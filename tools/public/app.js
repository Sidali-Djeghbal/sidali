/* Personal command center — vanilla JS SPA.
 * Hash router + four tools backed by the Worker's D1 API.
 */
(function () {
	'use strict';

	/* ================================================================
	 * Helpers
	 * ================================================================ */

	var $ = function (sel) {
		return document.querySelector(sel);
	};

	function esc(value) {
		return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
			return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
		});
	}

	function pad(n) {
		return String(n).padStart(2, '0');
	}

	function iso(date) {
		return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate());
	}

	function todayStr() {
		return iso(new Date());
	}

	function fmtDate(ts) {
		if (!ts) return '';
		return new Date(ts).toLocaleDateString(undefined, {
			month: 'short',
			day: 'numeric',
		});
	}

	function hostOf(url) {
		try {
			return new URL(url).hostname.replace(/^www\./, '');
		} catch (e) {
			return url;
		}
	}

	/* ================================================================
	 * Icons (lucide-style strokes)
	 * ================================================================ */

	var I = {
		sun: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>',
		moon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>',
		back: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>',
		lock: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
		plus: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="M12 5v14"/></svg>',
		x: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
		pencil: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>',
		trash: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>',
		check: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
		checkCircle: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/></svg>',
		flame: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>',
		book: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/></svg>',
		kanban: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 5v11"/><path d="M12 5v6"/><path d="M18 5v14"/></svg>',
		compass: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>',
		arrow: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
		chevL: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>',
		chevR: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>',
		chevD: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>',
		chevU: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m18 15-6-6-6 6"/></svg>',
		server: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><path d="M6 6h.01"/><path d="M6 18h.01"/></svg>',
		external: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>',
	};

	/* ================================================================
	 * State + API client
	 * ================================================================ */

	var state = {
		authed: false,
		bookmarks: [],
		tasks: [],
		habits: [],
		books: [],
		bookFilter: 'all',
		bookExpanded: {},
	};

	function api(path, opts) {
		opts = opts || {};
		return fetch(path, {
			method: opts.method || 'GET',
			headers: opts.body !== undefined ? { 'content-type': 'application/json' } : {},
			body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
			credentials: 'same-origin',
		}).then(function (res) {
			return res
				.json()
				.catch(function () {
					return null;
				})
				.then(function (data) {
					if (!res.ok) {
						if (res.status === 401 && path !== '/api/session') {
							showLogin();
						}
						var msg = (data && data.error) || 'Request failed (' + res.status + ')';
						var err = new Error(msg);
						err.status = res.status;
						throw err;
					}
					return data;
				});
		});
	}

	/* ================================================================
	 * Toast + modal
	 * ================================================================ */

	var toastTimer = null;

	function toast(message) {
		var root = $('#toast-root');
		root.innerHTML = '<div class="toast">' + esc(message) + '</div>';
		clearTimeout(toastTimer);
		toastTimer = setTimeout(function () {
			root.innerHTML = '';
		}, 2600);
	}

	function fail(err) {
		toast(err && err.message ? err.message : 'Something went wrong');
	}

	function escClose(e) {
		if (e.key === 'Escape') closeModal();
	}

	function openModal(title, bodyHtml) {
		var root = $('#modal-root');
		root.innerHTML =
			'<div class="modal-overlay">' +
			'<div class="modal" role="dialog" aria-modal="true" aria-label="' + esc(title) + '">' +
			'<div class="modal-head"><h3 class="modal-title">' + esc(title) + '</h3>' +
			'<button class="icon-btn" type="button" data-close aria-label="Close">' + I.x + '</button></div>' +
			'<div class="modal-body">' + bodyHtml + '</div>' +
			'</div></div>';
		var overlay = root.querySelector('.modal-overlay');
		overlay.addEventListener('click', function (e) {
			if (e.target === overlay) closeModal();
		});
		overlay.querySelector('[data-close]').addEventListener('click', closeModal);
		document.addEventListener('keydown', escClose);
		var first = overlay.querySelector('input, textarea, select');
		if (first) first.focus();
		return overlay;
	}

	function closeModal() {
		$('#modal-root').innerHTML = '';
		document.removeEventListener('keydown', escClose);
	}

	// Two-step confirm for destructive icon buttons: first click arms,
	// second click within the window confirms.
	function armDelete(btn, onConfirm) {
		if (btn.dataset.armed) {
			onConfirm();
			return;
		}
		btn.dataset.armed = '1';
		btn.classList.add('danger-armed');
		btn.innerHTML = I.check;
		btn.setAttribute('aria-label', 'Confirm delete');
		btn.title = 'Click again to confirm';
		setTimeout(function () {
			if (!btn.isConnected) return;
			delete btn.dataset.armed;
			btn.classList.remove('danger-armed');
			btn.innerHTML = I.trash;
			btn.setAttribute('aria-label', 'Delete');
			btn.title = 'Delete';
		}, 2600);
	}

	/* ================================================================
	 * Drag & drop (shared by bookmarks grid and kanban board)
	 * ================================================================ */

	function pointerAfter(e, rect) {
		if (e.clientY >= rect.bottom) return true;
		if (e.clientY <= rect.top) return false;
		return e.clientX > rect.left + rect.width / 2;
	}

	function enableDrag(scope, getPayload, handleDrop) {
		var placeholder = document.createElement('div');
		placeholder.className = 'drop-placeholder';
		var payload = null;

		scope.addEventListener('dragstart', function (e) {
			var item = e.target.closest('[draggable]');
			if (!item) return;
			payload = getPayload(item);
			try {
				e.dataTransfer.setData('text/plain', '');
			} catch (err) {}
			e.dataTransfer.effectAllowed = 'move';
			item.classList.add('dragging');
			requestAnimationFrame(function () {
				item.parentNode.insertBefore(placeholder, item.nextSibling);
			});
		});

		scope.addEventListener('dragend', function () {
			placeholder.remove();
			var dragging = scope.querySelector('.dragging');
			if (dragging) dragging.classList.remove('dragging');
			scope.querySelectorAll('.drop-in').forEach(function (el) {
				el.classList.remove('drop-in');
			});
			payload = null;
		});

		scope.addEventListener('dragover', function (e) {
			if (payload === null) return;
			e.preventDefault();
			e.dataTransfer.dropEffect = 'move';
			var item = e.target.closest('[draggable]');
			if (item) {
				var after = pointerAfter(e, item.getBoundingClientRect());
				item.parentNode.insertBefore(placeholder, after ? item.nextSibling : item);
			} else {
				var list = e.target.closest('.drop-list');
				if (list) list.appendChild(placeholder);
			}
			var zone = placeholder.closest('.drop-zone');
			scope.querySelectorAll('.drop-zone').forEach(function (el) {
				el.classList.toggle('drop-in', el === zone);
			});
		});

		scope.addEventListener('drop', function (e) {
			if (payload === null) return;
			e.preventDefault();
			var next = placeholder.nextElementSibling;
			while (next && !next.matches('[draggable]')) next = next.nextElementSibling;
			var list = placeholder.closest('.drop-list');
			var beforeId = next ? next.dataset.id : null;
			placeholder.remove();
			var dragging = scope.querySelector('.dragging');
			if (dragging) dragging.classList.remove('dragging');
			scope.querySelectorAll('.drop-in').forEach(function (el) {
				el.classList.remove('drop-in');
			});
			if (list) handleDrop(payload, list, beforeId);
			payload = null;
		});
	}

	// Fractional position between neighbours for drag/move reordering.
	function positionBetween(list, id, beforeId) {
		var others = list.filter(function (item) {
			return item.id !== id;
		});
		var idx = others.length;
		if (beforeId) {
			var found = -1;
			for (var i = 0; i < others.length; i++) {
				if (others[i].id === beforeId) {
					found = i;
					break;
				}
			}
			if (found !== -1) idx = found;
		}
		var prev = idx > 0 ? others[idx - 1].position : null;
		var next = idx < others.length ? others[idx].position : null;
		if (prev === null && next === null) return 1;
		if (prev === null) return next - 1;
		if (next === null) return prev + 1;
		return (prev + next) / 2;
	}

	/* ================================================================
	 * Theme
	 * ================================================================ */

	function setupTheme() {
		var button = $('#theme-toggle');
		var logoutBtn = $('#logout-btn');
		var backBtn = $('#back-btn');
		logoutBtn.innerHTML = I.lock;
		backBtn.innerHTML = I.back;

		function paint() {
			var dark = document.documentElement.classList.contains('dark');
			button.innerHTML = dark ? I.sun : I.moon;
		}

		button.addEventListener('click', function () {
			var next = !document.documentElement.classList.contains('dark');
			var apply = function () {
				document.documentElement.classList.toggle('dark', next);
				try {
					localStorage.setItem('tools-theme', next ? 'dark' : 'light');
				} catch (e) {}
				paint();
			};
			if (document.startViewTransition) {
				document.startViewTransition(apply);
			} else {
				apply();
			}
		});

		paint();
	}

	/* ================================================================
	 * Auth
	 * ================================================================ */

	function showLogin(message) {
		state.authed = false;
		$('#app-view').classList.add('hidden');
		$('#login-view').classList.remove('hidden');
		var error = $('#login-error');
		if (message) {
			error.textContent = message;
			error.classList.remove('hidden');
		} else {
			error.classList.add('hidden');
		}
	}

	function showApp(user) {
		state.authed = true;
		$('#login-view').classList.add('hidden');
		$('#app-view').classList.remove('hidden');
		setUserChip(user);
	}

	function setUserChip(user) {
		var chip = $('#user-chip');
		if (!user || !user.login) {
			chip.classList.add('hidden');
			return;
		}
		chip.innerHTML =
			'<img class="user-avatar" src="https://github.com/' +
			encodeURIComponent(user.login) +
			'.png?size=64" alt="' +
			esc(user.login) +
			'" />' +
			'<span class="user-name">' +
			esc(user.login) +
			'</span>';
		chip.classList.remove('hidden');
	}

	function wireLogin() {
		var error = $('#login-error');
		var params = new URLSearchParams(location.search);
		var oauthError = params.get('error');
		if (oauthError) {
			showLogin(decodeURIComponent(oauthError));
		} else {
			error.classList.add('hidden');
		}
		$('#github-login-btn').addEventListener('click', function () {
			error.classList.add('hidden');
		});
	}

	function wireTopbar() {
		$('#logout-btn').addEventListener('click', function () {
			api('/api/logout', { method: 'POST', body: {} })
				.catch(function () {})
				.then(function () {
					if (location.hash) location.hash = '';
					showLogin();
				});
		});
		$('#back-btn').addEventListener('click', function () {
			location.hash = '#/';
		});
	}

	/* ================================================================
	 * Router
	 * ================================================================ */

	var view = null;
	var clockTimer = null;

	function currentRoute() {
		var name = location.hash.replace(/^#\/?/, '').replace(/\/+$/, '');
		return ROUTES[name] ? name : '';
	}

	function route() {
		if (!state.authed) return;
		var name = currentRoute();
		if (location.hash !== '#/' && name === '') {
			location.hash = '#/';
			return;
		}
		var entry = ROUTES[name];
		$('#topbar-title').textContent = entry.title;
		$('#back-btn').style.visibility = name === '' ? 'hidden' : 'visible';
		document.title = (name === '' ? 'Tools' : entry.title) + ' — Sidali DJEGHBAL';
		view.innerHTML = '<p class="muted" style="padding:6rem 0 0">Loading…</p>';
		window.scrollTo(0, 0);
		Promise.resolve(entry.load ? entry.load() : null)
			.then(function () {
				entry.render();
			})
			.catch(fail);
	}

	function rerender(preserveScroll) {
		var y = window.scrollY;
		ROUTES[currentRoute()].render();
		if (preserveScroll) window.scrollTo(0, y);
	}

	/* ================================================================
	 * Launcher
	 * ================================================================ */

	function launcherStats() {
		var today = todayStr();
		var open = 0;
		var doing = 0;
		var doneToday = 0;
		state.tasks.forEach(function (t) {
			if (t.status === 'done') {
				if (t.completed_at && iso(new Date(t.completed_at)) === today) doneToday++;
			} else {
				open++;
				if (t.status === 'doing') doing++;
			}
		});
		var habitsToday = 0;
		var bestStreak = 0;
		state.habits.forEach(function (h) {
			if ((h.logs || []).indexOf(today) !== -1) habitsToday++;
			var s = streakOf(h.logs || []);
			if (s > bestStreak) bestStreak = s;
		});
		return {
			open: open,
			doing: doing,
			doneToday: doneToday,
			habitsToday: habitsToday,
			habitsTotal: state.habits.length,
			bestStreak: bestStreak,
		};
	}

	function currentBook() {
		for (var i = 0; i < state.books.length; i++) {
			if (state.books[i].status === 'reading') return state.books[i];
		}
		return null;
	}

	function fmtLongDate(d) {
		return d.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
	}

	function fmtClock(d) {
		return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
	}

	function greetingOf(d) {
		var h = d.getHours();
		if (h < 5) return 'Up late';
		if (h < 12) return 'Good morning';
		if (h < 18) return 'Good afternoon';
		return 'Good evening';
	}

	function startClock() {
		if (clockTimer) clearInterval(clockTimer);
		var el = $('#launcher-clock');
		if (!el) return;
		var tick = function () {
			if (!el.isConnected) {
				clearInterval(clockTimer);
				clockTimer = null;
				return;
			}
			el.textContent = fmtClock(new Date());
		};
		tick();
		clockTimer = setInterval(tick, 30000);
	}

	function launcherHeadline() {
		var s = launcherStats();
		var book = currentBook();
		var parts = [];
		if (s.open) parts.push(s.open + (s.open === 1 ? ' open task' : ' open tasks'));
		if (s.habitsTotal) parts.push(s.habitsToday + '/' + s.habitsTotal + ' habits today');
		if (book) {
			var title = book.title.length > 24 ? book.title.slice(0, 24) + '…' : book.title;
			parts.push(bookProgressOf(book) + '% through ' + title);
		}
		if (!parts.length) parts.push('everything in one place');
		return fmtLongDate(new Date()) + ' — ' + parts.join(' · ');
	}

	function renderLauncher() {
		var s = launcherStats();
		var book = currentBook();

		var featured;
		if (book) {
			var progress = bookProgressOf(book);
			featured =
				'<span class="bento-current">' +
				'<span class="bento-current-label">Now reading</span>' +
				'<span class="bento-current-title">' + esc(book.title) + '</span>' +
				(book.author ? '<span class="bento-current-author">' + esc(book.author) + '</span>' : '') +
				'</span>' +
				'<span class="progress-wrap"><span class="progress-bar"><span class="progress-fill" style="width:' + progress + '%"></span></span>' +
				'<span class="progress-num">' + esc(bookPagesLabel(book)) + '</span></span>';
		} else {
			featured =
				'<span class="bento-current">' +
				'<span class="bento-current-label">Nothing in progress</span>' +
				'<span class="bento-current-title">' +
				(state.books.length ? 'Pick up a book.' : 'Your shelf is empty.') +
				'</span></span>';
		}

		var bs = bookStats();
		featured +=
			'<span class="bento-stats">' +
			'<span class="bento-stat"><span class="bento-num">' + bs.reading + '</span><span class="bento-num-label">reading now</span></span>' +
			'<span class="bento-stat"><span class="bento-num">' + bs.pages + '</span><span class="bento-num-label">pages read</span></span>' +
			'<span class="bento-stat"><span class="bento-num">' + bs.streak + '</span><span class="bento-num-label">day streak</span></span>' +
			'</span>';

		view.innerHTML =
			'<header class="page">' +
			'<div class="launcher-hero">' +
			'<div><p class="kicker">Tools</p>' +
			'<h1>' + esc(greetingOf(new Date())) + '.</h1></div>' +
			'<span id="launcher-clock" class="launcher-clock" aria-hidden="true"></span>' +
			'</div>' +
			'<p class="subtitle launcher-line">' + esc(launcherHeadline()) + '</p></header>' +
			'<main class="page"><div class="bento">' +
			'<a class="bento-card bento-featured" href="#/books" style="--d:.02s">' +
			'<span class="bento-top"><span class="bento-icon">' + I.book + '</span><span class="bento-arrow">' + I.arrow + '</span></span>' +
			'<span class="bento-kicker">Books</span>' +
			featured +
			'</a>' +
			bentoSmall('tasks', 'kanban', 'Tasks', s.open, 'open', s.doing + ' doing' + (s.doneToday ? ' · ' + s.doneToday + ' done today' : ''), '--d:.08s', true) +
			bentoSmall('habits', 'flame', 'Habits', s.bestStreak, 'day streak', s.habitsTotal ? s.habitsToday + '/' + s.habitsTotal + ' done today' : 'no habits yet', '--d:.14s', true) +
			bentoSmall('start', 'compass', 'Start', state.bookmarks.length, 'quick links', state.bookmarks.length ? 'your launcher' : 'add your first link', '--d:.2s') +
			bentoSmall('infra', 'server', 'Infra', infraLinkCount(), 'dashboards', 'hosting & monitoring', '--d:.26s') +
			'</div></main>' +
			'<footer class="page"><a class="underline-magical" href="https://sidali-djeghbal.dev" target="_blank" rel="noreferrer">Sidali DJEGHBAL</a></footer>';
		startClock();
	}

	function infraLinkCount() {
		var n = 0;
		INFRA_GROUPS.forEach(function (group) {
			n += group.links.length;
		});
		return n;
	}

	function bentoSmall(route, icon, kicker, num, numLabel, meta, delay, sm) {
		return (
			'<a class="bento-card' + (sm ? ' bento-sm' : '') + '" href="#/' + route + '" style="' + delay + '">' +
			'<span class="bento-top"><span class="bento-icon">' + I[icon] + '</span><span class="bento-arrow">' + I.arrow + '</span></span>' +
			'<span class="bento-kicker">' + esc(kicker) + '</span>' +
			'<span class="bento-stat"><span class="bento-num">' + esc(num) + '</span><span class="bento-num-label">' + esc(numLabel) + '</span></span>' +
			'<span class="bento-meta">' + esc(meta) + '</span></a>'
		);
	}

	/* ================================================================
	 * Start — bookmarks
	 * ================================================================ */

	function loadBookmarks() {
		return api('/api/bookmarks').then(function (rows) {
			state.bookmarks = rows;
		});
	}

	function renderStart() {
		var cards = state.bookmarks
			.map(function (bm) {
				return (
					'<div class="bm-card" draggable="true" data-id="' + esc(bm.id) + '">' +
					'<a class="bm-main" href="' + esc(bm.url) + '" target="_blank" rel="noreferrer">' +
					'<span class="bm-icon">' + esc((bm.title || '?').trim().charAt(0).toUpperCase()) + '</span>' +
					'<span class="bm-body"><span class="bm-title">' + esc(bm.title) + '</span>' +
					'<span class="bm-host">' + esc(hostOf(bm.url)) + '</span></span></a>' +
					'<div class="bm-actions">' +
					'<button class="icon-btn" type="button" data-action="edit" aria-label="Edit link" title="Edit">' + I.pencil + '</button>' +
					'<button class="icon-btn" type="button" data-action="delete" aria-label="Delete" title="Delete">' + I.trash + '</button>' +
					'</div></div>'
				);
			})
			.join('');

		view.innerHTML =
			'<header class="page"><div class="view-head"><div><p class="kicker">Start</p>' +
			'<h1>Quick links.</h1><p class="subtitle">Your launcher — open, add, reorder.</p></div>' +
			'<button class="btn primary" type="button" data-action="add">' + I.plus + 'Add link</button></div></header>' +
			'<main class="page">' +
			(state.bookmarks.length
				? '<div class="bm-grid drop-zone">' + cards + '</div>'
				: '<div class="empty">' + I.compass + '<p class="empty-title">No links yet</p>' +
					'<p>Add your first bookmark to build your start page.</p></div>') +
			'</main>';

		var grid = view.querySelector('.bm-grid');
		if (grid) {
			enableDrag(
				grid,
				function (item) {
					return item.dataset.id;
				},
				function (id, list, beforeId) {
					var position = positionBetween(state.bookmarks, id, beforeId);
					var bm = find(state.bookmarks, id);
					if (!bm) return;
					bm.position = position;
					state.bookmarks.sort(byPosition);
					rerender(true);
					api('/api/bookmarks/' + id, { method: 'PUT', body: { position: position } }).catch(fail);
				}
			);
		}

		view.onclick = function (e) {
			var btn = e.target.closest('[data-action]');
			if (!btn) return;
			var action = btn.dataset.action;
			var card = btn.closest('[data-id]');
			var bm = card ? find(state.bookmarks, card.dataset.id) : null;

			if (action === 'add') {
				bookmarkModal(null);
			} else if (action === 'edit' && bm) {
				bookmarkModal(bm);
			} else if (action === 'delete' && bm) {
				armDelete(btn, function () {
					api('/api/bookmarks/' + bm.id, { method: 'DELETE' })
						.then(function () {
							state.bookmarks = state.bookmarks.filter(function (b) {
								return b.id !== bm.id;
							});
							toast('Link deleted');
							rerender(true);
						})
						.catch(fail);
				});
			}
		};
	}

	function bookmarkModal(bm) {
		var overlay = openModal(
			bm ? 'Edit link' : 'Add link',
			'<form id="bm-form">' +
			'<div class="field"><label for="bm-title">Title</label>' +
			'<input id="bm-title" class="input" name="title" required maxlength="120" value="' + esc(bm ? bm.title : '') + '" /></div>' +
			'<div class="field"><label for="bm-url">URL</label>' +
			'<input id="bm-url" class="input" name="url" type="url" required maxlength="2000" placeholder="https://…" value="' + esc(bm ? bm.url : '') + '" /></div>' +
			'<div class="modal-foot"><button class="btn" type="button" data-close>Cancel</button>' +
			'<button class="btn primary" type="submit">' + (bm ? 'Save' : 'Add') + '</button></div>' +
			'</form>'
		);
		overlay.querySelector('#bm-form').addEventListener('submit', function (e) {
			e.preventDefault();
			var body = {
				title: overlay.querySelector('#bm-title').value.trim(),
				url: overlay.querySelector('#bm-url').value.trim(),
			};
			var req = bm
				? api('/api/bookmarks/' + bm.id, { method: 'PUT', body: body })
				: api('/api/bookmarks', { method: 'POST', body: body });
			req
				.then(function (saved) {
					if (bm) {
						state.bookmarks = state.bookmarks.map(function (b) {
							return b.id === saved.id ? saved : b;
						});
					} else {
						state.bookmarks.push(saved);
					}
					state.bookmarks.sort(byPosition);
					closeModal();
					toast(bm ? 'Link updated' : 'Link added');
					rerender(true);
				})
				.catch(fail);
		});
	}

	/* ================================================================
	 * Tasks — kanban
	 * ================================================================ */

	var COLUMNS = [
		{ key: 'todo', label: 'To do' },
		{ key: 'doing', label: 'Doing' },
		{ key: 'done', label: 'Done' },
	];

	function loadTasks() {
		return api('/api/tasks').then(function (rows) {
			state.tasks = rows;
		});
	}

	function byPosition(a, b) {
		return a.position - b.position || a.created_at - b.created_at;
	}

	function tasksIn(status) {
		return state.tasks.filter(function (t) {
			return t.status === status;
		}).sort(byPosition);
	}

	function renderTasks() {
		var total = state.tasks.length;
		var doneCount = state.tasks.filter(function (t) { return t.status === 'done'; }).length;

		var columns = COLUMNS.map(function (col) {
			var colTasks = tasksIn(col.key);
			var cards = colTasks
				.map(function (task) {
					var priority = task.priority || 'none';
					return (
						'<div class="task-card' + (task.status === 'done' ? ' done' : '') + (priority !== 'none' ? ' pri-' + priority : '') + '" draggable="true" data-id="' + esc(task.id) + '">' +
						'<div class="task-row">' +
						'<button class="check' + (task.status === 'done' ? ' checked' : '') + '" type="button" data-action="toggle" aria-label="Toggle done" aria-pressed="' + (task.status === 'done') + '">' + I.check + '</button>' +
						'<span class="task-title">' + esc(task.title) + '</span>' +
						'<span class="task-actions">' +
						(col.key !== 'todo' ? '<button class="icon-btn" type="button" data-action="left" aria-label="Move left" title="Move left">' + I.chevL + '</button>' : '') +
						(col.key !== 'done' ? '<button class="icon-btn" type="button" data-action="right" aria-label="Move right" title="Move right">' + I.chevR + '</button>' : '') +
						'<button class="icon-btn" type="button" data-action="edit" aria-label="Edit" title="Edit">' + I.pencil + '</button>' +
						'<button class="icon-btn" type="button" data-action="delete" aria-label="Delete" title="Delete">' + I.trash + '</button>' +
						'</span></div>' +
						(task.notes || task.completed_at
							? '<div class="task-meta">' +
								(task.notes ? esc(task.notes) + (task.completed_at ? ' · ' : '') : '') +
								(task.completed_at ? 'done ' + esc(fmtDate(task.completed_at)) : '') +
								'</div>'
							: '') +
						'</div>'
					);
				})
				.join('');
			var emptyState = !colTasks.length
				? '<div class="col-empty">No tasks here yet</div>'
				: '';
			return (
				'<section class="kanban-col drop-zone" data-status="' + col.key + '">' +
				'<div class="kanban-col-head"><span class="kanban-col-title">' + col.label + '</span>' +
				'<span class="kanban-count">' + colTasks.length + '</span></div>' +
				'<div class="kanban-cards drop-list" data-status="' + col.key + '">' + cards + emptyState + '</div>' +
				'<div class="composer">' +
				'<input class="input" type="text" data-compose="' + col.key + '" placeholder="Add task…" aria-label="Add task to ' + col.label + '" maxlength="300" />' +
				'<button class="icon-btn" type="button" data-action="compose" data-status="' + col.key + '" aria-label="Add task">' + I.plus + '</button>' +
				'</div></section>'
			);
		}).join('');

		view.innerHTML =
			'<header class="page"><div class="view-head"><div><p class="kicker">Tasks</p>' +
			'<h1>The board.</h1><p class="subtitle">Organize your work · drag, shift or click to move.</p>' +
			(total ? '<p class="board-stats">' + total + ' tasks · ' + doneCount + ' done' + (total ? ' · ' + Math.round((doneCount / total) * 100) + '%' : '') + '</p>' : '') +
			'</div></div></header>' +
			'<main class="page"><div class="board">' + columns + '</div></main>';

		var board = view.querySelector('.board');
		enableDrag(
			board,
			function (item) {
				return item.dataset.id;
			},
			function (id, list, beforeId) {
				var status = list.dataset.status;
				var task = find(state.tasks, id);
				if (!task) return;
				var position = positionBetween(tasksIn(status), id, beforeId);
				var changed = task.status !== status || task.position !== position;
				task.status = status;
				task.position = position;
				if (changed) rerender(true);
				api('/api/tasks/' + id, { method: 'PUT', body: { status: status, position: position } }).catch(fail);
			}
		);

		view.onclick = function (e) {
			var btn = e.target.closest('[data-action]');
			if (!btn) return;
			var action = btn.dataset.action;
			var card = btn.closest('[data-id]');
			var task = card ? find(state.tasks, card.dataset.id) : null;

			if (action === 'compose') {
				submitComposer(btn.dataset.status);
			} else if (action === 'toggle' && task) {
				toggleTaskDone(task);
			} else if (action === 'left' && task) {
				shiftTask(task, -1);
			} else if (action === 'right' && task) {
				shiftTask(task, 1);
			} else if (action === 'edit' && task) {
				taskModal(task);
			} else if (action === 'delete' && task) {
				undoDeleteTask(task, btn);
			}
		};

		view.onkeydown = function (e) {
			if (e.key === 'Enter' && e.target.matches('[data-compose]')) {
				submitComposer(e.target.dataset.compose);
			}
		};

		enableSwipe(board);
	}

	function submitComposer(status) {
		var input = view.querySelector('[data-compose="' + status + '"]');
		if (!input) return;
		var title = input.value.trim();
		if (!title) return;
		api('/api/tasks', { method: 'POST', body: { title: title, status: status } })
			.then(function (task) {
				state.tasks.push(task);
				toast('Task added');
				rerender(true);
				var next = view.querySelector('[data-compose="' + status + '"]');
				if (next) next.focus();
			})
			.catch(fail);
	}

	function toggleTaskDone(task) {
		var status = task.status === 'done' ? 'todo' : 'done';
		task.status = status;
		task.completed_at = status === 'done' ? Date.now() : null;
		task.position = positionBetween(tasksIn(status), task.id, null);
		rerender(true);
		api('/api/tasks/' + task.id, {
			method: 'PUT',
			body: { status: status, position: task.position },
		}).catch(fail);
	}

	function shiftTask(task, dir) {
		var order = ['todo', 'doing', 'done'];
		var idx = order.indexOf(task.status) + dir;
		if (idx < 0 || idx > 2) return;
		var status = order[idx];
		task.status = status;
		task.completed_at = status === 'done' ? Date.now() : null;
		task.position = positionBetween(tasksIn(status), task.id, null);
		rerender(true);
		api('/api/tasks/' + task.id, {
			method: 'PUT',
			body: { status: status, position: task.position },
		}).catch(fail);
	}

	var _undoTimer = null;
	function undoDeleteTask(task, btn) {
		if (_undoTimer) { clearTimeout(_undoTimer); _undoTimer = null; }
		var snapshot = JSON.parse(JSON.stringify(state.tasks));
		state.tasks = state.tasks.filter(function (t) { return t.id !== task.id; });
		rerender(true);
		var root = $('#toast-root');
		root.innerHTML = '<div class="toast undo-toast">Task deleted<button class="btn small" id="undo-btn">Undo</button></div>';
		var undoBtn = root.querySelector('#undo-btn');
		if (undoBtn) undoBtn.onclick = function () {
			clearTimeout(_undoTimer);
			_undoTimer = null;
			state.tasks = snapshot;
			rerender(true);
			toast('Restored');
		};
		_undoTimer = setTimeout(function () {
			_undoTimer = null;
			api('/api/tasks/' + task.id, { method: 'DELETE' }).catch(fail);
			root.innerHTML = '';
		}, 5000);
	}

	function enableSwipe(board) {
		var startX = 0;
		var startY = 0;
		var swiping = null;
		var moved = false;

		board.addEventListener('touchstart', function (e) {
			var card = e.target.closest('.task-card');
			if (!card) return;
			swiping = card;
			startX = e.touches[0].clientX;
			startY = e.touches[0].clientY;
			moved = false;
		}, { passive: true });

		board.addEventListener('touchmove', function (e) {
			if (!swiping) return;
			var dx = e.touches[0].clientX - startX;
			var dy = e.touches[0].clientY - startY;
			if (!moved && Math.abs(dy) > Math.abs(dx)) { swiping = null; return; }
			if (Math.abs(dx) > 10) moved = true;
			if (moved) {
				e.preventDefault();
				swiping.style.transform = 'translateX(' + Math.max(-80, Math.min(80, dx)) + 'px)';
				swiping.style.transition = 'none';
			}
		}, { passive: false });

		board.addEventListener('touchend', function () {
			if (!swiping) return;
			var card = swiping;
			swiping = null;
			var dx = parseFloat(card.style.transform.replace(/[^-\d.]/g, '')) || 0;
			card.style.transform = '';
			card.style.transition = 'transform 0.2s ease';
			if (Math.abs(dx) > 50) {
				var task = find(state.tasks, card.dataset.id);
				if (task) shiftTask(task, dx > 0 ? 1 : -1);
			}
		}, { passive: true });
	}

	function taskModal(task) {
		var overlay = openModal(
			'Edit task',
			'<form id="task-form">' +
			'<div class="field"><label for="task-title">Title</label>' +
			'<input id="task-title" class="input" name="title" required maxlength="300" value="' + esc(task.title) + '" /></div>' +
			'<div class="field-row">' +
			'<div class="field"><label for="task-status">Status</label>' +
			'<select id="task-status" class="input" name="status">' +
			'<option value="todo"' + (task.status === 'todo' ? ' selected' : '') + '>To do</option>' +
			'<option value="doing"' + (task.status === 'doing' ? ' selected' : '') + '>Doing</option>' +
			'<option value="done"' + (task.status === 'done' ? ' selected' : '') + '>Done</option>' +
			'</select></div>' +
			'<div class="field"><label for="task-priority">Priority</label>' +
			'<select id="task-priority" class="input" name="priority">' +
			'<option value="none"' + ((!task.priority || task.priority === 'none') ? ' selected' : '') + '>None</option>' +
			'<option value="low"' + (task.priority === 'low' ? ' selected' : '') + '>Low</option>' +
			'<option value="medium"' + (task.priority === 'medium' ? ' selected' : '') + '>Medium</option>' +
			'<option value="high"' + (task.priority === 'high' ? ' selected' : '') + '>High</option>' +
			'</select></div>' +
			'</div>' +
			'<div class="field"><label for="task-notes">Notes</label>' +
			'<textarea id="task-notes" class="input" name="notes" maxlength="4000">' + esc(task.notes || '') + '</textarea></div>' +
			'<div class="modal-foot"><button class="btn" type="button" data-close>Cancel</button>' +
			'<button class="btn primary" type="submit">Save</button></div>' +
			'</form>'
		);
		overlay.querySelector('#task-form').addEventListener('submit', function (e) {
			e.preventDefault();
			var body = {
				title: overlay.querySelector('#task-title').value.trim(),
				notes: overlay.querySelector('#task-notes').value,
				status: overlay.querySelector('#task-status').value,
				priority: overlay.querySelector('#task-priority').value,
			};
			var prevStatus = task.status;
			api('/api/tasks/' + task.id, { method: 'PUT', body: body })
				.then(function (saved) {
					state.tasks = state.tasks.map(function (t) {
						return t.id === saved.id ? saved : t;
					});
					closeModal();
					toast('Task updated');
					rerender(true);
				})
				.catch(fail);
		});
	}

	/* ================================================================
	 * Habits
	 * ================================================================ */

	var WEEKS = 18;

	function loadHabits() {
		return api('/api/habits').then(function (rows) {
			state.habits = rows;
		});
	}

	function streakOf(logs) {
		var set = Object.create(null);
		logs.forEach(function (day) {
			set[day] = true;
		});
		var d = new Date();
		if (!set[iso(d)]) d.setDate(d.getDate() - 1);
		var n = 0;
		while (set[iso(d)]) {
			n++;
			d.setDate(d.getDate() - 1);
		}
		return n;
	}

	function habitRate(logs) {
		var set = Object.create(null);
		logs.forEach(function (day) { set[day] = true; });
		var d = new Date();
		d.setHours(12, 0, 0, 0);
		var done = 0;
		for (var i = 0; i < 30; i++) {
			if (set[iso(d)]) done++;
			d.setDate(d.getDate() - 1);
		}
		return { done: done, pct: Math.round((done / 30) * 100) };
	}

	function heatmapHtml(habit) {
		var set = Object.create(null);
		habit.logs.forEach(function (day) {
			set[day] = true;
		});
		var today = todayStr();
		var end = new Date();
		end.setHours(12, 0, 0, 0);
		var dow = (end.getDay() + 6) % 7; // 0 = Monday
		var start = new Date(end);
		start.setDate(end.getDate() - dow - (WEEKS - 1) * 7);

		var months = '';
		var prevMonth = '';
		for (var w = 0; w < WEEKS; w++) {
			var mid = new Date(start);
			mid.setDate(start.getDate() + w * 7 + 3);
			var m = mid.toLocaleDateString(undefined, { month: 'short' });
			months += '<span class="hm-month">' + (m === prevMonth ? '' : esc(m)) + '</span>';
			prevMonth = m;
		}

		var cells = '';
		for (var w = 0; w < WEEKS; w++) {
			for (var d = 0; d < 7; d++) {
				var date = new Date(start);
				date.setDate(start.getDate() + w * 7 + d);
				var day = iso(date);
				if (day > today) {
					cells += '<span class="hm-cell" aria-hidden="true"></span>';
					continue;
				}
				var done = !!set[day];
				cells +=
					'<button type="button" class="hm-cell' + (done ? ' done' : '') + (day === today ? ' today' : '') +
					'" data-id="' + esc(habit.id) + '" data-day="' + day + '" aria-pressed="' + done + '" ' +
					'aria-label="' + day + (done ? ', done' : ', not done') + '" title="' + day + '"></button>';
			}
		}
		return '<div class="heatmap habit-heat" role="group" aria-label="Daily history">' +
			'<div class="hm-months">' + months + '</div>' +
			'<div class="hm-grid">' + cells + '</div>' +
			'</div>';
	}

	function renderHabits() {
		var today = todayStr();
		var doneToday = 0;
		var bestStreak = 0;
		state.habits.forEach(function (h) {
			if (h.logs.indexOf(today) !== -1) doneToday++;
			var s = streakOf(h.logs);
			if (s > bestStreak) bestStreak = s;
		});
		var total = state.habits.length;
		var statsHtml = total
			? '<p class="board-stats">' + total + (total === 1 ? ' habit' : ' habits') +
				' · ' + doneToday + '/' + total + ' done today' +
				(bestStreak ? ' · ' + bestStreak + ' day best streak' : '') + '</p>'
			: '';

		var cards = state.habits
			.map(function (habit) {
				var streak = streakOf(habit.logs);
				var doneTodayH = habit.logs.indexOf(today) !== -1;
				var rate = habitRate(habit.logs);
				return (
					'<div class="habit-card">' +
					'<div class="habit-head">' +
					(habit.emoji ? '<span class="habit-emoji">' + esc(habit.emoji) + '</span>' : '') +
					'<span class="habit-name">' + esc(habit.name) + '</span>' +
					'<span class="habit-streak' + (streak > 0 ? ' hot' : '') + '">' + I.flame + streak + ' day streak</span>' +
					'<span class="habit-rate">' + rate.done + '/30 days · ' + rate.pct + '%</span>' +
					'<button class="icon-btn" type="button" data-action="edit" data-id="' + esc(habit.id) + '" aria-label="Edit habit" title="Edit">' + I.pencil + '</button>' +
					'<button class="icon-btn" type="button" data-action="delete" data-id="' + esc(habit.id) + '" aria-label="Delete" title="Delete">' + I.trash + '</button>' +
					'</div>' +
					'<div class="habit-body">' +
					heatmapHtml(habit) +
					'<button class="today-toggle' + (doneTodayH ? ' done-today' : '') + '" type="button" data-action="today" data-id="' + esc(habit.id) + '">' +
					'<span class="check' + (doneTodayH ? ' checked' : '') + '">' + I.check + '</span>' +
					(doneTodayH ? 'Done today' : 'Mark today') +
					'</button>' +
					'</div></div>'
				);
			})
			.join('');

		view.innerHTML =
			'<header class="page"><div class="view-head"><div><p class="kicker">Habits</p>' +
			'<h1>Build streaks that stick.</h1><p class="subtitle">Click any day to toggle it.</p>' +
			statsHtml + '</div>' +
			'<button class="btn primary" type="button" data-action="add">' + I.plus + 'Add habit</button></div></header>' +
			'<main class="page">' +
			(state.habits.length
				? '<div class="habit-list">' + cards + '</div>'
				: '<div class="empty">' + I.flame + '<p class="empty-title">No habits yet</p>' +
					'<p>Add a habit and start building a streak today.</p></div>') +
			'</main>';

		view.onclick = function (e) {
			var cell = e.target.closest('.hm-cell[data-day]');
			if (cell) {
				toggleDay(cell.dataset.id, cell.dataset.day);
				return;
			}
			var btn = e.target.closest('[data-action]');
			if (!btn) return;
			var action = btn.dataset.action;
			var habit = find(state.habits, btn.dataset.id);

			if (action === 'add') {
				habitModal(null);
			} else if (action === 'today' && habit) {
				toggleDay(habit.id, todayStr());
			} else if (action === 'edit' && habit) {
				habitModal(habit);
			} else if (action === 'delete' && habit) {
				undoDeleteHabit(habit, btn);
			}
		};
	}

	function toggleDay(habitId, day) {
		api('/api/habits/' + habitId + '/toggle', { method: 'POST', body: { day: day } })
			.then(function (res) {
				var habit = find(state.habits, habitId);
				if (!habit) return;
				var idx = habit.logs.indexOf(res.day);
				if (res.done && idx === -1) habit.logs.push(res.day);
				if (!res.done && idx !== -1) habit.logs.splice(idx, 1);
				habit.logs.sort();
				rerender(true);
			})
			.catch(fail);
	}

	var _undoHabitTimer = null;
	function undoDeleteHabit(habit, btn) {
		if (_undoHabitTimer) { clearTimeout(_undoHabitTimer); _undoHabitTimer = null; }
		var snapshot = JSON.parse(JSON.stringify(state.habits));
		state.habits = state.habits.filter(function (h) { return h.id !== habit.id; });
		rerender(true);
		var root = $('#toast-root');
		root.innerHTML = '<div class="toast undo-toast">Habit deleted<button class="btn small" id="undo-habit-btn">Undo</button></div>';
		var undoBtn = root.querySelector('#undo-habit-btn');
		if (undoBtn) undoBtn.onclick = function () {
			clearTimeout(_undoHabitTimer);
			_undoHabitTimer = null;
			state.habits = snapshot;
			rerender(true);
			toast('Restored');
		};
		_undoHabitTimer = setTimeout(function () {
			_undoHabitTimer = null;
			api('/api/habits/' + habit.id, { method: 'DELETE' }).catch(fail);
			root.innerHTML = '';
		}, 5000);
	}

	function habitModal(habit) {
		var overlay = openModal(
			habit ? 'Edit habit' : 'Add habit',
			'<form id="habit-form">' +
			'<div class="field"><label for="habit-name">Name</label>' +
			'<input id="habit-name" class="input" name="name" required maxlength="120" placeholder="e.g. Read 20 pages" value="' + esc(habit ? habit.name : '') + '" /></div>' +
			'<div class="field"><label for="habit-emoji">Emoji (optional)</label>' +
			'<input id="habit-emoji" class="input" name="emoji" maxlength="8" placeholder="📚" value="' + esc(habit ? habit.emoji : '') + '" /></div>' +
			'<div class="modal-foot"><button class="btn" type="button" data-close>Cancel</button>' +
			'<button class="btn primary" type="submit">' + (habit ? 'Save' : 'Add') + '</button></div>' +
			'</form>'
		);
		overlay.querySelector('#habit-form').addEventListener('submit', function (e) {
			e.preventDefault();
			var body = {
				name: overlay.querySelector('#habit-name').value.trim(),
				emoji: overlay.querySelector('#habit-emoji').value.trim(),
			};
			var req = habit
				? api('/api/habits/' + habit.id, { method: 'PUT', body: body })
				: api('/api/habits', { method: 'POST', body: body });
			req
				.then(function (saved) {
					if (habit) {
						state.habits = state.habits.map(function (h) {
							return h.id === saved.id ? Object.assign({}, h, saved) : h;
						});
					} else {
						saved.logs = [];
						state.habits.push(saved);
					}
					closeModal();
					toast(habit ? 'Habit updated' : 'Habit added');
					rerender(true);
				})
				.catch(fail);
		});
	}

	/* ================================================================
	 * Books — reading tracker
	 * ================================================================ */

	var BOOK_FILTERS = [
		{ key: 'all', label: 'All' },
		{ key: 'reading', label: 'Reading' },
		{ key: 'want', label: 'Want to read' },
		{ key: 'finished', label: 'Finished' },
	];

	var BOOK_STATUS_LABEL = { want: 'want to read', reading: 'reading', finished: 'finished' };

	function loadBooks() {
		return api('/api/books').then(function (rows) {
			state.books = rows;
		});
	}

	function bookProgressOf(b) {
		if (b.total_pages > 0) {
			return Math.min(100, Math.round((b.current_page / b.total_pages) * 100));
		}
		return b.status === 'finished' ? 100 : b.progress || 0;
	}

	function bookPagesLabel(b) {
		if (b.total_pages > 0) return b.current_page + ' / ' + b.total_pages + ' pages';
		return bookProgressOf(b) + '%';
	}

	function fmtDayStr(day) {
		var p = String(day).split('-');
		var d = new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
		return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
	}

	// Aggregate reading stats across every book + session.
	function bookStats() {
		var reading = 0;
		var finished = 0;
		var pages = 0;
		var days = Object.create(null);
		state.books.forEach(function (b) {
			if (b.status === 'reading') reading++;
			if (b.status === 'finished') finished++;
			(b.sessions || []).forEach(function (s) {
				pages += s.pages || 0;
				days[s.day] = true;
			});
		});
		var d = new Date();
		if (!days[iso(d)]) d.setDate(d.getDate() - 1);
		var streak = 0;
		while (days[iso(d)]) {
			streak++;
			d.setDate(d.getDate() - 1);
		}
		return { reading: reading, finished: finished, pages: pages, streak: streak };
	}

	function bookHeatmapHtml(b) {
		var set = Object.create(null);
		(b.sessions || []).forEach(function (s) {
			set[s.day] = true;
		});
		var today = todayStr();
		var now = new Date();
		now.setHours(12, 0, 0, 0);
		var dow = (now.getDay() + 6) % 7; // 0 = Monday
		now.setDate(now.getDate() - dow);

		var earliest = '';
		(b.sessions || []).forEach(function (s) {
			if (!earliest || s.day < earliest) earliest = s.day;
		});
		var weeks = WEEKS;
		if (earliest) {
			var e = earliest.split('-');
			var startOfReading = new Date(Number(e[0]), Number(e[1]) - 1, Number(e[2]), 12, 0, 0, 0);
			var span = Math.ceil((now.getTime() - startOfReading.getTime()) / (7 * 86400000)) + 1;
			weeks = Math.max(1, Math.min(WEEKS, span));
		}
		var start = new Date(now);
		start.setDate(start.getDate() - (weeks - 1) * 7);

		var months = '';
		var prevMonth = '';
		for (var w = 0; w < weeks; w++) {
			var mid = new Date(start);
			mid.setDate(start.getDate() + w * 7 + 3);
			var m = mid.toLocaleDateString(undefined, { month: 'short' });
			months += '<span class="hm-month">' + (m === prevMonth ? '' : esc(m)) + '</span>';
			prevMonth = m;
		}

		var cells = '';
		for (var w = 0; w < weeks; w++) {
			for (var d = 0; d < 7; d++) {
				var date = new Date(start);
				date.setDate(start.getDate() + w * 7 + d);
				var day = iso(date);
				if (day > today) {
					cells += '<span class="hm-cell" aria-hidden="true"></span>';
					continue;
				}
				var done = !!set[day];
				cells +=
					'<span class="hm-cell' + (done ? ' done' : '') + (day === today ? ' today' : '') +
					'" title="' + day + '" aria-hidden="true"></span>';
			}
		}
		return '<div class="heatmap book-heat" role="group" aria-label="Reading history">' +
			'<div class="hm-months">' + months + '</div>' +
			'<div class="hm-grid">' + cells + '</div>' +
			'</div>';
	}

	function sessionsHtml(b) {
		var list = (b.sessions || [])
			.slice()
			.sort(function (a, c) {
				return c.day < a.day ? -1 : c.day > a.day ? 1 : 0;
			});
		var rows = list
			.map(function (s) {
				return (
					'<div class="session-row">' +
					'<span class="session-day">' + esc(fmtDayStr(s.day)) + '</span>' +
					'<span class="session-nums">' +
					(s.pages ? esc(String(s.pages)) + 'p' : '') +
					(s.pages && s.minutes ? ' · ' : '') +
					(s.minutes ? esc(String(s.minutes)) + ' min' : '') +
					'</span>' +
					'<button class="icon-btn" type="button" data-action="del-session" data-sid="' + esc(s.id) + '" aria-label="Delete session" title="Delete">' + I.trash + '</button>' +
					'</div>'
				);
			})
			.join('');
		return (
			'<div class="session-list">' +
			(rows || '<p class="muted">No sessions logged yet — log your first one.</p>') +
			'</div>'
		);
	}

	function renderBooks() {
		var today = todayStr();
		var counts = { all: state.books.length, reading: 0, want: 0, finished: 0 };
		state.books.forEach(function (b) {
			counts[b.status] = (counts[b.status] || 0) + 1;
		});

		var chips = BOOK_FILTERS
			.map(function (f) {
				return (
					'<button class="chip' + (state.bookFilter === f.key ? ' active' : '') + '" type="button" data-action="filter" data-filter="' + f.key + '">' +
					f.label + ' · ' + counts[f.key] + '</button>'
				);
			})
			.join('');

		var stats = bookStats();
		var statsHtml =
			'<div class="stat-strip">' +
			'<div class="stat-cell"><span class="stat-num">' + stats.reading + '</span><span class="stat-label">Reading now</span></div>' +
			'<div class="stat-cell"><span class="stat-num">' + stats.finished + '</span><span class="stat-label">Finished</span></div>' +
			'<div class="stat-cell"><span class="stat-num">' + stats.pages + '</span><span class="stat-label">Pages read</span></div>' +
			'<div class="stat-cell"><span class="stat-num">' + stats.streak + '</span><span class="stat-label">Day streak</span></div>' +
			'</div>';

		var rows = state.books
			.filter(function (b) {
				return state.bookFilter === 'all' || b.status === state.bookFilter;
			})
			.map(function (b) {
				var progress = bookProgressOf(b);
				var expanded = !!state.bookExpanded[b.id];
				var progressBlock =
					b.status === 'want'
						? ''
						: '<div class="progress-wrap"><div class="progress-bar"><div class="progress-fill" style="width:' + progress + '%"></div></div>' +
							'<span class="progress-num">' + esc(bookPagesLabel(b)) + '</span></div>';
				return (
					'<div class="book-item">' +
					'<div class="book-row" data-id="' + esc(b.id) + '">' +
					'<div class="book-main"><span class="book-title">' + esc(b.title) + '</span>' +
					'<span class="book-meta">' +
					(b.author ? esc(b.author) : '') +
					(b.author ? ' · ' : '') +
					'<span class="status-chip ' + b.status + '">' + BOOK_STATUS_LABEL[b.status] + '</span>' +
					(b.started_at ? ' · started ' + esc(fmtDate(b.started_at)) : '') +
					(b.finished_at ? ' · finished ' + esc(fmtDate(b.finished_at)) : '') +
					'</span></div>' +
					'<div class="book-side">' +
					(b.link
						? '<a class="book-link icon-btn" href="' + esc(b.link) + '" target="_blank" rel="noopener noreferrer" aria-label="Open book link" title="Open book link">' + I.external + '</a>'
						: '') +
					progressBlock +
					(b.status === 'reading'
						? '<button class="btn small" type="button" data-action="finish" data-id="' + esc(b.id) + '">Finish</button>'
						: '') +
					'<button class="icon-btn" type="button" data-action="expand" data-id="' + esc(b.id) + '" aria-label="Toggle reading log" title="Reading log">' + (expanded ? I.chevU : I.chevD) + '</button>' +
					'<button class="icon-btn" type="button" data-action="edit" data-id="' + esc(b.id) + '" aria-label="Edit book" title="Edit">' + I.pencil + '</button>' +
					'<button class="icon-btn" type="button" data-action="delete" data-id="' + esc(b.id) + '" aria-label="Delete" title="Delete">' + I.trash + '</button>' +
					'</div></div>' +
					(b.status === 'reading'
						? '<form class="quick-log" data-id="' + esc(b.id) + '">' +
							'<label class="ql-label">Log reading</label>' +
							'<input class="input ql-day" type="date" max="' + today + '" value="' + today + '" aria-label="Date" />' +
							'<input class="input ql-pages" type="number" min="0" max="100000" placeholder="Pages" aria-label="Pages read" />' +
							'<input class="input ql-minutes" type="number" min="0" max="100000" placeholder="Min" aria-label="Minutes" />' +
							'<button class="btn small primary" type="submit">Log</button>' +
							'</form>'
						: '') +
					(expanded
						? '<div class="book-detail">' +
							'<div class="detail-heat">' + bookHeatmapHtml(b) + '</div>' +
							'<div class="detail-sessions">' + sessionsHtml(b) + '</div>' +
							'</div>'
						: '') +
					'</div>'
				);
			})
			.join('');

		view.innerHTML =
			'<header class="page"><div class="view-head"><div><p class="kicker">Books</p>' +
			'<h1>The bookshelf.</h1><p class="subtitle">A reading log — pages, sessions and streaks.</p></div>' +
			'<button class="btn primary" type="button" data-action="add">' + I.plus + 'Add book</button></div></header>' +
			'<main class="page">' + statsHtml + '<div class="filter-row">' + chips + '</div>' +
			(state.books.length
				? '<div class="book-list">' + (rows || '<div class="empty"><p class="empty-title">Nothing here</p><p>No books with this status yet.</p></div>') + '</div>'
				: '<div class="empty">' + I.book + '<p class="empty-title">No books yet</p><p>Add a book to start tracking your reading.</p></div>') +
			'</main>';

		view.onclick = function (e) {
			var btn = e.target.closest('[data-action]');
			if (!btn) return;
			var action = btn.dataset.action;
			var id = btn.dataset.id;
			var book = id ? find(state.books, id) : null;

			if (action === 'filter') {
				state.bookFilter = btn.dataset.filter;
				rerender(true);
			} else if (action === 'add') {
				bookModal(null);
			} else if (action === 'expand' && book) {
				state.bookExpanded[book.id] = !state.bookExpanded[book.id];
				rerender(true);
			} else if (action === 'del-session') {
				var sid = btn.dataset.sid;
				var srow = btn.closest('.book-item');
				var sbook = srow ? find(state.books, srow.querySelector('[data-id]').dataset.id) : null;
				armDelete(btn, function () {
					api('/api/books/' + sbook.id + '/sessions/' + sid, { method: 'DELETE' })
						.then(loadBooks)
						.then(function () {
							toast('Session deleted');
							rerender(true);
						})
						.catch(fail);
				});
			} else if (action === 'finish' && book) {
				book.status = 'finished';
				book.finished_at = Date.now();
				book.progress = 100;
				if (book.total_pages > 0) book.current_page = book.total_pages;
				rerender(true);
				api('/api/books/' + book.id, {
					method: 'PUT',
					body: { status: 'finished', current_page: book.current_page },
				})
					.then(function () {
						toast('Marked as finished');
					})
					.catch(fail);
			} else if (action === 'edit' && book) {
				bookModal(book);
			} else if (action === 'delete' && book) {
				armDelete(btn, function () {
					api('/api/books/' + book.id, { method: 'DELETE' })
						.then(function () {
							state.books = state.books.filter(function (b) {
								return b.id !== book.id;
							});
							toast('Book deleted');
							rerender(true);
						})
						.catch(fail);
				});
			}
		};

		view.onsubmit = function (e) {
			var form = e.target.closest('form.quick-log');
			if (!form) return;
			e.preventDefault();
			var book = find(state.books, form.dataset.id);
			if (!book) return;
			var body = {
				day: form.querySelector('.ql-day').value || todayStr(),
				pages: Number(form.querySelector('.ql-pages').value) || 0,
				minutes: Number(form.querySelector('.ql-minutes').value) || 0,
			};
			if (!body.pages && !body.minutes) {
				toast('Enter pages or minutes');
				return;
			}
			api('/api/books/' + book.id + '/sessions', { method: 'POST', body: body })
				.then(loadBooks)
				.then(function () {
					toast('Session logged');
					rerender(true);
				})
				.catch(fail);
		};
	}

	function bookModal(book) {
		var overlay = openModal(
			book ? 'Edit book' : 'Add book',
			'<form id="book-form">' +
			'<div class="field"><label for="book-title">Title</label>' +
			'<input id="book-title" class="input" name="title" required maxlength="200" value="' + esc(book ? book.title : '') + '" /></div>' +
			'<div class="field"><label for="book-author">Author</label>' +
			'<input id="book-author" class="input" name="author" maxlength="120" value="' + esc(book ? book.author : '') + '" /></div>' +
			'<div class="field"><label for="book-status">Status</label>' +
			'<select id="book-status" class="input" name="status">' +
			'<option value="want"' + (book && book.status === 'want' ? ' selected' : '') + '>Want to read</option>' +
			'<option value="reading"' + (book && book.status === 'reading' ? ' selected' : '') + '>Reading</option>' +
			'<option value="finished"' + (book && book.status === 'finished' ? ' selected' : '') + '>Finished</option>' +
			'</select></div>' +
			'<div class="field-row">' +
			'<div class="field"><label for="book-total">Total pages</label>' +
			'<input id="book-total" class="input" name="total_pages" type="number" min="0" max="10000000" value="' + (book ? book.total_pages || 0 : 0) + '" /></div>' +
			'<div class="field"><label for="book-cur">Current page</label>' +
			'<input id="book-cur" class="input" name="current_page" type="number" min="0" max="10000000" value="' + (book ? book.current_page || 0 : 0) + '" /></div>' +
			'</div>' +
			'<div class="field"><label for="book-started">Started reading</label>' +
			'<input id="book-started" class="input" name="started_at" type="date" value="' + (book && book.started_at ? iso(new Date(book.started_at)) : '') + '" /></div>' +
			'<div class="field"><label for="book-link">Book link (PDF, optional)</label>' +
			'<input id="book-link" class="input" name="link" type="url" maxlength="2000" placeholder="https://…" value="' + esc(book ? book.link || '' : '') + '" /></div>' +
			'<div class="field"><label for="book-notes">Notes</label>' +
			'<textarea id="book-notes" class="input" name="notes" maxlength="4000">' + esc(book ? book.notes || '' : '') + '</textarea></div>' +
			'<div class="modal-foot"><button class="btn" type="button" data-close>Cancel</button>' +
			'<button class="btn primary" type="submit">' + (book ? 'Save' : 'Add') + '</button></div>' +
			'</form>'
		);

		overlay.querySelector('#book-form').addEventListener('submit', function (e) {
			e.preventDefault();
			var started = overlay.querySelector('#book-started').value;
			var body = {
				title: overlay.querySelector('#book-title').value.trim(),
				author: overlay.querySelector('#book-author').value.trim(),
				status: overlay.querySelector('#book-status').value,
				total_pages: Number(overlay.querySelector('#book-total').value) || 0,
				current_page: Number(overlay.querySelector('#book-cur').value) || 0,
				started_at: started ? new Date(started + 'T12:00:00').getTime() : null,
				link: overlay.querySelector('#book-link').value.trim(),
				notes: overlay.querySelector('#book-notes').value,
			};
			var req = book
				? api('/api/books/' + book.id, { method: 'PUT', body: body })
				: api('/api/books', { method: 'POST', body: body });
			req
				.then(function (saved) {
					if (book) {
						saved.sessions = book.sessions || [];
						state.books = state.books.map(function (b) {
							return b.id === saved.id ? saved : b;
						});
					} else {
						saved.sessions = [];
						state.books.unshift(saved);
					}
					closeModal();
					toast(book ? 'Book updated' : 'Book added');
					rerender(true);
				})
				.catch(fail);
		});
	}

	/* ================================================================
	 * Infra — dashboards & monitoring links
	 * ================================================================ */

	var ICON_CDN = 'https://cdn.simpleicons.org';
	var INFRA_GROUPS = [
		{
			title: 'Hosting & data',
			icon: 'server',
			links: [
				{
					name: 'Render',
					url: 'https://dashboard.render.com/web/srv-da0d3dtbedkc73agihvg',
					desc: 'Docmost service — logs, env vars, redeploys',
					logo: ICON_CDN + '/render/664DE5',
				},
				{
					name: 'Supabase',
					url: 'https://supabase.com/dashboard/project/jtqlbqlcocsudrkbquhm',
					desc: 'Postgres for Docmost',
					logo: ICON_CDN + '/supabase/3ECF8E',
				},
				{
					name: 'Upstash',
					url: 'https://console.upstash.com/redis/90401fa2-1ac3-40c0-82ae-3705eb06cc1c',
					desc: 'Redis for rate-limiting & caching',
					logo: ICON_CDN + '/upstash/00C7B7',
				},
				{
					name: 'Cloudflare',
					url: 'https://dash.cloudflare.com/0e8ab63bb93128b57f4f47ad32f95988/sidali-djeghbal.dev',
					desc: 'DNS, R2 buckets, Workers & Turnstile',
					logo: ICON_CDN + '/cloudflare/F38020',
				},
			],
		},
		{
			title: 'Monitoring & analytics',
			icon: 'chart',
			links: [
				{
					name: 'LogRocket',
					url: 'https://app.logrocket.com/8mej4y/portfolio/metrics/logrocket-analytics',
					desc: 'Session replay & performance monitoring',
					logo: ICON_CDN + '/rocket/764ABC',
				},
				{
					name: 'Umami',
					url: 'https://cloud.umami.is/analytics/eu/websites/ce2db398-dd36-458e-ada8-d6106f9b76c1',
					desc: 'Privacy-friendly analytics',
					logo: ICON_CDN + '/umami/291333',
				},
				{
					name: 'Search Console',
					url: 'https://search.google.com/search-console?resource_id=sc-domain%3Asidali-djeghbal.dev',
					desc: 'SEO indexing, coverage & performance',
					logo: ICON_CDN + '/google/4285F4',
				},
				{
					name: 'PageSpeed Insights',
					url: 'https://pagespeed.web.dev/',
					desc: 'Core Web Vitals & Lighthouse scores',
					logo: ICON_CDN + '/lighthouse/FF6D01',
				},
			],
		},
	];

	function renderInfra() {
		var total = infraLinkCount();
		var sections = INFRA_GROUPS.map(function (group) {
			var count = group.links.length;
			var cards = group.links
				.map(function (link) {
					return (
						'<a class="infra-card" href="' + esc(link.url) + '" target="_blank" rel="noreferrer">' +
						'<img class="infra-logo" src="' + esc(link.logo) + '" alt="" width="28" height="28" loading="lazy" />' +
						'<div class="infra-card-body">' +
						'<span class="bm-title">' + esc(link.name) + '</span>' +
						'<span class="infra-desc">' + esc(link.desc) + '</span>' +
						'<span class="bm-host">' + esc(hostOf(link.url)) + '</span>' +
						'</div>' +
						'<span class="infra-arrow">' + I.arrow + '</span>' +
						'</a>'
					);
				})
				.join('');
			return (
				'<section class="infra-group">' +
				'<div class="infra-group-head">' +
				'<h2 class="infra-title">' + esc(group.title) + '</h2>' +
				'<span class="infra-badge">' + count + '</span>' +
				'</div>' +
				'<div class="infra-grid">' + cards + '</div>' +
				'</section>'
			);
		}).join('');

		view.innerHTML =
			'<header class="page"><div class="view-head"><div><p class="kicker">Infra</p>' +
			'<h1>Everything behind the sites.</h1>' +
			'<p class="subtitle">Dashboards, data stores and monitoring in one place.</p>' +
			'<p class="board-stats">' + total + ' dashboards · ' + INFRA_GROUPS.length + ' categories</p>' +
			'</div></div></header>' +
			'<main class="page">' + sections + '</main>';
	}

	/* ================================================================
	 * Utilities + boot
	 * ================================================================ */

	function find(list, id) {
		for (var i = 0; i < list.length; i++) {
			if (list[i].id === id) return list[i];
		}
		return null;
	}

	function loadLauncher() {
		return Promise.all([loadBookmarks(), loadTasks(), loadHabits(), loadBooks()]);
	}

	var ROUTES = {
		'': { title: 'Command center', load: loadLauncher, render: renderLauncher },
		start: { title: 'Start', load: loadBookmarks, render: renderStart },
		tasks: { title: 'Tasks', load: loadTasks, render: renderTasks },
		habits: { title: 'Habits', load: loadHabits, render: renderHabits },
		books: { title: 'Books', load: loadBooks, render: renderBooks },
		infra: { title: 'Infra', render: renderInfra },
	};

	window.addEventListener('hashchange', route);

	function init() {
		view = $('#view');
		setupTheme();
		wireLogin();
		wireTopbar();
		api('/api/session')
			.then(function (data) {
				showApp(data && data.user);
				route();
			})
			.catch(function () {
				showLogin();
			});
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();
