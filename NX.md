# Nx Monorepo Guide

## Projects

| Project                      | Path                       | Type                    |
| ---------------------------- | -------------------------- | ----------------------- |
| `@realvidas/types`           | `packages/types`           | Shared TypeScript types |
| `@realvidas/email-templates` | `packages/email-templates` | React Email templates   |
| `@realvidas/backend`         | `apps/backend`             | NestJS API              |
| `@realvidas/frontend`        | `apps/frontend`            | Vite + React SPA        |

## Dependency Graph

```
@realvidas/types ──────┬──→ @realvidas/backend
                       └──→ @realvidas/frontend

@realvidas/email-templates ─┬──→ @realvidas/backend
                            └──→ @realvidas/frontend
```

Nx automatically builds dependencies first via `"dependsOn": ["^build"]`.

Run `npm run graph` to visualize the full dependency graph in your browser.

---

## Development

```bash
# Start both backend + frontend (builds types/email-templates first)
npm run dev

# Start only backend
npm run dev:backend

# Start only frontend
npm run dev:frontend
```

---

## Production Build

### Full build (all projects in correct order with caching)

```bash
npm run build
```

This runs `nx run-many -t build` which:

1. Builds `@realvidas/types` (`tsc`)
2. Builds `@realvidas/email-templates` (`tsc`)
3. Builds `@realvidas/backend` (`nest build -b swc`) — only after types + email-templates complete
4. Builds `@realvidas/frontend` (`tsc -b && vite build`) — only after types + email-templates complete

Steps 3 and 4 run in parallel since they don't depend on each other.

**Second run hits cache** — if no files changed, Nx skips the build entirely.

### Individual builds

```bash
npm run build:backend    # builds types + email-templates first, then backend
npm run build:frontend   # builds types + email-templates first, then frontend
npm run build:types      # builds only types
```

---

## Database Migrations (TypeORM)

All migration commands run from root and delegate to the backend workspace:

```bash
# Run main database migrations (public schema)
npm run db:run:main

# Run tenant database migrations (all tenant_<uuid> schemas)
npm run db:run:tenant

# Generate a new main database migration
npm run db:generate:main

# Generate new tenant database migrations
npm run db:generate:tenant:all
```

These use `ts-node` and require the `.env` file at root with database credentials.

---

## Start Production Server

```bash
# After build, start the NestJS server from compiled dist/
npm run start:prod
```

This runs `node dist/main` inside `apps/backend/`.

---

## Production Deployment (step by step)

### 1. Install dependencies

```bash
npm install
```

This installs all workspace dependencies with hoisting. The `@realvidas/types` and `@realvidas/email-templates` packages are symlinked from `packages/` into `node_modules/@realvidas/`.

### 2. Build everything

```bash
npm run build
```

### 3. Run database migrations

```bash
npm run db:run:main
npm run db:run:tenant
```

### 4. Start with PM2

```bash
# From repo root
pm2 start apps/backend/dist/main.js --name pixie-backend -i max

# Or with ecosystem file (create ecosystem.config.cjs at root):
pm2 start ecosystem.config.cjs
```

Example `ecosystem.config.cjs`:

```js
module.exports = {
    apps: [
        {
            name: "pixie-backend",
            cwd: "./apps/backend",
            script: "dist/main.js",
            instances: "max",
            exec_mode: "cluster",
            env: {
                NODE_ENV: "production",
            },
        },
    ],
};
```

### 5. Serve frontend

The frontend builds to `apps/frontend/build/`. Serve it with Nginx:

```nginx
location / {
    root /path/to/pixie/apps/frontend/build;
    try_files $uri $uri/ /index.html;
}
```

---

## Production Deployment (Docker)

If using Docker instead of PM2:

```bash
# Build and start all services
docker compose -f docker-compose.prod.yaml up -d

# The backend Dockerfile handles:
# 1. npm install
# 2. Build types
# 3. Build backend
# 4. Run migrations (via entrypoint.sh)
# 5. Start server
```

---

## Seeding

```bash
npm run seed
```

---

## Testing

```bash
# Run all tests
npm run test

# Run only backend tests
npx nx run @realvidas/backend:test
```

---

## Linting

```bash
# Lint all projects
npm run lint

# Lint only backend
npx nx run @realvidas/backend:lint
```

---

## Caching

Nx caches `build`, `lint`, and `test` targets. Cached results are stored in `.nx/cache/` (gitignored).

```bash
# Clear cache if needed
npx nx reset
```

To see if a task will hit cache:

```bash
npx nx run @realvidas/types:build --verbose
# Output will say "Nx read the output from the cache" if cached
```

---

## Tanstack AI Fork

The backend uses a custom fork of `@tanstack/ai`. The tarballs are at `apps/backend/.tanstack-fork-tarballs/` (gitignored).

To rebuild the fork after a clean clone:

```bash
cd apps/backend
bash install-tanstack-fork.sh
```

This clones the fork, builds it, packs tarballs, installs them, and updates `package.json` `file:` references.

---

## Useful Nx Commands

```bash
npx nx graph                          # Visual dependency graph
npx nx show projects                  # List all projects
npx nx show project @realvidas/backend # Show project config
npx nx run-many -t build --skip-nx-cache  # Force rebuild (no cache)
npx nx affected -t build              # Build only affected projects (based on git diff)
npx nx reset                          # Clear Nx cache
```
