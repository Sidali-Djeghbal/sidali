-- Books: optional external link (e.g. PDF) replacing the rating field.

ALTER TABLE books ADD COLUMN link TEXT NOT NULL DEFAULT '';
ALTER TABLE books DROP COLUMN rating;
