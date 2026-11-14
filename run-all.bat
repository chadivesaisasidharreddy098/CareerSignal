@echo off
title CareerSignal Launcher
echo ====================================================
echo Launching CareerSignal Full Stack...
echo ====================================================
start "CareerSignal Backend" "%~dp0run-backend.bat"
start "CareerSignal Frontend" "%~dp0run-frontend.bat"
echo Services launched in separate windows!
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:8000
timeout /t 5

