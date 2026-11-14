'use client';

import React, { useState } from 'react';
import { 
  X, 
  Smartphone, 
  Bell, 
  Check, 
  QrCode, 
  Wifi, 
  Battery, 
  Radio, 
  TrendingUp, 
  TrendingDown,
  ShieldCheck
} from 'lucide-react';

interface MobileSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileSyncModal: React.FC<MobileSyncModalProps> = ({ isOpen, onClose }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [hiringFilter, setHiringFilter] = useState(true);
  const [layoffFilter, setLayoffFilter] = useState(true);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(5, 8, 16, 0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      zIndex: 120,
      animation: 'fadeIn 0.2s ease-out',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '750px',
        backgroundColor: '#0c1220',
        border: '1px solid rgba(56, 189, 248, 0.3)',
        borderRadius: '16px',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 30px rgba(56, 189, 248, 0.15)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(15, 23, 42, 0.6)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'rgba(56, 189, 248, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent)',
            }}>
              <Smartphone size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>
                CareerSignal Mobile Companion Sync
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                Synchronize real-time push alerts with React Native / Expo app
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '0.4rem',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body: Split View (Settings + Phone Mockup) */}
        <div style={{
          padding: '1.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
          alignItems: 'center',
        }}>
          {/* Left Settings & QR */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '0.4rem' }}>
                Instant Push Notifications
              </h4>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5 }}>
                Receive breaking signals for your target sectors or watchlisted employers directly on iOS and Android.
              </p>
            </div>

            {/* Toggle Switches */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Bell size={16} style={{ color: 'var(--accent)' }} />
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#e2e8f0' }}>
                    Push Notifications Active
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notificationsEnabled}
                  onChange={(e) => setNotificationsEnabled(e.target.checked)}
                  style={{ cursor: 'pointer', width: '16px', height: '16px', accentColor: 'var(--accent)' }}
                />
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <TrendingUp size={16} style={{ color: '#10b981' }} />
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#e2e8f0' }}>
                    Hiring Surges & Expansions
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={hiringFilter}
                  onChange={(e) => setHiringFilter(e.target.checked)}
                  style={{ cursor: 'pointer', width: '16px', height: '16px', accentColor: '#10b981' }}
                />
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <TrendingDown size={16} style={{ color: '#f43f5e' }} />
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#e2e8f0' }}>
                    Layoffs & Restructurings
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={layoffFilter}
                  onChange={(e) => setLayoffFilter(e.target.checked)}
                  style={{ cursor: 'pointer', width: '16px', height: '16px', accentColor: '#f43f5e' }}
                />
              </div>
            </div>

            {/* Expo Quick Launch Bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              backgroundColor: 'rgba(56, 189, 248, 0.08)',
              border: '1px solid rgba(56, 189, 248, 0.2)',
            }}>
              <QrCode size={24} style={{ color: 'var(--accent)' }} />
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f1f5f9' }}>
                  Expo Development Server
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                  Run <code>npm start</code> in <code>/mobile</code> to pair with Expo Go
                </div>
              </div>
            </div>
          </div>

          {/* Right Phone Mockup */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{
              width: '260px',
              height: '420px',
              backgroundColor: '#070a12',
              borderRadius: '32px',
              border: '4px solid #1e293b',
              boxShadow: '0 20px 40px rgba(0,0,0,0.8), inset 0 0 10px rgba(0,0,0,0.5)',
              display: 'flex',
              flexDirection: 'column',
              padding: '0.75rem',
              position: 'relative',
              overflow: 'hidden',
            }}>
              {/* Phone Status Bar */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.2rem 0.6rem',
                fontSize: '0.65rem',
                color: '#94a3b8',
                marginBottom: '0.5rem',
              }}>
                <span style={{ fontWeight: 600 }}>09:41</span>
                <div style={{
                  width: '60px',
                  height: '14px',
                  backgroundColor: '#1e293b',
                  borderRadius: '10px',
                }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Wifi size={10} />
                  <Battery size={10} />
                </div>
              </div>

              {/* App Bar in Phone */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.75rem',
                paddingBottom: '0.4rem',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--accent)' }}>
                  CareerSignal 📡
                </span>
                <span style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#10b981',
                  boxShadow: '0 0 6px #10b981',
                }} />
              </div>

              {/* Simulated Push Notification Toast */}
              <div style={{
                backgroundColor: 'rgba(30, 41, 59, 0.95)',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                borderRadius: '10px',
                padding: '0.6rem',
                marginBottom: '0.75rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                animation: 'bounce 2s infinite',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                  <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#38bdf8' }}>
                    🚨 BREAKING SIGNAL
                  </span>
                  <span style={{ fontSize: '0.6rem', color: '#64748b' }}>Now</span>
                </div>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#f8fafc' }}>
                  ASML • Dresden Fab
                </div>
                <div style={{ fontSize: '0.65rem', color: '#94a3b8', lineHeight: 1.2 }}>
                  +1,400 Semiconductor Roles announced in Germany
                </div>
              </div>

              {/* Mini Feed Items inside phone */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'hidden' }}>
                <div style={{
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '8px',
                  padding: '0.5rem',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', fontWeight: 700 }}>
                    <span style={{ color: '#f1f5f9' }}>NVIDIA</span>
                    <span style={{ color: '#34d399' }}>+2,200</span>
                  </div>
                  <div style={{ fontSize: '0.6rem', color: '#64748b' }}>Austin, TX • AI Hardware</div>
                </div>

                <div style={{
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '8px',
                  padding: '0.5rem',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', fontWeight: 700 }}>
                    <span style={{ color: '#f1f5f9' }}>BT Group</span>
                    <span style={{ color: '#fb7185' }}>-4,800</span>
                  </div>
                  <div style={{ fontSize: '0.6rem', color: '#64748b' }}>London, UK • Restructuring</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(15, 23, 42, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}>
          <button
            onClick={onClose}
            style={{
              backgroundColor: 'var(--accent)',
              border: 'none',
              borderRadius: '8px',
              padding: '0.6rem 1.2rem',
              color: '#090d16',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
