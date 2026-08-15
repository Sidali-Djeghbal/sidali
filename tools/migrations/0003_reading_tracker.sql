-- Reading tracker: page-level progress + logged reading sessions.
-- Applied on top of 0002 (books table already exists).

ALTER TABLE books ADD COLUMN total_pages INTEGER NOT NULL DEFAULT 0;
ALTER TABLE books ADD COLUMN current_page INTEGER NOT NULL DEFAULT 0;
ALTER TABLE books ADD COLUMN started_at INTEGER;

CREATE TABLE IF NOT EXISTS book_sessions (
	id TEXT PRIMARY KEY,
	book_id TEXT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
	day TEXT NOT NULL,
	pages INTEGER NOT NULL DEFAULT 0,
	minutes INTEGER NOT NULL DEFAULT 0,
	created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_book_sessions_book ON book_sessions (book_id, day);
CREATE INDEX IF NOT EXISTS idx_book_sessions_day ON book_sessions (day);
