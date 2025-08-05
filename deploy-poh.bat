@echo off
setlocal enabledelayedexpansion

REM ==============================
REM Path of Heroes Auto Deploy Script
REM ==============================

REM Change directory to your project folder
cd /d "C:\Users\Obai\Documents\GitHub\p-o-h"

REM Step 1 – Install dependencies
echo.
echo [1/4] Installing dependencies...
call npm install || goto :error

REM Step 2 – Build project
echo.
echo [2/4] Building project...
call npm run build || goto :error

REM Step 3 – Commit and push changes
echo.
echo [3/4] Adding, committing, and pushing changes to GitHub...
git add -A
git commit -m "Auto-deploy update" --allow-empty
git push origin main || goto :error

REM Step 4 – Trigger GitHub Actions deploy
echo.
echo [4/4] Triggering GitHub Actions deploy...
echo Deploy triggered. GitHub Actions will handle publishing.

REM Optional: Wait for confirmation from user before closing
echo.
pause
exit /b 0

:error
echo.
echo !!! ERROR: One of the steps failed. Check the output above.
pause
exit /b 1
