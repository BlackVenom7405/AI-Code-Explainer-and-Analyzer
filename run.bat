@echo off
title CodeLens AI Runner
echo ============================================================
echo           CodeLens AI - Single File Launcher
echo ============================================================
echo.

where python >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Python is not installed or not in your system PATH.
    echo Please install Python 3.9+ from https://www.python.org/
    pause
    exit /b 1
)

python "%~dp0run.py"

pause
