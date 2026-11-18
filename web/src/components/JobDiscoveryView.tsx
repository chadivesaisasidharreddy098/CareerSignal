'use client';

import React, { useState } from 'react';
import { SignalItem, OpenRole } from '../types';
import { getVerifiedCareerUrl, getDirectJobPortalUrl, getSkillsForRole } from '../lib/api';
import { Search, Bookmark, Check, ExternalLink, Sparkles, Briefcase, MapPin, DollarSign, Award } from 'lucide-react';

interface JobDiscoveryViewProps {
  signals: SignalItem[];
  onApply: (signal: SignalItem, role?: OpenRole) => void;
  onSaveJob?: (signal: SignalItem) => void;
}

export const JobDiscoveryView: React.FC<JobDiscoveryViewProps> = ({
  signals,
  onApply,
  onSaveJob,
}) => {
  const [activeFilter, setActiveFilter] = useState<'All matches' | 'Remote' | 'Full-time' | 'Saved'>('All matches');
  const [searchWord, setSearchWord] = useState('');
  const [selectedSignalId, setSelectedSignalId] = useState<number>(signals[0]?.id || 1);
  const [savedMap, setSavedMap] = useState<Record<number, boolean>>({});

  const handleToggleSave = (sig: SignalItem) => {
    setSavedMap((prev) => ({ ...prev, [sig.id]: !prev[sig.id] }));
    if (onSaveJob) onSaveJob(sig);
  };

  const filtered = signals.filter((s) => {
    if (activeFilter === 'Remote') {
      const mode = (s.work_mode || '').toLowerCase();
      if (!mode.includes('remote') && !s.city?.toLowerCase().includes('remote')) return false;
    }
    if (activeFilter === 'Saved') {
      if (!savedMap[s.id]) return false;
    }
    if (searchWord.trim()) {
      const q = searchWord.toLowerCase().trim();
      const match =
        s.title.toLowerCase().includes(q) ||
        s.company_name?.toLowerCase().includes(q) ||
        s.summary?.toLowerCase().includes(q) ||
        (s.open_roles && s.open_roles.some((r) => r.title.toLowerCase().includes(q)));
      if (!match) return false;
    }
    return true;
  });

  const selectedSignal = signals.find((s) => s.id === selectedSignalId) || signals[0];
  const firstRole = selectedSignal?.open_roles?.[0];
  const headerRole = firstRole?.title || selectedSignal?.title.split('-')[0].trim() || 'Role';
  const matchPct = selectedSignal ? Math.round((selectedSignal.confidence_score || 0.95) * 100) : 92;
  const directPortal = selectedSignal ? getDirectJobPortalUrl(selectedSignal.company_name, headerRole, selectedSignal.careers_url || selectedSignal.source_url) : '#';

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1.25rem',
      flex: 1,
      minHeight: '680px',
    }}>
      {/* Header matching PDF */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc' }}>
            Job Discovery
          </h1>
          <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.78rem', color: '#94a3b8' }}>
            Direct open roles with guaranteed corporate recruiter review & verified skill matching.
          </p>
        </div>

        <div style={{
          position: 'relative',
          width: '320px',
        }}>
          <input
            type="text"
            placeholder="Title, skill or company..."
            value={searchWord}
            onChange={(e) => setSearchWord(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: '#1b1c21',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '8px',
              padding: '0.55rem 0.85rem',
              color: '#f8fafc',
              fontSize: '0.8rem',
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* Filter pills navigation */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {(['All matches', 'Remote', 'Full-time', 'Saved'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            style={{
              padding: '0.4rem 1rem',
              borderRadius: '9999px',
              backgroundColor: activeFilter === filter ? '#2563eb' : 'rgba(255, 255, 255, 0.05)',
              border: activeFilter === filter ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
              color: activeFilter === filter ? '#ffffff' : '#cbd5e1',
              fontSize: '0.76rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {filter} {filter === 'Saved' && Object.values(savedMap).filter(Boolean).length > 0 ? `(${Object.values(savedMap).filter(Boolean).length})` : ''}
          </button>
        ))}
      </div>

      {/* 2-Column Split: Left List vs Right Detail Pane */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.3fr',
        gap: '1.25rem',
        flex: 1,
      }}>
        {/* Left Column: Job Cards List */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem',
          maxHeight: '620px',
          overflowY: 'auto',
          paddingRight: '0.35rem',
        }}>
          {filtered.map((s) => {
            const roleBadge = s.open_roles?.[0]?.title || s.title.split('-')[0].trim();
            const isSelected = s.id === selectedSignalId;
            const pct = Math.round((s.confidence_score || 0.95) * 100);

            return (
              <div
                key={s.id}
                onClick={() => setSelectedSignalId(s.id)}
                style={{
                  border: isSelected ? '1.5px solid #2563eb' : '1px solid rgba(255, 255, 255, 0.08)',
                  backgroundColor: isSelected ? 'rgba(37, 99, 235, 0.12)' : '#1b1c21',
                  borderRadius: '12px',
                  padding: '1.1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.6rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: isSelected ? '0 0 20px rgba(37, 99, 235, 0.25)' : 'none',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.94rem', color: '#f8fafc' }}>
                    {roleBadge}
                  </div>
                  <span style={{
                    fontSize: '0.72rem',
                    color: '#34d399',
                    fontWeight: 700,
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '9999px',
                  }}>
                    {pct}% match
                  </span>
                </div>

                <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                  {s.company_name} • {s.city ? `${s.city}, ${s.country}` : s.country} • {s.work_mode || 'Full-time'}
                </div>

                {/* Skill tags */}
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                  {getSkillsForRole(roleBadge, s.company_name, s.department).slice(0, 3).map((sk: string) => (
                    <span
                      key={sk}
                      style={{
                        fontSize: '0.68rem',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        padding: '0.15rem 0.45rem',
                        borderRadius: '6px',
                        color: '#cbd5e1',
                      }}
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Detailed Job View Matching PDF Section */}
        {selectedSignal && (
          <div style={{
            border: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: '#1b1c21',
            borderRadius: '14px',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.1rem',
          }}>
            <div>
              <div style={{
                fontSize: '0.72rem',
                color: '#38bdf8',
                fontWeight: 800,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}>
                {headerRole.toUpperCase()}
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', margin: '0.2rem 0' }}>
                {selectedSignal.company_name}
              </h2>
              <div style={{ fontSize: '0.76rem', color: '#94a3b8' }}>
                {selectedSignal.city ? `${selectedSignal.city}, ${selectedSignal.country}` : selectedSignal.country} • <strong style={{ color: '#34d399' }}>{selectedSignal.salary_range || 'Competitive Compensation'}</strong>
              </div>
            </div>

            <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.6, margin: 0 }}>
              {selectedSignal.summary}
            </p>

            {/* Why you match section from PDF */}
            <div style={{
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              paddingTop: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem',
            }}>
              <div style={{ fontWeight: 700, fontSize: '0.86rem', color: '#f8fafc' }}>
                Why you match ({matchPct}% Fit)
              </div>
              <div style={{ fontSize: '0.78rem', color: '#93c5fd', lineHeight: 1.5 }}>
                ✓ Technical competencies and distributed system specifications from your candidate profile align with the core requirements of {selectedSignal.company_name}.
              </div>
              <div style={{ fontSize: '0.76rem', color: '#94a3b8', lineHeight: 1.5 }}>
                ℹ Optional gap: formal enterprise case study publication would elevate your profile to top 2% of applicants.
              </div>
            </div>

            {/* Action buttons from PDF */}
            <div style={{ marginTop: 'auto', display: 'flex', gap: '0.75rem', paddingTop: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => onApply(selectedSignal, firstRole)}
                style={{
                  height: '42px',
                  padding: '0 1.5rem',
                  border: 'none',
                  borderRadius: '8px',
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  font: '700 0.84rem Inter, sans-serif',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                }}
              >
                <Sparkles size={14} />
                <span>Apply with profile</span>
              </button>

              <button
                onClick={() => handleToggleSave(selectedSignal)}
                style={{
                  height: '42px',
                  padding: '0 1.25rem',
                  border: savedMap[selectedSignal.id] ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px',
                  backgroundColor: savedMap[selectedSignal.id] ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                  color: savedMap[selectedSignal.id] ? '#38bdf8' : '#f8fafc',
                  font: '600 0.82rem Inter, sans-serif',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                {savedMap[selectedSignal.id] ? <Check size={14} /> : <Bookmark size={14} />}
                <span>{savedMap[selectedSignal.id] ? 'Saved' : 'Save role'}</span>
              </button>

              <a
                href={directPortal}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  marginLeft: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  color: '#38bdf8',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  padding: '0 0.85rem',
                  height: '42px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(56, 189, 248, 0.1)',
                }}
              >
                <span>Direct Job Portal</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
