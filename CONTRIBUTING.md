# Contributing Guide

This document explains how to work with the repository for our senior project. Every team member must follow these steps to keep the project organized, stable, and easy to collaborate on.

---

## General Rules
1. Never push directly to the main or dev branches. They are protected.
2. Do not use force push commands (git push --force or -f).
3. Stop all local servers (frontend and backend) before switching branches to avoid Windows file-locking errors.
4. Keep code organized, follow naming conventions, and write meaningful commit messages.
5. Do not commit large binary files unless necessary.

---

## Install Required Tools

### Git
Git is the version control engine used to track changes.
1. Download Git for Windows from the official site.
2. Run the installer and accept default settings. Ensure "Add Git to PATH" is selected.
3. Verify installation by running: `git --version`

### GitHub Desktop (Recommended for beginners)
GitHub Desktop provides a visual interface for Git operations.
1. Download GitHub Desktop.
2. Sign in with your GitHub account.

---

## Clone the Repository

### Using GitHub Desktop
1. Open GitHub Desktop.
2. Select File → Clone Repository.
3. Paste the repository URL, choose a local folder, and click Clone.

### Using Command Line
```bash
git clone <repository-url>
```

---

## Standard Workflow Loop

Follow these steps for every feature, bug fix, or documentation change.

### Step 1: Sync Your Local Dev Branch
Before starting any new work, update your local computer with the latest repository history from the dev branch.
* **GitHub Desktop:** Switch current branch to `dev`, then click "Fetch origin" / "Pull origin".
* **Command Line:**
```bash
git checkout dev
git pull origin dev
```

### Step 2: Create a Feature Branch
Do not write code directly on main or dev. Create a new branch named after your specific task.
* **Branch naming conventions:** `feature/your-task`, `bugfix/your-task`, or `docs/your-task`.
* **GitHub Desktop:** Click Current Branch → New Branch. Name your branch and click Create Branch.
* **Command Line:**
```bash
git checkout -b feature/your-feature-name
```

### Step 3: Make Changes & Commit Progress
Edit files using your preferred editor (VS Code recommended). Save snapshots of your work locally as you make progress.
* **GitHub Desktop:** Review changed files in the left panel. Write a clear commit message in the summary box and click "Commit to [branch-name]".
* **Command Line:**
```bash
git status
git add .
git commit -m "Provide a short, clear description of the changes"
```

### Step 4: Merge Dev Updates (Preventing Code Drift)
Before pushing, integrate any updates your teammates might have merged into the dev branch while you were working.
* **GitHub Desktop:** Click Branch → Merge into current branch. Select `dev` and confirm.
* **Command Line:**
```bash
git fetch origin
git merge origin/dev
```
*Note: If this command triggers a merge conflict, stop and contact the repository administrator to resolve it line-by-line. Do not guess and risk breaking the repo.*

### Step 5: Push to GitHub
Upload your local branch and history to the remote repository.
* **GitHub Desktop:** Click "Publish branch" or "Push origin".
* **Command Line:**
```bash
git push -u origin feature/your-feature-name
```

### Step 6: Open a Pull Request (PR)
All changes must be merged through a PR. 
1. Navigate to the repository on GitHub.com.
2. Click the "Compare & pull request" banner.
3. **Crucial:** Set the base branch to `dev` (not main).
4. Add a description of your changes and submit the PR.
5. A teammate will review your PR. Address any comments. Once approved, a project maintainer will merge it into dev. Only maintainers merge from dev into main.

---

## Troubleshooting

### Error: "Unlink of file ... failed. Should I try again? (y/n)"
* **Cause:** A running process (such as a local development server or database tool) is locking a file Git needs to modify.
* **Fix:** Type `n` to cancel the command. Terminate all running terminals, backend servers, and database applications. Re-run the Git command.

### Local Branch Reset
If your local files are corrupted or out of sync and you need to reset your branch to match the remote version exactly:
```bash
git reset --hard origin/your-feature-name
```
*(Warning: This permanently deletes all uncommitted local modifications on that branch).*

---

## Summary Workflow Checklist
1. Update your local `dev` branch.
2. Create a feature branch.
3. Commit and push changes.
4. Merge incoming `dev` updates into your branch to check for conflicts.
5. Open a pull request against the remote `dev` branch.
6. Get a review and merge.
