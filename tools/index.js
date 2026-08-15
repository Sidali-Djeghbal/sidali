export default {
	async fetch(request, env) {
		const url = new URL(request.url);

		if (url.pathname.startsWith('/api/notes')) {
			return handleNotes(request, env);
		}

		if (url.pathname === '/notes' || url.pathname === '/notes/') {
			return env.ASSETS.fetch(
				new Request(`${url.origin}/notes.html`, request),
			);
		}

		return env.ASSETS.fetch(request);
	},
};

async function sha256Hex(input) {
	const data = new TextEncoder().encode(input);
	const digest = await crypto.subtle.digest('SHA-256', data);
	return Array.from(new Uint8Array(digest))
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');
}

async function authorize(request, env) {
	const auth = request.headers.get('Authorization') || '';
	const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
	const expected = await sha256Hex(env.NOTES_PASSWORD || '');
	return token === expected;
}

function json(data, status = 200) {
	return new Response(JSON.stringify(data), {
		status,
		headers: {
			'content-type': 'application/json; charset=utf-8',
			'cache-control': 'no-store',
		},
	});
}

async function handleNotes(request, env) {
	if (!(await authorize(request, env))) {
		return json({ error: 'unauthorized' }, 401);
	}

	const url = new URL(request.url);
	const id = url.pathname.slice('/api/notes/'.length);
	const db = env.NOTES_DB;

	try {
		switch (request.method) {
			case 'GET': {
				if (id) {
					const { results } = await db
						.prepare('SELECT id, title, content, updated_at FROM notes WHERE id = ?')
						.bind(id)
						.all();
					const note = results[0];
					return note ? json(note) : json({ error: 'not found' }, 404);
				}
				const { results } = await db
					.prepare('SELECT id, title, updated_at FROM notes ORDER BY updated_at DESC')
					.all();
				return json(results);
			}
			case 'POST': {
				const body = await request.json();
				const now = Date.now();
				const noteId = crypto.randomUUID();
				await db
					.prepare(
						'INSERT INTO notes (id, title, content, updated_at) VALUES (?, ?, ?, ?)',
					)
					.bind(noteId, body.title || 'Untitled', body.content || '', now)
					.run();
				return json({ id: noteId, title: body.title || 'Untitled', content: body.content || '', updated_at: now }, 201);
			}
			case 'PUT': {
				const body = await request.json();
				const { results } = await db
					.prepare('SELECT id FROM notes WHERE id = ?')
					.bind(id)
					.all();
				if (!results[0]) return json({ error: 'not found' }, 404);
				const now = Date.now();
				await db
					.prepare(
						'UPDATE notes SET title = ?, content = ?, updated_at = ? WHERE id = ?',
					)
					.bind(body.title || 'Untitled', body.content || '', now, id)
					.run();
				return json({ id, title: body.title || 'Untitled', content: body.content || '', updated_at: now });
			}
			case 'DELETE': {
				await db.prepare('DELETE FROM notes WHERE id = ?').bind(id).run();
				return json({ ok: true });
			}
			default:
				return json({ error: 'method not allowed' }, 405);
		}
	} catch (err) {
		return json({ error: 'internal error', message: String(err) }, 500);
	}
}
