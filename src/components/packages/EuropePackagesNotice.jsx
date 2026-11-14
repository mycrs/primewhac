import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, ArrowRight, MapPin } from 'lucide-react';
import { BRAND_LOGO_URL } from '@/constants/brandAssets';
const STORAGE_KEY = 'epn-dismissed-v8';
const DELAY_MS = 4000;

const EuropePackagesNotice = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored === '1') return;
    const t = setTimeout(() => setShow(true), DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => {
    setShow(false);
    sessionStorage.setItem(STORAGE_KEY, '1');
  };

  if (!show) return null;

  return (
    <div
      data-europe-notice="v8"
      style={{
        position: 'fixed',
        left: '50%',
        bottom: '32px',
        transform: 'translateX(-50%)',
        zIndex: 999999,
        width: '100%',
        maxWidth: '480px',
        padding: '0 16px',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #0a0a0a 0%, #141414 50%, #0a0a0a 100%)',
          border: '1px solid rgba(229, 9, 20, 0.4)',
          borderRadius: '16px',
          padding: '18px 20px',
          boxShadow: '0 20px 60px rgba(229, 9, 20, 0.35), 0 4px 20px rgba(0,0,0,0.5)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          {/* Logo */}
          <div
            style={{
              flexShrink: 0,
              width: 48,
              height: 48,
              borderRadius: 12,
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            <img
              src={BRAND_LOGO_URL}
              alt="QruzeTV logo"
              style={{ width: 36, height: 36, objectFit: 'contain' }}
            />
          </div>

          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: 14, color: '#e2e8f0', lineHeight: 1.5 }}>
              Türkiye dışındaysanız, sizin için daha uygun olan{' '}
              <span style={{ color: '#e50914', fontWeight: 600 }}>Avrupa paketlerimize</span>{' '}
              göz atmanızı öneririz.
            </p>
            <div
              style={{
                marginTop: 10,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 12px',
                borderRadius: 10,
                background: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
              }}
            >
              <MapPin size={16} color="#f59e0b" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: '#fcd34d', fontWeight: 600 }}>
                TR paketleri sadece Türkiye'de çalışır.
              </span>
            </div>
          </div>

          <button
            onClick={dismiss}
            aria-label="Kapat"
            style={{
              flexShrink: 0,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#94a3b8',
              padding: 4,
              borderRadius: 8,
              lineHeight: 0,
            }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
          <Link
            to="/de/pakete/"
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              padding: '10px 14px',
              borderRadius: 12,
              background: 'linear-gradient(135deg, #db2777 0%, #b20710 100%)',
              color: '#fff',
              fontWeight: 600,
              fontSize: 13,
              textDecoration: 'none',
            }}
          >
            Avrupa Paketlerine Git <ArrowRight size={15} />
          </Link>

          <button
            onClick={dismiss}
            style={{
              padding: '10px 16px',
              borderRadius: 12,
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#94a3b8',
              fontWeight: 500,
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};

export default EuropePackagesNotice;