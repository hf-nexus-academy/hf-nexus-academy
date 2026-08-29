# HF Nexus Academy — Deployment Guide


---

## 1. Prerequisites

- Node.js 18.18 or later
- A PostgreSQL database (recommended: [Neon](https://neon.tech), [Supabase](https://supabase.com), or [Vercel Postgres](https://vercel.com/storage/postgres) — all have generous free tiers and work well with serverless deployments)
- A [Vercel](https://vercel.com) account (for deployment)

---

## 2. Local Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy the environment template and fill in real values
cp .env.example .env.local

# 3. Push the Prisma schema to your database
npx prisma db push

# 4. Seed the database with teachers, courses, and sample blog posts
npm run db:seed

# 5. Start the dev server
npm run dev
```

Visit `http://localhost:3000`. The seed script creates:
- An admin account: `admin@hf-nexus.com` / `ChangeMe123!`
- Three teacher accounts (Mufti Muhammad Faizan, Mufti Ahsan Ilyas, Mufti Faizan Tahir), each with password `ChangeMe123!`
- 20 courses across Quran, Hadith, Fiqh, Arabic, and Logic
- 3 sample blog posts

**Change all seeded passwords before going to production.** They exist only to give you a working app to click through immediately.

---

## 3. Database Setup in Detail

### Option A: Neon (recommended for simplicity)
1. Create a project at neon.tech.
2. Copy the **pooled connection string** into `DATABASE_URL`, and the **direct connection string** into `DIRECT_URL`. Neon provides both — the pooled one is required for serverless functions, the direct one is required for Prisma Migrate.

### Option B: Supabase
1. Create a project, go to Project Settings → Database.
2. Use the "Connection pooling" string (port 6543) for `DATABASE_URL`, and the direct string (port 5432) for `DIRECT_URL`.

### Running migrations in production
For your first deploy, `prisma db push` (used above) is fine for getting started. For ongoing schema changes in a team environment, switch to proper migrations:

```bash
npx prisma migrate dev --name init    # creates a migration locally
npx prisma migrate deploy             # applied automatically by the build script on Vercel
```

The `package.json` build script already runs `prisma generate` before `next build`, and `db:migrate:deploy` is available for CI/CD pipelines.

---


3. Register a webhook endpoint at Developers → Webhooks:

---


3. Register a webhook at the app's settings page:
   - Events: `PAYMENT.CAPTURE.COMPLETED`, `PAYMENT.CAPTURE.REFUNDED`, `PAYMENT.CAPTURE.DENIED`


---

## 6. Email Setup (Resend)

1. Create an account at [resend.com](https://resend.com) and verify a sending domain (e.g. `hf-nexus.com`).
2. Copy your API key into `RESEND_API_KEY`.
3. Set `EMAIL_FROM` to an address on your verified domain, e.g. `HF Nexus Academy <noreply@hf-nexus.com>`.

Without this configured, the app still works — verification/reset emails are logged to the console instead of sent, which is useful for local development.

---

## 7. Other Environment Variables

| Variable | Purpose |
|---|---|
| `AUTH_SECRET` | NextAuth session encryption. Generate with `openssl rand -base64 32`. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Number used by the floating WhatsApp button and contact page (include country code, no symbols). |
| `NEXT_PUBLIC_CALENDLY_URL` | Link shown on the Free Trial page's scheduling section. |
| `CONTACT_RECEIVER_EMAIL` | Where contact form and free trial lead notifications are sent. |
| `UPSTASH_REDIS_REST_URL` / `_TOKEN` | Optional. Enables rate limiting if you wire up `@upstash/ratelimit` on auth/contact routes. |
| `BLOB_READ_WRITE_TOKEN` | Optional. For teacher lesson video/resource uploads via Vercel Blob, if you extend beyond URL-based resources. |

---

## 8. Deploying to Vercel

1. Push this repository to GitHub/GitLab/Bitbucket.
2. In Vercel, click **New Project** and import the repository.
3. Vercel will auto-detect Next.js. Leave build settings as default (`npm run build`).
6. Deploy.
8. Run the seed script against your production database once, from your local machine, by temporarily pointing your local `.env.local`'s `DATABASE_URL`/`DIRECT_URL` at the production database and running `npm run db:seed`. Immediately change the seeded passwords afterward.

### Custom domain
Add `hf-nexus.com` under Project → Settings → Domains, and follow Vercel's DNS instructions (typically an A record or CNAME, depending on whether it's an apex domain or subdomain).

---

## 9. Post-Launch Checklist

- [ ] Change all seeded account passwords
- [ ] Replace placeholder Google Maps embed on the Contact page with a real embed if you have a physical address
- [ ] Have legal counsel review Privacy Policy, Terms & Conditions, and Refund Policy before relying on them
- [ ] Submit `sitemap.xml` to Google Search Console
- [ ] Run a Lighthouse audit against the deployed (not local) site — local dev mode is not representative of production performance
- [ ] Confirm `/student`, `/teacher`, `/admin` do not appear in Google Search Console's indexed pages report after a few weeks (robots.txt + noindex should prevent this)
- [ ] Set up real teacher photos (`photoUrl` field) and course cover images (`coverImageUrl`) — these are currently unset and fall back to initials/placeholder treatments
- [ ] Configure Upstash Redis and add rate limiting to `/api/auth/*` and `/api/contact` routes to prevent abuse (the dependency is installed but not yet wired up)

---

## 10. Architecture Notes for Future Developers

- **Auth**: NextAuth v5 (beta) with Credentials provider + Prisma adapter. Role (`ADMIN`/`TEACHER`/`STUDENT`) is stored on the JWT and re-validated against the database is *not* done per-request for performance — if you need to revoke access instantly on role change, consider shortening session `maxAge` or adding a database check in `middleware.ts`.
- **Authorization**: enforced at three layers — `middleware.ts` (route-prefix redirect), layout-level `auth()` checks (defense in depth), and ownership checks inside individual API routes (e.g. a teacher can only grade submissions for assignments they created).
- **Data fetching**: all portal pages are Server Components fetching directly via Prisma — no client-side data-fetching library is used. Mutations go through API routes called from small client components, followed by `router.refresh()` to re-fetch server data.
- **Rendering**: every `page.tsx` is a Server Component by default; `"use client"` is only used on interactive leaves (forms, dialogs, toggles) and the animated Hero section, to keep JS payload minimal.
