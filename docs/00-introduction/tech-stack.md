# Technology Stack

The HRMS Portal is built using a modern full-stack JavaScript architecture. The application uses Next.js for both the frontend and backend, PostgreSQL as the database, Prisma as the ORM, and Cloudinary for media storage. State management on the frontend is handled using Zustand, while authentication is implemented using a custom JWT-based solution.

---

## Frontend

| Technology | Purpose |
|------------|---------|
| **Next.js 14** | Full-stack React framework |
| **React 18** | UI development |
| **Bootstrap 5** | Responsive layout and utility classes |
| **Sass (SCSS)** | Custom styling |
| **Zustand** | State management |
| **React Select** | Advanced dropdowns |
| **React Hot Toast** | Notifications |
| **React Loading Skeleton** | Loading placeholders |
| **Lucide React** | Icons |

---

## Backend

| Technology | Purpose |
|------------|---------|
| **Next.js App Router** | API development |
| **Prisma ORM** | Database operations |
| **PostgreSQL** | Relational database |
| **Supabase** | PostgreSQL hosting |
| **Zod** | Validation |
| **bcryptjs** | Password hashing |
| **JOSE** | JWT authentication |

---

## Cloud Services

| Service | Purpose |
|---------|---------|
| **Cloudinary** | Image storage and optimization |
| **Resend** | Email delivery |

---

## Development Tools

| Tool | Purpose |
|------|---------|
| **npm** | Package manager |
| **Prisma CLI** | Database migrations |
| **Prettier** | Code formatting |

---

## Architecture

```text
Browser
    │
    ▼
Next.js (Frontend)
    │
    ▼
API Routes
    │
    ▼
Prisma ORM
    │
    ▼
PostgreSQL (Supabase)

Images ─────────► Cloudinary

Authentication ─► JWT

State ──────────► Zustand
```