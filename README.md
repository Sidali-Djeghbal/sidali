# Sidali DJEGHBAL — Personal Portfolio

Personal portfolio of [Sidali DJEGHBAL](https://sidali-djeghbal.dev), an AI Engineer Undergrad and Full-Stack Developer. Features a black/white adaptive theme, an interactive splash cursor, a project showcase, a uses page, and live stats.

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

## Running Locally

### Prerequisites

- [bun](https://bun.sh/) (or npm/yarn/pnpm)

### Installation

1. Clone the repo:

```bash
git clone <repo-url>
cd sidali
```

2. Install dependencies:

```bash
bun install
```

3. Create your environment file:

```bash
cp .env.example .env.local
```

4. Add your environment variables to `.env.local`:

```txt
NEXT_PUBLIC_LOGROCKET_ID=...
NEXT_PUBLIC_GITHUB_TOKEN=...
WAKATIME_SECRET_KEY=...
NEXT_PUBLIC_UMAMI_WEBSITE_ID=...
NEXT_PUBLIC_UMAMI_WEBSITE_URL=...
```

> GitHub and WakaTime variables are optional — the corresponding stats sections will fail gracefully without them.

5. Run the development server:

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Useful Scripts

| Script       | Description                        |
| ------------ | ---------------------------------- |
| `bun run dev`   | Start the development server     |
| `bun run build` | Build the production bundle      |
| `bun run check` | Run Biome linting                |
| `bun run format`| Format the codebase with Biome   |

## License

This project is a personal portfolio. All rights reserved.
