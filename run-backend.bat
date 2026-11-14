@echo off
title CareerSignal Backend
cd /d "%~dp0backend"
echo ====================================================
echo Starting CareerSignal FastAPI Backend (Port 8000)...
echo ====================================================
python -m uvicorn app.main:app --reload --port 8000
pause

