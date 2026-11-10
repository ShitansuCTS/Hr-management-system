# 3. Profile

## Overview

The profile area has two distinct use cases:

1. `/customers/profile`: the signed-in user views their own full profile.
2. Admin employee detail routes: Admin views an employee identified by employee ID.

Tabs show overview, financial/account information, documents, activity, and placeholder payroll/leaves sections. Profile reads and supporting activity/document requests use Zustand to avoid duplicate calls and to keep loading/error state in one place.

## Frontend files

| File | Responsibility |
|---|---|
| `src/app/(general)/customers/profile/page.js` | Self-profile route wrapper. |
| `src/app/(general)/customers/employees/[employeeId]/page.js` | Employee detail route wrapper. |
| `src/app/(general)/employees/[employeeId]/page.js` | Existing alternate Admin employee route wrapper. |
| `src/components/profile/ProfileContent.jsx` | Shared tab layout; chooses `self` or employee profile key from route params. |
| `src/components/widgetsList/Profile.jsx` | Profile summary card. |
| `src/components/customersView/TabOverviewContent.jsx` | Displays profile/personnel detail fields. |
| `src/components/customersView/TabBillingContent.jsx` | Renders `FinancialDetails` data (the tab label is “Account Info”). |
| `src/components/customersView/TabNotificationsContent.jsx` | Document listing/upload/delete UI. |
| `src/components/customersView/TabActivityContent.jsx` | Login/logout, creation, and attendance activity timeline. |
| `src/components/profile/ProfileInfo.jsx` | Separate `/profile/me` settings/profile-details screen; uses the profile store's self profile. |
| `src/store/profile.store.js` | Central profile, activity, and document reads/mutations, cache timestamps, request deduplication, loading/errors, and account-change invalidation. |
| `src/store/authStore.js` | Auth user state; clears profile and employee-directory caches on login, identity change, and logout. |

## Backend structure

| Concern | Files |
|---|---|
| Self profile | `src/app/api/auth/my-profile/route.js` |
| Admin employee profile | `src/app/api/v1/users/users-profile/[employeeId]/route.js`; legacy `src/app/api/users/users-profile/[employeeId]/route.js` |
| Employee-profile controller/service | `src/controllers/user/usersProfile.controller.js`, `src/services/user/users-profile/usersProfile.service.js` |
| Activity tab API | `src/app/api/v1/users/users-profile/[employeeId]/activity/route.js`, `src/controllers/user/employeeActivity.controller.js`, `src/services/user/users-profile/employeeActivity.service.js` |
| Documents | `src/app/api/v1/users/[employeeId]/documents/route.js`, `src/app/api/v1/users/[employeeId]/documents/[documentId]/route.js`, `src/controllers/user/document/`, `src/services/user/document/` |
| Authorization | `src/auth/requireAuth.js`; page paths in `src/lib/auth/permissions.js` and `src/middleware.js`. |

## APIs used

| Method/path | Purpose | Authorization |
|---|---|---|
| `GET /api/auth/my-profile` | Current-user profile and financial/department/designation relations. No employee ID is accepted; target ID comes from authenticated user. | `ADMIN`, `EMPLOYEE` |
| `GET /api/v1/users/users-profile/{employeeId}` | Admin profile details in the current organization. | `ADMIN` |
| `GET /api/users/users-profile/{employeeId}` | Legacy duplicate profile path; currently also Admin-protected and uses the profile controller. | `ADMIN` |
| `GET /api/v1/users/users-profile/{employeeId}/activity` | Activity rows for the resolved employee ID. Employee access is self-only in the service. | `ADMIN`, `EMPLOYEE` plus target authorization |
| `GET/POST /api/v1/users/{employeeId}/documents` | List or upload documents. | Authenticated role plus target authorization |
| `GET/DELETE /api/v1/users/{employeeId}/documents/{documentId}` | Get signed document URL or delete the document. | Authenticated role plus target authorization |

`profile.store.js` uses a four-minute profile/activity/document cache and shares in-flight requests by key. Profile requests use separate `self` and `employee:{employeeId}` keys. Document upload forces a list refresh; deletion removes the row from local state. Store state is cleared on login/logout and user identity change.

## Profile workflow

### Self profile

1. The profile component has no employee route parameter and requests `fetchProfile(null)`.
2. The store calls `GET /api/auth/my-profile`; the API calls `requireAuth` and queries by `auth.user.id`.
3. The handler includes financial details, department and designation and removes password/reset-token values from the JSON shape.
4. Profile and tabs render only when the store's key is `self`. A different or stale employee key is not displayed while a fetch is pending.

### Admin employee profile

1. Admin selects an employee from the directory; the link goes to `/customers/employees/{employeeId}`.
2. Middleware allows this path for Admin. `ProfileContent` requests the key `employee:{employeeId}`.
3. Store calls the versioned profile route. `requireAuth(["ADMIN"])` is required.
4. Service resolves the employee using employee ID, current organization, non-deleted state, and employee role, then returns a safe profile with a short-lived signed profile-image URL if one can be generated.

### Documents

The documents tab obtains its data from the profile store. Upload sends multipart `documentType`, `documentName`, and file. Backend validates file/document, resolves the target employee in the organization, uploads to organization storage, and persists metadata. Listing creates short-lived signed URLs. Delete removes the DB row and attempts object cleanup.

## Database models

`User` is the profile root. `FinancialDetails` and `PayrollSettings` are one-to-one; `Department`/`Designation` are references; `UserDocument` is one-to-many and records both owner and optional uploader. `UserActivity` is one-to-many. The profile endpoint itself reads `User`, `FinancialDetails`, `Department`, and `Designation`; activity and document tabs use their own APIs.

The current profile detail service selects an employee by `organizationId`, employee ID, `isDeleted: false`, and `role: EMPLOYEE`. The current-user API instead anchors the lookup to the authenticated user ID.

## Validation and security

- API authorization is independent of page middleware: self profile uses `requireAuth`; employee detail is Admin-only; document service checks target ownership/organization; activity service prevents employees from querying another employee's activity.
- Data is organization-scoped by authenticated context. Profile employee ID is a route selector, not authority to bypass role/org checks.
- Signed storage URLs expire after five minutes.
- Password and reset credentials are omitted by the profile service/API response.

## Current limitations

- The overview/profile tabs show a mixture of persisted fields and placeholder/default text; review each field in `Profile.jsx`, `TabOverviewContent.jsx`, and `TabBillingContent.jsx` before treating it as fully data-backed.
- Upload UI accepts only listed image MIME types, while one preview branch mentions PDF; backend file validation is authoritative.
- The document components still own modal and action-specific UI state, but network calls are delegated to the profile store.
- `GET /api/v1/users/users-profile/{employeeId}/activity` has no pagination/limit, so it returns the full activity list.
- “Payroll” and “Leaves” profile tabs are placeholder sections rather than complete employee payroll/leave detail features.
