# tools.sidali-djeghbal.dev — personal command center

A single Cloudflare Worker serving a password-gated SPA with four
self-contained tools, all persisted to D1:

- **Start** — bookmarks / quick links (drag to reorder)
- **Tasks** — three-column kanban with drag & drop
- **Habits** — daily streaks with a GitHub-style heatmap
- **Books** — reading tracker (status, progress, rating)

No server, no monitoring, no build step — just static assets + one Worker.

## Structure

```
tools/
├── index.js              # Worker: static assets + JSON API + auth
├── wrangler.jsonc        # Worker config (custom domain, D1 binding)
├── migrations/           # D1 schema
└── public/               # The SPA (vanilla JS, no framework)
    ├── index.html
    ├── styles.css
    └── app.js
```

## API

| Endpoint                        | Methods        |
| ------------------------------- | -------------- |
| `/api/login`                    | POST           |
| `/api/logout`                   | POST           |
| `/api/session`                  | GET            |
| `/api/bookmarks[/:id]`          | GET POST PUT DELETE |
| `/api/tasks[/:id]`              | GET POST PUT DELETE |
| `/api/habits[/:id]`             | GET POST PUT DELETE |
| `/api/habits/:id/toggle`        | POST `{ day }` |
| `/api/books[/:id]`              | GET POST PUT DELETE |

Auth is a signed, expiring HttpOnly cookie (30 days) issued after a
password check. Login attempts are rate-limited per IP.

## Secrets

The password is read from the `TOOLS_PASSWORD` secret (the legacy
`NOTES_PASSWORD` still works as a fallback).

```sh
npx wrangler secret put TOOLS_PASSWORD
```

For local dev, create `tools/.dev.vars` (gitignored):

```
TOOLS_PASSWORD=dev-password
```

## Local development

```sh
cd tools
npx wrangler d1 execute sidali-notes --local --file migrations/0001_init.sql
npx wrangler d1 execute sidali-notes --local --file migrations/0002_command_center.sql
npx wrangler dev
```

## Deploy

```sh
cd tools
npx wrangler d1 execute sidali-notes --remote --file migrations/0002_command_center.sql  # once
npx wrangler deploy
```

The `notes` table from the old notes app is left in the database
(data preserved); only the code was removed.
