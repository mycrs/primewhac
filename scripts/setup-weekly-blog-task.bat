@echo off
REM QruzeTV Haftalık Blog Otomasyon Görevini Kurar
cd /d "%~dp0.."
powershell -ExecutionPolicy Bypass -File "%~dp0setup-weekly-blog-task.ps1"
pause
