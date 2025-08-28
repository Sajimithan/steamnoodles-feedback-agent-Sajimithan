# SteamNoodles Feedback Agent - Setup Script
# This script sets up the backend environment and dependencies

Write-Host "=== SteamNoodles Feedback Agent Setup ===" -ForegroundColor Green

# Check if Python is installed
try {
    $pythonVersion = python --version 2>&1
    Write-Host "Found Python: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "Error: Python is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

# Create virtual environment if it doesn't exist
if (-not (Test-Path "venv")) {
    Write-Host "Creating virtual environment..." -ForegroundColor Yellow
    python -m venv venv
}

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
& .\venv\Scripts\Activate.ps1

# Upgrade pip
Write-Host "Upgrading pip..." -ForegroundColor Yellow
python -m pip install --upgrade pip

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt

# Create necessary directories
Write-Host "Creating directories..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "logs"
New-Item -ItemType Directory -Force -Path "data"
New-Item -ItemType Directory -Force -Path "test_data"

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "Creating .env file from template..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "Please edit .env file and add your GROQ_API_KEY" -ForegroundColor Red
}

# Run tests to verify setup
Write-Host "Running tests to verify setup..." -ForegroundColor Yellow
python -m pytest tests/ -v

Write-Host "Setup completed successfully!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Edit .env file and add your GROQ_API_KEY" -ForegroundColor White
Write-Host "2. Run: python -m uvicorn app:app --reload" -ForegroundColor White
Write-Host "3. Visit: http://127.0.0.1:8000/docs for API documentation" -ForegroundColor White
