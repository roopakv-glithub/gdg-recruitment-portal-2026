# Recruitment Portal Engineering Work

This document records the defects resolved, features added, architecture changes, and operational decisions used to turn the original portal into the production application.

## 1. UI and UX improvements

- Rebuilt the homepage in the supplied GDG visual language with responsive dark/light artwork, navigation, notice, recruitment hero, and footer.
- Added accessible theme, account, loading, empty, locked, validation, error, and success states.
- Rebuilt department discovery with search, responsive cards, colored accents, student-lead badges, two-selection state, and application/response links.
- Added pointer-aware 3D card motion, reduced-motion support, a GDG-colored desktop cursor, and touch-safe behavior.
- Added read-only submitted applications and a structured responsive application form with stable numbering and draft recovery.
- Removed corrupted placeholder copy and restored department-specific questions.
- Added a muted fullscreen intro for larger screens. It renders before the homepage, plays once per session, and is disabled on phones and for reduced-motion users.
- Added an About GDG VITC widget covering 12 departments, 16 student leads, two maximum applications, and recruitment year 2026.
- Added a live deadline widget with an explicit closed state and India-time display.

## 2. Client-side optimization

### Before

- UI state and failure handling were inconsistent.
- The old page tree contained heavy, unused animation/demo components.
- Submissions lacked reliable draft recovery and locked-response review.
- Pointer effects did not account for device capability or motion preferences.

### After

- Database credentials and access stay outside the browser bundle.
- Submitted department names are cached for navigation and refreshed from the server.
- Drafts are stored per signed-in user and department selection.
- Repeated submission clicks are blocked and partial successes preserve remaining answers.
- Pointer effects use passive listeners and animation frames, and respect reduced-motion/device capability.
- The intro video is skipped on phones, avoiding its download and landscape cropping.
- Legacy components and the corrupted development route were removed from the production tree.

## 3. Server-side optimization and best practices

### Before

- Generated document IDs made retries ambiguous.
- The application limit depended on non-atomic checks.
- Shortlist delivery feedback did not reliably represent the email state.
- Deadline configuration could not be changed by an administrator.

### After

- Every private endpoint authenticates on the server; admin mutations additionally verify authorization.
- Submission fields are normalized, length-bounded, format-checked, and department allow-listed.
- Firebase Admin connections are reused across warm serverless invocations.
- Independent reads run in parallel where practical.
- Shortlist email jobs use transactional claiming, attempt limits, leases, provider IDs, and explicit states.
- The deadline is server-enforced and controlled from the admin panel.
- Admin access requests remain pending until an existing administrator approves or rejects them.

## 4. Data and cost improvements

- `siteConfig/recruitment`: one small document controls the deadline.
- `adminAccessRequests/{userId}`: one deterministic request per account avoids duplicate pending rows.
- `applicationUsers/{emailHash}`: compact user state supports atomic limit checks.
- `formData/{emailDepartmentHash}`: deterministic application storage supports idempotent retry.
- `emailQueue/{jobId}`: auditable mail jobs avoid accidental duplicate sends.
- The public deadline endpoint uses short CDN caching; private responses remain dynamic and uncached.
- The architecture runs on Vercel Hobby and Firebase Spark without an always-on API server.

## 5. Hidden response-storage malfunction

### Before

Applications used generated IDs. Concurrent requests could both observe fewer than two existing responses and then both write. Retrying the same department could create another record, causing duplicate submissions, inaccurate counts, and ambiguous admin data.

### Fix

The server normalizes email and department, hashes them into stable IDs, and executes one Firestore transaction. That transaction reads the target application and per-user summary, rejects duplicates, enforces the two-department maximum, and writes both records together.

### Result

- One response per user and department.
- Concurrency-safe two-application enforcement.
- No partial state between application and user summary.
- Safe network retries and less duplicate storage/read cost.

## Authentication and admin access

- Better Auth owns users, sessions, accounts, verification data, and the persistent role.
- `ADMIN_EMAILS` bootstraps the first trusted administrators.
- A prospective admin signs in and creates a one-click pending request.
- The first configured admin email receives a notification when SMTP is available.
- Existing admins approve or reject from the admin panel. Approval changes the matching Better Auth user role to `admin`; the requester signs in again or refreshes the session to activate it.
- Requests never grant privileges automatically.

## Deadline workflow

1. An admin enters a local date/time in the admin panel.
2. The server stores it as an absolute Firestore timestamp.
3. The homepage renders the countdown from that document.
4. The submission route reads the same setting and rejects new responses after it passes.

## Email workflow

- A false-to-true shortlist transition creates one numbered idempotent job.
- Nodemailer claims it transactionally and sends through Gmail SMTP.
- Attempts, lease, SMTP message ID, timestamps, and failures are recorded.
- Deliberately unshortlisting and re-shortlisting creates a new auditable sequence.

## Security and validation

- Firestore browser rules deny direct access because Better Auth sessions are not Firebase Auth tokens.
- Trusted Next.js routes use Firebase Admin SDK.
- Keep service-account JSON, OAuth secrets, Better Auth secrets, and Gmail app passwords out of Git.
- Validate releases with `npm run lint`, `npm run build`, and `npm audit --omit=dev`.

## Repository cleanup

- Removed the corrupted legacy development page.
- Removed superseded page components, the old countdown, unused action/model layers, and obsolete mail template.
- Replaced scattered project notes with the focused README and this work record.
- Build output, local environments, local logs, and the source copy of the intro remain ignored.

## Production verification checklist

1. Google sign-in and sign-out.
2. One/two-department submission, duplicate rejection, and third-application rejection.
3. Submitted-response visibility and immutability.
4. Admin table, filters, CSV, shortlisting, and mail status.
5. Deadline update, countdown, and closed submission behavior.
6. Admin request, approval/rejection, and role activation after session refresh.
