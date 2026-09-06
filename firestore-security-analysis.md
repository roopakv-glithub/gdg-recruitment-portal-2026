# Firestore security analysis

## Architecture

The Next.js server and Better Auth Firestore adapter use `firebase-admin`.
The browser does not import or query the Firebase Web SDK. Better Auth sessions
are application cookies and do not populate `request.auth` in Firestore rules.

## Collections and access paths

- `formData`: server creates applications, queries by `Email` and optionally
  `Department`, lists applications for administrators, and updates shortlist
  status by document ID.
- `users`: legacy server-side model creates a user and performs a single-field
  equality query with `limit(1)`.
- Better Auth adapter collections include authentication users, sessions,
  accounts, and verification records; all access is server-side.

## Rule decision

All client reads and writes are denied. Server Admin SDK operations bypass
Firestore Security Rules and remain functional. This prevents public listing,
PII exposure, ownership hijacking, schema pollution, oversized client writes,
client-side privilege escalation, invalid state transitions, timestamp
manipulation, and direct replay attacks.

## Attack review

Every tested class of direct browser attack is rejected by the catch-all
`allow read, write: if false` rule: public list/get, unauthenticated and
authenticated read/write, create/update validation bypass, ownership changes,
immutable-field changes, type juggling, oversized values, missing fields,
role escalation, extra fields, invalid transitions, path manipulation,
counter replay, orphaned subcollections, and query-based access.

If a Firebase Web SDK is introduced later, create narrowly scoped collection
rules and emulator tests before permitting any client access.
