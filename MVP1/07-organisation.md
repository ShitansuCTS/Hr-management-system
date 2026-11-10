# 7. Organisation

## Overview

`Organization` is the tenant boundary for user, department, designation, calendar, leave, activity, and document data. In the reviewed code, “organisation management” consists mainly of organization-scoped Department and Designation management. No organization create/update/settings API or UI was found in the API/page inventory.

## Frontend

| File | Responsibility |
|---|---|
| `src/app/(general)/organization/departments/page.js` | Department-management page wrapper. |
| `src/components/departments/DepartmentSection.jsx` | Department list/create/delete UI. |
| `src/app/(general)/organization/designations/page.js` | Designation-management page wrapper. |
| `src/components/designations/DesignationSection.jsx` | Department/designation selection and designation create/delete UI. |
| `src/store/useOrganizationStore.js` | Caches department/designation data and owns create/delete calls/loading/toasts. |
| `src/components/customersCreate/TabProfile.jsx` | Consumes department/designation options during employee creation. |
| `src/components/customers/EmployeesTable.jsx` | Reads departments for employee directory filtering. |
| `src/lib/auth/permissions.js` | Page permissions. Both settings pages are Admin routes. |

## Backend APIs

| Method/path | Purpose | Roles |
|---|---|---|
| `GET /api/v1/departments` | List active departments for authenticated organization. | Admin, Employee |
| `POST /api/v1/departments` | Create department from `{ name }`. | Admin |
| `DELETE /api/v1/departments/{id}` | Delete organization-scoped department. | Admin |
| `GET /api/v1/designations` | List organization designations including department. | Admin, Employee |
| `POST /api/v1/designations` | Create `{ name, departmentId }`; department must be active and in same org. | Admin |
| `DELETE /api/v1/designations/{id}` | Delete organization-scoped designation. | Admin |

The route → controller → validation/service chain is:

- Departments: `src/app/api/v1/departments/`, `src/controllers/department/department.controller.js`, `src/services/department/department.service.js`, `src/validations/department.validation.js`.
- Designations: `src/app/api/v1/designations/`, `src/controllers/designation/designation.controller.js`, `src/services/designation/designation.service.js`, `src/validations/designation.validation.js`.

## Workflow

1. Store loads `/api/v1/departments` or `/api/v1/designations`; it skips repeat fetches after successful load unless forced.
2. Admin submits a name (and department ID for designation).
3. Route authenticates/authorizes and passes current user to controller.
4. Controller validates the payload and calls the service.
5. Service sets `organizationId` from authenticated context. Designation creation first confirms the parent department belongs to the same organization and is active.
6. Successful create updates the Zustand list. Delete checks related record constraints and updates local state.

## Database models and relationships

- `Organization` 1→many `Department`, `Designation`, and users/holidays/leave/activity/calendar/document rows.
- `Department` has `organizationId`, `name`, `isActive`, users and designations. Unique `(organizationId,name)`.
- `Designation` has required `organizationId` and `departmentId`, `name`, `isActive`, and users. Unique `(organizationId,departmentId,name)`.
- `User.departmentId` and `User.designationId` are optional references.

## Validation, access, and constraints

- Department name is trimmed, starts with a letter, and has a 25-character maximum.
- Designation name uses similar checks; `departmentId` is required.
- Department and designation reads are available to both roles; writes are Admin-only.
- Services use current organization ID rather than accepting organization ID from the write body.
- Database uniqueness enforces organization-scoped names. Foreign-key violations are translated into useful errors; deletion is blocked when dependent records exist.

## Boundaries and gaps

- There is no Organization CRUD/settings module in the reviewed pages, controllers, services, or API routes; `Organization` records are assumed provisioned elsewhere.
- Department deletion is a hard delete. The model has `isActive`, but this delete route does not use soft-deactivation.
- Designation reads include records without filtering `isActive`, while department reads filter to active records.
- Store state is browser-global and department/designation caches are not keyed by account or organization; login/logout does not currently clear `useOrganizationStore`.
- Organization is also a cross-cutting dependency of User Management, Leave, Calendar, Profile/Activity, and storage bucket selection.
