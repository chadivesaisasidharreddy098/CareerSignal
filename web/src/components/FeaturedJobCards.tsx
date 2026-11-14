'use client';

import React, { useState } from 'react';
import { SignalItem, OpenRole } from '../types';
import { getVerifiedCareerUrl, getDirectJobPortalUrl } from '../lib/api';
import { 
  X, 
  Send, 
  Bookmark, 
  ExternalLink, 
  Check, 
  ChevronRight,
  Briefcase
} from 'lucide-react';

interface FeaturedJobCardsProps {
  signals: SignalItem[];
  onApply: (signal: SignalItem, role?: OpenRole) => void;
  onSaveJob?: (signal: SignalItem) => void;
  onSelectSignal?: (signal: SignalItem) => void;
}

export const FeaturedJobCards: React.FC<FeaturedJobCardsProps> = ({
  signals,
  onApply,
  onSaveJob,
  onSelectSignal,
}) => {
  const [savedIds, setSavedIds] = useState<Record<number, boolean>>({});
  const [dismissedIds, setDismissedIds] = useState<Record<number, boolean>>({});
  const [activePageIndex, setActivePageIndex] = useState(0);

  const handleToggleSave = (signal: SignalItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedIds((prev) => ({
      ...prev,
      [signal.id]: !prev[signal.id],
    }));
    if (onSaveJob) onSaveJob(signal);
  };

  const handleDismiss = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setDismissedIds((prev) => ({ ...prev, [id]: true }));
  };

  // Find Microsoft and Adobe, plus other active signals
  const visibleSignals = signals
    .filter((s) => !dismissedIds[s.id])
    .slice(activePageIndex * 2, activePageIndex * 2 + 2);

  const renderCompanyLogo = (companyName?: string) => {
    const name = companyName || '';
    if (name.toLowerCase().includes('microsoft')) {
      return (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 7px)',
          gap: '2px',
          width: '18px',
          height: '18px',
          flexShrink: 0,
        }}>
          <div style={{ width: '7px', height: '7px', backgroundColor: '#f25022' }} />
          <div style={{ width: '7px', height: '7px', backgroundColor: '#7fba00' }} />
          <div style={{ width: '7px', height: '7px', backgroundColor: '#00a4ef' }} />
          <div style={{ width: '7px', height: '7px', backgroundColor: '#ffb900' }} />
        </div>
      );
    }
    if (name.toLowerCase().includes('adobe')) {
      return (
        <div style={{
          width: '20px',
          height: '20px',
          borderRadius: '4px',
          backgroundColor: '#eb1000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontWeight: 900,
          fontSize: '0.75rem',
          flexShrink: 0,
        }}>
          A
        </div>
      );
    }
    if (name.toLowerCase().includes('nvidia')) {
      return (
        <div style={{
          width: '20px',
          height: '20px',
          borderRadius: '4px',
          backgroundColor: '#76b900',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#000000',
          fontWeight: 900,
          fontSize: '0.75rem',
          flexShrink: 0,
        }}>
          NV
        </div>
      );
    }
    // Default initial avatar
    return (
      <div style={{
        width: '20px',
        height: '20px',
        borderRadius: '4px',
        backgroundColor: '#2563eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff',
        fontWeight: 700,
        fontSize: '0.68rem',
        flexShrink: 0,
      }}>
        {name.slice(0, 2).toUpperCase()}
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {/* Cards 2-Column Grid matching reference image */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1rem',
      }}>
        {visibleSignals.map((sig) => {
          const isSaved = !!savedIds[sig.id];
          const firstRole = sig.open_roles && sig.open_roles.length > 0 ? sig.open_roles[0] : undefined;

          // Header badge: PRODUCT DESIGNER / UI/UX ASSOCIATE / SOFTWARE ANALYST or Title
          const headerBadge = firstRole?.title || sig.title.split('-')[0].trim();
          const directJobUrl = getDirectJobPortalUrl(sig.company_name, headerBadge, sig.careers_url || sig.source_url);

          return (
            <div
              key={sig.id}
              onClick={() => {
                if (onSelectSignal) onSelectSignal(sig);
              }}
              style={{
                backgroundColor: '#1b1c21',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '18px',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '0.9rem',
                position: 'relative',
                cursor: 'pointer',
                transition: 'border-color 0.15s ease, transform 0.15s ease',
              }}
            >
              {/* Header Title & Close Button */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <span style={{
                  color: '#2563eb',
                  fontSize: '0.76rem',
                  fontWeight: 800,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}>
                  {headerBadge.toUpperCase()}
                </span>

                <button
                  onClick={(e) => handleDismiss(sig.id, e)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    cursor: 'pointer',
                    padding: '0.2rem',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  title="Dismiss card"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Company Logo, Name & Location */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                {renderCompanyLogo(sig.company_name)}

                <div>
                  <h4 style={{
                    color: '#f8fafc',
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    margin: 0,
                    lineHeight: 1.2,
                  }}>
                    {sig.company_name}
                  </h4>
                  <div style={{ color: '#64748b', fontSize: '0.72rem', marginTop: '0.15rem' }}>
                    {sig.city ? `${sig.city}, ${sig.country}` : sig.country} ({sig.work_mode?.split(' ')[0] || 'On-site'})
                  </div>
                </div>
              </div>

              {/* Job Summary Paragraph */}
              <p style={{
                color: '#94a3b8',
                fontSize: '0.75rem',
                lineHeight: 1.5,
                margin: 0,
                display: '-webkit-box',
                WebkitLineClamp: 4,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}>
                {sig.summary}
              </p>

              {/* Timestamp Footer */}
              <div style={{ color: '#525866', fontSize: '0.7rem' }}>
                Posted {sig.id === 1 ? '2 days ago' : sig.id === 2 ? '3 hours ago' : '1 day ago'}
              </div>

              {/* Action Buttons: Apply & Save for later */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                paddingTop: '0.25rem',
              }}>
                {/* Primary Solid Blue Apply Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onApply(sig, firstRole);
                  }}
                  style={{
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '9999px',
                    padding: '0.45rem 1.4rem',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span>Apply</span>
                </button>

                {/* Secondary Bordered Save for Later Button */}
                <button
                  onClick={(e) => handleToggleSave(sig, e)}
                  style={{
                    backgroundColor: isSaved ? 'rgba(37, 99, 235, 0.15)' : 'transparent',
                    border: isSaved ? '1px solid #2563eb' : '1px solid rgba(255, 255, 255, 0.14)',
                    color: isSaved ? '#38bdf8' : '#cbd5e1',
                    borderRadius: '9999px',
                    padding: '0.45rem 1rem',
                    fontSize: '0.76rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {isSaved ? <Check size={12} /> : null}
                  <span>{isSaved ? 'Saved' : 'Save for later'}</span>
                </button>

                {/* Direct Role-Specific Portal Link */}
                <a
                  href={directJobUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    marginLeft: 'auto',
                    color: '#38bdf8',
                    backgroundColor: 'rgba(56, 189, 248, 0.08)',
                    border: '1px solid rgba(56, 189, 248, 0.25)',
                    borderRadius: '9999px',
                    padding: '0.35rem 0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    transition: 'all 0.15s ease',
                  }}
                  title={`Open direct ${headerBadge} posting on ${sig.company_name} portal`}
                >
                  <span>Direct Job</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination dots / cycle controller */}
      {signals.length > 2 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.4rem',
          padding: '0.2rem 0',
        }}>
          {Array.from({ length: Math.min(5, Math.ceil(signals.length / 2)) }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActivePageIndex(idx)}
              style={{
                width: activePageIndex === idx ? '20px' : '6px',
                height: '6px',
                borderRadius: '9999px',
                backgroundColor: activePageIndex === idx ? '#2563eb' : 'rgba(255, 255, 255, 0.15)',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                transition: 'all 0.2s ease',
              }}
              title={`Page ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

