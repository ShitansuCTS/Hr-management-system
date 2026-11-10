# 6. Activity Management

## Overview

Activity Management is an employee event timeline backed by `UserActivity`. It currently records a small set of explicit actions and exposes a read API used by the profile Activity tab. It is not a general audit/event framework: only code paths that explicitly insert a row appear in this timeline.

## Frontend

| File | Responsibility |
|---|---|
| `src/components/profile/ProfileContent.jsx` | Mounts the profile tab and passes current profile employee ID. |
| `src/components/customersView/TabActivityContent.jsx` | Renders loading/error/empty states and action-specific icons, labels, descriptions, and timestamps. |
| `src/store/profile.store.js` | `fetchActivities(employeeId)` caches by employee ID, deduplicates in-flight requests, and maintains loading/error state. |

## Backend

| File | Responsibility |
|---|---|
| `src/app/api/v1/users/users-profile/[employeeId]/activity/route.js` | Authenticates Admin/Employee and delegates request. |
| `src/controllers/user/employeeActivity.controller.js` | Shapes success response as `data.activities`. |
| `src/services/user/users-profile/employeeActivity.service.js` | Resolves employee ID inside current organization, checks employee self-access, and queries activity rows. |
| `prisma/schema.prisma` (`UserActivity`) | Database model. |

## API

`GET /api/v1/users/users-profile/{employeeId}/activity`

- Auth: `requireAuth(["ADMIN", "EMPLOYEE"])`.
- Employee ID is resolved by `(employeeId, organizationId, isDeleted=false)`.
- `EMPLOYEE` may request only the row whose database user ID matches the authenticated user.
- Response: `{ success: true, data: { activities: [{ id, action, description, createdAt }] } }`.
- Sort order: `createdAt DESC`, then `id DESC`.
- No pagination, date range filter, event-type filter, or export is implemented.

## Events currently written

| Action | Producer | Notes |
|---|---|---|
| `LOGIN` | `src/app/api/auth/login/route.js` | In a transaction with `User.lastLoginAt`. |
| `LOGOUT` | `src/app/api/auth/logout/route.js` | Appended from verified token claims; cookie clearing still occurs if activity creation fails. |
| `USER_CREATED` | `src/services/user/allUserDetail.service.js` | Written in employee creation transaction. |
| `USER_CREATED` | `src/services/user/import-users/processChunks.service.js` through batch objects | Bulk-created employee row. |
| `PUNCH_IN`, `PUNCH_OUT` | `src/services/attendance/attendance.service.js` | Written with attendance transaction. |

Leave applications/comments and calendar operations use their own models; they are not automatically written to `UserActivity`.

## Database and relationships

`UserActivity` contains `id`, `userId`, `organizationId`, free-form `action`, optional description, and `createdAt`. It is many-to-one with `User` and `Organization`, both cascading on delete. Index `(organizationId,userId,createdAt)` supports scoped timeline queries.

## Security and operations

- Reads are scoped to the current organization and target employee.
- Employee self-only access is enforced in the service, in addition to the route role allow-list.
- Admin can read any employee timeline in their organization.
- Activity records have no update/delete API and no typed Prisma enum for `action`; action names are strings, so producers and UI labels must stay coordinated.
- Logout activity can fail independently of cookie deletion. The API returns an error response in that case, even though the browser session cookie has been expired.
- Do not log event payloads containing credentials or signed URLs; activity rows should contain only needed audit context.
