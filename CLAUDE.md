# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start development server
pnpm build        # prisma generate + next build
pnpm start        # Start production server
pnpm lint         # ESLint via next lint
```

Database migrations:
```bash
pnpm prisma migrate dev   # Create and apply a new migration
pnpm prisma generate      # Regenerate Prisma client (must run before build)
pnpm prisma studio        # Open Prisma Studio GUI
```

## Architecture

This is a **Next.js 14 App Router** virtual try-on app (Chinese UI). Users upload a person photo and a clothing photo; an AI model composites them and returns a result image.

### Request flow

1. `app/page.tsx` — client component collects two base64-encoded images, `category` (`top`/`bottom`/`dress`), optional `fit` (`slim`/`oversized`), and a Cloudflare Turnstile token.
2. `POST /api/tryon` — verifies Turnstile, then calls `src/services/tryon.ts` which hits the **Volcengine Doubao Seedream** model (`VOLC_API_KEY`, `VOLC_API_URL`, `VOLC_MODEL`). The AI returns a temporary image URL.
3. The API **immediately returns** the temp URL to the frontend (non-blocking). In the background (`processInBackground`), the temp image is downloaded and uploaded to **Cloudflare R2** via `src/services/uploadToCloud.ts`, then a `TryOnHistory` row is written to the DB — but only for signed-in users.

### Auth & user sync

- **Clerk** handles auth (`@clerk/nextjs`). `ClerkProvider` wraps the whole app in `app/layout.tsx`.
- The local DB `User` table stores `clerkUserId` as a foreign key. The tryon route lazily creates a `User` row on first generation if the user is signed in.
- `POST /api/webhooks/clerk` listens for the `user.created` event and sends a welcome email via **Resend** (`src/lib/email.ts`).

### Data layer

- **Prisma** with **Neon PostgreSQL**. Two models: `User` (keyed on `clerkUserId`) and `TryOnHistory` (stores clothing/person/result image URLs).
- `src/lib/prisma.ts` exports a singleton `PrismaClient`. API routes **dynamically import** it (`await import('@/src/lib/prisma')`) to avoid startup errors in serverless environments.
- `GET /api/history` returns the last 20 `TryOnHistory` rows for the signed-in user.

### Storage

`src/services/uploadToCloud.ts` wraps the AWS S3 SDK to upload to Cloudflare R2. Requires `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL`, and either `R2_ENDPOINT` or `R2_ACCOUNT_ID`.

### Required environment variables

| Variable | Purpose |
|---|---|
| `VOLC_API_KEY` / `VOLC_API_URL` / `VOLC_MODEL` | Volcengine AI image generation |
| `API_TIMEOUT` | Volcengine request timeout in ms (default 25000) |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY` | Clerk auth |
| `DATABASE_URL` | Neon PostgreSQL (pooled) |
| `R2_*` | Cloudflare R2 storage |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile bot protection |
| `RESEND_API_KEY` | Transactional email via Resend |

### Path aliases

`@/` maps to the project root (`tsconfig.json`). Components live in `components/`, services in `src/services/`, utilities in `src/lib/`, and shared types in `types/index.ts`.
