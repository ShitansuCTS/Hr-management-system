# GitHub Collaboration Guide

## Purpose

This document explains the Git workflow followed in the HRMS project. Every developer must follow these guidelines to ensure smooth collaboration and avoid merge conflicts.

---

# Branch Strategy

| Branch | Purpose |
|---------|---------|
| `main` | Production-ready code |
| `staging` | Development and testing |
| `feature/<feature-name>` | Individual feature development |
| `bugfix/<bug-name>` | Bug fixes |
| `hotfix/<issue-name>` | Critical production fixes |

---

# Development Workflow

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd hrms
```

---

### Step 2: Switch to Staging

```bash
git checkout staging
git pull origin staging
```

---

### Step 3: Create a New Feature Branch

Never work directly on the `staging` branch.

```bash
git checkout -b feature/employee-module
```

Examples:

```
feature/login
feature/attendance
feature/payroll
feature/dashboard-ui
```

---

### Step 4: Work on Your Feature

Make your changes.

```bash
git add .
git commit -m "Added employee attendance module"
```

---

### Step 5: Push Your Branch

```bash
git push origin feature/employee-module
```

---

### Step 6: Create a Pull Request

Create a Pull Request from

```
feature/employee-module
        ↓
staging
```

Do not merge your own Pull Request unless instructed.

---

### Step 7: Code Review

The Team Lead will review the code.

If changes are requested:

- Make the requested changes.
- Commit them.
- Push again.

The Pull Request updates automatically.

---

### Step 8: Merge

Once approved, the Pull Request will be merged into the `staging` branch.

---

# Keeping Your Branch Updated

If another developer merges code before you:

```bash
git checkout feature/employee-module
git pull origin staging --rebase
```

Resolve any conflicts.

Then push:

```bash
git push origin feature/employee-module --force-with-lease
```

---

# Merge Conflict Resolution

If Git reports a conflict:

```
<<<<<<< HEAD
Current code
=======
Incoming code
>>>>>>> feature
```

1. Review both changes.
2. Keep the correct code.
3. Remove the conflict markers.
4. Save the file.

Then run:

```bash
git add .
git rebase --continue
```

or

```bash
git commit
```

Finally:

```bash
git push
```

---

# Branch Naming Convention

Feature:

```
feature/module-name
```

Bug Fix:

```
bugfix/login-error
```

Hot Fix:

```
hotfix/payment-crash
```

Release:

```
release/v1.2.0
```

---

# Best Practices

- Never push directly to `main`.
- Never push directly to `staging`.
- Create a new feature branch for every task.
- Pull the latest changes before starting work.
- Write meaningful commit messages.
- Keep Pull Requests small and focused.
- Resolve conflicts before requesting a review.
- Delete feature branches after they are merged.

---

# Workflow Diagram

```
main
 │
 ▼
staging
 │
 ├── feature/login
 ├── feature/attendance
 ├── feature/payroll
 └── feature/dashboard
        │
        ▼
   Pull Request
        │
        ▼
     Code Review
        │
        ▼
      Merge into staging
        │
        ▼
     Testing & QA
        │
        ▼
         main
```

---

# Need Help?

If you encounter merge conflicts or Git-related issues, contact the Team Lead before using commands like `git push --force` or `git reset --hard`.