# 1. Authentication

## Overview

Authentication covers sign-in, sign-out, password recovery, current-session lookup, and protected page/API access. The primary credential is an email and bcrypt-hashed password. A successful login issues a signed JWT in an HTTP-only `auth_token` cookie. The browser does not receive or persist the raw JWT in application state.

## Frontend files

| File | Responsibility |
|---|---|
| `src/app/authentication/login/minimal/page.js` | Main sign-in page; renders `LoginForm`. |
| `src/components/authentication/LoginForm.jsx` | Captures email/password, calls the auth store, and redirects by role to `/dashboard/admin` or `/dashboard/user`. |
| `src/components/authentication/ResetForm.jsx` | Forgot-password UI; sends the email to the recovery API. |
| `src/app/authentication/reset/forgot-password/page.js` | Forgot-password page wrapper. |
| `src/components/authentication/UpdatePassword.jsx` | Reads the reset token from the route and submits the new password and confirmation. |
| `src/app/authentication/reset/reset-password/[token]/page.js` | Reset-token page wrapper. |
| `src/store/authStore.js` | Zustand state for user, initialization, loading, login, profile refresh, and logout clearing. |
| `src/providers/AuthProvider.jsx` | Calls `fetchProfile()` on application startup. |

`src/app/login/page.jsx` is a second, simpler login page that calls the login endpoint directly; it does not use the normal `LoginForm`/`authStore` flow.

## Backend and middleware

| File | Responsibility |
|---|---|
| `src/app/api/auth/login/route.js` | Verifies credentials, records `lastLoginAt` and a `LOGIN` activity in a Prisma transaction, creates the JWT, and sets the cookie. |
| `src/app/api/auth/logout/route.js` | Attempts to append `LOGOUT` activity, then expires `auth_token`. |
| `src/app/api/auth/forgot-password/route.js` | Generates a random reset token, stores its SHA-256 hash and 15-minute expiry, and sends a reset link via Resend. |
| `src/app/api/auth/reset-password/route.js` | Hashes the presented token, checks expiry/account state, bcrypt-hashes the new password, and clears reset fields. |
| `src/app/api/auth/me/route.js` | Returns the authenticated current user's ID and role using `requireAuth`; used by middleware. |
| `src/app/api/auth/my-profile/route.js` | Authenticated lookup for the current user's expanded profile. |
| `src/app/api/auth/signup/route.js` | Separate public signup handler; see the security note below. |
| `src/auth/requireAuth.js` | Validates the cookie JWT, reloads the user from Prisma, rejects inactive/deleted users, and optionally checks allowed roles. |
| `src/lib/jwt.js` | Shared JWT verification helper. |
| `src/middleware.js` | Verifies page-session JWT and role via `/api/auth/me`, applies `ROUTE_PERMISSIONS`, redirects unauthenticated sessions, and rewrites denied routes to `/403`. |
| `src/lib/auth/permissions.js` | Public paths and per-role page route prefixes. |

## API contract

| Method and path | Behavior | Access |
|---|---|---|
| `POST /api/auth/login` | Body: `{ email, password }`. Returns success/user summary and sets the cookie. | Public |
| `POST /api/auth/logout` | Expires cookie; appends activity where token claims are available. | Cookie required for activity; response still expires cookie |
| `POST /api/auth/forgot-password` | Body: `{ email }`; sends a reset link. | Public |
| `POST /api/auth/reset-password` | Body: `{ token, password, confirmpassword }`. | Public, token-authorized |
| `GET /api/auth/me` | Returns `{ user: { id, role } }`. | Authenticated |
| `GET /api/auth/my-profile` | Returns current profile and related financial, department, designation data. | `ADMIN`, `EMPLOYEE` |
| `POST /api/auth/signup` | Creates an employee account from submitted email/password/organization ID. | No `requireAuth` check in this handler |

The signup route is not the employee-provisioning route used by the Admin UI; the Admin employee creation flow is described in [User management](./02-user-management.md).

## End-to-end flows

### Login

1. `LoginForm` calls `useAuthStore.login(email, password)`.
2. The store posts JSON to `/api/auth/login`.
3. The route looks up `User` by unique email, checks `ACTIVE`, and compares the password with bcrypt.
4. In one Prisma transaction it updates `lastLoginAt` and appends `UserActivity(action="LOGIN")`.
5. The route signs a one-day JWT with user ID, role, and organization ID claims and sets `auth_token` as HTTP-only, `sameSite: "strict"`, `secure` in production.
6. The store loads the full profile; the form routes by role and refreshes the Next router.

### Request authentication

For API handlers using `requireAuth`, the helper reads the cookie, verifies the JWT, fetches the current user record, checks active/not-deleted state, then applies the handler's allowed-role list. The database row, not just the token's role claim, supplies the current role and organization context.

Page middleware runs separately. It fetches `/api/auth/me` with the incoming cookie, then checks the role against path prefixes in `ROUTE_PERMISSIONS`. API endpoints still need their own checks because middleware deliberately excludes `/api`.

### Password reset

1. Forgot-password client posts email.
2. The route creates 32 random bytes, stores only a SHA-256 digest and a millisecond expiry, and emails the raw token in a URL built from `BASE_URL`.
3. Reset page posts token and matching passwords.
4. The route hashes the supplied token, finds an active/non-deleted user with a future expiry, bcrypt-hashes the new password, and clears the reset token/expiry.

## Database

`User` stores email, bcrypt password, role/status, last login, reset-token digest/expiry, and `organizationId`. The email is globally unique; `@@unique([organizationId, employeeId])` scopes employee identifiers. Login/logout activity is stored in `UserActivity`, related to both `User` and `Organization`.

## Validation and security behavior

- Login requires email/password and checks `status === "ACTIVE"`. Password comparison uses bcrypt.
- Reset validates required fields, matching passwords, and a minimum length of eight; the token is one-time in practice because successful reset clears it, and its expiry is 15 minutes.
- The JWT cookie is HTTP-only, uses `sameSite: "strict"`, has a one-day max age, and is `secure` only when `NODE_ENV === "production"`.
- API role authorization is provided only when the handler calls `requireAuth` with roles. Page permissions do not enforce API permissions.

## Gaps observed in source

- `POST /api/auth/signup` is unauthenticated, accepts `organizationId` from the client, and supplies only email/password/role/status/organization to a `User` model that has additional required fields. This does not match the Admin-provisioned account policy and should not be treated as a supported secure onboarding flow.
- Forgot-password returns `404` for an unknown email, permitting account enumeration. It logs the submitted email and full reset URL. Reset UI logs the token and password values to the browser console. These are implementation facts, not recommended behavior.
- `logout` does not use `requireAuth`; it verifies token claims directly for its activity row. It clears the cookie even if activity recording fails.
- `src/app/login/page.jsx` bypasses the common store and has no shared role-based form handling.
- `requireAuth` and middleware are separate implementations; test both invalid/expired sessions and role changes at API and page boundaries.

## Integrations

- `bcryptjs` for password hashes.
- `jsonwebtoken`/`src/lib/jwt.js` and `jose` in middleware for JWT signing/verification.
- Resend for password-reset email.
- Prisma/PostgreSQL for users and activity.
