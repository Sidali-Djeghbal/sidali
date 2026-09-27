# tools.sidali-djeghbal.dev — personal command center

A single Cloudflare Worker serving a GitHub-OAuth-gated SPA, all persisted to D1:

- **Start** — bookmarks / quick links (drag to reorder)
- **Tasks** — three-column kanban with drag & drop
- **Habits** — daily streaks with a GitHub-style heatmap
- **Books** — a reading log: page-level progress, per-day sessions and streaks
- **Infra** — one-page links to hosting, data and monitoring dashboards

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
| `/api/auth/github`              | GET (starts OAuth) |
| `/api/auth/github/callback`     | GET (OAuth callback) |
| `/api/logout`                   | POST           |
| `/api/session`                  | GET            |
| `/api/bookmarks[/:id]`          | GET POST PUT DELETE |
| `/api/tasks[/:id]`              | GET POST PUT DELETE |
| `/api/habits[/:id]`             | GET POST PUT DELETE |
| `/api/habits/:id/toggle`        | POST `{ day }` |
| `/api/books[/:id]`              | GET POST PUT DELETE |
| `/api/books/:id/sessions`       | POST `{ day, pages, minutes }` |
| `/api/books/:id/sessions/:sid`  | DELETE |

Auth is GitHub OAuth. Only the logins in `GITHUB_ALLOWED_USERS`
(comma-separated) can sign in; a signed, expiring HttpOnly cookie
(30 days) is issued on success. OAuth start is rate-limited per IP.

## Secrets

```sh
npx wrangler secret put GITHUB_CLIENT_ID
npx wrangler secret put GITHUB_CLIENT_SECRET
npx wrangler secret put GITHUB_ALLOWED_USERS   # e.g. Sidali-Djeghbal
```

Create a GitHub OAuth App at github.com/settings/developers with:

- Homepage URL: `https://tools.sidali-djeghbal.dev`
- Authorization callback URL: `https://tools.sidali-djeghbal.dev/api/auth/github/callback`

For local dev, create `tools/.dev.vars` (gitignored):

```
GITHUB_CLIENT_ID=dev-client-id
GITHUB_CLIENT_SECRET=dev-client-secret
GITHUB_ALLOWED_USERS=Sidali-Djeghbal
```

## Local development

### 1 — Create `.dev.vars` (first time only)

Create `tools/.dev.vars` (already gitignored) with your local credentials:

```sh
GITHUB_CLIENT_ID=your-local-github-client-id
GITHUB_CLIENT_SECRET=your-local-github-client-secret
GITHUB_ALLOWED_USERS=Sidali-Djeghbal
```

To make GitHub OAuth work locally, create a **separate** GitHub OAuth App at
[github.com/settings/developers](https://github.com/settings/developers) with:

- Homepage URL: `http://localhost:8787`
- Authorization callback URL: `http://localhost:8787/api/auth/github/callback`

Then use its `Client ID` and `Client Secret` in `.dev.vars`.

> **Note:** The placeholder values (`dev-client-id` / `dev-client-secret`) let
> the server start, but OAuth login will fail. You need a real local OAuth App
> to actually sign in.

### 2 — Apply migrations (first time only)

```sh
cd tools
npx wrangler d1 execute sidali-notes --local --file migrations/0001_init.sql
npx wrangler d1 execute sidali-notes --local --file migrations/0002_command_center.sql
npx wrangler d1 execute sidali-notes --local --file migrations/0003_reading_tracker.sql
npx wrangler d1 execute sidali-notes --local --file migrations/0004_books_link.sql
npx wrangler d1 execute sidali-notes --local --file migrations/0005_tasks_priority.sql
```

### 3 — Start the dev server

```sh
npx wrangler dev --port 8787
```

Open **[http://localhost:8787](http://localhost:8787)** in your browser.

## Deploy

```sh
cd tools
npx wrangler d1 execute sidali-notes --remote --file migrations/0002_command_center.sql  # once
npx wrangler d1 execute sidali-notes --remote --file migrations/0003_reading_tracker.sql  # once
npx wrangler deploy
```

The `notes` table from the old notes app is left in the database
(data preserved); only the code was removed.
