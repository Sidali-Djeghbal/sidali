-- Tasks: add priority field for visual card indicators.

ALTER TABLE tasks ADD COLUMN priority TEXT NOT NULL DEFAULT 'none';
