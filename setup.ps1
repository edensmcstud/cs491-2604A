# setup.ps1
# Installs dependencies for root, frontend, and backend

Write-Host "=== CS491 Project Setup ===" -ForegroundColor Cyan

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Node.js is not installed." -ForegroundColor Red
    exit 1
}

$root = Get-Location

function Install-Dependencies($path, $name) {
    if (Test-Path "$path\package.json") {
        Write-Host "`n=== Installing $name dependencies ===" -ForegroundColor Cyan

        Set-Location $path
        npm install

        if ($LASTEXITCODE -ne 0) {
            Write-Host "$name install failed." -ForegroundColor Red
            exit 1
        }

        Write-Host "$name setup complete." -ForegroundColor Green
    }
}

# Root dependencies (npm-run-all, scripts, etc.)
Install-Dependencies $root "root"

# Frontend dependencies
Install-Dependencies "$root\frontend" "frontend"

# Backend dependencies
Install-Dependencies "$root\backend" "backend"

# Create backend .env if missing
$envPath = "$root\backend\.env"

if (-not (Test-Path $envPath)) {
    Write-Host "`n=== Creating default backend .env ===" -ForegroundColor Cyan

    @"
# Environment variables for backend
JWT_SECRET=changeme123
PORT=3001
DB_PATH=./database.sqlite
"@ | Out-File -FilePath $envPath -Encoding utf8

    Write-Host "Default .env created at backend\.env" -ForegroundColor Green
} else {
    Write-Host "backend\.env already exists — not overwriting." -ForegroundColor Yellow
}

# === Initialize database and run seed scripts ===

$backendPath = "$root\backend"
$dbFile = "$backendPath\database.sqlite"

Write-Host "`n=== Initializing database (npm start) ===" -ForegroundColor Cyan
Set-Location $backendPath

# Start backend to trigger DB creation
npm start

# Wait for DB file to appear
Write-Host "Waiting for database.sqlite to be created..."
$maxWait = 30
$waited = 0

while (-not (Test-Path $dbFile)) {
    Start-Sleep -Seconds 1
    $waited++

    if ($waited -ge $maxWait) {
        Write-Host "Database was not created within timeout." -ForegroundColor Red
        exit 1
    }
}

Write-Host "Database created." -ForegroundColor Green

# Run seed scripts
Write-Host "`n=== Running seed scripts ===" -ForegroundColor Cyan

node seedAll.js
if ($LASTEXITCODE -ne 0) {
    Write-Host "seedAll.js failed." -ForegroundColor Red
    exit 1
}

node seedBooks.js
if ($LASTEXITCODE -ne 0) {
    Write-Host "seedBooks.js failed." -ForegroundColor Red
    exit 1
}

node seedInventory.js
if ($LASTEXITCODE -ne 0) {
    Write-Host "seedInventory.js failed." -ForegroundColor Red
    exit 1
}

Write-Host "All seed scripts completed successfully." -ForegroundColor Green


Set-Location $root

Write-Host "`n=== Setup Complete ===" -ForegroundColor Green
Write-Host ""
Write-Host "Start everything with:"
Write-Host "  npm start"
Write-Host ""
Write-Host "Or individually:"
Write-Host "  cd frontend && npm run dev"
Write-Host "  cd backend && npm run dev"
