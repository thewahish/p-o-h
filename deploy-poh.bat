@echo off
setlocal enabledelayedexpansion

REM ==============================
REM Path of Heroes Auto Deploy Script (Fixed Tailwind Version Check)
REM ==============================

REM Change directory to your project folder
cd /d "C:\Users\Obai\Documents\GitHub\p-o-h"

REM Step 0 – Check TailwindCSS version (from package.json)
echo.
echo [0/5] Checking TailwindCSS version (installed)...
for /f "delims=" %%a in ('node -p "require('./package.json').devDependencies['tailwindcss']" 2^>nul') do (
    set "version=%%a"
)

if "!version!"=="" (
    echo ERROR: Could not detect TailwindCSS version. Installing correct version...
    npm install tailwindcss@3.4.17 --save-dev --save-exact
) else if "!version!"=="3.4.17" (
    echo TailwindCSS version is correct: !version!
) else (
    echo WARNING: Installed TailwindCSS version is !version! – fixing to 3.4.17...
    npm install tailwindcss@3.4.17 --save-dev --save-exact
)

REM Step 1 – Install dependencies
echo.
echo [1/5] Installing dependencies...
call npm install || goto :error

REM Step 2 – Build project
echo.
echo [2/5] Building project...
call npm run build || goto :error

REM Step 3 – Commit and push changes
echo.
echo [3/5] Adding, committing, and pushing changes to GitHub...
git add -A
git commit -m "Auto-deploy update" --allow-empty
git push origin main || goto :error

REM Step 4 – Trigger GitHub Actions deploy
echo.
echo [4/5] Triggering GitHub Actions deploy...
echo Deploy triggered. GitHub Actions will handle publishing.

REM Done
echo.
echo Deployment process completed successfully.
pause
exit /b 0

:error
echo.
echo !!! ERROR: One of the steps failed. Check the output above.
pause
exit /b 1
