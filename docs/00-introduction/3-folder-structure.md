# Folder Structure

This document explains the overall project structure and the purpose of each major directory.

---

## Root Structure

```text
project-root/
│
├── docs/
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.js
│
├── public/
├── src/
├── node_modules/
│
├── .env
├── .gitignore
├── .prettierignore
├── jsconfig.json
├── next.config.js
├── package.json
├── package-lock.json
├── prisma.config.ts
└── README.md
```

---

## Source Directory

```text
src/
│
├── app/
├── components/
├── controllers/
├── services/
├── validations/
├── middleware/
├── stores/
├── lib/
├── utils/
├── hooks/
├── constants/
├── types/
└── styles/
```

---

## Directory Overview

### app/

Contains all application routes, pages, layouts, and API route handlers using the Next.js App Router.

Example:

```text
app/
├── (dashboard)/
├── login/
├── employees/
├── departments/
└── api/
```

---

### components/

Reusable UI components shared across the application.

Example:

```text
components/
├── ui/
├── forms/
├── tables/
├── layout/
└── common/
```

---

### controllers/

Handles incoming API requests and returns responses.

Responsibilities:

- Receive request
- Call services
- Return response

---

### services/

Contains all business logic.

Responsibilities:

- Database operations
- Business rules
- Data processing

---

### validations/

Contains Zod validation schemas.

Responsibilities:

- Request validation
- Response validation
- Form validation

---

### middleware/

Application middleware.

Examples:

- Authentication
- Authorization
- Role checking
- Request protection

---

### stores/

Frontend state management using Zustand.

Examples:

- Authentication Store
- Employee Store
- Attendance Store
- Dashboard Store

---

### lib/

Shared libraries and application configuration.

Examples:

- Prisma Client
- JWT
- Cloudinary
- Database
- Email

---

### utils/

Utility helper functions.

Examples:

- Date formatting
- Slug generation
- File helpers
- Common utilities

---

### hooks/

Reusable React custom hooks.

Examples:

- useAuth()
- usePagination()
- useDebounce()

---

### styles/

Global styles and SCSS files.

---

## Database

```text
prisma/
├── schema.prisma
├── migrations/

```

Responsible for:

- Database schema
- Migrations
- Seed data

---

## Public Assets

```text
public/
├── images/
├── icons/
├── fonts/
└── uploads/
```

Stores publicly accessible static assets.