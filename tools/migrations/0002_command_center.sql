-- Personal command center: bookmarks, tasks, habits, books.
-- The legacy `notes` table from 0001 is left untouched (data preserved).

CREATE TABLE IF NOT EXISTS bookmarks (
	id TEXT PRIMARY KEY,
	title TEXT NOT NULL,
	url TEXT NOT NULL,
	position REAL NOT NULL DEFAULT 0,
	created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_bookmarks_position ON bookmarks (position);

CREATE TABLE IF NOT EXISTS tasks (
	id TEXT PRIMARY KEY,
	title TEXT NOT NULL,
	notes TEXT NOT NULL DEFAULT '',
	status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'doing', 'done')),
	position REAL NOT NULL DEFAULT 0,
	completed_at INTEGER,
	created_at INTEGER NOT NULL,
	updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks (status, position);

CREATE TABLE IF NOT EXISTS habits (
	id TEXT PRIMARY KEY,
	name TEXT NOT NULL,
	emoji TEXT NOT NULL DEFAULT '',
	archived INTEGER NOT NULL DEFAULT 0,
	created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS habit_logs (
	habit_id TEXT NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
	day TEXT NOT NULL,
	PRIMARY KEY (habit_id, day)
);

CREATE INDEX IF NOT EXISTS idx_habit_logs_day ON habit_logs (day);

CREATE TABLE IF NOT EXISTS books (
	id TEXT PRIMARY KEY,
	title TEXT NOT NULL,
	author TEXT NOT NULL DEFAULT '',
	status TEXT NOT NULL DEFAULT 'want' CHECK (status IN ('want', 'reading', 'finished')),
	rating INTEGER NOT NULL DEFAULT 0 CHECK (rating BETWEEN 0 AND 5),
	progress INTEGER NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
	notes TEXT NOT NULL DEFAULT '',
	finished_at INTEGER,
	created_at INTEGER NOT NULL,
	updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_books_status ON books (status);
