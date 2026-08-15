/* Personal command center — Cloudflare Worker.
 *
 * Serves the static SPA from ASSETS and exposes a JSON API on D1:
 *   POST /api/login    { password }        -> sets signed session cookie
 *   POST /api/logout                        -> clears session cookie
 *   GET  /api/session                       -> auth probe
 *   /api/bookmarks  /api/tasks  /api/books  -> CRUD collections
 *   /api/habits                              -> CRUD + POST /:id/toggle { day }
 *
 * Auth: sha256(password) compare, HMAC-signed expiring cookie.
 * Secret: TOOLS_PASSWORD (falls back to legacy NOTES_PASSWORD).
 */

const SESSION_COOKIE = 'cc_session';
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days
const LOGIN_WINDOW_MS = 5 * 60 * 1000;
const LOGIN_MAX_ATTEMPTS = 10;

const TASK_STATUSES = ['todo', 'doing', 'done'];
const BOOK_STATUSES = ['want', 'reading', 'finished'];

const loginAttempts = new Map(); // ip -> { count, resetAt }

// Keeps Render free-tier Docmost awake (free instances sleep after ~15 min idle).
const WARM_TARGET = 'https://docs.sidali-djeghbal.dev/api/health';

export default {
	async fetch(request, env) {
		const url = new URL(request.url);
		const path = url.pathname;

		if (path === '/api/login' && request.method === 'POST') {
			return handleLogin(request, env);
		}
		if (path === '/api/logout' && request.method === 'POST') {
			return withCookie(json({ ok: true }), SESSION_COOKIE, '', 0);
		}
		if (path === '/api/session' && request.method === 'GET') {
			return (await isAuthed(request, env))
				? json({ ok: true })
				: json({ error: 'unauthorized' }, 401);
		}

		if (path.startsWith('/api/')) {
			if (!(await isAuthed(request, env))) {
				return json({ error: 'unauthorized' }, 401);
			}
			try {
				return await routeApi(request, env, path);
			} catch (err) {
				return json({ error: 'internal error', message: String(err) }, 500);
			}
		}

		return env.ASSETS.fetch(request);
	},

	async scheduled(event, env, ctx) {
		ctx.waitUntil(
			fetch(WARM_TARGET).catch(() => {}),
		);
	},
};

async function routeApi(request, env, path) {
	const db = env.DB;

	if (path.startsWith('/api/bookmarks')) {
		return handleBookmarks(request, db, path.slice('/api/bookmarks'.length));
	}
	if (path.startsWith('/api/tasks')) {
		return handleTasks(request, db, path.slice('/api/tasks'.length));
	}
	if (path.startsWith('/api/habits')) {
		return handleHabits(request, db, path.slice('/api/habits'.length));
	}
	if (path.startsWith('/api/books')) {
		return handleBooks(request, db, path.slice('/api/books'.length));
	}
	return json({ error: 'not found' }, 404);
}

/* ------------------------------------------------------------------ */
/* Auth                                                                */
/* ------------------------------------------------------------------ */

function json(data, status = 200) {
	return new Response(JSON.stringify(data), {
		status,
		headers: {
			'content-type': 'application/json; charset=utf-8',
			'cache-control': 'no-store',
		},
	});
}

function hex(buffer) {
	return Array.from(new Uint8Array(buffer))
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');
}

async function sha256(input) {
	return hex(
		await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input)),
	);
}

async function hmac(secret, message) {
	const key = await crypto.subtle.importKey(
		'raw',
		new TextEncoder().encode(secret),
		{ name: 'HMAC', hash: 'SHA-256' },
		false,
		['sign'],
	);
	return hex(
		await crypto.subtle.sign(
			'HMAC',
			key,
			new TextEncoder().encode(message),
		),
	);
}

function getPassword(env) {
	return env.TOOLS_PASSWORD || env.NOTES_PASSWORD || '';
}

async function sessionSecret(env) {
	return sha256(`${getPassword(env)}|cc-session-v1`);
}

function parseCookies(request) {
	const header = request.headers.get('cookie') || '';
	const out = {};
	for (const part of header.split(';')) {
		const idx = part.indexOf('=');
		if (idx === -1) continue;
		out[part.slice(0, idx).trim()] = decodeURIComponent(
			part.slice(idx + 1).trim(),
		);
	}
	return out;
}

async function isAuthed(request, env) {
	const password = getPassword(env);
	if (!password) return false;
	const token = parseCookies(request)[SESSION_COOKIE] || '';
	const dot = token.lastIndexOf('.');
	if (dot === -1) return false;
	const exp = Number(token.slice(0, dot));
	const sig = token.slice(dot + 1);
	if (!Number.isFinite(exp) || exp < Date.now()) return false;
	return sig === (await hmac(await sessionSecret(env), `cc:${exp}`));
}

function withCookie(response, name, value, maxAgeSeconds) {
	response.headers.append(
		'set-cookie',
		`${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAgeSeconds}; HttpOnly; Secure; SameSite=Lax`,
	);
	return response;
}

function tooManyAttempts(ip) {
	const now = Date.now();
	const entry = loginAttempts.get(ip);
	if (!entry || entry.resetAt < now) {
		loginAttempts.set(ip, { count: 1, resetAt: now + LOGIN_WINDOW_MS });
		return false;
	}
	entry.count += 1;
	return entry.count > LOGIN_MAX_ATTEMPTS;
}

async function handleLogin(request, env) {
	const password = getPassword(env);
	if (!password) {
		return json({ error: 'TOOLS_PASSWORD secret is not set' }, 500);
	}

	const ip = request.headers.get('cf-connecting-ip') || 'local';
	if (tooManyAttempts(ip)) {
		return json({ error: 'too many attempts, try later' }, 429);
	}

	let body = {};
	try {
		body = await request.json();
	} catch {
		return json({ error: 'invalid body' }, 400);
	}

	if ((await sha256(String(body.password || ''))) !== (await sha256(password))) {
		return json({ error: 'unauthorized' }, 401);
	}

	const exp = Date.now() + SESSION_TTL_MS;
	const sig = await hmac(await sessionSecret(env), `cc:${exp}`);
	return withCookie(json({ ok: true }), SESSION_COOKIE, `${exp}.${sig}`, Math.round(SESSION_TTL_MS / 1000));
}

/* ------------------------------------------------------------------ */
/* Shared collection helpers                                           */
/* ------------------------------------------------------------------ */

async function readJson(request) {
	try {
		return await request.json();
	} catch {
		return {};
	}
}

function idSegment(rest) {
	const value = rest.replace(/^\/+|\/+$/g, '');
	return value.includes('/') ? null : value || null;
}

function str(value, { max = 500, fallback = '' } = {}) {
	if (value === undefined || value === null) return undefined;
	return String(value).trim().slice(0, max) || fallback;
}

function int(value, min, max) {
	const n = Number(value);
	if (!Number.isFinite(n)) return undefined;
	return Math.min(max, Math.max(min, Math.round(n)));
}

function position(value) {
	const n = Number(value);
	return Number.isFinite(n) ? n : undefined;
}

// Builds `UPDATE tbl SET a = ?, b = ? WHERE id = ?` from provided fields.
// Returns null when there is nothing to update.
function updateStatement(table, allowed, body, extraSets = []) {
	const columns = [];
	const values = [];
	for (const [field, column] of allowed) {
		if (body[field] !== undefined) {
			columns.push(column);
			values.push(body[field]);
		}
	}
	if (!columns.length && !extraSets.length) return null;
	for (const set of extraSets) {
		columns.push(set.column);
		values.push(set.value);
	}
	values.push(body.id);
	return {
		sql: `UPDATE ${table} SET ${columns.map((c) => `${c} = ?`).join(', ')} WHERE id = ?`,
		values,
	};
}

async function updateById(db, table, id, stmt) {
	const { meta } = await db
		.prepare(stmt.sql)
		.bind(...stmt.values)
		.run();
	return meta.changes > 0;
}

async function getById(db, table, id) {
	const { results } = await db
		.prepare(`SELECT * FROM ${table} WHERE id = ?`)
		.bind(id)
		.all();
	return results[0] || null;
}

function requireId(request, rest) {
	if (request.method !== 'DELETE' && request.method !== 'PUT') {
		return json({ error: 'method not allowed' }, 405);
	}
	const id = idSegment(rest);
	return id ? null : json({ error: 'missing id' }, 400);
}

/* ------------------------------------------------------------------ */
/* Bookmarks                                                           */
/* ------------------------------------------------------------------ */

async function handleBookmarks(request, db, rest) {
	const id = idSegment(rest);

	switch (request.method) {
		case 'GET': {
			const { results } = await db
				.prepare('SELECT * FROM bookmarks ORDER BY position ASC, created_at ASC')
				.all();
			return json(results);
		}
		case 'POST': {
			const body = await readJson(request);
			const title = str(body.title, { max: 120 });
			const url = str(body.url, { max: 2000 });
			if (!title) return json({ error: 'title is required' }, 400);
			if (!url || !/^https?:\/\//i.test(url)) {
				return json({ error: 'url must start with http(s)://' }, 400);
			}
			const bookmark = {
				id: crypto.randomUUID(),
				title,
				url,
				position: position(body.position) ?? (await maxPosition(db, 'bookmarks')) + 1,
				created_at: Date.now(),
			};
			await db
				.prepare(
					'INSERT INTO bookmarks (id, title, url, position, created_at) VALUES (?, ?, ?, ?, ?)',
				)
				.bind(bookmark.id, bookmark.title, bookmark.url, bookmark.position, bookmark.created_at)
				.run();
			return json(bookmark, 201);
		}
		case 'PUT': {
			const invalid = requireId(request, rest);
			if (invalid) return invalid;
			const body = await readJson(request);
			if (body.url !== undefined && !/^https?:\/\//i.test(String(body.url))) {
				return json({ error: 'url must start with http(s)://' }, 400);
			}
			const stmt = updateStatement(
				'bookmarks',
				[
					['title', 'title'],
					['url', 'url'],
					['position', 'position'],
				],
				{ ...body, id },
			);
			if (!stmt) return json({ ok: true });
			if (!(await updateById(db, 'bookmarks', id, stmt))) {
				return json({ error: 'not found' }, 404);
			}
			return json(await getById(db, 'bookmarks', id));
		}
		case 'DELETE': {
			const invalid = requireId(request, rest);
			if (invalid) return invalid;
			await db.prepare('DELETE FROM bookmarks WHERE id = ?').bind(id).run();
			return json({ ok: true });
		}
		default:
			return json({ error: 'method not allowed' }, 405);
	}
}

async function maxPosition(db, table) {
	const { results } = await db
		.prepare(`SELECT COALESCE(MAX(position), 0) AS max FROM ${table}`)
		.all();
	return results[0].max;
}

/* ------------------------------------------------------------------ */
/* Tasks                                                               */
/* ------------------------------------------------------------------ */

async function handleTasks(request, db, rest) {
	const id = idSegment(rest);

	switch (request.method) {
		case 'GET': {
			const { results } = await db
				.prepare('SELECT * FROM tasks ORDER BY position ASC, created_at ASC')
				.all();
			return json(results);
		}
		case 'POST': {
			const body = await readJson(request);
			const title = str(body.title, { max: 300 });
			if (!title) return json({ error: 'title is required' }, 400);
			const status = TASK_STATUSES.includes(body.status) ? body.status : 'todo';
			const now = Date.now();
			const task = {
				id: crypto.randomUUID(),
				title,
				notes: str(body.notes, { max: 4000, fallback: '' }) || '',
				status,
				position: position(body.position) ?? (await maxPosition(db, 'tasks')) + 1,
				completed_at: status === 'done' ? now : null,
				created_at: now,
				updated_at: now,
			};
			await db
				.prepare(
					`INSERT INTO tasks (id, title, notes, status, position, completed_at, created_at, updated_at)
					 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
				)
				.bind(
					task.id,
					task.title,
					task.notes,
					task.status,
					task.position,
					task.completed_at,
					task.created_at,
					task.updated_at,
				)
				.run();
			return json(task, 201);
		}
		case 'PUT': {
			const invalid = requireId(request, rest);
			if (invalid) return invalid;
			const body = await readJson(request);
			if (body.status !== undefined && !TASK_STATUSES.includes(body.status)) {
				return json({ error: 'invalid status' }, 400);
			}
			const existing = await getById(db, 'tasks', id);
			if (!existing) return json({ error: 'not found' }, 404);

			const status = body.status ?? existing.status;
			const extraSets = [{ column: 'updated_at', value: Date.now() }];
			if (status !== existing.status) {
				extraSets.push({
					column: 'completed_at',
					value: status === 'done' ? Date.now() : null,
				});
			}

			const stmt = updateStatement(
				'tasks',
				[
					['title', 'title'],
					['notes', 'notes'],
					['status', 'status'],
					['position', 'position'],
				],
				{ ...body, id },
				extraSets,
			);
			if (stmt) await updateById(db, 'tasks', id, stmt);
			return json(await getById(db, 'tasks', id));
		}
		case 'DELETE': {
			const invalid = requireId(request, rest);
			if (invalid) return invalid;
			await db.prepare('DELETE FROM tasks WHERE id = ?').bind(id).run();
			return json({ ok: true });
		}
		default:
			return json({ error: 'method not allowed' }, 405);
	}
}

/* ------------------------------------------------------------------ */
/* Habits                                                              */
/* ------------------------------------------------------------------ */

const DAY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

async function handleHabits(request, db, rest) {
	const restPath = rest.replace(/^\/+/, '');
	const toggleMatch = restPath.match(/^([^/]+)\/toggle$/);

	if (request.method === 'POST' && toggleMatch) {
		const habitId = toggleMatch[1];
		const body = await readJson(request);
		const day = String(body.day || '');
		if (!DAY_PATTERN.test(day) || day > new Date().toISOString().slice(0, 10)) {
			return json({ error: 'day must be a YYYY-MM-DD not in the future' }, 400);
		}
		const habit = await getById(db, 'habits', habitId);
		if (!habit) return json({ error: 'not found' }, 404);
		const { results } = await db
			.prepare('SELECT 1 AS hit FROM habit_logs WHERE habit_id = ? AND day = ?')
			.bind(habitId, day)
			.all();
		if (results[0]) {
			await db
				.prepare('DELETE FROM habit_logs WHERE habit_id = ? AND day = ?')
				.bind(habitId, day)
				.run();
			return json({ day, done: false });
		}
		await db
			.prepare('INSERT INTO habit_logs (habit_id, day) VALUES (?, ?)')
			.bind(habitId, day)
			.run();
		return json({ day, done: true });
	}

	const id = idSegment(rest);

	switch (request.method) {
		case 'GET': {
			const { results: habits } = await db
				.prepare('SELECT * FROM habits WHERE archived = 0 ORDER BY created_at ASC')
				.all();
			const cutoff = new Date(Date.now() - 190 * 86400000)
				.toISOString()
				.slice(0, 10);
			const { results: logs } = await db
				.prepare('SELECT habit_id, day FROM habit_logs WHERE day >= ?')
				.bind(cutoff)
				.all();
			const byHabit = new Map(habits.map((h) => [h.id, []]));
			for (const log of logs) {
				const list = byHabit.get(log.habit_id);
				if (list) list.push(log.day);
			}
			return json(habits.map((h) => ({ ...h, logs: byHabit.get(h.id) || [] })));
		}
		case 'POST': {
			const body = await readJson(request);
			const name = str(body.name, { max: 120 });
			if (!name) return json({ error: 'name is required' }, 400);
			const habit = {
				id: crypto.randomUUID(),
				name,
				emoji: str(body.emoji, { max: 8, fallback: '' }) || '',
				archived: 0,
				created_at: Date.now(),
			};
			await db
				.prepare('INSERT INTO habits (id, name, emoji, archived, created_at) VALUES (?, ?, ?, 0, ?)')
				.bind(habit.id, habit.name, habit.emoji, habit.created_at)
				.run();
			return json({ ...habit, logs: [] }, 201);
		}
		case 'PUT': {
			const invalid = requireId(request, rest);
			if (invalid) return invalid;
			const body = await readJson(request);
			const stmt = updateStatement(
				'habits',
				[
					['name', 'name'],
					['emoji', 'emoji'],
					['archived', 'archived'],
				],
				{ ...body, id },
			);
			if (!stmt) return json({ ok: true });
			if (!(await updateById(db, 'habits', id, stmt))) {
				return json({ error: 'not found' }, 404);
			}
			return json(await getById(db, 'habits', id));
		}
		case 'DELETE': {
			const invalid = requireId(request, rest);
			if (invalid) return invalid;
			await db.batch([
				db.prepare('DELETE FROM habit_logs WHERE habit_id = ?').bind(id),
				db.prepare('DELETE FROM habits WHERE id = ?').bind(id),
			]);
			return json({ ok: true });
		}
		default:
			return json({ error: 'method not allowed' }, 405);
	}
}

/* ------------------------------------------------------------------ */
/* Books                                                               */
/* ------------------------------------------------------------------ */

function computedProgress(status, totalPages, currentPage, fallback) {
	if (status === 'finished') return 100;
	if (totalPages > 0) return Math.min(100, Math.round((currentPage / totalPages) * 100));
	return fallback;
}

async function handleBooks(request, db, rest) {
	const restPath = rest.replace(/^\/+/, '');
	const sessionMatch = restPath.match(/^([^/]+)\/sessions(?:\/([^/]+))?$/);

	if (sessionMatch) {
		return handleBookSessions(request, db, sessionMatch[1], sessionMatch[2]);
	}

	const id = idSegment(rest);

	switch (request.method) {
		case 'GET': {
			const { results } = await db
				.prepare(
					`SELECT * FROM books
					 ORDER BY CASE status WHEN 'reading' THEN 0 WHEN 'want' THEN 1 ELSE 2 END,
					 updated_at DESC`,
				)
				.all();
			const { results: sessions } = await db
				.prepare('SELECT * FROM book_sessions ORDER BY day ASC, created_at ASC')
				.all();
			const byBook = new Map(results.map((b) => [b.id, []]));
			for (const s of sessions) {
				const list = byBook.get(s.book_id);
				if (list) list.push(s);
			}
			return json(results.map((b) => ({ ...b, sessions: byBook.get(b.id) || [] })));
		}
		case 'POST': {
			const body = await readJson(request);
			const title = str(body.title, { max: 200 });
			if (!title) return json({ error: 'title is required' }, 400);
			const status = BOOK_STATUSES.includes(body.status) ? body.status : 'want';
			const now = Date.now();
			const total_pages = int(body.total_pages, 0, 10000000) ?? 0;
			const current_page = int(body.current_page, 0, 10000000) ?? 0;
			const book = {
				id: crypto.randomUUID(),
				title,
				author: str(body.author, { max: 120, fallback: '' }) || '',
				status,
				rating: int(body.rating, 0, 5) ?? 0,
				total_pages,
				current_page,
				progress: computedProgress(status, total_pages, current_page, int(body.progress, 0, 100) ?? 0),
				notes: str(body.notes, { max: 4000, fallback: '' }) || '',
				started_at: int(body.started_at, 0, 9007199254740991) ?? null,
				finished_at: status === 'finished' ? now : null,
				created_at: now,
				updated_at: now,
			};
			await db
				.prepare(
					`INSERT INTO books (id, title, author, status, rating, total_pages, current_page, progress, notes, started_at, finished_at, created_at, updated_at)
					 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
				)
				.bind(
					book.id,
					book.title,
					book.author,
					book.status,
					book.rating,
					book.total_pages,
					book.current_page,
					book.progress,
					book.notes,
					book.started_at,
					book.finished_at,
					book.created_at,
					book.updated_at,
				)
				.run();
			return json({ ...book, sessions: [] }, 201);
		}
		case 'PUT': {
			const invalid = requireId(request, rest);
			if (invalid) return invalid;
			const body = await readJson(request);
			if (body.status !== undefined && !BOOK_STATUSES.includes(body.status)) {
				return json({ error: 'invalid status' }, 400);
			}
			const existing = await getById(db, 'books', id);
			if (!existing) return json({ error: 'not found' }, 404);

			const status = body.status ?? existing.status;
			const total_pages = body.total_pages !== undefined
				? int(body.total_pages, 0, 10000000) ?? existing.total_pages
				: existing.total_pages;
			const current_page = body.current_page !== undefined
				? int(body.current_page, 0, 10000000) ?? existing.current_page
				: existing.current_page;
			const progress = body.progress !== undefined
				? computedProgress(status, total_pages, current_page, int(body.progress, 0, 100) ?? existing.progress)
				: computedProgress(status, total_pages, current_page, existing.progress);

			const extraSets = [
				{ column: 'updated_at', value: Date.now() },
				{ column: 'progress', value: progress },
				{ column: 'total_pages', value: total_pages },
				{ column: 'current_page', value: current_page },
			];
			if (status !== existing.status) {
				extraSets.push({
					column: 'finished_at',
					value: status === 'finished' ? Date.now() : null,
				});
				if (status === 'finished') extraSets.push({ column: 'progress', value: 100 });
			}

			const stmt = updateStatement(
				'books',
				[
					['title', 'title'],
					['author', 'author'],
					['status', 'status'],
					['rating', 'rating'],
					['notes', 'notes'],
					['started_at', 'started_at'],
				],
				{ ...body, id },
				extraSets,
			);
			if (stmt) await updateById(db, 'books', id, stmt);
			return json(await getById(db, 'books', id));
		}
		case 'DELETE': {
			const invalid = requireId(request, rest);
			if (invalid) return invalid;
			await db.batch([
				db.prepare('DELETE FROM book_sessions WHERE book_id = ?').bind(id),
				db.prepare('DELETE FROM books WHERE id = ?').bind(id),
			]);
			return json({ ok: true });
		}
		default:
			return json({ error: 'method not allowed' }, 405);
	}
}

async function handleBookSessions(request, db, bookId, sessionId) {
	if (request.method === 'POST' && !sessionId) {
		const book = await getById(db, 'books', bookId);
		if (!book) return json({ error: 'not found' }, 404);
		const body = await readJson(request);
		const day = String(body.day || '');
		if (!DAY_PATTERN.test(day) || day > new Date().toISOString().slice(0, 10)) {
			return json({ error: 'day must be a YYYY-MM-DD not in the future' }, 400);
		}
		const pages = int(body.pages, 0, 100000) ?? 0;
		const minutes = int(body.minutes, 0, 100000) ?? 0;
		if (pages === 0 && minutes === 0) {
			return json({ error: 'enter pages or minutes' }, 400);
		}
		const session = {
			id: crypto.randomUUID(),
			book_id: bookId,
			day,
			pages,
			minutes,
			created_at: Date.now(),
		};
		await db
			.prepare('INSERT INTO book_sessions (id, book_id, day, pages, minutes, created_at) VALUES (?, ?, ?, ?, ?, ?)')
			.bind(session.id, session.book_id, session.day, session.pages, session.minutes, session.created_at)
			.run();
		return json(session, 201);
	}
	if (request.method === 'DELETE' && sessionId) {
		await db.prepare('DELETE FROM book_sessions WHERE id = ?').bind(sessionId).run();
		return json({ ok: true });
	}
	return json({ error: 'method not allowed' }, 405);
}
