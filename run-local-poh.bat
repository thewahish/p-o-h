@echo off
setlocal enabledelayedexpansion

REM ==============================
REM Path of Heroes - Local Test Script
REM ==============================

REM Step 0 – Change directory to project folder
cd /d "C:\Users\Obai\Documents\GitHub\p-o-h"

REM Step 1 – Install dependencies (including Tailwind & PostCSS)
echo.
echo [1/3] Installing dependencies...
call npm install || goto :error
call npm install -D tailwindcss postcss autoprefixer @tailwindcss/postcss || goto :error

REM Step 2 – Build project
echo.
echo [2/3] Building project...
call npm run build || goto :error

REM Step 3 – Run local preview
echo.
echo [3/3] Starting local preview...
call npm run preview || goto :error

pause
exit /b 0

:error
echo.
echo !!! ERROR: Something went wrong during local test.
pause
exit /b 1
