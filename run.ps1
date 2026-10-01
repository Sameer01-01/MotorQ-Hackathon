$ErrorActionPreference = "Stop"

Write-Host "=== Setting up FleetSentinel Lite ===" -ForegroundColor Green

# Create venv if not exists
if (-not (Test-Path ".venv")) {
    Write-Host "Creating Python virtual environment..."
    python -m venv .venv
}

# Activate venv and install requirements
Write-Host "Installing Python dependencies..."
& .\.venv\Scripts\python.exe -m pip install -r requirements.txt

# Run seed script
Write-Host "Seeding database..."
& .\.venv\Scripts\python.exe -m services.api.seed

# Start the services in the background
Write-Host "Starting API on port 8000..."
Start-Process -FilePath ".\.venv\Scripts\uvicorn.exe" -ArgumentList "services.api.main:app", "--reload" -NoNewWindow

Write-Host "Starting React UI..."
Set-Location .\services\web
Start-Process -FilePath "npm.cmd" -ArgumentList "run", "dev" -NoNewWindow

Write-Host "Services are starting! API @ http://localhost:8000, UI @ http://localhost:5173" -ForegroundColor Green
Write-Host "Running in background... (Cancel this task to stop)"
while ($true) {
    Start-Sleep -Seconds 3600
}
