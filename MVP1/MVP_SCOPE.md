# MVP 1: HRMS Launch Scope

## Goal

Launch a dependable HRMS for one organization, covering the everyday employee and HR workflows without including unfinished or optional features.

## Users

- **HR/Admin:** manages employees, leave requests, holidays, announcements, and organization settings.
- **Employee:** views their profile and leave information, submits leave requests, and sees company announcements and holidays.

## Features to include

### 1. Sign-in and access

- HR/Admin-created employee accounts; no open employee self-registration.
- Secure sign-in and sign-out.
- Forgot/reset password by email.
- Enforce roles and organization boundaries in every protected API, not only in page navigation.

### 2. Employee records

- HR/Admin can create, view, update, and deactivate employee records.
- Employees can view their own profile and update only the fields allowed by HR.
- Assign employees to a department and designation.
- Support employee documents with access restricted to the employee and authorized HR/Admin users.

### 3. Leave management

- HR/Admin can assign leave types and annual balances.
- Employees can submit leave requests and view their balance and request history.
- HR/Admin can review, approve, or reject requests and provide a decision reason.
- Keep balances correct when requests are submitted, approved, rejected, or cancelled.
- Prevent invalid date ranges, duplicate/overlapping requests, and requests exceeding available balance.
- Notify the employee and HR/Admin about relevant request and decision events.

### 4. Holidays and calendar

- HR/Admin can manage organization holidays.
- Employees can view the holiday calendar.
- Display relevant leave events without exposing another employee's private information.

### 5. Announcements

- HR/Admin can send an announcement to all active employees or selected employees in their organization.
- Employees can view announcements addressed to them.
- Show clear success or failure when email delivery is attempted.

### 6. Departments and designations

- HR/Admin can create and manage departments and designations.
- Employee records use valid, organization-scoped department and designation assignments.

## Out of scope for MVP 1

Defer these until the core workflows are stable and users have validated the need:

- Payroll calculations, payslips, and salary processing.
- Recruitment, performance management, and e-signatures.
- Biometric attendance hardware integrations.
- Asset management and background verification.
- Advanced analytics and custom reporting.

Basic punch-in/punch-out attendance can be considered for MVP 1 only after its rules, reporting needs, and access controls are confirmed.

## MVP acceptance checklist

- [ ] An authorized HR/Admin can create an employee and initiate account access.
- [ ] An employee can sign in, reset a forgotten password, and see only their own permitted data.
- [ ] An employee can submit a valid leave request and see its status.
- [ ] HR/Admin can review a request; approval, rejection, and cancellation leave balances consistent.
- [ ] Employees see only their organization's holidays and announcements addressed to them.
- [ ] Unauthorized roles and users from another organization cannot access protected pages or API data.
- [ ] Core workflows pass automated tests and a manual end-to-end staging pilot.
- [ ] A clean staging database can be provisioned from the documented Prisma migrations.
- [ ] Required integrations, backups, and production error monitoring are configured before launch.

## Suggested delivery order

1. Establish a clean staging environment and verify the database migrations.
2. Audit and secure authentication, employee creation, and API authorization.
3. Finish employee records, organization scoping, and document access.
4. Correct leave validation, balance accounting, decisions, and notifications.
5. Verify holidays/calendar and announcement delivery and visibility.
6. Add automated tests, run the staging pilot, and fix issues before production rollout.
