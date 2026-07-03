Contributing Guide

This document explains exactly how to work with the repository for our senior project. Every team member must follow these steps to keep the project organized, stable, and easy to collaborate on.

1. Install Required Tools

Git

Git is the version control engine used to track changes.

Download Git for Windows from the official site.

Run the installer and accept default settings.

Ensure "Add Git to PATH" is selected.

Verify installation:

git --version

GitHub Desktop (Recommended)

GitHub Desktop provides a visual interface for Git operations.

Download GitHub Desktop.

Sign in with your GitHub account.

2. Clone the Repository

Using GitHub Desktop

Open GitHub Desktop.

Select File → Clone Repository.

Paste the repository URL.

Choose a local folder.

Click Clone.

Using Command Line

git clone <repository-url>

3. Branching Workflow

Never Work on main

main contains stable, production-ready code. Do not commit directly to it.

Always Create a Feature Branch

Branch naming conventions:

feature/<task-name>

bugfix/<issue-name>

docs/<documentation-change>

Create a Branch

GitHub Desktop:

Click Current Branch → New Branch.

Name your branch.

Click Create Branch.

Command Line:

git checkout -b feature/<task-name>

4. Make Changes

Edit files using your preferred editor (VS Code recommended).

5. Commit Changes

GitHub Desktop

Review changed files.

Write a clear commit message.

Click Commit to <branch>.

Command Line

git add .
git commit -m "Describe your change"

6. Push Changes

GitHub Desktop

Click Push origin.

Command Line

git push -u origin <branch-name>

7. Open a Pull Request (PR)

All changes must be merged through a PR.

Go to the repository on GitHub.

Click Compare & pull request.

Set the base branch to dev.

Add a description of your changes.

Submit the PR.

8. Code Review and Merge

A teammate reviews your PR.

Address any comments.

Once approved, the PR is merged into dev.

Only maintainers merge into main.

9. Keeping Your Branch Updated

Before starting new work:

git checkout dev
git pull

Then update your feature branch:

git checkout feature/<task-name>
git merge dev

Resolve conflicts if necessary.

10. Project Structure Expectations

Keep code organized.

Follow naming conventions.

Write meaningful commit messages.

Do not commit large binary files unless necessary.

11. Communication

If you are unsure about anything:

Ask in the team chat.

Do not guess and risk breaking the repo.

Summary

Install Git and GitHub Desktop.

Clone the repo.

Create a feature branch.

Commit and push changes.

Open a pull request.

Get a review.

Merge into dev.

Following this workflow ensures smooth collaboration and prevents accidental breakage of the project.
