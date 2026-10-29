import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, CalendarDays, MapPinned, Users, Goal, Sparkles } from 'lucide-react';

/** Hebt Schlüsselbegriffe im Text hervor */
function highlightText(text, phrases) {
  if (!phrases?.length) return text;
  let parts = [text];
  phrases.forEach(([phrase, cls]) => {
    parts = parts.flatMap((p) =>
      typeof p === 'string' && p.includes(phrase)
        ? p.split(phrase).flatMap((seg, i) => (i === 0 ? [seg] : [<span key={`${phrase}-${i}`} className={cls}>{phrase}</span>, seg]))
        : [p]
    );
  });
  return <>{parts}</>;
}

const PARAGRAPH_HIGHLIGHTS = [
  [['Spielplanseite', 'text-primary/90'], ['Datumsleiste', 'text-amber-200/90'], ['Spielplan', 'text-[#e50914]/90']],
  [['Ligen verschiedener Länder', 'text-primary/90'], ['kompletten Spielplan sehen', 'text-amber-200/90'], ['Fußball-Marathon', 'text-[#e50914]/90']],
  [['Derby-Wochen', 'text-amber-200/90'], ['Spielplanseite', 'text-primary/90'], ['Meisterschaftsrennen', 'text-[#e50914]/90']],
  [['Spielplanseite mit Uhrzeiten', 'text-primary/90'], ['Zeitmanagement', 'text-amber-200/90']],
  [['IPTV', 'text-primary/90'], ['Spielplanseite', 'text-amber-200/90']],
  [['Spielplan überblicken', 'text-primary/90'], ['Spielplanseite', 'text-[#e50914]/90']],
  [['Spielplan prüfen', 'text-amber-200/90'], ['Spielplanseite', 'text-primary/90']],
  [['Meisterschaftsrennen', 'text-amber-200/90'], ['Spielplanseite', 'text-primary/90'], ['schicksalsträchtig', 'text-[#e50914]/90']],
  [['QruzeTV', 'text-primary/90'], ['Ausgangspunkt des Zuschauerlebnisses', 'text-amber-200/90']],
  [['Datumsleiste', 'text-primary/90'], ['Übertragungsplan', 'text-[#e50914]/90']],
];

const LONG_PARAGRAPHS = [
  'Wenn der Fußballkalender voller wird, hilft die regelmäßige Nutzung des Spielplans sowohl beim Genuss als auch beim Zeitmanagement. Besonders unter der Woche nach der Arbeit oder am Wochenende mit der Familie ist es wichtig zu wissen, an welchem Tag welche Liga wie viele Spiele hat. Die Spielplanseite ist daher nicht nur eine Liste, sondern ein Leitfaden, um Ihren Fußballtag zu organisieren. Mit der Datumsleiste wählen Sie den Tag – sofort sehen Sie alle offiziellen Spiele nach Ligen sortiert. So verpassen Sie weder die Spielzeit Ihres Teams noch können Sie bewusst entscheiden, welche Spiele Sie nacheinander schauen.',
  'Viele Fußballfans konzentrieren sich nur auf ihr Team, doch an einem Tag laufen in verschiedenen Ligen spannende Partien. Ligen verschiedener Länder können am selben Abend kollidierende Anstoßzeiten haben. Den kompletten Spielplan zu sehen, hilft bei der Priorisierung. Ein frühes Spiel vor dem Derby kann als Aufwärmen dienen; späte Spiele schließen den Abend ab. Mit der richtigen Planung lässt sich ein nahezu durchgehender Fußball-Marathon gestalten.',
  'Derby-Wochen sind die besonderen Momente im Fußballkalender. Wenn zwei Erzrivalen aufeinandertreffen, zählt nicht nur die Spielzeit – Vor- und Nachspiel haben ihre eigene Geschichte. Die Spielplanseite zeigt Derby-Tage klar zwischen den anderen Partien. Fans können sowohl das eigene Spiel als auch den Meisterschaftsrennen beeinflussende Spiele auf einen Blick verfolgen. Ergebnisse vor dem Derby steigern die Spannung. Daher lohnt es sich, den gesamten Spieltag zu überblicken.',
  'Unter der Woche bringen Pokal- und Europaspiele einen anderen Rhythmus in den Ligakalender. An manchen Tagen gibt es nur ein oder zwei Spiele, an anderen Abenden starten dutzende Partien gleichzeitig. Besonders Spiele zur Feierabendzeit werden leicht verpasst. Die Spielplanseite mit Uhrzeiten zeigt die Tagesdichte klar. So wissen Sie vorab, welches Spiel Sie verpassen und welches Sie noch erreichen können. Mit richtigem Zeitmanagement lässt sich selbst ein kurzer Abend zu einem vollen Fußballerlebnis machen.',
  'IPTV und andere internetbasierte Lösungen haben die Gewohnheiten beim Spielschauen verändert. Sie sind nicht mehr an einen Bildschirm gebunden; verschiedene Geräte und Räume ermöglichen flexibles Schauen. Diese Flexibilität erhöht aber den Planungsbedarf. Welcher Raum für welches Spiel, gemeinsam mit Freunden oder per Chat – solche Details gewinnen an Bedeutung. Die Spielplanseite ist der erste Anlaufpunkt. Wenn Sie wissen, wann wie viele Spiele laufen, können Sie Geräte und Freundeskreis entsprechend organisieren.',
  'Bei einem Fußballabend zu Hause lautet oft die erste Frage: „Welches Spiel schauen wir?“ Manche bevorzugen Ligaspiele, andere Europapokal, wieder andere Überraschungen aus unteren Ligen. Um alle zufriedenzustellen, braucht es einen Überblick über den Spielplan. Die Spielplanseite dient als gemeinsamer Referenzpunkt. Alle schauen auf dieselbe Übersicht und entscheiden gemeinsam, welche Spiele wichtiger sind und welche im Hintergrund laufen können. So entsteht ein soziales Erlebnis ohne verpasste Highlights.',
  'Auch wer allein schaut, profitiert davon, den Rest des Tages zu kennen. Morgens den Spielplan prüfen und sich auf das Abendderby freuen – so verbringen Sie den ganzen Tag in Spielstimmung. Pausen für Tippspiele, Kommentare in den sozialen Medien werden Teil des Rituals. Die Spielplanseite unterstützt diese psychologische Vorbereitung. Sie funktioniert nicht nur ergebnisorientiert, sondern als Begleiter der Vorfreude.',
  'Manche Fans verfolgen nicht nur die Spitzen, sondern auch Abstiegskämpfe. Gegen Saisonende steigt der Wert jedes Punktes. Am selben Tag sowohl den Meisterschaftsrennen als auch kritische Spiele unten zu sehen, hilft, die Liga als Ganzes zu verstehen. Die Spielplanseite liefert diese Übersicht; mit einem Blick erkennen Sie, welche Partien schicksalsträchtig sind. So lässt sich Fußball taktisch und strategisch besser verfolgen.',
  'QruzeTV versteht die Spielplanseite nicht als einfache Kalenderansicht, sondern als Ausgangspunkt des Zuschauerlebnisses. Nach dem Überblick über die Spiele können Sie entscheiden, welche Pakete zu Ihnen passen. Für Ligafans, Europapokal-Fans oder Gelegenheitszuschauer gibt es unterschiedliche Optionen. So entsteht ein Abo, das zu Ihren Gewohnheiten passt und unnötige Kosten vermeidet.',
  'Dieser Erklärungstext am Ende der Spielplanseite dient nicht nur der SEO; er soll Ihre Fußballkultur bereichern. Mit den Tipps können Sie eigene Routinen entwickeln und schönere Fußballabende planen. Egal welches Team Sie unterstützen – mit der richtigen Planung wird jeder Spieltag angenehmer. Die Datumsleiste regelmäßig nutzen, Spiele prüfen und einen passenden Übertragungsplan erstellen – so wird Fußball zum festen Teil Ihres Alltags.',
];

const HIGHLIGHT_CARDS = [
  {
    icon: Trophy,
    title: 'Große Ligen auf einen Blick',
    text: <>Für alle, die am selben Tag sowohl <span className="text-primary/90">lokale Ligen</span> als auch <span className="text-amber-200/90">Europapokal</span> verfolgen wollen, ist der gesamte Spielplan auf einer Seite. So sehen Sie Meisterschaftsrennen und Abstiegskämpfe gleichzeitig.</>,
  },
  {
    icon: Trophy,
    title: 'Derby und kritische Spiele',
    text: <>In Derby-Wochen sollten Sie den Spielplan nicht nur für ein Spiel lesen, sondern <span className="text-[#e50914]/90">alle Partien des Tages</span> einbeziehen. So erkennen Sie klar, welches Spiel vor oder nach dem Derby läuft.</>,
  },
  {
    icon: CalendarDays,
    title: 'Wochentag & Wochenende',
    text: <>Planen Sie <span className="text-white">Wochentagsspiele</span> und Wochenend-Marathons getrennt. Die Kalenderstruktur hilft, auch in kurzen Lücken passende Partien zu finden.</>,
  },
  {
    icon: MapPinned,
    title: 'Verschiedene Länder, verschiedene Zeiten',
    text: <>Da Ligen unterschiedliche Anstoßzeiten haben, können Sie am selben Abend <span className="text-amber-200/90">mehrere Spiele</span> erwischen. Die Spielplanseite zeigt alle Zeiten an einem Ort.</>,
  },
  {
    icon: Users,
    title: 'Fußballabend mit Freunden',
    text: <>Für einen Fußballabend zu Hause: Zuerst den <span className="text-primary/90">Spielplan prüfen</span>. Große Spiele in der Mitte, davor und danach kleinere Partien mit Gesprächen – so wird jeder zufrieden.</>,
  },
  {
    icon: Goal,
    title: 'Abstiegskampf nicht vergessen',
    text: <>Nicht nur die Spitze, auch <span className="text-[#e50914]/90">Abstiegskämpfe</span> lohnen einen Blick. Den Spielplan als Ganzes zu sehen, hilft, die Liga besser zu verstehen.</>,
  },
];

const MatchScheduleSeoSectionDE = () => (
  <section className="mt-20 pt-14 border-t border-slate-800/70" aria-labelledby="seo-section-title-de">
    <div className="flex items-center gap-3 mb-4">
      <div className="h-9 w-9 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center">
        <Sparkles className="w-4 h-4 text-primary" />
      </div>
      <h2
        id="seo-section-title-de"
        className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-[#e50914] via-white/85 to-[#b20710] bg-clip-text text-transparent"
      >
        Spielplan clever nutzen – Ihren Fußballtag planen
      </h2>
    </div>

    <p className="text-slate-200 leading-relaxed mb-10 text-sm sm:text-base">
      Die folgende Anleitung zeigt, wie Sie die <span className="text-primary/90 font-semibold">Spielplanseite</span> nicht nur nutzen, um zu sehen, wann welches Spiel läuft, sondern um Ihren ganzen Tag <span className="text-amber-200/90">fußballorientiert zu planen</span>. Wenn Sie den Spielplan richtig lesen, verpassen Sie weniger Spiele und genießen die, die Sie schauen, umso mehr.
    </p>

    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 mb-12">
      {HIGHLIGHT_CARDS.map((item, i) => (
        <article
          key={i}
          className="bg-[#0a0a0a]/60 rounded-2xl p-5 border border-slate-800/80 hover:border-primary/60 hover:bg-[#0a0a0a]/90 transition-colors"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="shrink-0 w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center">
              <item.icon className="w-4 h-4 text-primary" />
            </div>
            <h3 className="text-sm font-semibold text-slate-50">{item.title}</h3>
          </div>
          <p className="text-[13px] text-slate-200 leading-relaxed">{item.text}</p>
        </article>
      ))}
    </div>

    <div className="bg-[#0a0a0a]/70 rounded-3xl border border-slate-800/80 px-5 py-6 sm:px-7 sm:py-8 space-y-4">
      {LONG_PARAGRAPHS.map((p, idx) => (
        <p
          key={idx}
          className={
            idx === 0
              ? 'text-slate-100 text-sm sm:text-[15px] leading-relaxed font-medium'
              : 'text-slate-200 text-sm sm:text-[15px] leading-relaxed'
          }
        >
          {highlightText(p, PARAGRAPH_HIGHLIGHTS[idx] || [])}
        </p>
      ))}
    </div>

    <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <p className="text-slate-300 text-sm leading-relaxed">
        Wenn Sie Ihre Spieltage <span className="text-primary/90">geplanter und angenehmer</span> verbringen möchten, ist der Spielplan ein guter Start – den Tag in wenigen Minuten organisieren.
      </p>
      <Link
        to="/de/pakete"
        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#e50914] to-[#b20710] hover:from-[#e50914] hover:to-[#e50914] text-white text-sm font-medium shadow-lg shadow-primary/40"
      >
        <Trophy className="w-4 h-4" />
        Pakete ansehen
      </Link>
    </div>
  </section>
);

export default MatchScheduleSeoSectionDE;
