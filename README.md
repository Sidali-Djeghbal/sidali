# Personal Portfolio

[Sidali DJEGHBAL's](https://sidali-djeghbal.dev) personal portfolio, an AI Engineer Undergrad and Full-Stack Developer. Features an adaptive theme, an interactive splash cursor, a project showcase, an uses page, and live stats.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, TypeScript, Turbopack)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animation**: [Motion](https://motion.dev/), [GSAP](https://gsap.com/), [Lenis](https://lenis.darkroom.engineering/)
- **Data**: [WakaTime API](https://wakatime.com/), [GitHub GraphQL](https://docs.github.com/en/graphql)
- **Analytics**: [LogRocket](https://logrocket.com/), [Umami](https://umami.is/)
- **Deployment**: [Cloudflare Pages](https://pages.cloudflare.com/) (custom domain `sidali-djeghbal.dev`)

## Pages

| Route       | Description                                        |
| ----------- | -------------------------------------------------- |
| `/`         | Hero and skills                                    |
| `/projects` | Project showcase with hover image previews         |
| `/uses`     | The tools I use                                    |
| `/stats`    | GitHub contributions and WakaTime stats            |

## Monorepo Structure

```
sidali/
├── app/          # Next.js portfolio website  →  sidali-djeghbal.dev
└── tools/        # Cloudflare Worker command center  →  tools.sidali-djeghbal.dev
```

---

## Running the Portfolio Locally

### Prerequisites

- [Bun](https://bun.sh/) (recommended) — or npm / yarn / pnpm

### 1 — Install dependencies

```bash
bun install
```

### 2 — Set up environment variables

```bash
cp .env.example .env.local
```

Then fill in `.env.local`:

| Variable                      | Required | Description                                                  |
| ----------------------------- | -------- | ------------------------------------------------------------ |
| `GITHUB_TOKEN`                | Optional | GitHub personal access token for GraphQL stats (server-side) |
| `WAKATIME_SECRET_KEY`         | Optional | WakaTime API secret key for coding stats                     |
| `NEXT_PUBLIC_LOGROCKET_ID`    | Optional | LogRocket app ID for session recording                       |
| `NEXT_PUBLIC_UMAMI_WEBSITE_ID`| Optional | Umami analytics website ID                                   |
| `NEXT_PUBLIC_UMAMI_WEBSITE_URL`| Optional | Umami analytics script URL                                   |

> All variables are optional — the stats sections will fail gracefully if they are missing.

### 3 — Start the dev server

```bash
bun run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### Useful Scripts

| Script            | Description                        |
| ----------------- | ---------------------------------- |
| `bun run dev`     | Start the development server       |
| `bun run build`   | Build the production bundle        |
| `bun run check`   | Run Biome linting                  |
| `bun run format`  | Format the codebase with Biome     |

---

## Running the Command Center Locally

The command center lives in `tools/` and is a separate Cloudflare Worker + D1 app.
See [`tools/README.md`](./tools/README.md) for the full local dev guide.

**Quick start:**

```bash
cd tools

# 1. Apply all migrations to the local D1 database (first time only)
npx wrangler d1 execute sidali-notes --local --file migrations/0001_init.sql
npx wrangler d1 execute sidali-notes --local --file migrations/0002_command_center.sql
npx wrangler d1 execute sidali-notes --local --file migrations/0003_reading_tracker.sql
npx wrangler d1 execute sidali-notes --local --file migrations/0004_books_link.sql
npx wrangler d1 execute sidali-notes --local --file migrations/0005_tasks_priority.sql

# 2. Start the local dev server
npx wrangler dev --port 8787
```

Open **[http://localhost:8787](http://localhost:8787)** in the browser.
