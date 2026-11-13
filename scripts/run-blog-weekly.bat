@echo off
REM QruzeTV Telif Güvenli Haftalık Blog Otomasyonu
REM Haftada bir çalışır; konuyu Gemini ile yazar (TR+DE), Puppeteer ile telifsiz kapak üretir,
REM Supabase veritabanına ve CDN Storage'a yükler, IndexNow ile arama motorlarına bildirir.
cd /d "%~dp0.."
node scripts/generate-blog-posts.mjs >> blog-automation.log 2>&1
