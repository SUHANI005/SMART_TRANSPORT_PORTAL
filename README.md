# Smart Transport Services Portal

A friendly, AI-assisted transport-services portal (driving licences, vehicle registration, permits, challan payments) built with **Next.js 14, TypeScript, Tailwind CSS, Prisma, and NextAuth**. Includes four AI features powered by the **OpenAI API**: a Transport Assistant chatbot, an AI Document Checker, voice-based service search, and AI service recommendation.

This is a demo/portfolio project inspired by the *type* of services on government transport portals — original branding, sample data, not affiliated with any government body.

## What's included

- Home, service browsing/search (+ voice search), service detail pages
- 5-step application wizard: Personal Details → Documents → Payment (mock) → Appointment → Complete
- Track-by-reference-number page (no login required)
- Auth (NextAuth credentials) with 3 roles: Citizen, Officer, Admin
- Citizen dashboard (my applications), Officer dashboard (review/approve/reject queue), Admin dashboard (basic analytics)
- **AI Transport Assistant** — floating chat widget, answers from your service catalog via OpenAI (`app/api/assistant/chat`)
- **AI Document Checker** — runs automatically on each document upload (`app/api/ai/document-check`)
- **Voice-Based Service Search** — browser Web Speech API, no backend/key needed
- **AI Service Recommendation** — homepage quiz, OpenAI-matched with a keyword fallback (`app/api/ai/recommend`)
- English/Hindi toggle for core UI strings

## Not included (left as extension points, noted in the admin dashboard)

The full brief lists a lot of surface area (every driving-licence/vehicle/permit sub-service, full admin CRUD for services/fees/users/notices, dealer logins, file storage on S3/Cloudinary, etc.). This build gives you a complete, working *core* — 7 real services in the catalog, the full citizen/officer loop, and all 4 AI features — on top of a data model (`prisma/schema.prisma`) designed so you can add more services and admin CRUD screens without restructuring anything.

---

## 1. Setup

```bash
npm install
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL="file:./dev.db"          # SQLite, zero-config for local dev
NEXTAUTH_SECRET="<run: openssl rand -base64 32>"
NEXTAUTH_URL="http://localhost:3000"
OPENAI_API_KEY="sk-...your key..."     # required for the 3 OpenAI-backed features
```

> **No OpenAI key?** The app still runs. The Assistant will explain it isn't configured yet, and the Document Checker / Recommendation quiz automatically fall back to simpler built-in logic (heuristic checks / keyword matching) instead of failing.

Push the schema and seed demo data:

```bash
npm run db:push
npm run db:seed
```

Run it:

```bash
npm run dev
```

Open http://localhost:3000. Demo logins (password for all: `password123`):

| Role    | Email             |
|---------|-------------------|
| Citizen | citizen@demo.in   |
| Officer | officer@demo.in   |
| Admin   | admin@demo.in     |

## 2. How the AI features are wired

All OpenAI calls happen **server-side only**, in API routes — the key is read from `process.env.OPENAI_API_KEY` and never sent to the browser. See `lib/openai.ts`.

- `app/api/assistant/chat/route.ts` — chat completions (`gpt-4o-mini`), grounded in your live `Service` table so it can't invent fees/documents
- `app/api/ai/document-check/route.ts` — vision-capable chat completion on uploaded images; PDFs get a basic pass-through in this demo
- `app/api/ai/recommend/route.ts` — asks the model to pick the closest-matching service slug from your catalog, strict-JSON response

If you want a different model, change the `model:` string in those three files (any OpenAI chat model with vision support works for the document checker).

## 3. Deploying

The easiest path is **Vercel + a hosted Postgres** (SQLite doesn't persist on serverless):

1. Push this repo to GitHub.
2. In `prisma/schema.prisma`, change:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
3. Create a free Postgres database (e.g. [Neon](https://neon.tech) or [Supabase](https://supabase.com)) and copy its connection string.
4. Import the repo into [Vercel](https://vercel.com/new), and set these Environment Variables in the Vercel project settings:
   - `DATABASE_URL` — your Postgres connection string
   - `NEXTAUTH_SECRET` — a random 32-byte string
   - `NEXTAUTH_URL` — your deployed URL (e.g. `https://your-app.vercel.app`)
   - `OPENAI_API_KEY` — your OpenAI key
5. Deploy. Then run once against the production database (locally, with `DATABASE_URL` temporarily pointed at production, or via a one-off Vercel deploy hook):
   ```bash
   npx prisma db push
   npx tsx prisma/seed.ts
   ```

Document uploads are currently stored as base64 in the database (`Document.dataUrl`) — fine for a demo, but swap for actual object storage (S3, Cloudinary, Supabase Storage) before handling real user files at scale; the upload API route (`app/api/applications/[id]/documents/route.ts`) is the only place that needs to change.

## 4. Project structure

```
app/                      Next.js App Router pages + API routes
  api/                     backend endpoints (auth, applications, AI features)
  apply/[slug]/            application wizard page
  services/[slug]/         service info pages
  dashboard/{citizen,officer,admin}/
components/               React components (AI widget, wizard, dashboards, etc.)
lib/                       prisma client, auth config, OpenAI helper, i18n, utils
prisma/schema.prisma       data model
prisma/seed.ts             demo users, 7 services, notices
```

## 5. Extending it

Good next additions, all straightforward with the existing schema:
- More services: add rows via `prisma/seed.ts` or build an admin "Add Service" form (the `Service` model already has every field the detail page needs)
- Admin CRUD for services/fees/notices/users (the admin dashboard currently reports only)
- Real file storage instead of base64
- Email/SMS notifications on status change
- Full bilingual coverage (currently core nav strings + service `nameHi`/`summaryHi` fields; extend `lib/i18n.ts` and add Hindi content per service)
