'use client';

import React from 'react';
import { SignalItem, SignalType, OpenRole } from '../types';
import { getVerifiedCareerUrl, getDirectJobPortalUrl } from '../lib/api';
import { 
  Building2, 
  MapPin, 
  ExternalLink, 
  ShieldCheck, 
  TrendingUp, 
  TrendingDown, 
  Layers, 
  AlertTriangle,
  Clock,
  Send,
  Briefcase
} from 'lucide-react';

interface SignalCardProps {
  signal: SignalItem;
  isSelected?: boolean;
  onSelect: (signal: SignalItem) => void;
  onApply?: (signal: SignalItem, role?: OpenRole) => void;
}

export const SignalCard: React.FC<SignalCardProps> = ({
  signal,
  isSelected,
  onSelect,
  onApply,
}) => {
  const getBadgeConfig = (type: SignalType) => {
    switch (type) {
      case 'hiring_surge':
        return {
          label: 'Hiring Surge',
          bg: 'rgba(16, 185, 129, 0.12)',
          border: 'rgba(16, 185, 129, 0.3)',
          text: '#34d399',
          icon: TrendingUp,
        };
      case 'layoff':
        return {
          label: 'Layoff Alert',
          bg: 'rgba(244, 63, 94, 0.12)',
          border: 'rgba(244, 63, 94, 0.3)',
          text: '#fb7185',
          icon: TrendingDown,
        };
      case 'expansion':
        return {
          label: 'Corporate Expansion',
          bg: 'rgba(6, 182, 212, 0.12)',
          border: 'rgba(6, 182, 212, 0.3)',
          text: '#38bdf8',
          icon: Layers,
        };
      case 'restructuring':
        return {
          label: 'Restructuring',
          bg: 'rgba(245, 158, 11, 0.12)',
          border: 'rgba(245, 158, 11, 0.3)',
          text: '#fbbf24',
          icon: AlertTriangle,
        };
      default:
        return {
          label: 'Intelligence',
          bg: 'rgba(56, 189, 248, 0.12)',
          border: 'rgba(56, 189, 248, 0.3)',
          text: '#38bdf8',
          icon: TrendingUp,
        };
    }
  };

  const badge = getBadgeConfig(signal.signal_type);
  const BadgeIcon = badge.icon;
  const primaryRoleObj = signal.open_roles && signal.open_roles.length > 0 ? signal.open_roles[0] : undefined;
  const primaryRole = primaryRoleObj?.title || signal.title.split('-')[0].trim();
  const directJobUrl = getDirectJobPortalUrl(signal.company_name, primaryRole, signal.careers_url || signal.source_url);

  const formatTimeAgo = (dateStr: string) => {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffHours = Math.floor(diffMs / (3600 * 1000));
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <div
      onClick={() => onSelect(signal)}
      style={{
        backgroundColor: isSelected ? 'rgba(30, 41, 59, 0.85)' : 'rgba(19, 26, 41, 0.75)',
        border: isSelected ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        padding: '1.25rem',
        cursor: 'pointer',
        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: isSelected
          ? '0 8px 25px rgba(56, 189, 248, 0.2), 0 0 1px #38bdf8'
          : '0 4px 12px rgba(0, 0, 0, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '0.85rem',
        position: 'relative',
        overflow: 'hidden',
      }}
      className="signal-card-hover"
    >
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '8px',
            backgroundColor: 'rgba(56, 189, 248, 0.1)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            color: '#38bdf8',
            fontSize: '0.85rem',
          }}>
            {signal.company_name?.charAt(0) || 'C'}
          </div>

          <div>
            <h4 style={{ color: '#f8fafc', fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.2 }}>
              {signal.company_name || 'Enterprise'}
            </h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#94a3b8', fontSize: '0.74rem', marginTop: '0.15rem' }}>
              <MapPin size={11} style={{ color: 'var(--accent)' }} />
              <span>{signal.city ? `${signal.city}, ${signal.country}` : signal.country || 'Global'}</span>
            </div>
          </div>
        </div>

        {/* Headcount impact pill */}
        {signal.impact_headcount !== undefined && signal.impact_headcount !== null && (
          <span style={{
            padding: '0.25rem 0.55rem',
            borderRadius: '6px',
            fontWeight: 700,
            fontSize: '0.75rem',
            backgroundColor: signal.impact_headcount > 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
            border: signal.impact_headcount > 0 ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid rgba(244, 63, 94, 0.35)',
            color: signal.impact_headcount > 0 ? '#34d399' : '#fb7185',
            whiteSpace: 'nowrap',
          }}>
            {signal.impact_headcount > 0 ? `+${signal.impact_headcount.toLocaleString()}` : signal.impact_headcount.toLocaleString()}
          </span>
        )}
      </div>

      {/* Signal Title */}
      <h3 style={{
        fontSize: '0.92rem',
        fontWeight: 600,
        color: '#f1f5f9',
        lineHeight: 1.4,
      }}>
        {signal.title}
      </h3>

      {/* Summary Snippet */}
      {signal.summary && (
        <p style={{
          fontSize: '0.8rem',
          color: '#94a3b8',
          lineHeight: 1.45,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {signal.summary}
        </p>
      )}

      {/* Quick Action Bar on Card */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.5rem 0.75rem',
        borderRadius: '8px',
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.07)',
        gap: '0.5rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.74rem', color: '#38bdf8' }}>
          <Briefcase size={12} />
          <span>{signal.open_roles?.length || 2} Roles</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          {/* Direct Role Job Portal Button */}
          <a
            href={directJobUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.stopPropagation();
            }}
            style={{
              backgroundColor: 'rgba(56, 189, 248, 0.15)',
              color: '#38bdf8',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              borderRadius: '6px',
              padding: '0.3rem 0.65rem',
              fontSize: '0.74rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              textDecoration: 'none',
              boxShadow: '0 0 10px rgba(56, 189, 248, 0.15)',
              transition: 'all 0.15s ease',
            }}
            title={`Open direct ${primaryRole} job posting on ${signal.company_name} portal`}
          >
            <span>Direct Job</span>
            <ExternalLink size={11} />
          </a>

          {/* Quick Apply In-App Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onApply) {
                onApply(signal, primaryRoleObj);
              } else {
                onSelect(signal);
              }
            }}
            style={{
              backgroundColor: '#10b981',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              padding: '0.3rem 0.65rem',
              fontSize: '0.74rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              boxShadow: '0 0 10px rgba(16, 185, 129, 0.25)',
            }}
          >
            <Send size={11} />
            <span>Apply</span>
          </button>
        </div>
      </div>

      {/* Bottom Metadata & Badges */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '0.6rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        fontSize: '0.72rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            padding: '0.2rem 0.45rem',
            borderRadius: '4px',
            backgroundColor: badge.bg,
            border: `1px solid ${badge.border}`,
            color: badge.text,
            fontWeight: 600,
          }}>
            <BadgeIcon size={11} />
            {badge.label}
          </span>

          <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            <Clock size={11} />
            {formatTimeAgo(signal.published_at)}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.2rem',
            color: '#10b981',
            fontWeight: 600,
          }}>
            <ShieldCheck size={12} />
            {Math.round(signal.confidence_score * 100)}%
          </span>

          <a
            href={directJobUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.stopPropagation();
            }}
            style={{
              color: '#38bdf8',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.72rem',
              padding: '0.15rem 0.4rem',
              borderRadius: '4px',
              backgroundColor: 'rgba(56, 189, 248, 0.1)',
            }}
            title={`Open verified career portal: ${signal.company_name}`}
          >
            <span>Visit Portal</span>
            <ExternalLink size={11} />
          </a>
        </div>
      </div>
    </div>
  );
};

