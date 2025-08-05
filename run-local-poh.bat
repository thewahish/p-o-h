@echo off
setlocal enabledelayedexpansion

REM ==============================
REM Path of Heroes - Local Test Script (With Tailwind Version Check)
REM ==============================

REM Step 0 – Change directory to project folder
cd /d "C:\Users\Obai\Documents\GitHub\p-o-h"

REM Step 1 – Check TailwindCSS version
echo.
echo [0/3] Checking TailwindCSS version...
for /f "delims=" %%a in ('node -p "require('./package.json').devDependencies['tailwindcss']" 2^>nul') do (
    set "version=%%a"
)

if "!version!"=="" (
    echo TailwindCSS not found – installing version 3.4.17...
    npm install tailwindcss@3.4.17 --save-dev --save-exact
) else if "!version!"=="3.4.17" (
    echo TailwindCSS version is correct: !version!
) else (
    echo WARNING: Installed TailwindCSS version is !version! – fixing to 3.4.17...
    npm install tailwindcss@3.4.17 --save-dev --save-exact
)

REM Step 2 – Install dependencies
echo.
echo [1/3] Installing dependencies...
call npm install || goto :error

REM Step 3 – Build project
echo.
echo [2/3] Building project...
call npm run build || goto :error

REM Step 4 – Run local preview
echo.
echo [3/3] Starting local preview (http://localhost:4173/p-o-h/)...
call npm run preview || goto :error

pause
exit /b 0

:error
echo.
echo !!! ERROR: Something went wrong during local test.
pause
exit /b 1
