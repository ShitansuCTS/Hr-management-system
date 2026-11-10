# 2. User Management

## Overview

User Management is primarily employee administration: Admin-created employee records, employee directory views, bulk Excel import, profile-image/document storage, and assignment to organization departments/designations. Employee identity is the `User` record; `Role` distinguishes `ADMIN` and `EMPLOYEE`.

## Frontend structure

| File or route | Responsibility |
|---|---|
| `src/app/(general)/customers/create/page.js` | Employee-create page wrapper. |
| `src/components/customersCreate/CustomerCreateContent.jsx` | Tabbed create form shell. |
| `src/components/customersCreate/TabProfile.jsx` | Employee identity, work, contact, and organization assignment fields. |
| `src/components/customersCreate/TabBilling.jsx`, `TabPassword.jsx` | Additional form sections; the service supplies password from server configuration rather than accepting an employee password in its normal create path. |
| `src/app/(general)/customers/all/page.js` | Admin directory page using the table. |
| `src/components/customers/EmployeesTable.jsx` | Searchable/filterable employee table; obtains users from `useAllUsersStore` and departments for filtering. |
| `src/app/(general)/customers/list/page.js` | Card-style employee directory using `CustomersTable`. |
| `src/components/customers/CustomersTable.jsx` | Employee-card list; uses the all-user store. |
| `src/store/useAllUserStore.js` | Caches employee-directory results and exposes `fetchUsers`/`clearUsers`. |
| `src/app/(general)/employees/[employeeId]/page.js` and `src/app/(general)/customers/employees/[employeeId]/page.js` | Employee profile detail route wrappers. |

`src/store/profile.store.js` also centralizes profile, activity, and document requests used by profile views; see [Profile](./03-profile.md).

## Backend structure

| Layer | Files |
|---|---|
| Employee create/list API | `src/app/api/v1/users/all-users-details/route.js` and legacy `src/app/api/users/all-users-details/route.js` |
| Create/list controller | `src/controllers/user/allUserDetail.controller.js` |
| Create/list service | `src/services/user/allUserDetail.service.js` |
| Employee form validation | `src/validations/user.validation.js` |
| Bulk import API/controller | `src/app/api/v1/users/import-users/route.js`, `src/controllers/user/importUsers.controller.js` |
| Bulk import pipeline | `src/services/user/import-users/` (parse, lookup, row validation, batch construction/persistence, error report, response) |
| Download template | `src/app/api/v1/users/import-users/template/route.js`, `src/controllers/user/downloadEmployeeTemplate.controller.js`, `src/services/user/import-users/downloadEmployeeTemplate.service.js` |
| Profile/document storage | `src/services/user/uploadProfileImage.service.js`, `src/services/user/document/`, and `src/services/storage/` |
| Auth | All protected handlers use `src/auth/requireAuth.js`; role routing is in `src/middleware.js` and `src/lib/auth/permissions.js`. |

## APIs

| Method and path | Purpose and implementation |
|---|---|
| `POST /api/v1/users/all-users-details` | Authenticated Admin employee creation. Reads multipart form data, validates it, calls service, returns created safe user. |
| `GET /api/v1/users/all-users-details` | Lists active, non-deleted organization users, optionally filtered by `departmentId`. |
| `POST /api/users/all-users-details` / `GET /api/users/all-users-details` | Legacy duplicate handlers with similar controller/service paths. |
| `POST /api/v1/users/import-users` | Admin uploads `.xlsx`; controller enforces extension and 10 MiB size limit; service parses/validates/persists rows and can return a signed error-report URL. |
| `GET /api/v1/users/import-users/template` | Admin downloads the Excel template. |
| `GET /api/v1/departments` and `/api/v1/designations` | Supplies employee form assignment options (organization-scoped; see [Organisation](./07-organisation.md)). |
| `GET/POST /api/v1/users/{employeeId}/documents` | List or upload employee documents; role authorization is checked in route and target-user authorization in service. |
| `GET/DELETE /api/v1/users/{employeeId}/documents/{documentId}` | Retrieve a signed file URL or delete a document, subject to service checks. |

The list handlers currently call `requireAuth(request, ["ADMIN", "EMPLOYEE"])`, even though the employee directory pages are intended to be Admin-only in the page permissions/menu. Consequently, API authorization is broader than UI authorization; an employee can call the directory endpoint directly. Treat this as a security discrepancy, not as an intended directory policy.

## Create workflow

1. Admin enters the employee form and submits multipart data to the versioned create route.
2. Controller converts `FormData` to a plain object and calls `validateCreateUser`.
3. Validation trims/sanitizes text and checks values such as numeric employee ID, email, phone, names, employment type, bank identifiers and address fields.
4. Service prefixes the submitted employee ID with `CTSL`, uploads an optional profile image to organization storage, hashes `DEFAULT_USER_PASSWORD`, then executes a Prisma transaction:
   - creates `User` with role `EMPLOYEE` and `organizationId` from authenticated Admin context;
   - appends `USER_CREATED` to `UserActivity`;
   - creates `FinancialDetails` and default `PayrollSettings`;
   - allocates configured leave balances for the current year.
5. A welcome email is attempted after the database transaction.
6. Unique violations map to conflict responses; selected database/reference failures map to client/server errors. If creation fails after image upload, the service tries to delete that object.

The user service currently logs the entire user-create payload, which can include financial and identity fields. Directory image URL generation also logs signed URLs. Avoid copying this logging pattern into new code.

## Bulk import workflow

1. Admin uploads `.xlsx`; file name extension and 10 MiB maximum are checked.
2. `parseExcel` reads headers/rows; organization lookup maps support department/designation resolution.
3. Each row is validated and converted into user, financial, payroll, activity, and leave-balance records. Duplicate rows are tracked in-memory.
4. Persistence is chunked (100 employees per transaction). Known row-level database errors trigger individual retries so failed rows can be reported without discarding valid rows.
5. Welcome email batches are sent for persisted employees. Failed rows are exported to an organization storage bucket with a one-hour signed download URL.

## Database models and relationships

- `User`: core identity, role/status, personal/contact data, employee ID, organization, department and designation references.
- `Organization` 1→many `User`.
- `Department` and `Designation` are optional User references; designation itself belongs to a department and organization.
- `User` 1→1 `FinancialDetails`, `PayrollSettings`.
- `User` 1→many `UserDocument`, `Attendance`, `LeaveApplication`, `LeaveBalance`, `UserActivity`.
- `UserDocument.uploadedById` is a second optional relation to the uploader.

Employee ID is unique within organization; email is globally unique. Department/designation records use organization-scoped uniqueness.

## Authorization and security

- Creation, import, and template download handlers require `ADMIN`.
- Services take the current user's organization from auth context rather than trusting a client-supplied org on employee creation.
- Document services find the target within the current organization and restrict an `EMPLOYEE` to their own record. Admins can access employee records in their organization.
- Middleware gates pages, but it does not protect API routes.
- The current directory GET API allows employees, unlike the page-level Admin route config.
- The legacy `POST /api/auth/signup` is a different, unauthenticated registration path; see [Authentication](./01-authentication.md).
- No general employee edit/deactivate endpoint was found in the route inventory. The `isDeleted`/status fields exist, but this module does not expose a complete Admin CRUD/deactivation API in the reviewed routes.

## Integrations

Prisma/PostgreSQL; bcrypt; Supabase/storage adapters (`uploadFile`, `deleteFile`, signed URL helper); Resend welcome email; ExcelJS-based import/template and error report; department/designation and leave-balance services.
