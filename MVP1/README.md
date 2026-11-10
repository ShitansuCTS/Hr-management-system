# MVP 1 Technical Documentation

This folder documents the implementation currently present in this repository for the eight MVP 1 areas listed below. It is an engineering map, not a feature specification: where the source differs from the intended launch scope, the relevant document calls that out explicitly.

## Modules

1. [Authentication](./01-authentication.md)
2. [User management](./02-user-management.md)
3. [Profile](./03-profile.md)
4. [Company calendar](./04-company-calendar.md)
5. [Leave management](./05-leave-management.md)
6. [Activity management](./06-activity-management.md)
7. [Organisation](./07-organisation.md)
8. [Resume bank](./08-resume-bank.md)

## Application conventions

- Framework: Next.js App Router under `src/app`; API handlers are `route.js` files under `src/app/api`.
- UI: React client components under `src/components`; app-level state is commonly held in Zustand stores under `src/store`.
- Persistence: PostgreSQL accessed through Prisma; schema and enums live in `prisma/schema.prisma`.
- Backend layering is present for many features: route → controller → validation/service → Prisma. Some older endpoints access Prisma directly, so this is not universal.
- Authentication uses a JWT in the `auth_token` cookie. `src/auth/requireAuth.js` is the primary API helper; `src/middleware.js` uses role-based route permissions for pages.
- Organization isolation is usually based on `organizationId` obtained from the authenticated user. Older endpoints are inconsistent; module documents flag the meaningful exceptions.

## Source of truth and known discrepancies

The module documents distinguish implemented behavior from the desired scope in [MVP_SCOPE.md](./MVP_SCOPE.md). The existing [CURRENT_GAPS.md](./CURRENT_GAPS.md) records previously identified release risks. Both documents are retained as project context; neither is a substitute for the live code.

Examples of implementation differences documented below:

- Public signup exists even though the intended flow is Admin-created employee accounts.
- Employee-list API handlers currently accept `EMPLOYEE` as well as `ADMIN`, although the employee list pages are role-gated.
- Leave balance is reduced on submission, but rejection does not restore it.
- Calendar CRUD has both newer layered holiday handlers and older direct-Prisma handlers.
- Resume Bank reads a third-party careers API and has fallback sample rows; it has no Prisma resume model or first-party API route.
- Activity is a simple append-only event table and listing endpoint, not a general audit framework.

## How to read paths

Paths in the module documents are repository-relative. Dynamic route segments such as `[employeeId]` and `[leaveId]` are Next.js filesystem route parameters. All behavior descriptions were checked against this repository's current source and Prisma schema; they should be rechecked when those sources change.
