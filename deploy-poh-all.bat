@echo off
setlocal

:: Log file with timestamp
set LOGFILE=deploy_log_%DATE:~10,4%-%DATE:~4,2%-%DATE:~7,2%_%TIME:~0,2%-%TIME:~3,2%-%TIME:~6,2%.txt
set LOGFILE=%LOGFILE: =0%

echo [1/4] Installing dependencies... >> %LOGFILE%
call npm install >> %LOGFILE% 2>&1
echo Step 1 complete. >> %LOGFILE%

echo [2/4] Building project... >> %LOGFILE%
call npm run build >> %LOGFILE% 2>&1
echo Step 2 complete. >> %LOGFILE%

echo [3/4] Deploying to GitHub Pages... >> %LOGFILE%
call npm run deploy >> %LOGFILE% 2>&1
echo Step 3 complete. >> %LOGFILE%

echo [4/4] Deployment complete! >> %LOGFILE%
type %LOGFILE%
pause
