@echo off
title CareerSignal Frontend
cd /d "%~dp0web"
echo ====================================================
echo Starting CareerSignal Web Dashboard (Port 3000)...
echo ====================================================
npm.cmd run dev
pause

