@echo off
title SmartCivic Application Launcher
echo ========================================================
echo        SMARTCIVIC PLATFORM - ONE-CLICK LAUNCHER
echo ========================================================
echo.
echo [1/3] Starting SmartCivic REST API Server (Port 5000)...
start "SmartCivic Backend API" /min py backend/server.py

timeout /t 2 /nobreak >nul

echo [2/3] Starting SmartCivic Web Frontend Server (Port 8000)...
start "SmartCivic Frontend Web" /min py -m http.server 8000

timeout /t 1 /nobreak >nul

echo [3/3] Launching Web Browser at http://127.0.0.1:8000 ...
start http://127.0.0.1:8000

echo.
echo ========================================================
echo SmartCivic is now RUNNING!
echo.
echo Frontend Web URL : http://127.0.0.1:8000
echo Backend API URL  : http://localhost:5000/api/health
echo.
echo Press any key to close this launcher window (servers keep running in background).
echo ========================================================
pause >nul
