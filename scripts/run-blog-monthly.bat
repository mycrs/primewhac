@echo off
REM Blog otomasyonu - ayda bir calistirilir. Windows Gorev Zamanlayici ile ayarlayin:
REM   Tetikleyici : Aylik, 1. gun, sabah 09:15 gibi bos bir saat
REM   Eylem       : Bu .bat dosyasini calistir
REM   Kosul       : Bilgisayar acik olmali; kacirilirsa sonraki acilista manuel calistirin.
REM Akis: yazi uret (TR+DE+kapak) -> build (prerender + sitemap) -> FTP deploy.
REM Sadece uretmek isterseniz ilk satirdan sonrakini yoruma alin.
cd /d "%~dp0.."
call npm run blog:generate >> blog-automation.log 2>&1
call npm run deploy >> blog-automation.log 2>&1
