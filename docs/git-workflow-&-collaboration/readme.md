# GitHub Contribution & Development Workflow

## Overview

This document defines the standard GitHub workflow for all developers, interns, and contributors working on the **HR Management System**.

Our development process follows:

```text
Fork → Clone → Upstream Sync → Feature Branch
→ Develop → Test → Commit → Push
→ Pull Request → Code Review → Merge
→ Sync Local Repository → Cleanup
```

The purpose of this workflow is to:

* Keep the `main` branch stable.
* Prevent accidental direct changes to protected branches.
* Reduce merge conflicts.
* Maintain a clean and understandable Git history.
* Make code reviews easier.
* Ensure every change is tested before merging.
* Provide clear ownership and traceability for changes.

---

# 1. Repository Structure

**Original Repository:**

```text
https://github.com/ShitansuCTS/Hr-management-system
```

The repository uses two important remotes:

```text
origin    → Your personal fork
upstream  → Original project repository
```

Example:

```text
Your Fork
    │
    │ origin
    ▼
Your Local Repository
    │
    │ upstream
    ▼
Original Repository
```

### Remote Responsibilities

| Remote     | Purpose                     |
| ---------- | --------------------------- |
| `origin`   | Your personal fork          |
| `upstream` | Original project repository |

Developers should **pull/fetch changes from `upstream`** and **push their feature branches to `origin`**.

---

# 2. Fork the Repository

Every external developer or contributor should work from their own fork.

1. Open the repository on GitHub.
2. Click **Fork**.
3. Select your GitHub account.
4. Confirm that the fork was created.

Your fork will look like:

```text
https://github.com/YOUR_USERNAME/Hr-management-system
```

---

# 3. Clone Your Fork

Clone your fork to your local machine:

```bash
git clone https://github.com/YOUR_USERNAME/Hr-management-system.git
cd Hr-management-system
```

Verify the repository:

```bash
git remote -v
```

At this stage, you should see `origin`.

---

# 4. Add the Upstream Repository

Add the original repository as `upstream`:

```bash
git remote add upstream https://github.com/ShitansuCTS/Hr-management-system.git
```

Verify:

```bash
git remote -v
```

Expected result:

```text
origin    https://github.com/YOUR_USERNAME/Hr-management-system.git (fetch)
origin    https://github.com/YOUR_USERNAME/Hr-management-system.git (push)

upstream  https://github.com/ShitansuCTS/Hr-management-system.git (fetch)
upstream  https://github.com/ShitansuCTS/Hr-management-system.git (push)
```

### Important

Developers should normally:

```text
Pull/Fetch → upstream
Push       → origin
```

---

# 5. Sync Before Starting New Work

Before creating a new branch, always make sure your local `main` is up to date.

```bash
git checkout main
git fetch upstream
git merge upstream/main
git push origin main
```

Alternatively, if your team prefers a linear history:

```bash
git checkout main
git fetch upstream
git rebase upstream/main
git push origin main
```

> **Do not start new work from an outdated `main` branch.**

---

# 6. Branching Strategy

Developers must **never work directly on `main`**.

Create a separate branch for every feature, bug fix, or task.

### Feature Branch

```bash
git checkout -b feature/feature-name
```

Example:

```bash
git checkout -b feature/employee-crud
```

### Bug Fix Branch

```bash
git checkout -b bugfix/bug-name
```

Example:

```bash
git checkout -b bugfix/login-validation
```

### Other Branch Types

For larger projects, the following naming conventions may also be used:

```text
feature/     → New functionality
bugfix/      → Bug fixes
hotfix/      → Urgent production fixes
refactor/    → Code restructuring
chore/       → Maintenance/configuration
docs/        → Documentation changes
```

Examples:

```text
feature/leave-management
feature/employee-documents
bugfix/attendance-calculation
hotfix/login-production-error
refactor/authentication-service
chore/update-dependencies
docs/api-documentation
```

### Branch Naming Rules

Use:

```text
lowercase
kebab-case
descriptive names
```

Good:

```text
feature/employee-profile
bugfix/leave-balance-calculation
```

Avoid:

```text
feature/test
feature/my-work
feature/changes
fix/fix
newbranch
```

---

# 7. Develop on the Feature Branch

After creating the branch:

```bash
git checkout -b feature/employee-profile
```

Make your changes.

Before committing, check:

```bash
git status
```

Review the changed files:

```bash
git diff
```

Make sure that you have not accidentally modified unrelated files.

---

# 8. Test Before Committing

Before pushing your changes, run the project's required checks.

Typical checks include:

```bash
npm install
npm run lint
npm run build
```

If the project contains tests:

```bash
npm test
```

Also test the functionality manually when appropriate.

### Minimum Requirements

Before creating a PR:

* Application starts successfully.
* Feature works as expected.
* Existing functionality is not broken.
* No console errors are introduced.
* No unnecessary files are committed.
* No secrets are included.

---

# 9. Commit Your Changes

Stage the required files:

```bash
git add .
```

Review staged files:

```bash
git status
```

Create a meaningful commit:

```bash
git commit -m "Add employee profile management"
```

### Good Commit Messages

```text
Add employee CRUD API
Add employee profile page
Fix login validation
Fix leave balance calculation
Update attendance dashboard
Refactor authentication service
Add employee document upload
```

### Avoid

```text
update
changes
fix
work
testing
final
done
```

A commit message should explain **what changed**.

---

# 10. Push the Feature Branch

Push your branch to your fork:

```bash
git push -u origin feature/employee-profile
```

After the first push, future pushes can usually be:

```bash
git push
```

---

# 11. Create a Pull Request

Open your fork on GitHub and create a Pull Request.

### Pull Request Configuration

```text
Base Repository:
ShitansuCTS/Hr-management-system

Base Branch:
main

Head Repository:
YOUR_USERNAME/Hr-management-system

Compare Branch:
feature/employee-profile
```

If the project uses `staging` as the designated integration branch, use:

```text
Base Branch:
staging
```

> Always confirm the team's current target branch before opening the PR.

---

# 12. Pull Request Requirements

Before submitting a PR, verify:

```text
[ ] Feature/bug is complete
[ ] Code works locally
[ ] Application builds successfully
[ ] Lint passes
[ ] Tests pass, if applicable
[ ] No merge conflicts
[ ] No secrets or .env files
[ ] No unnecessary files
[ ] Only task-related changes are included
[ ] Commit messages are meaningful
[ ] PR title clearly describes the change
[ ] PR description explains what was changed
```

---

# 13. Pull Request Title

Use a clear title.

Good:

```text
Add employee profile management
Fix leave balance calculation
Add attendance dashboard
Fix login redirect issue
```

Avoid:

```text
Changes
Update
New work
Final PR
```

---

# 14. Code Review

After creating the PR, the reviewer will review:

* Code quality
* Architecture
* Security
* Performance
* Database changes
* API implementation
* UI/UX
* Error handling
* Edge cases
* Existing functionality
* Naming and maintainability

The PR should **not be merged until required reviews are completed**.

---

# 15. Address Review Comments

If the reviewer requests changes, continue working on the same branch.

Make the required changes:

```bash
git add .
git commit -m "Address PR review comments"
git push
```

The existing PR will automatically update.

### Important

Do **not** create a second PR for review changes.

Keep all related changes on the same feature branch.

---

# 16. Keep Your Branch Updated

If `main` changes while you are working, update your feature branch before merging.

First fetch the latest changes:

```bash
git fetch upstream
```

Then update your branch.

### Merge Strategy

```bash
git checkout feature/employee-profile
git merge upstream/main
```

Resolve any conflicts, test the application, then:

```bash
git add .
git commit
git push
```

### Rebase Strategy

If your team uses rebase:

```bash
git checkout feature/employee-profile
git fetch upstream
git rebase upstream/main
```

Resolve conflicts, then:

```bash
git add .
git rebase --continue
git push --force-with-lease
```

> Use `--force-with-lease`, not `--force`, when updating a rebased branch.

---

# 17. Merge the Pull Request

After:

```text
Code complete
      ↓
Testing complete
      ↓
Review complete
      ↓
Review comments resolved
      ↓
CI/build checks passed
      ↓
No conflicts
      ↓
PR approved
      ↓
Merge
```

The authorized maintainer merges the PR.

Developers should **not bypass the review process by directly pushing to protected branches**.

---

# 18. After the PR Is Merged

Update your local `main`:

```bash
git checkout main
git fetch upstream
git merge upstream/main
```

Update your fork:

```bash
git push origin main
```

Your local repository is now synchronized.

---

# 19. Delete the Feature Branch

After the PR has been successfully merged:

### Delete local branch

```bash
git branch -d feature/employee-profile
```

### Delete remote branch

```bash
git push origin --delete feature/employee-profile
```

Verify:

```bash
git branch
```

and:

```bash
git branch -r
```

---

# 20. Complete Development Cycle

The standard development cycle is:

```text
Fork Repository
       ↓
Clone Fork
       ↓
Add Upstream
       ↓
Sync Main
       ↓
Create Feature/Bugfix Branch
       ↓
Develop
       ↓
Test
       ↓
Commit
       ↓
Push to Origin
       ↓
Create Pull Request
       ↓
Code Review
       ↓
Changes Required?
       │
    ┌──┴──┐
   Yes    No
    │      │
    ▼      ▼
Commit   Approval
Push       │
    │      ▼
    └──→ Merge
           │
           ▼
       Sync Main
           │
           ▼
      Delete Branch
           │
           ▼
      Start Next Task
```

---

# 21. Common Git Commands

| Task                 | Command                                |
| -------------------- | -------------------------------------- |
| Check status         | `git status`                           |
| View branches        | `git branch`                           |
| View remote branches | `git branch -r`                        |
| Switch branch        | `git checkout branch-name`             |
| Create branch        | `git checkout -b branch-name`          |
| View remotes         | `git remote -v`                        |
| Fetch upstream       | `git fetch upstream`                   |
| Update main          | `git merge upstream/main`              |
| View history         | `git log --oneline`                    |
| View changes         | `git diff`                             |
| Stage changes        | `git add .`                            |
| Commit changes       | `git commit -m "message"`              |
| Push branch          | `git push -u origin branch-name`       |
| Delete local branch  | `git branch -d branch-name`            |
| Delete remote branch | `git push origin --delete branch-name` |

---

# 22. Troubleshooting

## Merge Conflict

Fetch the latest changes:

```bash
git fetch upstream
```

Update your branch:

```bash
git merge upstream/main
```

Git will identify conflicting files.

Resolve the conflicts manually.

Then:

```bash
git add .
git commit
git push
```

Test the application before updating the PR.

---

## Undo Last Commit While Keeping Changes

```bash
git reset --soft HEAD~1
```

Your changes remain in the working directory/staging area.

---

## Discard Local Changes

To discard changes to tracked files:

```bash
git restore .
```

> Use this carefully. Discarded changes may not be recoverable.

---

## Delete a Local Branch

```bash
git branch -d feature/feature-name
```

If the branch has not been merged:

```bash
git branch -D feature/feature-name
```

Use `-D` carefully.

---

## Accidentally Committed a Secret

If an API key, password, token, or other secret has been committed:

1. **Immediately revoke/rotate the secret.**
2. Do not rely only on deleting the file in a later commit.
3. Inform the project maintainer.
4. Remove the secret from Git history if required.

Never commit:

```text
.env
.env.local
API keys
Database passwords
Private keys
OAuth secrets
Production credentials
```

Use environment variables and the project's approved secret-management system.

---

# 23. Git Safety Rules

### Never directly work on `main`

```text
❌ main → development
```

Use:

```text
✅ main → feature branch → PR → review → merge
```

### Never commit secrets

```text
❌ .env
❌ API keys
❌ passwords
❌ private credentials
```

### Never force-push shared branches

Avoid:

```bash
git push --force
```

If rewriting your own feature branch is necessary:

```bash
git push --force-with-lease
```

Never rewrite the history of protected/shared branches.

### Keep PRs focused

One PR should normally contain:

```text
One feature
OR
One bug fix
OR
One focused technical change
```

Avoid combining:

```text
Login feature
+ Leave module
+ UI redesign
+ unrelated bug fixes
```

into one PR.

---

# 24. Pull Request Best Practices

A good PR should answer three questions:

### What changed?

Example:

```text
Added employee profile management.
```

### Why was it changed?

Example:

```text
HR users need to create, update, and view employee profiles.
```

### How was it tested?

Example:

```text
- Tested employee creation
- Tested profile update
- Tested validation
- Ran npm run build
```

---

# 25. Frequently Asked Questions

### Can I work directly on `main`?

**No.**

Always create a feature, bugfix, hotfix, or appropriate task branch.

---

### Should one PR contain multiple features?

**No, whenever practical.**

Keep PRs focused on one feature or bug fix.

---

### What if someone changes `main` while I'm working?

Update your branch with the latest upstream changes before requesting or completing the merge.

```bash
git fetch upstream
git merge upstream/main
```

---

### Do I need a new PR after fixing review comments?

**No.**

Push the additional commits to the existing PR branch.

---

### Should I delete the branch after merging?

**Yes.**

Delete both the local and remote feature branches after the PR is merged.

---

### What if I accidentally committed `.env`?

Immediately rotate/revoke the exposed credentials and notify the maintainer.

Deleting `.env` in a later commit is **not enough** if the secret exists in Git history.

---

# 26. Quick Reference

```text
                    START
                      │
                      ▼
                  Fork Repo
                      │
                      ▼
                  Clone Fork
                      │
                      ▼
                Add Upstream
                      │
                      ▼
                  Sync Main
                      │
                      ▼
               Create Branch
                      │
                      ▼
              Develop & Test
                      │
                      ▼
              Commit Changes
                      │
                      ▼
              Push to Origin
                      │
                      ▼
               Create PR
                      │
                      ▼
                Code Review
                      │
                ┌─────┴─────┐
                │           │
             Changes?       No
                │           │
               Yes          ▼
                │        Approval
                ▼           │
          Commit + Push     ▼
                │          Merge
                └───────────┤
                            ▼
                       Sync Main
                            │
                            ▼
                      Delete Branch
                            │
                            ▼
                         DONE
```

---

# Golden Rule

> **Never make development changes directly on `main`.**
>
> **Always work on a dedicated branch, test your changes, create a Pull Request, get the required review, and merge only after approval.**

```text
Fork
  ↓
Clone
  ↓
Upstream Sync
  ↓
Feature/Bugfix Branch
  ↓
Develop
  ↓
Test
  ↓
Commit
  ↓
Push
  ↓
Pull Request
  ↓
Review
  ↓
Merge
  ↓
Sync Main
  ↓
Delete Branch
  ↓
Repeat
```
