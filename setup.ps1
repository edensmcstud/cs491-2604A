# setup.ps1
# Installs dependencies for CS491 project

Write-Host "=== CS491 Project Setup ===" -ForegroundColor Cyan

# Check Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Node.js is not installed. Install Node.js first: https://nodejs.org/" -ForegroundColor Red
    exit 1
}

Write-Host "Node version:"
node -v

Write-Host "npm version:"
npm -v

$root = Get-Location

# Frontend setup
if (Test-Path "$root\frontend\package.json") {
    Write-Host "`n=== Installing frontend dependencies ===" -ForegroundColor Cyan

    Set-Location "$root\frontend"

    npm install

    if ($LASTEXITCODE -ne 0) {
        Write-Host "Frontend install failed." -ForegroundColor Red
        exit 1
    }

    Write-Host "Frontend setup complete." -ForegroundColor Green
}
else {
    Write-Host "No frontend/package.json found. Skipping frontend." -ForegroundColor Yellow
}

# Backend setup
if (Test-Path "$root\backend\package.json") {
    Write-Host "`n=== Installing backend dependencies ===" -ForegroundColor Cyan

    Set-Location "$root\backend"

    npm install

    if ($LASTEXITCODE -ne 0) {
        Write-Host "Backend install failed." -ForegroundColor Red
        exit 1
    }

    Write-Host "Backend setup complete." -ForegroundColor Green
}
else {
    Write-Host "No backend/package.json found. Skipping backend." -ForegroundColor Yellow
}

# Return to root
Set-Location $root

Write-Host "`n=== Setup Complete ===" -ForegroundColor Green
Write-Host ""
Write-Host "To start the frontend:"
Write-Host "  cd frontend"
Write-Host "  npm run dev"
Write-Host ""
Write-Host "To start the backend:"
Write-Host "  cd backend"
Write-Host "  npm run dev"
