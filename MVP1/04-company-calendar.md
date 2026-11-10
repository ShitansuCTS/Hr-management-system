# 4. Company Calendar

## Overview

The calendar area combines two concepts that are persisted separately:

- **Holidays** (`Holiday`): organization-wide dates with a name, type, and description.
- **Calendar events** (`CalendarEvent`): meetings, training, deadlines, tasks, reminders, and other events with creator/update/delete audit references.

The current UI and backend use multiple generations of handlers. Holiday list/create generally use `/api/v1/holidays`; calendar event CRUD and some holiday calendar operations use older `/api/holidays/...` handlers.

## Frontend structure

| File | Responsibility |
|---|---|
| `src/app/(general)/holidays/list/page.js` | Holiday table page. |
| `src/app/(general)/holidays/create/page.js` | Holiday create form page. |
| `src/app/(general)/holidays/calender/page.js` | Calendar view page (route spelling is `calender`). |
| `src/components/holidays/HolidaysList.jsx` | Loads and displays holiday rows; invokes store delete action. |
| `src/components/holidays/CreateHolidayList.jsx` | Holiday form and date/type capture. |
| `src/components/holidays/CalenderView.jsx` | Large calendar UI; merges holiday events from legacy holiday API with regular calendar events and persists regular events in browser local storage. |
| `src/components/calender/CalenderContent.jsx` | FullCalendar event-management UI; category filters, create, detail and delete flows. |
| `src/components/EventCalendarSmall.jsx` | Small visual calendar widget; its event list is local component state rather than a database-backed feed. |
| `src/store/companyCalendarStore.js` | Zustand cache/actions for holiday and regular event data. |

## Backend and APIs

| Method/path | Handler | Behavior and authorization |
|---|---|---|
| `GET /api/v1/holidays` | `src/app/api/v1/holidays/route.js` → holiday controller/service | Requires Admin or Employee; returns current-organization, non-deleted holidays, sorted upcoming then expired. |
| `POST /api/v1/holidays` | Same route → controller → validation/service | Admin-only. Validates and creates holiday using current organization. |
| `PUT/DELETE /api/holidays/{id}` | `src/app/api/holidays/[id]/route.js` direct Prisma | Checks JWT and `decoded.role === ADMIN`, scopes lookup to token organization. Update validates date/duplicate but does not use the Zod create schema. Delete soft-deletes. |
| `GET/POST /api/holidays` | `src/app/api/holidays/route.js` direct Prisma, legacy | Uses JWT presence/verification only; has a hard-coded organization ID for creation and reads all holidays with organization relation. It is not organization-safe and is not the normal layered handler. |
| `GET/POST /api/holidays/event-calender` | Direct Prisma legacy event handler | JWT verification only. GET scopes events to token organization and excludes soft-deleted. POST creates with token `userId` and `organizationId`. No Admin role check. |
| `DELETE /api/holidays/event-calender/{id}` | Direct Prisma legacy event handler | Checks event organization and soft-deletes, but only verifies token; no Admin role check. |

Holiday controller/service/validation are `src/controllers/holiday/holiday.controller.js`, `src/services/holiday/holiday.service.js`, and `src/validations/holiday.validation.js`. The holiday store uses versioned create/list but legacy update/delete paths.

## Holiday create workflow

1. Admin selects name, date, and type in `CreateHolidayList`.
2. UI sends `{ name, date, day, year, type, description }` via `createHoliday`.
3. Versioned route calls `requireAuth(["ADMIN"])`, then controller validation.
4. Zod checks name format/length, ISO date shape, enum type, description length, and that date is tomorrow or later.
5. Service creates a local date, derives day/year server-side, sanitizes description to plain text, uses authenticated organization ID and inserts `Holiday`.
6. Prisma unique constraint on `(date, organizationId)` prevents duplicate day entries; conflict is mapped to 409.

The form offers `OPTIONAL`, but the Prisma `HolidayType` enum and validator support `NATIONAL`, `FESTIVAL`, and `COMPANY` only; the server validation rejects `OPTIONAL`.

## Calendar event workflow

1. `CalenderContent` fetches events through the store from `/api/holidays/event-calender`.
2. Calendar controls filter event categories and open add/details dialogs.
3. Create posts title, description, start/end date, all-day flag, and category. API stores creator and organization from verified token claims.
4. Delete calls `/api/holidays/event-calender/{id}`; API checks organization ownership, sets `isDeleted`, `deletedAt`, `deletedById`.
5. Calendar-event model has `updatedBy` audit fields but no update handler was found in the route inventory.

`CalenderView` is a separate implementation: it fetches `/api/holidays`, maps holiday rows into calendar events, writes regular events to localStorage, and directly invokes legacy APIs for holiday creation/update/deletion. This means calendar views do not share one consistent persistence path.

## Database models

- `Organization` 1→many `Holiday` and `CalendarEvent`.
- `Holiday` contains `name`, `date`, stored `day` and `year`, `HolidayType`, optional description, and soft-delete flag. Unique `(date, organizationId)`.
- `CalendarEvent` contains title/description/date range/all-day/category, organization, created/updated/deleted user references, soft-delete fields, and timestamps.
- `CalendarEventCategory`: `MEETING`, `TRAINING`, `DEADLINE`, `TASK`, `REMINDER`, `OTHER`.

## Security and gaps

- The versioned holiday endpoints correctly use `requireAuth` and organization context.
- The legacy `/api/holidays` endpoint hard-codes an organization on create and lists across all organizations; do not treat it as a safe organization-scoped API.
- Calendar event handlers verify a JWT but do not load/check current active user or role through `requireAuth`; any valid session token can reach their POST/DELETE operations.
- Holiday mutation routes are legacy and directly access Prisma; route and store use mixed API generations.
- Company calendars currently show holiday and general events. No source path was found that merges private employee leave into a shared calendar.
