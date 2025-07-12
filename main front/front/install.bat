@echo off
echo ========================================
echo Skill Swap Platform - Installation Script
echo ========================================
echo.

echo [1/4] Checking Node.js...
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from: https://nodejs.org/
    pause
    exit /b 1
)

echo [2/4] Installing backend dependencies...
cd backend
npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies!
    pause
    exit /b 1
)

echo [3/4] Testing database connection...
node test-db.js
if %errorlevel% neq 0 (
    echo WARNING: Database connection failed!
    echo Please make sure XAMPP MySQL is running
    echo and database 'skill_swap_db' exists
)

echo [4/4] Starting backend server...
echo.
echo Backend will start on: http://localhost:5000
echo Frontend should be on: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.
npm start

pause 