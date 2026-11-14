'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Briefcase, ExternalLink, MapPin, Building2, Send } from 'lucide-react';
import { INITIAL_MOCK_SIGNALS, getVerifiedCareerUrl } from '@/lib/api';

export default function JobsIndexPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#040711', color: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      <nav style={{
        backgroundColor: 'rgba(8, 12, 22, 0.9)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '0.85rem 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#38bdf8',
              textDecoration: 'none',
              fontSize: '0.85rem',
              fontWeight: 700,
            }}
          >
            <ArrowLeft size={16} />
            <span>Return to Global Radar</span>
          </Link>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            Active Employment Signals & Verified Corporate Opportunities
          </span>
        </div>
      </nav>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem', width: '100%', flex: 1 }}>
        <div style={{ marginBottom: '1.75rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.35rem' }}>
            Verified Corporate Positions & Portals
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Zero 404 corporate career listings authenticated by CareerSignal Intelligence.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.25rem' }}>
          {INITIAL_MOCK_SIGNALS.map((s) => {
            const portalUrl = getVerifiedCareerUrl(s.company_name, s.careers_url || s.source_url);
            return (
              <div
                key={s.id}
                style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1rem',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(56, 189, 248, 0.15)',
                        border: '1px solid rgba(56, 189, 248, 0.35)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        color: '#38bdf8',
                        fontSize: '0.85rem',
                      }}>
                        {s.company_name?.charAt(0) || 'C'}
                      </div>
                      <span style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.95rem' }}>
                        {s.company_name}
                      </span>
                    </div>

                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '0.2rem 0.5rem',
                      borderRadius: '6px',
                      backgroundColor: (s.impact_headcount || 0) > 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                      color: (s.impact_headcount || 0) > 0 ? '#34d399' : '#fb7185',
                    }}>
                      {(s.impact_headcount || 0) > 0 ? `+${s.impact_headcount?.toLocaleString()}` : s.impact_headcount?.toLocaleString()}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f1f5f9', lineHeight: 1.4, marginBottom: '0.5rem' }}>
                    {s.title}
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#94a3b8', fontSize: '0.75rem' }}>
                    <MapPin size={12} style={{ color: '#38bdf8' }} />
                    <span>{s.city ? `${s.city}, ${s.country}` : s.country}</span>
                    <span>•</span>
                    <span style={{ color: '#38bdf8', fontWeight: 600 }}>{s.open_roles?.length || 2} Roles</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.65rem' }}>
                  <Link
                    href={`/jobs/${s.id}`}
                    style={{
                      flex: 1,
                      backgroundColor: '#10b981',
                      color: '#ffffff',
                      borderRadius: '6px',
                      padding: '0.5rem',
                      textAlign: 'center',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.35rem',
                    }}
                  >
                    <Send size={12} />
                    <span>View & Apply</span>
                  </Link>

                  <a
                    href={portalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      flex: 1,
                      backgroundColor: 'rgba(56, 189, 248, 0.12)',
                      border: '1px solid rgba(56, 189, 248, 0.3)',
                      color: '#38bdf8',
                      borderRadius: '6px',
                      padding: '0.5rem',
                      textAlign: 'center',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.35rem',
                    }}
                  >
                    <span>Official Portal</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

