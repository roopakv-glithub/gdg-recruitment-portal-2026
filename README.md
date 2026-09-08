# GDG VITC Recruitment Portal 2026

A production recruitment portal for Google Developer Groups on Campus, VIT Chennai. Candidates sign in with their VIT Google account, choose up to two departments, submit department-specific answers, and review their locked responses. Authorized leads review applicants, export data, shortlist candidates, manage the deadline, and approve admin-access requests.

**Production:** https://gdg-recruitment-portal-2026.vercel.app

## The five engineering pillars

### 1. UI and UX

- Responsive dark/light themes, accessible states, supplied GDG artwork, professional motion, and phone-specific layouts.
- Department selection, submitted-response review, live deadline, About GDG statistics, and admin controls.

### 2. Client performance and best practices

- Next.js App Router rendering, session-scoped intro, draft persistence, cached submission state, passive pointer handling, and reduced-motion support.
- Focused interactive components; sensitive data code remains on the server. The intro video is not loaded on phones.

### 3. Server performance and best practices

- Server authorization on private endpoints, strict input validation, parallel independent reads, and cached Firebase connection reuse.
- Transactional, idempotent email jobs with retry and audit state.

### 4. Cost-aware data architecture

- Firebase Spark and Vercel Hobby compatible, with no always-on server.
- Compact configuration and per-user documents, deterministic IDs, duplicate prevention, and short public-only CDN caching.

### 5. Response-storage malfunction fixed

The original path could create duplicate department responses under retries or concurrency. The current path hashes normalized email and department into a deterministic application ID and commits the response plus user summary in one Firestore transaction. Duplicate responses are rejected and the two-department limit is atomic.

## Architecture

- Next.js 16, React 19, Tailwind CSS, Radix UI, and Framer Motion
- Better Auth with VIT Google OAuth and persistent admin roles
- Firestore Standard (`asia-south1`) through Firebase Admin SDK
- Nodemailer through Gmail SMTP
- Vercel serverless hosting

Browser Firestore access is denied by `firestore.rules`; data operations use authenticated server routes.

## Setup

1. Install Node.js 20–24.
2. Copy `.env.example` to `.env.local` and add Firebase, Google OAuth, Better Auth, SMTP, and admin values.
3. Run `npm install` and `npm run dev`.

The production Google OAuth client must allow:

`https://gdg-recruitment-portal-2026.vercel.app/api/auth/callback/google`

Validate with `npm run lint`, `npm run build`, and `npm audit --omit=dev`.

See [WORK.md](WORK.md) for the detailed implementation record and operational notes.
