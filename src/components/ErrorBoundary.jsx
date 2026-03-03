
import React from 'react';
import { AlertTriangle, RefreshCw, Home, Terminal, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { checkOnlineStatus } from '@/utils/networkConnectivity';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null, isOffline: !checkOnlineStatus() };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo, isOffline: !checkOnlineStatus() });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null, isOffline: !checkOnlineStatus() });
    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      const isNetworkError = this.state.isOffline || this.state.error?.message?.toLowerCase().includes('fetch');
      
      return (
        <div className="min-h-[50vh] flex items-center justify-center p-6 animate-in fade-in duration-300 w-full">
          <Card className="w-full max-w-lg bg-slate-900 border-red-900/50 shadow-2xl">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mb-4 border border-red-900/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                {isNetworkError ? <WifiOff className="w-8 h-8 text-orange-500" /> : <AlertTriangle className="w-8 h-8 text-red-500" />}
              </div>
              <CardTitle className="text-xl text-white">
                {isNetworkError ? 'Bağlantı Hatası' : 'Bir Hata Oluştu'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center text-slate-400 text-sm">
                {isNetworkError 
                  ? 'İnternet bağlantınız kopmuş veya sunucuya ulaşılamıyor olabilir.' 
                  : 'Beklenmedik bir sorunla karşılaştık. Aşağıdaki hata detaylarını teknik ekibe iletebilirsiniz.'}
              </div>
              
              {this.state.error && import.meta.env.DEV && (
                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-left relative group">
                  <div className="flex items-center gap-2 mb-2 text-red-400 text-xs font-bold uppercase tracking-wider">
                    <Terminal className="w-3 h-3" />
                    Hata Logu (Sadece Geliştirme)
                  </div>
                  <div className="overflow-auto max-h-40 custom-scrollbar">
                    <p className="text-red-300 font-mono text-xs break-all leading-relaxed">
                      {this.state.error.friendlyMessage || this.state.error.toString()}
                    </p>
                    {this.state.errorInfo && (
                        <pre className="text-slate-500 font-mono text-[10px] mt-2 whitespace-pre-wrap">
                            {this.state.errorInfo.componentStack}
                        </pre>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button 
                onClick={this.handleReset} 
                className="w-full bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/20"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Yeniden Dene
              </Button>
              <Button 
                variant="outline" 
                onClick={this.handleGoHome}
                className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                <Home className="w-4 h-4 mr-2" />
                Ana Sayfaya Dön
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
