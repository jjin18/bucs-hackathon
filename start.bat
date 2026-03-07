@echo off
REM Always run from this script's folder so npm finds package.json
cd /d "%~dp0"

echo Portfolio folder: %CD%
echo Starting dev server at http://127.0.0.1:3006
echo Press Ctrl+C to stop.
echo.

REM Open browser after ~5 seconds
start /b cmd /c "ping -n 6 127.0.0.1 >nul && start http://127.0.0.1:3006"

npm run dev
pause
