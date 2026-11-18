'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Clock, 
  Pencil, 
  Sparkles,
  ExternalLink,
  Check,
  ChevronDown,
  X
} from 'lucide-react';

export interface FilterState {
  datePosted: string;
  experienceLevel: string;
  location: string;
  jobType: string;
  workMode: string;
}

interface JobSearchSidebarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectCompany?: (company: string) => void;
  onSelectRoleFilter?: (role: string) => void;
  onFiltersChange?: (filters: FilterState) => void;
  onOpenProModal?: () => void;
}

export const FILTER_OPTIONS: Record<keyof FilterState, string[]> = {
  datePosted: ['Anytime', 'Past 24 Hours', 'Past Week', 'Past Month'],
  experienceLevel: ['All Levels', 'Internship', 'Entry Level', 'Associate', 'Mid-Senior', 'Director'],
  location: ['All Locations', 'Bengaluru, India', 'Hyderabad, India', 'Mumbai, India', 'Remote (Global)', 'San Jose, CA', 'London, UK'],
  jobType: ['All Types', 'Full-Time', 'Contract', 'Part-Time', 'Internship'],
  workMode: ['All Modes', 'On-site', 'Hybrid', 'Remote'],
};

export const JobSearchSidebar: React.FC<JobSearchSidebarProps> = ({
  searchQuery,
  onSearchChange,
  onSelectCompany,
  onSelectRoleFilter,
  onFiltersChange,
  onOpenProModal,
}) => {
  const [activePopoverKey, setActivePopoverKey] = useState<keyof FilterState | null>(null);

  // Active filter values matching reference image
  const [filters, setFilters] = useState<FilterState>({
    datePosted: 'Anytime',
    experienceLevel: 'Associate',
    location: 'Bengaluru, India',
    jobType: 'Full-Time',
    workMode: 'Hybrid',
  });

  const recentCompanies = [
    { name: 'PayPal', bg: '#003087', letter: 'P', color: '#0079C1' },
    { name: 'Adobe', bg: '#eb1000', letter: 'A', color: '#ffffff' },
    { name: 'Amazon', bg: '#131921', letter: 'a', color: '#ff9900' },
    { name: 'Intel', bg: '#0071c5', letter: 'intel', color: '#ffffff', isWord: true },
    { name: 'Microsoft', isMs: true },
    { name: 'Dell', bg: '#007db8', letter: 'DELL', color: '#ffffff', isWord: true },
  ];

  const recentSearches = [
    'software analyst',
    'product designer',
    'user experience designer',
    'graphic designer',
  ];

  const handleSelectOption = (key: keyof FilterState, val: string) => {
    const updated = { ...filters, [key]: val };
    setFilters(updated);
    setActivePopoverKey(null);
    if (onFiltersChange) {
      onFiltersChange(updated);
    }
  };

  return (
    <aside style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1.25rem',
      width: '265px',
      flexShrink: 0,
    }}>
      {/* 1. Search Box */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        backgroundColor: '#1b1c21',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        padding: '0.65rem 0.85rem',
        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.4)',
      }}>
        <Search size={15} style={{ color: '#525866', flexShrink: 0 }} />
        <input
          type="text"
          placeholder="Job title, Keywords or company"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#f1f5f9',
            fontSize: '0.74rem',
            width: '100%',
            outline: 'none',
            letterSpacing: '0.01em',
          }}
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
              fontSize: '0.8rem',
              padding: 0,
            }}
          >
            ×
          </button>
        )}
      </div>

      {/* 2. Recent Searches & Companies Bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>
            Recent
          </span>
          <span
            onClick={() => onSearchChange('')}
            style={{ fontSize: '0.7rem', color: '#2563eb', cursor: 'pointer', fontWeight: 600 }}
          >
            View all
          </span>
        </div>

        {/* Company Logos Horizontal Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
          {recentCompanies.map((c) => (
            <button
              key={c.name}
              onClick={() => {
                if (onSelectCompany) onSelectCompany(c.name);
                onSearchChange(c.name);
              }}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: c.bg || '#1e1f25',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                padding: 0,
                flexShrink: 0,
                transition: 'transform 0.15s ease',
              }}
              title={c.name}
            >
              {c.isMs ? (
                /* Microsoft 4-square icon */
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 6px)',
                  gap: '2px',
                }}>
                  <div style={{ width: '6px', height: '6px', backgroundColor: '#f25022' }} />
                  <div style={{ width: '6px', height: '6px', backgroundColor: '#7fba00' }} />
                  <div style={{ width: '6px', height: '6px', backgroundColor: '#00a4ef' }} />
                  <div style={{ width: '6px', height: '6px', backgroundColor: '#ffb900' }} />
                </div>
              ) : (
                <span style={{
                  color: c.color,
                  fontSize: c.isWord ? '0.55rem' : '0.75rem',
                  fontWeight: 800,
                  fontFamily: 'sans-serif',
                }}>
                  {c.letter}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Recent Search Queries List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.25rem' }}>
          {recentSearches.map((query) => (
            <div
              key={query}
              onClick={() => {
                if (onSelectRoleFilter) onSelectRoleFilter(query);
                onSearchChange(query);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                color: '#8c93a3',
                fontSize: '0.72rem',
                cursor: 'pointer',
                padding: '0.15rem 0',
                transition: 'color 0.15s ease',
              }}
            >
              <Clock size={12} style={{ color: '#525866', flexShrink: 0 }} />
              <span>
                <strong style={{ color: '#cbd5e1', fontWeight: 500 }}>{query}</strong>{' '}
                <span style={{ color: '#525866' }}>in Jobs</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Filter Parameters List with INLINE POPOVER SELECTORS (NO PROMPT) */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        paddingTop: '0.85rem',
        position: 'relative',
      }}>
        {[
          { label: 'Date posted', key: 'datePosted' as const, val: filters.datePosted },
          { label: 'Experience Level', key: 'experienceLevel' as const, val: filters.experienceLevel },
          { label: 'Location', key: 'location' as const, val: filters.location },
          { label: 'Job type', key: 'jobType' as const, val: filters.jobType },
          { label: 'On-site/remote', key: 'workMode' as const, val: filters.workMode },
        ].map((item) => (
          <div
            key={item.label}
            style={{ position: 'relative' }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.73rem',
              }}
            >
              <span style={{ color: '#64748b' }}>{item.label}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <span 
                  onClick={() => setActivePopoverKey(activePopoverKey === item.key ? null : item.key)}
                  style={{ color: '#f1f5f9', fontWeight: 600, cursor: 'pointer' }}
                >
                  {item.val}
                </span>
                <button
                  onClick={() => setActivePopoverKey(activePopoverKey === item.key ? null : item.key)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#2563eb',
                    cursor: 'pointer',
                    padding: '0.15rem',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  title={`Change ${item.label}`}
                >
                  <Pencil size={11} />
                </button>
              </div>
            </div>

            {/* Interactive Dark Popover */}
            {activePopoverKey === item.key && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '0.35rem',
                backgroundColor: '#1b1d24',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                borderRadius: '8px',
                padding: '0.35rem',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.8), 0 0 15px rgba(37, 99, 235, 0.2)',
                zIndex: 50,
                minWidth: '160px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.25rem 0.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.66rem', color: '#38bdf8', fontWeight: 700 }}>
                    Select {item.label}
                  </span>
                  <button
                    onClick={() => setActivePopoverKey(null)}
                    style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 0 }}
                  >
                    <X size={12} />
                  </button>
                </div>
                {FILTER_OPTIONS[item.key].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleSelectOption(item.key, opt)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      textAlign: 'left',
                      padding: '0.35rem 0.6rem',
                      backgroundColor: item.val === opt ? 'rgba(37, 99, 235, 0.2)' : 'transparent',
                      color: item.val === opt ? '#38bdf8' : '#cbd5e1',
                      border: 'none',
                      borderRadius: '5px',
                      fontSize: '0.72rem',
                      fontWeight: item.val === opt ? 700 : 500,
                      cursor: 'pointer',
                    }}
                  >
                    <span>{opt}</span>
                    {item.val === opt && <Check size={12} />}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 4. Upgrade to PRO Banner Card */}
      <div style={{
        position: 'relative',
        background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #3b82f6 100%)',
        borderRadius: '16px',
        padding: '1.1rem',
        color: '#ffffff',
        overflow: 'hidden',
        marginTop: 'auto',
        boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.4)',
      }}>
        {/* Subtle Wave Backdrop Pattern */}
        <div style={{
          position: 'absolute',
          top: -20,
          right: -20,
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <h4 style={{
            fontSize: '0.88rem',
            fontWeight: 800,
            margin: '0 0 0.2rem 0',
            letterSpacing: '0.01em',
          }}>
            Upgrade to PRO
          </h4>
          <p style={{
            fontSize: '0.72rem',
            color: '#bfdbfe',
            margin: '0 0 0.85rem 0',
          }}>
            For premium benefits
          </p>

          <button
            onClick={() => {
              if (onOpenProModal) onOpenProModal();
              else alert('CareerSignal PRO unlocks real-time executive recruiter routing & AI auto-apply.');
            }}
            style={{
              backgroundColor: '#0b1120',
              color: '#ffffff',
              border: 'none',
              borderRadius: '9999px',
              padding: '0.4rem 0.9rem',
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              transition: 'transform 0.15s ease',
            }}
          >
            Get started
          </button>
        </div>

        {/* 9-dot grid icon in bottom right */}
        <div style={{
          position: 'absolute',
          bottom: '12px',
          right: '12px',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 4px)',
          gap: '3px',
          opacity: 0.6,
        }}>
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#ffffff' }} />
          ))}
        </div>
      </div>
    </aside>
  );
};
