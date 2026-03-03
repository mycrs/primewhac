import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Tv, Zap, Shield, Users, CheckCircle2, Star } from 'lucide-react';

const HomePageSeoContentDE = () => {
  return (
    <div className="container mx-auto px-4 py-16 text-slate-300 leading-relaxed">
      <article className="max-w-5xl mx-auto">
        
        <header className="mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Premium IPTV Deutschland – Stabile Streams in <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">4K Qualität</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Erleben Sie das beste IPTV-Erlebnis in Deutschland mit kristallklarer Bildqualität, stabilen Verbindungen und über 10.000 Premium-Kanälen. Ihr verlässlicher Partner für hochwertiges Internet-Fernsehen.
          </p>
        </header>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
            <Tv className="w-8 h-8 text-purple-500" />
            Warum IPTV Deutschland die beste Wahl ist
          </h2>
          
          <div className="prose prose-invert max-w-none mb-8">
            <p className="text-lg mb-6">
              In der heutigen digitalen Welt ist <strong>IPTV Deutschland</strong> längst zur bevorzugten Alternative zum traditionellen Kabelfernsehen geworden. Immer mehr Haushalte entscheiden sich für flexibles Internet-Fernsehen, das nicht nur kostengünstiger ist, sondern auch deutlich mehr Funktionen und Inhalte bietet. Bei uns erhalten Sie Zugang zu einem <strong>Premium IPTV Anbieter</strong>, der höchste Qualitätsstandards erfüllt und Ihnen ein unvergleichliches Seherlebnis garantiert.
            </p>
            
            <p className="text-lg mb-6">
              Unsere IPTV-Lösung wurde speziell für den deutschen Markt entwickelt und berücksichtigt die Bedürfnisse deutscher Zuschauer. Sie profitieren von einer umfangreichen Auswahl an deutschen TV-Sendern, internationalen Kanälen sowie exklusiven Sport- und Entertainment-Programmen. Dabei legen wir besonderen Wert auf technische Exzellenz und Kundenzufriedenheit.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Zap className="w-6 h-6 text-purple-500" />
                Stabile IPTV ohne Unterbrechung
              </h3>
              <p className="text-slate-400 mb-4">
                Eine <strong>stabile IPTV</strong>-Verbindung ist das A und O für unterbrechungsfreien Fernsehgenuss. Unsere hochmodernen Server-Infrastrukturen in Deutschland und Europa garantieren Ihnen eine durchgehend stabile Übertragung ohne lästiges Ruckeln oder Buffering. Wir setzen auf redundante Systeme und intelligente Lastverteilung, sodass Sie auch zu Stoßzeiten mit erstklassiger Streaming-Qualität rechnen können.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-purple-500 mt-0.5 shrink-0" />
                  <span>99,9% Verfügbarkeit durch redundante Server</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-purple-500 mt-0.5 shrink-0" />
                  <span>Automatische Fehlerkorrektur in Echtzeit</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-purple-500 mt-0.5 shrink-0" />
                  <span>Optimierte Verbindung zu deutschen Internetanbietern</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Star className="w-6 h-6 text-purple-500" />
                4K IPTV für ultimatives Seherlebnis
              </h3>
              <p className="text-slate-400 mb-4">
                Tauchen Sie ein in die Welt der Ultra-HD-Unterhaltung! Unser <strong>4K IPTV</strong> Service bietet Ihnen gestochen scharfe Bilder mit viermal höherer Auflösung als Full HD. Genießen Sie Ihre Lieblingssendungen, Filme und Sportereignisse in atemberaubender Bildqualität. Ob auf Ihrem Smart TV, Tablet oder Smartphone – unsere adaptive Streaming-Technologie passt die Qualität automatisch an Ihre Internetgeschwindigkeit und Ihr Gerät an.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-purple-500 mt-0.5 shrink-0" />
                  <span>Ultra HD Auflösung bis zu 4K (2160p)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-purple-500 mt-0.5 shrink-0" />
                  <span>HDR-Unterstützung für brillante Farben</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-purple-500 mt-0.5 shrink-0" />
                  <span>Adaptive Bitrate für optimale Qualität</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
            <Shield className="w-8 h-8 text-purple-500" />
            Premium IPTV Anbieter – Was uns auszeichnet
          </h2>

          <div className="prose prose-invert max-w-none mb-8">
            <p className="text-lg mb-6">
              Als etablierter <strong>Premium IPTV Anbieter</strong> in Deutschland stehen wir für Qualität, Zuverlässigkeit und exzellenten Kundenservice. Wir verstehen, dass Sie mehr erwarten als nur eine große Kanalauswahl – Sie wünschen sich ein rundum sorgloses Fernseherlebnis. Genau das bieten wir Ihnen mit unserem umfassenden Service-Paket.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-xl border border-slate-700 hover:border-purple-500 transition-all">
              <h3 className="text-xl font-bold text-white mb-4">Umfangreiches Kanalangebot</h3>
              <p className="text-slate-400 mb-4">
                Über 10.000 Live-TV-Kanäle aus aller Welt stehen Ihnen zur Verfügung. Von deutschen öffentlich-rechtlichen und privaten Sendern über internationale Nachrichten- und Sportkanäle bis hin zu exklusiven Premium-Inhalten – bei uns finden Sie garantiert Ihr Lieblingsprogramm. Zusätzlich bieten wir Ihnen Zugriff auf über 50.000 Filme und Serien on demand.
              </p>
              <Link to="/channels" className="text-purple-400 hover:text-purple-300 font-semibold inline-flex items-center gap-2">
                Kanalliste ansehen →
              </Link>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-xl border border-slate-700 hover:border-purple-500 transition-all">
              <h3 className="text-xl font-bold text-white mb-4">Zuverlässiger Kundenservice</h3>
              <p className="text-slate-400 mb-4">
                Unser deutschsprachiges Support-Team steht Ihnen 24 Stunden am Tag, 7 Tage die Woche zur Verfügung. Egal ob Sie Fragen zur Installation haben, technische Unterstützung benötigen oder Hilfe bei der Konfiguration Ihrer Geräte – wir sind für Sie da. Per WhatsApp, E-Mail oder Telefon erreichen Sie uns jederzeit schnell und unkompliziert.
              </p>
              <Link to="/sss" className="text-purple-400 hover:text-purple-300 font-semibold inline-flex items-center gap-2">
                Häufige Fragen →
              </Link>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-xl border border-slate-700 hover:border-purple-500 transition-all">
              <h3 className="text-xl font-bold text-white mb-4">Sichere und legale Nutzung</h3>
              <p className="text-slate-400 mb-4">
                Ihre Sicherheit und Privatsphäre haben für uns oberste Priorität. Wir arbeiten ausschließlich mit lizenzierten Inhaltsanbietern zusammen und gewährleisten eine rechtskonforme Nutzung. Alle Datenübertragungen sind verschlüsselt, und wir speichern keine sensiblen Nutzerdaten. So können Sie unser <strong>IPTV ohne Unterbrechung</strong> und Sorgen genießen.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16 bg-gradient-to-br from-purple-900/20 to-slate-900/50 p-8 md:p-12 rounded-2xl border border-purple-500/30">
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
            <Users className="w-8 h-8 text-purple-500" />
            IPTV kaufen – Einfach und sicher
          </h2>

          <div className="prose prose-invert max-w-none">
            <p className="text-lg mb-6">
              Sie möchten <strong>IPTV kaufen</strong> und fragen sich, wie der Bestellprozess abläuft? Bei uns ist der Einstieg ins Premium-Fernsehen denkbar einfach. Wählen Sie zunächst das für Sie passende Paket aus – ob 1-Monats-Abonnement zum Testen oder langfristige Pakete mit attraktiven Rabatten. Unser transparentes Preissystem ohne versteckte Kosten sorgt für volle Kostenkontrolle.
            </p>

            <div className="grid md:grid-cols-2 gap-6 my-8">
              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-white">Der Kaufprozess in 4 Schritten:</h4>
                <ol className="space-y-3 list-none">
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center font-bold">1</span>
                    <div>
                      <strong className="text-white">Paket wählen:</strong> Entscheiden Sie sich für ein Abonnement, das zu Ihren Bedürfnissen passt
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center font-bold">2</span>
                    <div>
                      <strong className="text-white">Sicher bezahlen:</strong> Nutzen Sie eine unserer vielen sicheren Zahlungsmethoden
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center font-bold">3</span>
                    <div>
                      <strong className="text-white">Zugangsdaten erhalten:</strong> Sie erhalten sofort per E-Mail Ihre Login-Daten
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center font-bold">4</span>
                    <div>
                      <strong className="text-white">Sofort starten:</strong> Installieren Sie die App und genießen Sie IPTV in bester Qualität
                    </div>
                  </li>
                </ol>
              </div>

              <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700">
                <h4 className="text-xl font-semibold text-white mb-4">Sichere Zahlungsmethoden</h4>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span>Kreditkarte (Visa, Mastercard)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span>PayPal für maximale Sicherheit</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span>Sofortüberweisung</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span>Kryptowährungen akzeptiert</span>
                  </li>
                </ul>
                <p className="text-sm text-slate-400 mt-4">
                  Alle Zahlungen sind SSL-verschlüsselt und entsprechen den höchsten Sicherheitsstandards.
                </p>
              </div>
            </div>

            <p className="text-lg mb-6">
              Nach erfolgreichem Kauf erhalten Sie innerhalb weniger Minuten Ihre persönlichen Zugangsdaten per E-Mail. Diese können Sie auf beliebig vielen Geräten gleichzeitig nutzen – je nach gewähltem Paket. Unsere detaillierte Installationsanleitung hilft Ihnen dabei, IPTV auf Smart TVs, Smartphones, Tablets, Fire TV Sticks oder anderen kompatiblen Geräten einzurichten. <Link to="/kurulum" className="text-purple-400 hover:text-purple-300 font-semibold">Zur Installationsanleitung →</Link>
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Unsere IPTV Pakete für Deutschland</h2>
          
          <div className="prose prose-invert max-w-none mb-8">
            <p className="text-lg text-center mb-6">
              Wir bieten flexible Abonnement-Optionen für jeden Bedarf und jedes Budget. Alle unsere Pakete beinhalten den vollen Zugriff auf unser komplettes Programmangebot ohne Einschränkungen. <strong>Entdecken Sie unsere Pakete jetzt</strong> und finden Sie das perfekte Angebot für Ihr Fernseherlebnis.
            </p>
          </div>

          <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 p-8 rounded-2xl border border-purple-500/50 text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-4">Bereit für Premium IPTV?</h3>
            <p className="text-lg text-slate-300 mb-6 max-w-2xl mx-auto">
              <strong>Wählen Sie Ihr Paket</strong> und starten Sie noch heute mit dem besten IPTV-Erlebnis in Deutschland. Von monatlichen Testpaketen bis zu 12-Monats-Abonnements mit bis zu 40% Rabatt – bei uns finden Sie garantiert das richtige Angebot.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/paketler" 
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-purple-500/50"
              >
                Jetzt IPTV kaufen →
              </Link>
              <Link 
                to="/test" 
                className="inline-flex items-center justify-center px-8 py-4 bg-slate-700 text-white font-bold rounded-xl hover:bg-slate-600 transition-all"
              >
                Kostenlos testen
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
              <h4 className="text-lg font-bold text-white mb-3">Alle Pakete beinhalten:</h4>
              <ul className="space-y-2 text-slate-400">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-purple-500 mt-0.5 shrink-0" />
                  <span>Über 10.000 Live-TV-Kanäle</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-purple-500 mt-0.5 shrink-0" />
                  <span>50.000+ Filme und Serien</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-purple-500 mt-0.5 shrink-0" />
                  <span>4K/HD/SD Qualitätsoptionen</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-purple-500 mt-0.5 shrink-0" />
                  <span>EPG (Elektronischer Programmguide)</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
              <h4 className="text-lg font-bold text-white mb-3">Gerätekompatibilität:</h4>
              <ul className="space-y-2 text-slate-400">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-purple-500 mt-0.5 shrink-0" />
                  <span>Smart TV (Samsung, LG, Sony)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-purple-500 mt-0.5 shrink-0" />
                  <span>Android TV / Fire TV Stick</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-purple-500 mt-0.5 shrink-0" />
                  <span>iOS und Android Smartphones</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-purple-500 mt-0.5 shrink-0" />
                  <span>Windows und Mac Computer</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
              <h4 className="text-lg font-bold text-white mb-3">Service & Support:</h4>
              <ul className="space-y-2 text-slate-400">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-purple-500 mt-0.5 shrink-0" />
                  <span>24/7 deutschsprachiger Support</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-purple-500 mt-0.5 shrink-0" />
                  <span>Schnelle Hilfe per WhatsApp</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-purple-500 mt-0.5 shrink-0" />
                  <span>Umfangreiche Anleitungen</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-purple-500 mt-0.5 shrink-0" />
                  <span>Regelmäßige Updates</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <footer className="text-center pt-8 border-t border-slate-800">
          <p className="text-slate-500 text-sm">
            Dieser SEO-optimierte Inhalt wurde speziell für <strong>IPTV Deutschland</strong> erstellt, um Ihnen alle wichtigen Informationen über unseren Premium IPTV Service zu bieten. Profitieren Sie von stabilen Verbindungen, 4K-Qualität und über 10.000 Kanälen.
          </p>
        </footer>

      </article>
    </div>
  );
};

export default memo(HomePageSeoContentDE);