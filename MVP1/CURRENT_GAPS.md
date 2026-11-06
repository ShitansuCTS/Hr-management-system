# MVP 1: Current Gaps

This list reflects a source and documentation review. Items marked **verify** need a build, runtime check, or end-to-end test before they can be considered confirmed.

## Launch blockers

### Access control and account creation

- **Observed:** `src/app/api/auth/signup/route.js` accepts an `organizationId` from the request and creates an employee without an HR/Admin authorization check.
- **Observed:** the documented account flow says HR/Admin creates employee accounts; the public signup API does not match that flow and appears not to provide all fields required by the current Prisma user model.
- **Required:** disable public signup or restrict account creation to an authorized HR/Admin flow; verify role and organization access independently on every API route.
- **Verify:** middleware protects pages, but API routes must also enforce access. Review both legacy routes and `/api/v1` routes and decide which endpoints are canonical.

### Leave workflow and balances

- **Observed:** `src/services/leave/leave.service.js` deducts leave balance when an application is created.
- **Observed:** `src/services/leave/leaveStatus.service.js` changes the request status but does not restore balance when the request is rejected.
- **Required:** define when leave is reserved/deducted and handle approval, rejection, and cancellation consistently, preferably with atomic database transactions.
- **Verify:** cross-year requests, invalid dates, overlapping requests, concurrent submissions, and sufficient-balance checks need explicit validation and tests.
- **Required:** define whether rejection reasons and decision history are part of the launch workflow.

### Production configuration and deployment

- **Required:** document and securely configure database, JWT, email, storage, and application URL settings. Names referenced in the code include `DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`, `RESEND_API_KEY`, `BASE_URL`, `ADMIN_EMAIL`, Supabase settings, Cloudinary settings, and `DEFAULT_USER_PASSWORD`.
- **Required:** never commit real credentials; use hosting-provider secrets and a safe example environment file if one is needed.
- **Verify:** apply the Prisma migration history to a clean staging database and confirm it matches `prisma/schema.prisma`.
- **Verify:** production build and deployment checks have not yet been confirmed.

## Important workflow gaps to close

- **Verify:** employee creation, updates, deactivation, department/designation assignment, and welcome/reset email work end to end.
- **Verify:** employees can only read their own profile, leave history, and documents; HR/Admin access is limited to the same organization.
- **Verify:** holiday creation and employee calendar visibility are consistent.
- **Verify:** announcements store the correct organization recipients, display to intended employees, and report email delivery failures clearly.
- **Verify:** document and profile-image uploads use correct per-organization access controls and storage configuration.
- **Required:** settle on one API route version and update the UI and documentation to use it consistently.

## Quality and operations

- **Observed:** `package.json` does not define a test script, and no test files were found in the reviewed source tree.
- **Required:** add focused tests for authorization, organization isolation, employee creation, leave balance transitions, and announcement/holiday visibility.
- **Required:** run a manual HR-and-employee pilot against staging before a wider launch.
- **Required:** plan database backups, error monitoring, and a way to respond to failed email or storage integrations.

## Not MVP 1 commitments

Payroll processing and payslips, recruitment, performance management, e-signatures, biometric hardware, asset management, background verification, and advanced reporting are future scope unless explicitly prioritized after the pilot.

## Review note

The project already contains pages and API/service code for several MVP areas, but file presence alone does not confirm that a complete workflow is production-ready. Treat every **verify** item as open until it passes a staging check.
