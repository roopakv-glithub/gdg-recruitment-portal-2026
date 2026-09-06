# Security

Report a suspected vulnerability privately to the project maintainers. Do not include applicant personal data, access tokens, service-account keys, or OAuth secrets in a public issue.

## Controls

- Production authentication is Google-only and restricted to the `vitstudent.ac.in` Workspace domain.
- Admin routes require a server-verified session plus the configured admin role or email allowlist.
- Firestore client access is denied; server routes use the Firebase Admin SDK.
- Submission transactions enforce idempotency and the maximum of two department applications.
- API responses use no-store caching, and the site sends anti-clickjacking, MIME-sniffing, referrer, permissions, and HSTS headers.
- Secrets and service-account files are excluded from Git.

Rotate the Firebase service-account key, Google OAuth secret, and Better Auth secret immediately if any value is exposed.
