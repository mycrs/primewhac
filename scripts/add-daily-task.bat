@echo off
REM Görev Zamanlayıcı'ya günlük pregenerate ekler (her gün 00:01)
cd /d "%~dp0.."
set "BAT_PATH=%CD%\scripts\run-pregenerate-daily.bat"

schtasks /create /tn "PrimeWhac Pregenerate" /tr "\"%BAT_PATH%\"" /sc daily /st 00:01 /f

echo.
echo Gorev eklendi: Her gun 00:01'de calisacak.
echo Kaldirmak icin: schtasks /delete /tn "PrimeWhac Pregenerate" /f
