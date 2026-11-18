'use client';

import React, { useState } from 'react';
import { SignalItem, OpenRole } from '../types';
import { getVerifiedCareerUrl, getDirectJobPortalUrl, getSkillsForRole } from '../lib/api';
import { Search, Bookmark, Check, ExternalLink, Sparkles } from 'lucide-react';

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

  const selectedSignal = signals.find((s) => s.id === selectedSignalId) || filtered[0] || signals[0];
  const firstRole = selectedSignal?.open_roles?.[0];
  const headerRole = firstRole?.title || selectedSignal?.title.split('-')[0].trim() || 'Role';
  const matchPct = selectedSignal ? Math.round((selectedSignal.confidence_score || 0.95) * 100) : 92;
  const directPortal = selectedSignal ? getDirectJobPortalUrl(selectedSignal.company_name, headerRole, selectedSignal.careers_url || selectedSignal.source_url) : '#';

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      flex: 1,
      minHeight: '680px',
      background: '#FFFFFF',
    }}>
      {/* Header matching PDF 2_job_discovery.html */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#0F172A' }}>
            Job Discovery
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#475569' }}>
            Curated corporate opportunities with real-time verified skill matching.
          </p>
        </div>
        <input
          aria-label="Search jobs"
          placeholder="Title, skill or company"
          value={searchWord}
          onChange={(e) => setSearchWord(e.target.value)}
          style={{
            width: '320px',
            height: '40px',
            boxSizing: 'border-box',
            padding: '0 14px',
            border: '1px solid #CBD5E1',
            borderRadius: '8px',
            font: '400 14px Inter, sans-serif',
            color: '#0F172A',
            outline: 'none',
            backgroundColor: '#FFFFFF',
          }}
        />
      </header>

      {/* Nav filter pills matching PDF */}
      <nav style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {(['All matches', 'Remote', 'Full-time', 'Saved'] as const).map((filter) => {
          const isActive = activeFilter === filter;
          return (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              style={{
                padding: '6px 14px',
                borderRadius: '999px',
                background: isActive ? '#0F172A' : '#FFFFFF',
                color: isActive ? '#FFFFFF' : '#334155',
                border: isActive ? 'none' : '1px solid #CBD5E1',
                fontSize: '13px',
                fontWeight: isActive ? 600 : 400,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {filter} {filter === 'Saved' && Object.values(savedMap).filter(Boolean).length > 0 ? `(${Object.values(savedMap).filter(Boolean).length})` : ''}
            </button>
          );
        })}
      </nav>

      {/* Section 2 columns matching 2_job_discovery.html */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1.25fr', gap: '20px', flex: 1, minHeight: 0 }}>
        {/* Left Column Job Cards List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', maxHeight: '600px', paddingRight: '4px' }}>
          {filtered.map((s) => {
            const roleBadge = s.open_roles?.[0]?.title || s.title.split('-')[0].trim();
            const isSelected = s.id === selectedSignalId;
            const pct = Math.round((s.confidence_score || 0.95) * 100);
            const skills = getSkillsForRole(roleBadge, s.company_name, s.department);

            return (
              <div
                key={s.id}
                onClick={() => setSelectedSignalId(s.id)}
                style={{
                  border: isSelected ? '1px solid #2563EB' : '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  cursor: 'pointer',
                  backgroundColor: '#FFFFFF',
                  boxShadow: isSelected ? '0 0 0 1px #2563EB' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 600, fontSize: '16px', color: '#0F172A' }}>
                    {roleBadge}
                  </div>
                  <span style={{
                    fontSize: '12px',
                    color: pct >= 85 ? '#047857' : '#334155',
                    backgroundColor: pct >= 85 ? '#ECFDF5' : '#F1F5F9',
                    padding: '2px 8px',
                    borderRadius: '999px',
                    fontWeight: 600,
                  }}>
                    {pct}% match
                  </span>
                </div>

                <div style={{ fontSize: '13px', color: '#64748B' }}>
                  {s.company_name} · {s.city ? `${s.city}, ${s.country}` : s.country} · {s.work_mode || 'Full-time'}
                </div>

                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '2px' }}>
                  {skills.slice(0, 3).map((sk: string) => (
                    <span
                      key={sk}
                      style={{
                        fontSize: '12px',
                        background: '#F1F5F9',
                        color: '#334155',
                        padding: '3px 8px',
                        borderRadius: '6px',
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

        {/* Right Column Job Details Pane matching PDF */}
        {selectedSignal && (
          <div style={{
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            background: '#FFFFFF',
          }}>
            <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600, letterSpacing: '.04em' }}>
              {headerRole.toUpperCase()}
            </div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: '#0F172A' }}>
              {selectedSignal.company_name}
            </div>
            <div style={{ fontSize: '14px', color: '#334155', lineHeight: 1.6 }}>
              {selectedSignal.summary}
            </div>

            {/* Why you match section */}
            <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontWeight: 600, fontSize: '14px', color: '#0F172A' }}>
                Why you match ({matchPct}% Fit)
              </div>
              <div style={{ fontSize: '13px', color: '#334155' }}>
                ✓ Technical competencies and distributed system skills from your candidate profile directly match the core requirements of {selectedSignal.company_name}.
              </div>
              <div style={{ fontSize: '13px', color: '#334155' }}>
                ℹ Gap: formal experimentation experience or a published case study would raise alignment to top 1%.
              </div>
            </div>

            {/* Bottom buttons matching 2_job_discovery.html */}
            <div style={{ marginTop: 'auto', display: 'flex', gap: '10px', paddingTop: '16px', flexWrap: 'wrap' }}>
              <button
                onClick={() => onApply(selectedSignal, firstRole)}
                style={{
                  height: '44px',
                  padding: '0 20px',
                  border: 0,
                  borderRadius: '8px',
                  background: '#2563EB',
                  color: '#FFFFFF',
                  font: '600 14px Inter, sans-serif',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)',
                }}
              >
                <Sparkles size={14} />
                <span>Apply with profile</span>
              </button>

              <button
                onClick={() => handleToggleSave(selectedSignal)}
                style={{
                  height: '44px',
                  padding: '0 20px',
                  border: '1px solid #CBD5E1',
                  borderRadius: '8px',
                  background: savedMap[selectedSignal.id] ? '#EFF6FF' : '#FFFFFF',
                  color: savedMap[selectedSignal.id] ? '#1D4ED8' : '#0F172A',
                  font: '600 14px Inter, sans-serif',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
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
                  height: '44px',
                  padding: '0 16px',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  background: '#F8FAFC',
                  color: '#2563EB',
                  fontSize: '13px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>Direct Job Portal</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
