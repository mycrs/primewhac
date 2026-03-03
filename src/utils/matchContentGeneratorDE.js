import { slugify } from './matchSlug';

const TAGE = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
const LIGA_KONTEXT = {
  'Süper Lig': ['In der spannendsten Liga der Türkei', 'Im Programm der Süper Lig diese Woche', 'In der türkischen Spitzenliga'],
  'Premier Lig': ['In Englands prestigeträchtigster Liga', 'In der Premier League diese Woche', 'In der meistgesehenen Fußballliga der Welt'],
  'La Liga': ['In Spaniens höchster Spielklasse', 'In La Liga diese Woche', 'Im Herzen des spanischen Fußballs'],
  'Şampiyonlar Ligi': ['Im größten europäischen Pokalwettbewerb', 'In der UEFA Champions League', 'Im kontinentalen Wettbewerb'],
  'Bundesliga': ['In Deutschlands höchster Liga', 'In der Bundesliga diese Woche', 'An der Spitze des deutschen Fußballs'],
  'Serie A': ['In Italiens höchster Spielklasse', 'In der Serie A diese Woche', 'Im Herzen des italienischen Fußballs'],
};

const DERBY_MANNSCHAFTEN = [
  ['galatasaray', 'fenerbahce'], ['galatasaray', 'besiktas'], ['fenerbahce', 'besiktas'],
  ['trabzonspor', 'galatasaray'], ['trabzonspor', 'fenerbahce'],
  ['real madrid', 'barcelona'], ['barcelona', 'real madrid'],
  ['liverpool', 'man utd'], ['man utd', 'man city'],
  ['bayern', 'dortmund'], ['b-dortmund', 'bayern'],
  ['inter', 'ac milan'], ['ac milan', 'inter'],
  ['arsenal', 'chelsea'], ['spurs', 'arsenal'],
];

function isDerby(home, away) {
  const h = slugify(home).toLowerCase();
  const a = slugify(away).toLowerCase();
  return DERBY_MANNSCHAFTEN.some(([x, y]) =>
    (h.includes(x) || x.includes(h)) && (a.includes(y) || y.includes(a))
  );
}

function pickIndex(str, max) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h % max;
}

const BLOECKE = {
  einleitung: [
    (h, a, lig, tag) => `${h} und ${a} treffen am ${tag} in der ${lig} aufeinander. Dieses Spiel zählt zu den wichtigsten Begegnungen der Saison. Während die Fans die Leistung beider Teams gespannt verfolgen, steigt die Vorfreude. ${h} geht mit Heimvorteil auf den Platz, ${a} bereitet sich auf die Auswärtsherausforderung vor. Beide Teams zielen auf drei Punkte; dieses Spiel kann für die Tabelle entscheidend sein.`,
    (h, a, lig, tag) => `Am ${tag} steht das ${lig}-Spiel ${h} gegen ${a} im Mittelpunkt. Zwei traditionsreiche Vereine liefern sich ein packendes Duell. Die Vorberichte konzentrieren sich auf Form, Verletzungen und Taktik. Die Fans von ${h} sind bereit, ihr Team zu unterstützen. ${a} hofft auf Auswärtspunkte. Beide Mannschaften haben eine große Fangemeinde.`,
    (h, a, lig, tag) => `${h} und ${a} bestreiten am ${tag} ihr ${lig}-Spiel. Dieses Duell verspricht Spannung. Beide Teams wollen in der Tabelle nach oben. Die Stimmung steigt. Heimvorteil trifft auf Auswärtsstärke. Neunzig Minuten intensiver Fußball werden erwartet.`,
    (h, a, lig, tag) => `Der Spielplan ist für ${tag} gesetzt: ${h} empfängt ${a} in der ${lig}. Beide Teams haben sich speziell auf dieses Spiel vorbereitet. ${h} nutzt den Rückhalt der Fans; ${a} muss sich in schwieriger Atmosphäre beweisen. Für Tabelle und Selbstvertrauen ist das Ergebnis von großer Bedeutung.`,
  ],
  ligaBedeutung: [
    (lig) => `Die ${lig} zählt zu den meistverfolgten Ligen Europas und der Welt. Jedes Spiel zieht lokale und internationale Zuschauer an. Form, Tabelle und Titelkampf bestimmen wöchentlich die Schlagzeilen. Spiele finden meist am Wochenende oder unter der Woche abends statt. Übertragungsrechte liegen bei Sportkanälen und digitalen Plattformen. Der Wettbewerb nimmt von Saison zu Saison zu.`,
    (lig) => `In der ${lig} herrscht diese Saison Spannung. Jede Woche werden entscheidende Spiele ausgetragen. Fans verfolgen Form, Verletzungen und Taktik. Am Spieltag wünschen sich Zuschauer ein klares Bild und geringe Verzögerung. Vorberichte und Analysen bereiten die Partie vor. Ligaspiele konzentrieren sich auf Samstag und Sonntag.`,
  ],
  mannschaften: [
    (h, a) => `${h} und ${a} sind traditionsreiche Vereine. Die Duelle zwischen beiden Teams erzeugen stets großes Interesse. Die Heimmannschaft profitiert von der Unterstützung der Fans; die Gäste sind an schwierige Auswärtsatmosphären gewöhnt. Das Ergebnis ist schwer vorherzusagen. Beide Fangruppen wollen live dabei sein.`,
    (h, a) => `In dieser Partie tritt ${h} als Gastgeber an. ${a} kämpft um Auswärtspunkte. Beide Teams haben Stärken und Schwächen. Die Fans tippen, die Trainer bereiten die Taktik vor. Heimvorteil und Auswärtsdruck prallen aufeinander.`,
    (h, a) => `${h} möchte zu Hause überzeugen. ${a} ist an Auswärtsdruck gewöhnt. Beide haben eine treue Fangemeinde. Am Spieltag herrscht großes Interesse. Die ersten Minuten werden aufmerksam beobachtet.`,
  ],
  derby: [
    (h, a) => `Ein Derby: Die Spiele zwischen ${h} und ${a} haben durch die historische Rivalität und Leidenschaft der Fans stets besondere Bedeutung. Bei Derby-Partien vervielfacht sich die Spannung. Jedes Tor, jede Aktion erzeugt große Resonanz. Die Stadien sind voll, die Zuschauerzahlen brechen Rekorde. Selbst kleinere Schiedsrichterentscheidungen werden lange diskutiert.`,
    (h, a) => `Derby-Stimmung am Spieltag: ${h} gegen ${a} – zwei Erzrivalen. Bei solchen Partien ist die Prognose schwierig; Form, Verletzungen und Tagesform entscheiden. Choreografien und Gesänge heizen die Atmosphäre an. Jeder Moment kann überraschend sein.`,
  ],
  tagKontext: [
    (tag) => `Spiele am ${tag} gehören zum Wochenendprogramm. Familien und Freundesgruppen versammeln sich vor dem Bildschirm. Nachmittags- und Abendspiele erreichen die höchsten Zuschauerzahlen. Snacks werden vorbereitet, Taktik wird diskutiert. ${tag}-Spiele werden geplant; Zuschauer bereiten sich Stunden vorher vor.`,
    (tag) => `Der ${tag}-Spielplan hat für Fußballfans besondere Bedeutung. Nach Arbeit und Schule ist das Spiel ein fester Bestandteil. Manche schauen allein, andere in der Gruppe. ${tag}-Spiele werden zu einem sozialen Ereignis.`,
  ],
  uebertragung: [
    () => `Das Live-Erlebnis hängt von Bildqualität und Übertragungsstabilität ab. Ruckeln, Verzögerung oder Abbruch frustrieren Zuschauer. Moderne Technik ermöglicht hochauflösende und verzögerungsarme Übertragungen. Jeden Moment klar und flüssig zu sehen, ist besonders bei entscheidenden Szenen wichtig. Tore und Elfmeter live zu verfolgen, ist die Erwartung der Fans.`,
    () => `Ruckeln und Verzögerung sind die größten Feinde beim Spiel. Ein verspätetes Tor oder Abbruch kann frustrierend sein. Zuschauer bevorzugen Anbieter mit starker Infrastruktur. Lastverteilung und Server-Optimierung sichern die Qualität. Eine stabile Verbindung ist am Spieltag entscheidend.`,
  ],
  kanal: [
    (lig) => `Spiele der ${lig} werden in der Regel von Sportkanälen übertragen. Welches Spiel auf welchem Sender läuft, steht im wöchentlichen Programm. Digitale Plattformen bieten ebenfalls Sportübertragungen. In der Kanalliste finden Sie Ihr Spiel schnell. Die Rechte werden zu Saisonbeginn vergeben.`,
    (lig) => `Am Spieltag herrscht auf den Sportkanälen Hochbetrieb. Bei mehreren parallelen Spielen laufen verschiedene Partien auf verschiedenen Sendern. Zuschauer wählen nach Programm. Sportkanäle, nationale und internationale Sender übertragen gleichzeitig. Der Senderwechsel ist schnell – wichtige Momente können verfolgt werden.`,
  ],
  iptv: [
    () => `IPTV bietet als Alternative zu Satellit und Kabel Fernsehen über das Internet. Mit einem Abo erhalten Sie Zugang zu tausenden Kanälen, Filmen und Serien. Sportkanäle sind besonders gefragt; am Spieltag ist eine stabile Infrastruktur wichtig. Apps für verschiedene Geräte ermöglichen flexibles Schauen.`,
    () => `IPTV bietet breite Kanallandschaft, hohe Bildqualität und 24/7-Zugang. Wer beim Spiel kein Ruckeln erleben möchte, wählt Anbieter mit starker Server-Infrastruktur. Smart TV, Android, iOS oder PC – ein Abo reicht für alle Geräte.`,
  ],
  primewatch: [
    () => `PrimeWatch TV ist ein IPTV-Anbieter für Nutzer in Europa. Sportkanäle, Filme, Serien, Live-TV und Video-on-Demand sind in einem Abo enthalten. Das Ziel ist eine stabile und unterbrechungsfreie Erfahrung, besonders an Spieltagen. Verschiedene Pakete decken unterschiedliche Bedürfnisse ab.`,
    () => `PrimeWatch TV bietet eine umfangreiche Kanalliste und technischen Support. Für Fußballfans steht die stabile Übertragung der Sportkanäle im Vordergrund. Infrastruktur und Server-Optimierung sollen Ruckeln und Verzögerung minimieren.`,
  ],
  spielVorher: [
    (h, a) => `Vorberichte deuten auf ein spannendes Spiel zwischen ${h} und ${a} hin. Beide Teams zielen auf drei Punkte. Form, Verletzungen und Taktik beeinflussen den Spielverlauf. Fans warten gespannt; in den sozialen Medien werden Prognosen geteilt. Trainer halten sich mit taktischen Details zurück.`,
    (h, a) => `${h} profitiert von der Unterstützung der Heimfans. ${a} ist an schwierige Auswärtsatmosphären gewöhnt. In Pressekonferenzen geben Trainer allgemeine Einblicke; Details bleiben geheim. Die Spannung steigt mit dem nahenden Anpfiff.`,
  ],
  historie: [
    (h, a) => `Die Duelle zwischen ${h} und ${a} waren historisch stets eng. Beide Fangruppen messen diesen Partien große Bedeutung bei. Die letzten Jahre brachten ausgeglichene Ergebnisse. Die Rivalität hat sich über die Jahre vertieft.`,
    (h, a) => `Die Rivalität zwischen ${h} und ${a} reicht Jahre zurück. Die Spiele erzeugen stets großes Interesse. Historische Ergebnisse wechseln zwischen Heim- und Auswärtssiegen. Die Stadien sind bei diesen Partien meist ausverkauft.`,
  ],
  sendung: [
    () => `Spielübertragungen werden meist in Full HD angeboten; manche Partien auch in 4K. Die Rechte werden zu Saisonbeginn vergeben. Ob Sportkanäle im Abo enthalten sind, beeinflusst die Wahl der Zuschauer. Vorberichte und Analysen laufen auf denselben Sendern.`,
    () => `Bei Live-Übertragungen wird die Verzögerung minimiert. Ein verspätetes Tor frustriert Fans. Die Qualität reicht von 720p bis 4K; sie passt sich der Internetgeschwindigkeit an. Vor- und Nachberichte analysieren die taktischen Aspekte.`,
  ],
  formTaktik: [
    (h, a) => `${h} zeigte in den letzten Wochen wechselhafte Ergebnisse; ${a} strebt Stabilität in der Tabelle an. Die letzten fünf Spiele beider Teams beeinflussen die Partie. Heimresultate stärken das Selbstvertrauen; Auswärtspunkte motivieren die Gäste.`,
    (h, a) => `${h} zeigte in Teilen der Saison starke Leistungen, hatte aber auch defensive Schwächen. ${a} überzeugte besonders gegen starke Gegner. Welches Team die Oberhand behält, kann für den Rest der Saison entscheidend sein.`,
  ],
  taktik: [
    (h, a) => `${h} spielt oft ballbesitzorientiert und mit hohem Druck. ${a} setzt auf kompakte Verteidigung und schnelle Konter. Diese unterschiedlichen Spielweisen können die Partie prägen. Das Mittelfeldduell und die Flügelorganisation werden entscheidend sein.`,
    (h, a) => `Der Trainer von ${h} setzt auf kreative Offensivspieler. ${a} plant defensiv diszipliniert und konterorientiert. Taktische Anpassungen und Wechsel sind zu erwarten. Standardsituationen können den Spielverlauf beeinflussen.`,
  ],
  schluss: [
    () => `Stellen Sie Ihren Spielplan rechtzeitig ein. Ob allein oder mit Freunden – genießen Sie neunzig Minuten Spannung. Prüfen Sie Übertragungsoptionen und Sender vor dem Spiel. Viel Spaß beim Zuschauen.`,
    () => `Das Schöne am Fußball ist, dass jedes Spiel eine neue Geschichte schreibt. Der Kampf auf dem Platz, die Leidenschaft der Fans und unerwartete Momente machen das Spiel einzigartig. Viel Spaß beim Zuschauen.`,
  ],
};

export function generateMatchContentDE(match) {
  const { home, away, league, date } = match;
  const ligaName = league?.name || 'Liga';
  const ligaOpts = LIGA_KONTEXT[ligaName] || [ligaName + ' Programm', ligaName + ' diese Woche'];
  const ligaCtx = ligaOpts[pickIndex(home + away, ligaOpts.length)];
  const [y, m, d] = (date || '').split('-').map(Number);
  const tag = (y && m && d) ? TAGE[new Date(y, m - 1, d).getDay()] : 'Diese Woche';
  const derby = isDerby(home, away);
  const seed = `${home}-${away}-${date}`;

  const paragraphs = [];
  const pick = (key, list) => list[pickIndex(seed + key, list.length)];

  paragraphs.push(pick('g', BLOECKE.einleitung)(home, away, ligaCtx, tag));

  const useLiga = pickIndex(seed + 'lt', 2) === 0;
  if (useLiga) {
    paragraphs.push(pick('l', BLOECKE.ligaBedeutung)(ligaName));
  } else {
    paragraphs.push(pick('r', BLOECKE.historie)(home, away));
  }

  paragraphs.push(pick('t', BLOECKE.mannschaften)(home, away));

  if (derby) {
    paragraphs.push(pick('d', BLOECKE.derby)(home, away));
  }

  paragraphs.push(pick('f', BLOECKE.formTaktik)(home, away));
  paragraphs.push(pick('x', BLOECKE.taktik)(home, away));

  const useSpielVorher = pickIndex(seed + 'm', 2) === 0;
  const useTagKontext = pickIndex(seed + 'b', 2) === 0 || !useSpielVorher;
  if (useSpielVorher) {
    paragraphs.push(pick('m', BLOECKE.spielVorher)(home, away));
  }
  if (useTagKontext) {
    paragraphs.push(pick('b', BLOECKE.tagKontext)(tag));
  }

  paragraphs.push(pick('i', BLOECKE.uebertragung)());
  const useKanal = pickIndex(seed + 'k', 3) !== 0;
  const useSendung = pickIndex(seed + 'y', 3) !== 1;
  if (useKanal) {
    paragraphs.push(pick('k', BLOECKE.kanal)(ligaName));
  }
  if (useSendung) {
    paragraphs.push(pick('y', BLOECKE.sendung)());
  }

  if (pickIndex(seed + 'p', 4) === 0) {
    paragraphs.push(pick('p', BLOECKE.iptv)());
  }
  if (pickIndex(seed + 'q', 5) === 0) {
    paragraphs.push(pick('q', BLOECKE.primewatch)());
  }

  paragraphs.push(pick('c', BLOECKE.schluss)());

  const fullText = paragraphs.join(' ');
  const wordCount = fullText.split(/\s+/).filter(Boolean).length;

  return { paragraphs, isDerbi: derby, wordCount };
}
