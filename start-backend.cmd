@echo off
REM Double-click this file to start the Ramadan Goal Companion backend.
REM Leave the window open while you use the app. Close it to stop the server.
title Ramadan Goal Companion - Backend (port 4000)
cd /d "%~dp0server"
echo Starting backend on http://localhost:4000 ...
echo Keep this window open. Press Ctrl+C to stop.
echo.
call npm start
echo.
echo Server stopped. Press any key to close this window.
pause >nul
