import React from 'react';
import { AlertTriangle, RefreshCw, Home, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { checkOnlineStatus } from '@/utils/networkConnectivity';

function resolveLocale(propLocale) {
  if (propLocale === 'de' || propLocale === 'tr') return propLocale;
  if (typeof window !== 'undefined' && window.location?.pathname?.startsWith('/de')) return 'de';
  return 'tr';
}

const COPY = {
  tr: {
    headline: 'Bu sayfa yüklenemedi — Ana Sayfaya Dön',
    offlineHint: 'İnternet bağlantınızı kontrol edip tekrar deneyebilirsiniz.',
    genericHint: 'Bir sorun oluştu. Sayfayı yenileyebilir veya ana sayfaya dönebilirsiniz.',
    retry: 'Tekrar Dene',
    home: 'Ana Sayfaya Dön',
    offlineTitle: 'Bağlantı sorunu',
  },
  de: {
    headline: 'Diese Seite konnte nicht geladen werden — Zur Startseite',
    offlineHint: 'Bitte prüfen Sie Ihre Internetverbindung und versuchen Sie es erneut.',
    genericHint: 'Es ist ein Problem aufgetreten. Sie können die Seite neu laden oder zur Startseite gehen.',
    retry: 'Erneut versuchen',
    home: 'Zur Startseite',
    offlineTitle: 'Verbindungsproblem',
  },
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null, isOffline: !checkOnlineStatus() };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary] Caught error:', error);
    if (error?.stack) console.error('[ErrorBoundary] error.stack:', error.stack);
    console.error('[ErrorBoundary] componentStack:', errorInfo?.componentStack);
    this.setState({ errorInfo, isOffline: !checkOnlineStatus() });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    const locale = resolveLocale(this.props.locale);
    window.location.href = locale === 'de' ? '/de' : '/';
  };

  render() {
    if (this.state.hasError) {
      const locale = resolveLocale(this.props.locale);
      const t = COPY[locale];
      const isNetworkError = this.state.isOffline || this.state.error?.message?.toLowerCase().includes('fetch');

      return (
        <div className="min-h-[50vh] flex items-center justify-center p-6 animate-in fade-in duration-300 w-full">
          <Card className="w-full max-w-lg bg-[#0a0a0a] border-red-900/50 shadow-2xl">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mb-4 border border-red-900/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                {isNetworkError ? <WifiOff className="w-8 h-8 text-orange-500" /> : <AlertTriangle className="w-8 h-8 text-red-500" />}
              </div>
              <CardTitle className="text-lg sm:text-xl text-white leading-snug">
                {isNetworkError ? t.offlineTitle : t.headline}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isNetworkError ? (
                <p className="text-center text-slate-400 text-sm">{t.offlineHint}</p>
              ) : (
                <>
                  <p className="text-center text-slate-400 text-sm">{t.genericHint}</p>
                  {import.meta.env.DEV && this.state.error?.message ? (
                    <pre className="mt-2 max-h-40 overflow-auto rounded-md bg-black/40 p-2 text-left text-xs text-red-300">
                      {this.state.error.message}
                    </pre>
                  ) : null}
                </>
              )}
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                type="button"
                onClick={this.handleReload}
                className="w-full bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/20"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                {t.retry}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={this.handleGoHome}
                className="w-full border-slate-700 text-slate-300 hover:bg-[#0a0a0a] hover:text-white"
              >
                <Home className="w-4 h-4 mr-2" />
                {t.home}
              </Button>
            </CardFooter>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
