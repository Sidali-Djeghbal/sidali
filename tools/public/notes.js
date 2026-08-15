(function () {
	'use strict';

	var TOKEN_KEY = 'tools-notes-token';
	var CURRENT_KEY = 'tools-notes-current';
	var API = '/api/notes';

	var notes = [];
	var currentId = null;
	var saveTimer = null;

	var $ = function (sel) {
		return document.querySelector(sel);
	};

	function setView(name) {
		$('#login-view').classList.toggle('hidden', name !== 'login');
		$('#workspace-view').classList.toggle('hidden', name !== 'workspace');
	}

	function getToken() {
		try {
			return localStorage.getItem(TOKEN_KEY) || '';
		} catch (e) {
			return '';
		}
	}

	function setToken(token) {
		try {
			localStorage.setItem(TOKEN_KEY, token);
		} catch (e) {}
	}

	async function sha256(input) {
		var data = new TextEncoder().encode(input);
		var digest = await crypto.subtle.digest('SHA-256', data);
		return Array.from(new Uint8Array(digest))
			.map(function (b) {
				return b.toString(16).padStart(2, '0');
			})
			.join('');
	}

	function api(path, options) {
		options = options || {};
		options.headers = options.headers || {};
		options.headers['Authorization'] = 'Bearer ' + getToken();
		return fetch(API + path, options).then(function (res) {
			if (res.status === 401) {
				setToken('');
				setView('login');
				throw new Error('unauthorized');
			}
			return res.json().then(function (data) {
				if (!res.ok) throw new Error(data.error || 'request failed');
				return data;
			});
		});
	}

	function timeAgo(ts) {
		var diff = Date.now() - ts;
		var min = Math.floor(diff / 60000);
		if (min < 1) return 'just now';
		if (min < 60) return min + 'm ago';
		var hrs = Math.floor(min / 60);
		if (hrs < 24) return hrs + 'h ago';
		return Math.floor(hrs / 24) + 'd ago';
	}

	function renderList() {
		var ul = $('#notes-list');
		ul.textContent = '';
		notes.forEach(function (note) {
			var li = document.createElement('li');
			var btn = document.createElement('button');
			btn.type = 'button';
			btn.className = 'note-item' + (note.id === currentId ? ' active' : '');
			btn.setAttribute('data-id', note.id);

			var title = document.createElement('span');
			title.className = 'note-item-title';
			title.textContent = note.title || 'Untitled';

			var meta = document.createElement('span');
			meta.className = 'note-item-meta';
			meta.textContent = timeAgo(note.updated_at);

			btn.appendChild(title);
			btn.appendChild(meta);
			btn.addEventListener('click', function () {
				openNote(note.id);
			});
			li.appendChild(btn);
			ul.appendChild(li);
		});
	}

	async function refreshList() {
		try {
			notes = await api('');
			renderList();
			if (currentId && !notes.some(function (n) { return n.id === currentId; })) {
				currentId = null;
				$('#editor').classList.add('hidden');
				$('#empty-editor').classList.remove('hidden');
			}
		} catch (e) {
			showEditorStatus('sync failed');
		}
	}

	function setCurrent(id, title, content, ts) {
		currentId = id;
		$('#note-title').value = title || '';
		$('#note-content').value = content || '';
		$('#empty-editor').classList.add('hidden');
		$('#editor').classList.remove('hidden');
		renderList();
		try {
			localStorage.setItem(CURRENT_KEY, id);
		} catch (e) {}
	}

	async function openNote(id) {
		var note = notes.find(function (n) {
			return n.id === id;
		});
		if (!note) return;
		try {
			var full = await api('/' + id);
			setCurrent(full.id, full.title, full.content, full.updated_at);
		} catch (e) {}
	}

	function showEditorStatus(text) {
		var el = $('#editor-status');
		el.textContent = text;
		clearTimeout(showEditorStatus._t);
		if (text) {
			showEditorStatus._t = setTimeout(function () {
				el.textContent = '';
			}, 2500);
		}
	}

	function scheduleSave() {
		clearTimeout(saveTimer);
		saveTimer = setTimeout(saveCurrent, 800);
	}

	async function saveCurrent() {
		if (!currentId) return;
		var title = $('#note-title').value;
		var content = $('#note-content').value;
		var now = Date.now();
		try {
			var saved = await api('/' + currentId, {
				method: 'PUT',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ title: title, content: content }),
			});
			var idx = notes.findIndex(function (n) {
				return n.id === currentId;
			});
			if (idx !== -1) {
				var moved = notes[idx];
				moved.title = saved.title;
				moved.updated_at = now;
				notes.splice(idx, 1);
				notes.unshift(moved);
				renderList();
			}
			showEditorStatus('saved');
		} catch (e) {
			showEditorStatus('save failed');
		}
	}

	async function createNote() {
		try {
			var note = await api('', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ title: '', content: '' }),
			});
			notes.unshift(note);
			setCurrent(note.id, '', '');
			$('#note-title').focus();
		} catch (e) {}
	}

	async function deleteNote() {
		if (!currentId) return;
		if (!confirm('Delete this note?')) return;
		try {
			await api('/' + currentId, { method: 'DELETE' });
			notes = notes.filter(function (n) {
				return n.id !== currentId;
			});
			currentId = null;
			$('#editor').classList.add('hidden');
			$('#empty-editor').classList.remove('hidden');
			renderList();
		} catch (e) {}
	}

	function initLogin() {
		$('#login-form').addEventListener('submit', function (e) {
			e.preventDefault();
			var password = $('#password').value;
			sha256(password).then(function (token) {
				setToken(token);
				$('#password').value = '';
				return load().catch(function () {
					$('#login-error').textContent = 'Wrong password.';
					$('#login-error').classList.remove('hidden');
				});
			});
		});
	}

	async function load() {
		try {
			await refreshList();
			setView('workspace');
			$('#login-error').classList.add('hidden');
			var savedId = localStorage.getItem(CURRENT_KEY);
			if (savedId && notes.some(function (n) { return n.id === savedId; })) {
				openNote(savedId);
			} else if (notes.length) {
				openNote(notes[0].id);
			} else {
				$('#empty-editor').classList.remove('hidden');
			}
		} catch (e) {
			if (e.message === 'unauthorized') return;
		}
	}

	function init() {
		$('#new-note').addEventListener('click', createNote);
		$('#delete-note').addEventListener('click', deleteNote);
		$('#note-title').addEventListener('input', scheduleSave);
		$('#note-content').addEventListener('input', scheduleSave);
		$('#note-title').addEventListener('keydown', function (e) {
			if (e.key === 'Enter') {
				e.preventDefault();
				$('#note-content').focus();
			}
		});
		$('#note-content').addEventListener('keydown', function (e) {
			if ((e.metaKey || e.ctrlKey) && e.key === 's') {
				e.preventDefault();
				clearTimeout(saveTimer);
				saveCurrent();
			}
			if (e.key === 'Escape' && !currentId) {
				$('#note-content').blur();
			}
		});

		initLogin();

		if (getToken()) {
			load();
		} else {
			setView('login');
		}
	}

	document.addEventListener('DOMContentLoaded', init);
})();
