(function () {
	'use strict';

	var TOKEN_KEY = 'tools-notes-token';
	var CURRENT_KEY = 'tools-notes-current';
	var API = '/api/notes';

	var notes = [];
	var currentId = null;
	var saveTimer = null;
	var editor = null;
	var loadingContent = false;

	var $ = function (sel) {
		return document.querySelector(sel);
	};

	function setView(name) {
		$('#login-view').classList.toggle('hidden', name !== 'login');
		$('#workspace-view').classList.toggle('hidden', name !== 'workspace');
		if (name === 'workspace') {
			$('#fixed-toolbar').classList.remove('hidden');
		} else {
			$('#fixed-toolbar').classList.add('hidden');
		}
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
				$('#fixed-toolbar').classList.add('hidden');
			}
		} catch (e) {
			showEditorStatus('sync failed');
		}
	}

	function setEditorContent(content) {
		if (!editor) return;
		loadingContent = true;
		editor.commands.setContent(content || '<p></p>', false);
		loadingContent = false;
		editor.commands.blur();
	}

	function setCurrent(id, title, content, ts) {
		currentId = id;
		$('#note-title').value = title || '';
		setEditorContent(content);
		var byline = $('#editor-byline');
		if (ts) {
			byline.textContent = 'Updated ' + timeAgo(ts);
		} else {
			byline.textContent = '';
		}
		$('#empty-editor').classList.add('hidden');
		$('#editor').classList.remove('hidden');
		$('#fixed-toolbar').classList.remove('hidden');
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
		if (id === currentId) return;
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
		var content = editor ? editor.getHTML() : '';
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
			$('#editor-byline').textContent = 'Updated just now';
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
			$('#fixed-toolbar').classList.add('hidden');
			$('#empty-editor').classList.remove('hidden');
			renderList();
		} catch (e) {}
	}

	/* --- Toolbar wiring --- */
	function updateToolbar() {
		if (!editor) return;
		var isActive = function (name, attrs) {
			return attrs ? editor.isActive(name, attrs) : editor.isActive(name);
		};
		var map = {
			bold: isActive('bold'),
			italic: isActive('italic'),
			strike: isActive('strike'),
			code: isActive('code'),
			bulletList: isActive('bulletList'),
			orderedList: isActive('orderedList'),
			blockquote: isActive('blockquote'),
			codeBlock: isActive('codeBlock'),
		};
		document.querySelectorAll('.toolbar-btn[data-cmd]').forEach(function (btn) {
			var cmd = btn.getAttribute('data-cmd');
			btn.classList.toggle('active', !!map[cmd]);
		});

		var select = $('#block-type');
		if (editor.isActive('heading', { level: 1 })) select.value = 'heading1';
		else if (editor.isActive('heading', { level: 2 })) select.value = 'heading2';
		else if (editor.isActive('heading', { level: 3 })) select.value = 'heading3';
		else select.value = 'paragraph';
	}

	function runCommand(cmd) {
		if (!editor) return;
		var chain = editor.chain();
		switch (cmd) {
			case 'undo':
				chain.undo().run();
				break;
			case 'redo':
				chain.redo().run();
				break;
			case 'bold':
				chain.toggleBold().run();
				break;
			case 'italic':
				chain.toggleItalic().run();
				break;
			case 'strike':
				chain.toggleStrike().run();
				break;
			case 'code':
				chain.toggleCode().run();
				break;
			case 'bulletList':
				chain.toggleBulletList().run();
				break;
			case 'orderedList':
				chain.toggleOrderedList().run();
				break;
			case 'blockquote':
				chain.toggleBlockquote().run();
				break;
			case 'codeBlock':
				chain.toggleCodeBlock().run();
				break;
			case 'horizontalRule':
				chain.setHorizontalRule().run();
				break;
		}
		updateToolbar();
		editor.commands.focus();
	}

	function applyBlockType(value) {
		if (!editor) return;
		var chain = editor.chain();
		switch (value) {
			case 'heading1':
				chain.setHeading({ level: 1 }).run();
				break;
			case 'heading2':
				chain.setHeading({ level: 2 }).run();
				break;
			case 'heading3':
				chain.setHeading({ level: 3 }).run();
				break;
			default:
				chain.setParagraph().run();
				break;
		}
		updateToolbar();
		editor.commands.focus();
	}

	/* --- TipTap editor init --- */
	function initEditor() {
		if (!window.Tiptap || !window.Tiptap.Editor) {
			showEditorStatus('editor failed to load');
			return;
		}
		var T = window.Tiptap;
		var Placeholder = T.Placeholder;
		editor = new T.Editor({
			element: document.querySelector('#editor-content'),
			extensions: [
				T.StarterKit.configure({
					heading: { levels: [1, 2, 3] },
				}),
				Placeholder.configure({
					placeholder: function (params) {
						if (params.node.type.name === 'heading') {
							return 'Heading ' + params.node.attrs.level;
						}
						return "Write anything. Enter '/' for commands";
					},
					includeChildren: true,
					showOnlyWhenEditable: true,
				}),
			],
			content: '<p></p>',
			editorProps: {
				attributes: {
					class: 'ProseMirror',
					spellcheck: 'false',
				},
				handleKeyDown: function (view, event) {
					if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's') {
						event.preventDefault();
						clearTimeout(saveTimer);
						saveCurrent();
						return true;
					}
					return false;
				},
			},
			onUpdate: function () {
				updateToolbar();
				if (!loadingContent) scheduleSave();
			},
			onSelectionUpdate: updateToolbar,
		});

		document.querySelectorAll('.toolbar-btn[data-cmd]').forEach(function (btn) {
			btn.addEventListener('click', function () {
				runCommand(btn.getAttribute('data-cmd'));
			});
		});
		$('#block-type').addEventListener('change', function (e) {
			applyBlockType(e.target.value);
		});
	}

	/* --- Login --- */
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
				$('#fixed-toolbar').classList.add('hidden');
			}
		} catch (e) {
			if (e.message === 'unauthorized') return;
		}
	}

	function init() {
		$('#new-note').addEventListener('click', createNote);
		$('#empty-new-note').addEventListener('click', createNote);
		$('#delete-note').addEventListener('click', deleteNote);
		$('#note-title').addEventListener('input', scheduleSave);
		$('#note-title').addEventListener('keydown', function (e) {
			if (e.key === 'Enter') {
				e.preventDefault();
				if (editor) editor.commands.focus();
			}
		});

		initLogin();
		initEditor();

		if (getToken()) {
			load();
		} else {
			setView('login');
		}
	}

	document.addEventListener('DOMContentLoaded', init);
})();
