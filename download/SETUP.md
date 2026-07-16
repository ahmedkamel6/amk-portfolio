# AMK Portfolio — Setup Guide

## Quick Start

```bash
# 1. Install dependencies
bun install

# 2. Set up the database
bunx prisma generate
bunx prisma migrate dev
bun run db:seed

# 3. Start the dev server
bun run dev
```

## Access

- **Live site**: http://localhost:3000
- **Admin dashboard**: http://localhost:3000/admin
- **Admin login**: `admin` / `admin123`

## Key Commands

```bash
bun run dev        # Start dev server
bun run build      # Production build
bun run lint       # ESLint check
bun run db:push    # Push schema changes
bun run db:seed    # Re-seed database with defaults
bun run db:reset   # Reset database (destructive)
```

## Database

- SQLite (local dev) — stored in `db/custom.db`
- To switch to PostgreSQL: change `provider` in `prisma/schema.prisma` and update `DATABASE_URL` in `.env`

## Architecture

- **Next.js 16** (App Router) + TypeScript
- **Prisma ORM** + SQLite
- **Tailwind CSS 4** + shadcn/ui
- **Framer Motion** for animations
- **Three.js** (@react-three/fiber) for particle background
- **Lenis** for smooth scrolling
- **Session-based auth** (bcrypt + HTTP-only cookies)
- **SSR** for all public pages
- **On-demand revalidation** after admin edits

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # SSR home page
│   ├── layout.tsx            # Root layout (fetches theme)
│   ├── not-found.tsx         # Custom 404
│   ├── admin/
│   │   ├── login/            # Auth page
│   │   └── (dashboard)/      # 11 editor pages (auth-gated)
│   ├── projects/[slug]/      # SSR project detail page
│   └── api/                  # 12 route handlers + auth + migrate
├── components/
│   ├── portfolio/            # 10 sections + primitives
│   └── admin/                # Sidebar + UI
└── lib/
    ├── db.ts                 # Prisma client
    └── portfolio/
        ├── db.ts             # Data access layer
        ├── auth.ts           # Session management
        ├── content-store.ts  # Legacy (kept for reference)
        └── default-content.ts # Types + defaults
```

## Features

- 10 cinematic sections (Hero, Showreel, Services, Projects, Before/After, Workflow, Skills, About, Testimonials, Contact)
- Full CRUD admin dashboard with instant DB persistence
- Dynamic project detail pages with SEO metadata
- Dark + Light mode (stored in DB, applied server-side)
- 6 accent color presets per theme
- Custom 404 page
- Auth-protected admin (session cookies)
- JSON export/import for content backups
- Migrate from localStorage button (for old data)
