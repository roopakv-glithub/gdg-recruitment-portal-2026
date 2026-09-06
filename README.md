# Recruitment Portal 2026

A full-stack recruitment portal for GDG on Campus. Candidates authenticate with their VIT Google account, choose up to two departments, submit department-specific responses, and review their applications. Authorized leads can review applicants, shortlist candidates, export data, and enqueue selection emails.

## Architecture

- **Web application:** Next.js App Router, React, Tailwind CSS, Radix UI, Framer Motion
- **Authentication:** Better Auth with Google OAuth restricted to `vitstudent.ac.in`
- **Database:** Firebase Firestore through the Firebase Admin SDK
- **Hosting:** Vercel Hobby
- **Email workflow:** shortlisting writes an idempotent job to the Firestore `emailQueue` collection; Activepieces can trigger from that collection and deliver the email

All Firestore access goes through authenticated Next.js server routes. Browser access is denied by `firestore.rules`. Application submission uses a deterministic application ID and a Firestore transaction, which prevents duplicate responses and safely enforces the two-department limit under concurrent requests.

## Local setup

1. Install Node.js 20 or newer.
2. Copy `.env.example` to `.env.local` and add the Firebase and Google OAuth values.
3. Run `npm install`.
4. Run `npm run dev` and open `http://localhost:3000`.

For a UI-only preview, set `NEXT_PUBLIC_DEMO_MODE=true` in `.env.local`. Demo mode is disabled in production by design.

## Production configuration

Set these variables in Vercel for the Production environment:

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_WORKSPACE_DOMAIN=vitstudent.ac.in`
- `ADMIN_EMAILS`
- `APPLICATION_DEADLINE` when recruitment has a fixed closing time
- `NEXT_PUBLIC_DEMO_MODE=false`

Do not configure `ALLOW_PASSWORD_AUTH` or `NEXT_PUBLIC_ALLOW_PASSWORD_AUTH` in production. Production login is Google-only so ownership of the VIT email address is verified by Google.

In the Google OAuth client, add the production site as an authorized JavaScript origin and add `https://YOUR_DOMAIN/api/auth/callback/google` as an authorized redirect URI.

Deploy Firestore rules with `npx firebase-tools deploy --only firestore --project gdg-vitc-recruitment-2026`.

## Checks

```bash
npm run lint
npm run build
npm audit --omit=dev
```

The security audit currently reports moderate advisories in the optional Cloud Storage dependency bundled by Firebase Admin. This portal does not initialize or use Cloud Storage. Track Firebase Admin releases and update when its dependency chain is patched.

## Collections

- `formData`: submitted applications
- `applicationUsers`: per-user department limits and idempotency metadata
- `selectedApplicants`: shortlisted candidate records
- `emailQueue`: idempotent outbound-email jobs for Activepieces
- Better Auth collections: users, sessions, accounts, and verification records
