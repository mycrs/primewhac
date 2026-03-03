
import React, { useState, useEffect } from 'react';
import { AlertTriangle, RefreshCw, ShieldAlert, LogIn, HardDrive, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { clearAllAuth } from '@/utils/clearAllAuth';
import AuthRecoveryManager from '@/utils/authRecoveryManager';
import TokenValidator from '@/utils/tokenValidator';
import { useNavigate } from 'react-router-dom';

const AuthErrorRecovery = ({ errorDetails, errorType, onRecover }) => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoverySuccess, setRecoverySuccess] = useState(false);
  const [cleanupReport, setCleanupReport] = useState(null);
  const [tokenReport, setTokenReport] = useState(null);

  useEffect(() => {
    let timer;
    if (countdown > 0 && !isRecovering && !recoverySuccess) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0 && !isRecovering && !recoverySuccess) {
      handleRetryLogin();
    }
    return () => clearInterval(timer);
  }, [countdown, isRecovering, recoverySuccess]);

  useEffect(() => {
    // Generate report on mount to show what's wrong
    setCleanupReport(AuthRecoveryManager.getReport());
    
    // If the error detail looks like a JWT token, attempt to parse it
    if (typeof errorDetails === 'string' && errorDetails.split('.').length === 3) {
      try {
        console.log('[AuthErrorRecovery] Attempting to parse token details for debugging');
        const report = TokenValidator.getDetailedClaimsReport(errorDetails);
        setTokenReport(report);
        console.log('[AuthErrorRecovery] Token analysis complete:', report);
      } catch (err) {
        console.error('[AuthErrorRecovery] Failed to analyze token details:', err);
        setTokenReport({ 
          isValid: false, 
          errorMessage: 'Failed to analyze token structure. The token might be severely corrupted.',
          missingClaims: []
        });
      }
    }
  }, [errorDetails]);

  const handleComprehensiveCleanup = async () => {
    setIsRecovering(true);
    try {
      console.log('[AuthErrorRecovery] Performing comprehensive cleanup...');
      AuthRecoveryManager.wipeAuthStorage();
      await clearAllAuth();
      
      setRecoverySuccess(true);
      setTimeout(() => {
        window.location.href = '/admin-login';
      }, 1500);
    } catch (e) {
      console.error('[AuthErrorRecovery] Cleanup failed', e);
      setIsRecovering(false);
    }
  };

  const handleHardReset = async () => {
    setIsRecovering(true);
    try {
      console.log('[AuthErrorRecovery] Performing hard reset...');
      AuthRecoveryManager.wipeAuthStorage();
      localStorage.clear();
      sessionStorage.clear();
      
      // Clear cookies
      document.cookie.split(";").forEach((c) => {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      
      setRecoverySuccess(true);
      setTimeout(() => {
        if (onRecover) onRecover();
        else window.location.href = '/admin-login';
      }, 1500);
    } catch (e) {
      console.error('[AuthErrorRecovery] Reset failed', e);
      setIsRecovering(false);
    }
  };

  const handleRetryLogin = async () => {
    setIsRecovering(true);
    try {
      AuthRecoveryManager.wipeAuthStorage();
      setRecoverySuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (e) {
      setIsRecovering(false);
    }
  };

  const handleManualLogin = () => {
    AuthRecoveryManager.wipeAuthStorage();
    window.location.href = '/admin-login';
  };

  const getSpecificErrorMessage = () => {
    if (errorType === 'network') return "Sunucuya ulaşılamıyor. Lütfen internet bağlantınızı kontrol edin.";
    if (errorType === 'token_cleaned' || String(errorDetails).includes('malformed')) return "Bozuk oturum verileri tespit edildi. Sistem otomatik olarak temizleniyor.";
    if (String(errorDetails).includes('expired')) return "Oturum süreniz dolmuş.";
    return "Tarayıcınızdaki oturum verilerinde bir yapısal sorun tespit edildi. Bu durum genellikle eksik veya geçersiz yetkilendirme kaynaklıdır.";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#05050A] p-4 text-slate-200">
      <div className="max-w-md w-full bg-slate-900 border border-red-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        {isRecovering && !recoverySuccess && (
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
            <RefreshCw className="w-10 h-10 text-purple-500 animate-spin mb-4" />
            <p className="text-white font-medium">Sistem kurtarılıyor...</p>
          </div>
        )}

        {recoverySuccess && (
          <div className="absolute inset-0 bg-emerald-900/90 z-10 flex flex-col items-center justify-center">
            <ShieldAlert className="w-12 h-12 text-emerald-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Başarılı!</h3>
            <p className="text-emerald-200 text-center px-4">Sistem temizlendi ve yetkilendirme sıfırlandı, yönlendiriliyorsunuz...</p>
          </div>
        )}

        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center shrink-0">
            <ShieldAlert className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Güvenlik Hatası</h2>
            <p className="text-sm text-slate-400">
              {countdown > 0 ? `${countdown} saniye içinde tekrar denenecek...` : 'Otomatik deneme yapılıyor...'}
            </p>
          </div>
        </div>

        <div className="bg-black/50 rounded-xl p-4 mb-6 text-sm border border-white/5">
          <p className="mb-2 font-medium text-slate-300">{getSpecificErrorMessage()}</p>
          
          {import.meta.env.DEV && errorDetails && !tokenReport && (
            <div className="mt-3 p-2 bg-red-950/30 text-red-400 font-mono text-[10px] rounded break-words max-h-32 overflow-y-auto">
              [DEV] Detail: {typeof errorDetails === 'string' ? errorDetails : JSON.stringify(errorDetails)}
            </div>
          )}

          {tokenReport && !tokenReport.isValid && (
            <div className="mt-3 p-3 bg-red-950/40 text-red-300 font-mono text-xs rounded border border-red-900/50">
              <p className="font-bold mb-1 border-b border-red-900/50 pb-1 text-red-400">Geçersiz Token Tespiti</p>
              <p className="mb-1">{tokenReport.errorMessage}</p>
              {tokenReport.missingClaims?.length > 0 && (
                <p>Eksik Veriler: <span className="text-white">{tokenReport.missingClaims.join(', ')}</span></p>
              )}
            </div>
          )}

          {cleanupReport && cleanupReport.corruptedFound > 0 && (
            <div className="mt-3 p-2 bg-yellow-950/30 text-yellow-400 font-mono text-[10px] rounded break-words">
              Tespit Edilen Bozuk Kayıtlar: {cleanupReport.corruptedFound}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <Button 
            onClick={handleRetryLogin}
            disabled={isRecovering}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-5 rounded-xl flex items-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Tekrar Dene
          </Button>

          <Button 
            onClick={handleComprehensiveCleanup}
            disabled={isRecovering}
            variant="outline"
            className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white py-5 rounded-xl flex items-center gap-2"
          >
            <Trash2 className="w-5 h-5 text-orange-400" />
            Yetkilendirme Verilerini Temizle
          </Button>
          
          <Button 
            onClick={handleHardReset}
            disabled={isRecovering}
            variant="ghost"
            className="w-full border-red-900/50 text-red-400 hover:bg-red-950/30 hover:text-red-300 py-5 rounded-xl flex items-center gap-2"
          >
            <HardDrive className="w-4 h-4" />
            Tarayıcıyı Tamamen Sıfırla (Hard Reset)
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AuthErrorRecovery;
