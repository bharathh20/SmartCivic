@echo off
title SmartCivic Automated Test Suite Runner
echo ========================================================
echo        SMARTCIVIC PLATFORM - AUTOMATED TEST RUNNER
echo ========================================================
echo.
echo [1/4] Running 20-Point End-to-End Integration Suite...
py backend/tests/test_runner.py
echo.
echo [2/4] Running Login Persistence & Profile State Suite...
py backend/tests/verify_login_persistence.py
echo.
echo [3/4] Running Image Upload & Citizen Complaint Isolation Suite...
py backend/tests/verify_image_upload_and_isolation.py
echo.
echo [4/4] Running Role Portals & Authentication Security Suite...
py backend/tests/verify_role_portals_and_login_security.py
echo.
echo ========================================================
echo All test suites executed.
echo ========================================================
pause
