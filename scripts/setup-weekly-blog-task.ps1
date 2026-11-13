# QruzeTV Haftalık Blog Otomasyonu - Windows Görev Zamanlayıcı Kurulumu
$TaskName = "QruzeTV_Weekly_Blog_Automation"
$ProjectPath = "D:\Projects\güncel siteler\primewhac"
$ScriptPath = Join-Path $ProjectPath "scripts\run-blog-weekly.bat"

# Önceki görev varsa kaldır
try {
    Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false -ErrorAction SilentlyContinue
} catch {}

# Eylem: Gizli pencerede bat dosyasını çalıştır
$Action = New-ScheduledTaskAction -Execute "cmd.exe" -Argument "/c `"$ScriptPath`"" -WorkingDirectory $ProjectPath

# Tetikleyici: Her Pazartesi saat 10:00'da
$Trigger = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Monday -At 10:00AM

# Ayarlar: Bilgisayar kapalıysa açıldığında hemen çalıştır, pilde de çalıştır
$Settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -DontStopIfGoingOnBatteries -AllowStartIfOnBatteries -MultipleInstances IgnoreNew

# Görevi kaydet
Register-ScheduledTask -TaskName $TaskName -Action $Action -Trigger $Trigger -Settings $Settings -Description "QruzeTV Telif Guvenli Haftalik Otomatik Blog Uretici (TR+DE+Kapak)"

Write-Host "✅ Gorev basariyla kaydedildi: $TaskName"
Write-Host "📅 Calisma Zamani: Her Pazartesi 10:00 (PC kapaliysa ilk acilista calisir)"
