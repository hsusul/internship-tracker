# Internship Tracker

A full-stack **Internship Application Tracker** built with **Next.js (App Router)**, **TypeScript**, **Prisma**, **Postgres**, **TailwindCSS**, and **NextAuth (Google OAuth)**. Track applications, filter/search, and view a dashboard summary of milestones like **Applied → Interview → Offer**.

## Features

* **Google sign-in** via NextAuth (OAuth)
* **Dashboard stats** (Total, Applied, Interviews, Offers)
* **Search + filter** by company/role and milestone
* **CRUD applications** (create/view/manage entries)
* **Prisma + Postgres** persistence (works great with Neon)
* **Deployed on Vercel** with custom domain + HTTPS

---

## Tech Stack

* **Frontend:** Next.js 16 (App Router), React, TypeScript, TailwindCSS
* **Backend:** Next.js server components + route handlers, NextAuth
* **Database:** Postgres
* **ORM:** Prisma
* **Deployment:** Vercel

---

## Project Structure (high level)

```
src/
  app/                # Next.js App Router routes
    api/auth/[...nextauth]/route.ts
    (app)/dashboard/  # authenticated app pages
  components/         # UI components (tables/cards/forms)
  lib/                # prisma client, helpers
prisma/               # schema + migrations (if included)
```

---

## Environment Variables

Create a `.env` locally (do not commit secrets). Example:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB?sslmode=require"

NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-random-secret"

GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### Generate NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

---

## Local Development

Install deps:

```bash
npm install
```

Run Prisma (first-time / after schema changes):

```bash
npx prisma generate
npx prisma db push
# or if you're using migrations:
# npx prisma migrate dev
```

Start dev server:

```bash
npm run dev
```

Open: `http://localhost:3000`

---

## Build

```bash
npm run build
npm start
```

---

## Deploy (Vercel)

1. Import the GitHub repo in Vercel
2. Set environment variables in Vercel:

   * `DATABASE_URL`
   * `NEXTAUTH_URL` (your production domain, e.g. `https://www.internship-tracker.com`)
   * `NEXTAUTH_SECRET`
   * `GOOGLE_CLIENT_ID`
   * `GOOGLE_CLIENT_SECRET`
3. Add your custom domain (optional)
4. Ensure Google OAuth **Authorized redirect URIs** include:

   * `https://YOUR_DOMAIN/api/auth/callback/google`

---

## Screens / Demo

* Landing page + CTA to login
* Authenticated dashboard with stats + filters
* Applications table view

---

## License

MIT
