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

Set-Location $root

Write-Host "`n=== Setup Complete ===" -ForegroundColor Green
Write-Host ""
Write-Host "Start everything with:"
Write-Host "  npm start"
Write-Host ""
Write-Host "Or individually:"
Write-Host "  cd frontend && npm run dev"
Write-Host "  cd backend && npm run dev"
