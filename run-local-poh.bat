@echo off
setlocal enabledelayedexpansion

REM ==============================
REM Path of Heroes - Local Test Build
REM ==============================

cd /d "C:\Users\Obai\Documents\GitHub\p-o-h"

echo.
echo [1/2] Installing dependencies...
call npm install || goto :error

echo.
echo [2/2] Building project for local testing...
call npm run build || goto :error

echo.
echo ✅ Build complete! You can now run:
echo     npm run dev
echo to preview the game locally.
pause
exit /b 0

:error
echo.
echo ❌ ERROR: Build failed. Check the output above.
pause
exit /b 1
