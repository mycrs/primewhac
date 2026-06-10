
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AlertCircle, FileX, WifiOff, PlayCircle } from 'lucide-react';

const TroubleshootingAccordion = ({ lang = 'tr' }) => {
  const isDe = lang === 'de';

  const items = [
    {
      id: "app-not-found",
      icon: <FileX className="w-5 h-5 text-red-400" />,
      title: isDe ? "App nicht im Store gefunden" : "Uygulama Mağazada Bulunamadı",
      content: (
        <div className="space-y-2 text-xs md:text-sm">
          <p>{isDe ? "Aufgrund regionaler Einschränkungen werden einige Apps möglicherweise nicht im Store angezeigt. Lösung:" : "Bölgesel kısıtlamalar nedeniyle bazı uygulamalar mağazada görünmeyebilir. Çözüm:"}</p>
          <ul className="list-disc list-inside space-y-1 text-slate-300 ml-2">
            <li>{isDe ? "Geben Sie den vollständigen Namen der App in die Suchleiste des Stores ein (z. B. 'XCIPTV Player')." : "Mağazanın arama çubuğuna uygulamanın tam adını girin (örn. \"XCIPTV Player\")."}</li>
            <li>{isDe ? "Installieren Sie alternativ die 'Downloader'-App und installieren Sie die APK direkt." : "Alternatif olarak \"Downloader\" uygulamasını yükleyin ve APK'yı doğrudan kurun."}</li>
            <li>{isDe ? "Probieren Sie einen anderen IPTV-Player aus (Smarters Pro, IBO Player usw.)." : "Farklı bir IPTV oynatıcı (Smarters Pro, IBO Player vb.) deneyin."}</li>
          </ul>
        </div>
      )
    },
    {
      id: "login-failed",
      icon: <AlertCircle className="w-5 h-5 text-amber-400" />,
      title: isDe ? "Anmeldung fehlgeschlagen / Falsche Daten" : "Giriş Başarısız / Yanlış Bilgiler",
      content: (
        <div className="space-y-2 text-xs md:text-sm">
          <p>{isDe ? "Benutzername- und Passwortfehler sind das häufigste Problem." : "Kullanıcı adı ve şifre hataları en yaygın sorundur."}</p>
          <ul className="list-disc list-inside space-y-1 text-slate-300 ml-2">
            <li>{isDe ? "Achten Sie auf Groß-/Kleinschreibung (verwechseln Sie nicht I und l, O und 0)." : "Büyük/küçük harf duyarlılığına dikkat edin (I ve l, O ve 0 harflerini karıştırmayın)."}</li>
            <li>{isDe ? "Stellen Sie sicher, dass beim Kopieren und Einfügen keine Leerzeichen vorhanden sind." : "Kopyalayıp yapıştırırken boşluk bırakmadığınızdan emin olun."}</li>
            <li>{isDe ? "Stellen Sie sicher, dass die DNS-URL (Serveradresse) mit http:// oder https:// beginnt." : "DNS URL'sinin (Sunucu Adresi) http:// veya https:// ile başladığından emin olun."}</li>
          </ul>
        </div>
      )
    },
    {
      id: "stream-issues",
      icon: <WifiOff className="w-5 h-5 text-blue-400" />,
      title: isDe ? "Stream startet nicht / Schwarzer Bildschirm" : "Yayın Açılmıyor / Siyah Ekran",
      content: (
        <div className="space-y-2 text-xs md:text-sm">
          <p>{isDe ? "Wenn die Kanalliste geladen wird, der Kanal aber nicht startet:" : "Kanal listesi yükleniyor ancak kanal açılmıyorsa:"}</p>
          <ul className="list-disc list-inside space-y-1 text-slate-300 ml-2">
            <li>{isDe ? "Ändern Sie die Option 'Stream-Format' in den App-Einstellungen (MPEG-TS oder HLS)." : "Uygulama ayarlarından \"Yayın Formatı\" seçeneğini değiştirin (MPEG-TS veya HLS)."}</li>
            <li>{isDe ? "Aktivieren/Deaktivieren Sie die Option 'Hardwarebeschleunigung' in den Player-Einstellungen." : "Oynatıcı ayarlarından \"Donanım Hızlandırıcı\" seçeneğini açıp/kapatın."}</li>
            <li>{isDe ? "Stellen Sie sicher, dass Ihre Internetverbindung stabil ist." : "İnternet bağlantınızın stabil olduğundan emin olun."}</li>
          </ul>
        </div>
      )
    },
    {
      id: "playlist-error",
      icon: <PlayCircle className="w-5 h-5 text-primary" />,
      title: isDe ? "Wiedergabeliste lädt nicht" : "Oynatma Listesi Yüklenmiyor",
      content: (
        <div className="space-y-2 text-xs md:text-sm">
          <p>{isDe ? "Wenn Sie beim Laden der Liste einen Fehler erhalten:" : "Listeyi yüklerken bir hata alıyorsanız:"}</p>
          <ul className="list-disc list-inside space-y-1 text-slate-300 ml-2">
            <li>{isDe ? "Überprüfen Sie, ob Ihr Konto abgelaufen ist." : "Hesabınızın süresinin dolup dolmadığını kontrol edin."}</li>
            <li>{isDe ? "Der Gerätespeicher ist möglicherweise unzureichend, weil zu viele Kanäle geladen wurden. Bitten Sie den Live-Support, Ihre Liste zu verkleinern (z. B. nur TR, DE, Sport)." : "Çok fazla kanal yüklendiği için cihaz hafızası yetersiz olabilir. Canlı destekten listenizi küçültmesini isteyin (örn. sadece TR, DE, Spor)."}</li>
            <li>{isDe ? "Verwenden Sie die Schaltfläche 'Wiedergabeliste aktualisieren' oder 'Aktualisieren' der App." : "Uygulamanın \"Oynatma Listesini Yenile\" veya \"Güncelle\" düğmesini kullanın."}</li>
          </ul>
        </div>
      )
    }
  ];

  return (
    <div className="bg-[#0a0a0a]/40 border border-slate-800 rounded-2xl p-4 md:p-6 w-full">
      <h3 className="text-lg md:text-xl font-bold text-white mb-4 md:mb-6 flex items-center gap-2">
        <AlertCircle className="w-5 h-5 md:w-6 md:h-6 text-primary" />
        {isDe ? "Fehlerbehebungsleitfaden" : "Sorun Giderme Kılavuzu"}
      </h3>
      
      <Accordion type="single" collapsible className="w-full space-y-2 md:space-y-3">
        {items.map((item) => (
          <AccordionItem 
            key={item.id} 
            value={item.id} 
            className="border border-slate-800 bg-[#0a0a0a]/50 rounded-lg px-2 overflow-hidden data-[state=open]:border-primary/50 transition-colors w-full"
          >
            <AccordionTrigger className="hover:no-underline py-3 md:py-4 px-2 md:px-3 min-h-[44px] touch-manipulation w-full">
              <div className="flex items-center gap-2 md:gap-3 text-left w-full">
                <div className="bg-[#0a0a0a] p-1.5 md:p-2 rounded-md border border-slate-800 shrink-0">
                  {item.icon}
                </div>
                <span className="text-sm md:text-base text-slate-200 font-medium hover:text-primary transition-colors flex-1 pr-2">
                  {item.title}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 md:px-14 pb-4 pt-1 text-slate-400 text-xs md:text-sm leading-relaxed w-full">
              {item.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default TroubleshootingAccordion;
