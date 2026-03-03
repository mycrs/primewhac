@echo off
REM Her gün 00:01'de çalıştırılacak - Görev Zamanlayıcı ile ayarla
cd /d "%~dp0.."
call npm run pregenerate:content
