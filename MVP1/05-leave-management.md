# 5. Leave Management

## Overview

Employees submit leave requests and see their own request history/balances. Admins see organization leave applications and can approve or reject pending requests. A leave request can have a comment thread. Email notifications are sent on submission and decision.

## Frontend structure

| File | Responsibility |
|---|---|
| `src/app/(general)/leaves/create/page.js` | Employee apply page. |
| `src/components/leaves/CreateLeaves.jsx` | Collects leave type/date/reason and submits through the store. |
| `src/app/(general)/leaves/list/page.js` | Employee leave-history page. |
| `src/components/leaves/LeavesTables.jsx` | Employee requests list via `fetchMyLeaves`. |
| `src/components/leaves/LeaveSidebar.jsx` | Employee leave balance summary via store. |
| `src/app/(general)/leaves/all/page.js` | Admin review page. |
| `src/components/leaves/AllLeavesData.jsx` | Admin-wide list; status actions and leave discussion UI. |
| `src/components/leaves/LeavesSidebar.jsx`, `LeavesHeader.jsx`, `SidebarHeader.jsx`, `CommentMessages.jsx` | Supporting leave navigation, summaries, and comment UI. |
| `src/store/useLeaveStore.js` | Caches balances, own/all requests and comments; handles submit, decision, comments, per-item loading state, and toast errors. |
| `src/validations/leave.validation.js`, `leaveStatus.validation.js`, `leaveComment.validation.js` | Zod-backed request/status/comment validation. |

## Backend structure

| Concern | Files |
|---|---|
| Apply/list own requests | `src/app/api/v1/leaves/myleaves/route.js` → `src/controllers/leave/leave.controller.js` → `src/services/leave/leave.service.js` |
| Admin list | `src/app/api/v1/leaves/all-employee-leaves/route.js` → same controller/service |
| Own balances | `src/app/api/v1/leaves/myleaves-balance/route.js` → `src/controllers/leave/myleaveBalance.controller.js` → `src/services/leave/myleaveBalance.service.js` |
| Admin decision | `src/app/api/v1/leaves/[leaveId]/status/route.js` → status controller/service |
| Comments | `src/app/api/v1/leaves/[leaveId]/comments/route.js` → comment controller/service |
| Default balances on employee creation | `src/services/user/leaveBalance.service.js`, `src/config/defaultLeaveBalances.js` |
| Email | `src/lib/email.js`, leave templates under `src/templates/` |

Equivalent non-v1 paths also exist under `src/app/api/leaves/`; the UI/store uses versioned endpoints.

## API reference

| Method/path | Behavior | Access |
|---|---|---|
| `POST /api/v1/leaves/myleaves` | Validate/create own pending leave and reserve balance; sends emails. | `EMPLOYEE` |
| `GET /api/v1/leaves/myleaves` | Current user's requests in their organization. | `EMPLOYEE` |
| `GET /api/v1/leaves/myleaves-balance` | Current-year balance rows for the signed-in employee. | `EMPLOYEE` |
| `GET /api/v1/leaves/all-employee-leaves` | Organization leave applications with employee summary. | `ADMIN` |
| `PATCH /api/v1/leaves/{leaveId}/status` | Change pending request status. | `ADMIN` |
| `GET/POST /api/v1/leaves/{leaveId}/comments` | Read or add comments to own request; Admin can access organization requests. | `ADMIN`, `EMPLOYEE` with service ownership check |

## Application workflow

1. Employee selects `PAID_LEAVE`, `SICK_LEAVE`, or `CASUAL_LEAVE`, a date range and reason.
2. UI does basic required-field/order checks; store POSTs JSON.
3. `validateCreateLeave` requires fields, reason 1–500 chars, valid dates, start date at least tomorrow, and end date not before start.
4. Service sanitizes the reason to plain text, calculates inclusive days from millisecond date difference, and chooses balance year from the start date.
5. It reads the unique balance `(organizationId,userId,leaveType,year)`, checks remaining days, then in one Prisma transaction creates a `PENDING` application and increments `used`/decrements `remaining`.
6. Service looks up employee details and sends email to configured `ADMIN_EMAIL` and employee using submission templates.
7. Store inserts the request locally and refreshes the balance.

## Admin decision workflow

1. Admin list loads applications through the organization-scoped service.
2. Store sends `PATCH` with status.
3. Validator permits `APPROVED`, `REJECTED`, or `PENDING`; service resolves the request within organization and only allows unresolved `PENDING` requests.
4. Service rejects decision on/after start date, updates the status, then sends approval/rejection email to employee.
5. Store updates the row locally and shows toast.

## Comments workflow

The comment service checks leave ID and organization, then allows only the owner or an Admin. Messages are stripped to plain text. GET returns chronological comments and prepends the original leave reason as a synthetic initial note.

## Database

- `LeaveApplication`: belongs to `User` and `Organization`; stores leave type, range, reason and `LeaveStatus` (`PENDING`, `APPROVED`, `REJECTED`); has many comments.
- `LeaveBalance`: belongs to user/organization; tracks leave type/year and `allocated`, `used`, `remaining`; unique key is org + user + type + year.
- `LeaveComment`: belongs to application, user and organization; stores message/time.
- `User` is linked to leave applications/balances/comments; employee provisioning allocates defaults for the current year.

## Important business logic and limitations

- **Balance is deducted at submission, not approval.** It is a reservation-like behavior in practice, but `used` is incremented and `remaining` decremented immediately.
- **Rejection does not restore balance.** The status service updates only the application status. No balance reversal or cancellation route was found. This is a material accounting defect for workflows that reject requests.
- The service does not check overlapping requests or explicitly constrain a request spanning multiple calendar years. It computes the whole request duration, but checks/deducts only the balance year containing `startDate`.
- Leave-day calculation uses `Math.ceil(ms / 24h) + 1`; behavior around time zones/DST should be tested.
- Admin cannot change a finalized status because service permits only pending records.
- Admin decision reason is not stored; only status and comments exist.
- Email sending occurs after DB writes. A failed email can make an API call report failure after the database has already committed.
- `ADMIN_EMAIL` is one configured destination; the service does not discover Admin users dynamically.
- No employee cancellation endpoint was found.
