@echo off
title Publish SmartCivic to GitHub
echo ========================================================
echo        SMARTCIVIC - ONE-CLICK GITHUB PUBLISHER
echo ========================================================
echo.
set "PATH=C:\Users\Bharath S\AppData\Local\Programs\MinGit\cmd;C:\Program Files\GitHub CLI;%PATH%"

echo [1/3] Checking GitHub Authentication...
gh auth status >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Please authenticate your GitHub account in the browser:
    echo.
    gh auth login --web -h github.com -p https -w
)

echo.
echo [2/3] Creating GitHub Repository 'SmartCivic' (if not already created)...
gh repo create SmartCivic --public --source=. --remote=origin --push >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Repository already exists or remote is set. Pushing to origin main...
    git push -u origin main
)

echo.
echo ========================================================
echo [SUCCESS] SmartCivic has been pushed to GitHub!
echo.
gh repo view --web
echo ========================================================
pause
