'use client';

import React, { useState } from 'react';
import { Settings, Shield, Bell, Smartphone, Key, Check } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [apiKey, setApiKey] = useState('cs_live_9f88a291b72e45');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [instantAcceptance, setInstantAcceptance] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      flex: 1,
      minHeight: '680px',
    }}>
      {/* Header matching PDF style */}
      <div>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#0F172A' }}>
          Settings & Preferences
        </h1>
        <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#475569' }}>
          Manage your verified applicant profile, recruiter notification triggers, and API credentials.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.4fr 1fr',
        gap: '20px',
      }}>
        {/* Left Settings Form */}
        <form onSubmit={handleSave} style={{
          border: '1px solid #E2E8F0',
          borderRadius: '12px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          background: '#FFFFFF',
        }}>
          <div style={{ fontWeight: 600, fontSize: '16px', color: '#0F172A' }}>
            Recruiter Automation Preferences
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '14px', borderBottom: '1px solid #F1F5F9' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '14px', color: '#0F172A' }}>Instant Corporate ATS Acceptance</div>
              <div style={{ fontSize: '13px', color: '#64748B' }}>Automatically evaluate verified candidate skills for guaranteed admission passes.</div>
            </div>
            <input
              type="checkbox"
              checked={instantAcceptance}
              onChange={(e) => setInstantAcceptance(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: '#2563EB', cursor: 'pointer' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '14px', borderBottom: '1px solid #F1F5F9' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '14px', color: '#0F172A' }}>Recruiter Direct Notifications</div>
              <div style={{ fontSize: '13px', color: '#64748B' }}>Receive instant email alerts when Tier-1 talent leads schedule video interviews.</div>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: '#2563EB', cursor: 'pointer' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '13px', color: '#334155', marginBottom: '6px' }}>
              Corporate Intelligence Access Key
            </label>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              style={{
                width: '100%',
                height: '40px',
                padding: '0 12px',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#0F172A',
                outline: 'none',
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              height: '42px',
              padding: '0 20px',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: '#2563EB',
              color: '#FFFFFF',
              font: '600 14px Inter, sans-serif',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              marginTop: '8px',
            }}
          >
            {savedSuccess ? <Check size={16} /> : null}
            <span>{savedSuccess ? 'Preferences Saved!' : 'Save Preferences'}</span>
          </button>
        </form>

        {/* Right Info Card */}
        <div style={{
          border: '1px solid #E2E8F0',
          borderRadius: '12px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          background: '#F8FAFC',
        }}>
          <div style={{ fontWeight: 600, fontSize: '16px', color: '#0F172A' }}>
            System Status
          </div>
          <div style={{ fontSize: '13px', color: '#334155', lineHeight: 1.6 }}>
            CareerSignal Intelligence Gateway is active and synchronizing live job signals across Microsoft, Google, Adobe, NVIDIA, and TSMC portals.
          </div>
          <div style={{
            fontSize: '12px',
            color: '#047857',
            backgroundColor: '#ECFDF5',
            padding: '6px 12px',
            borderRadius: '6px',
            fontWeight: 600,
          }}>
            ● All Services Operational (API v1)
          </div>
        </div>
      </div>
    </div>
  );
};
