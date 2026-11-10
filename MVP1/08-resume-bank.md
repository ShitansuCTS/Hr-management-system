# 8. Resume Bank

## Overview

The Resume Bank page displays candidate applications from an external Careers API. It is not backed by this application's Prisma database and has no first-party `/api/resumes` route, controller, service, or resume model.

## Files

| File | Responsibility |
|---|---|
| `src/app/(general)/resumes/all/page.js` | Page wrapper. |
| `src/components/resumes/ResumeTable.jsx` | Candidate table, status display, date formatting, and resume download links. |
| `src/store/useResumeBankStore.js` | Calls external API, caches results, and falls back to local sample rows. |
| `src/components/shared/table/Table.jsx` and related table components | Shared search/table rendering. |
| `src/lib/auth/permissions.js` | `/resumes/all` is included in Admin permissions; Employee has no matching permission. |

## Data source and request flow

1. `ResumeTable` calls `fetchResumeData()` on mount.
2. Store skips the request when `hasFetched` is true unless forced.
3. Store reads `NEXT_PUBLIC_API_KEY` or `API_KEY`.
4. With a key, it calls:

   `GET https://crushaderstech.com/career-api/api.php?action=get_careers&api_key={API_KEY}`

   It also sends `X-API-Key`, disables browser caching, parses several possible array response shapes, and stores the result.
5. If the key is missing, API fails, or returned records are empty, the store displays hard-coded sample rows.
6. Table renders candidate, position, department, status, date, and direct `resume_url` links.

## API and backend

There is **no application backend route** for Resume Bank. The browser store talks directly to `crushaderstech.com`; there is no local controller/service or persistence layer in this repository. Candidate state changes/remarks are not implemented by this table.

## Database

No Prisma model or relation for resumes/candidates exists in `prisma/schema.prisma`. Resume data is transient client state sourced externally or from static fallback data.

## Validation and security

- Page access is restricted by middleware route permissions to Admin.
- External API requests are made from the client-side Zustand store.
- The code allows `NEXT_PUBLIC_API_KEY`; Next.js public environment variables are exposed to browser code. The key is also placed in the query string, where URLs may be recorded in browser/network logs and upstream logs.
- Candidate resume URLs are direct external URLs opened in a new tab; this app does not proxy or sign those downloads.
- Fallback rows are demonstration data, not verified live records. The UI silently falls back on missing key/error/empty result, although an error is written to the console in the catch path.

## Dependencies and limitations

- External integration: `crushaderstech.com/career-api`.
- Local dependencies: Zustand and shared TanStack-backed table UI.
- No file upload, candidate create/update, status mutation, persistence, audit trail, or server-side API-key protection was found.
- Treat this module as a read-only external dashboard rather than a fully implemented recruiting/resume-management subsystem.
