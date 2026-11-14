'use client';

import React from 'react';
import { SignalStats, SignalItem } from '../types';
import { 
  TrendingUp, 
  TrendingDown, 
  Building2, 
  Globe2, 
  BarChart3, 
  PieChart, 
  Layers,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface AnalyticsRadarProps {
  stats: SignalStats;
  signals: SignalItem[];
}

export const AnalyticsRadar: React.FC<AnalyticsRadarProps> = ({ stats, signals }) => {
  const maxCompanyHeadcount = Math.max(
    ...stats.top_companies.map((c) => Math.abs(c.net_headcount || 1)),
    1000
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Headcount Flow Ticker Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1.25rem',
      }}>
        {/* Total Signals Tracked */}
        <div style={{
          backgroundColor: 'rgba(19, 26, 41, 0.75)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          padding: '1.25rem',
          boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600 }}>
            <span>Intelligence Nodes Tracked</span>
            <Layers size={16} style={{ color: 'var(--accent)' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc', marginTop: '0.4rem' }}>
            {stats.total_signals} Signals
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>
            Across 14 countries and 8 industry verticals
          </div>
        </div>

        {/* Total Planned Hires */}
        <div style={{
          backgroundColor: 'rgba(19, 26, 41, 0.75)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          borderRadius: '12px',
          padding: '1.25rem',
          boxShadow: '0 4px 15px rgba(16, 185, 129, 0.05)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#34d399', fontSize: '0.8rem', fontWeight: 600 }}>
            <span>Identified New Roles</span>
            <ArrowUpRight size={18} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#34d399', marginTop: '0.4rem' }}>
            +{stats.total_hiring_headcount.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>
            Hiring surges & facility expansions
          </div>
        </div>

        {/* Total Layoffs / Reductions */}
        <div style={{
          backgroundColor: 'rgba(19, 26, 41, 0.75)',
          border: '1px solid rgba(244, 63, 94, 0.25)',
          borderRadius: '12px',
          padding: '1.25rem',
          boxShadow: '0 4px 15px rgba(244, 63, 94, 0.05)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#fb7185', fontSize: '0.8rem', fontWeight: 600 }}>
            <span>Headcount Reductions</span>
            <ArrowDownRight size={18} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fb7185', marginTop: '0.4rem' }}>
            -{stats.total_layoff_headcount.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>
            Corporate downsizings & reorganizations
          </div>
        </div>

        {/* Net Labor Delta */}
        <div style={{
          backgroundColor: 'rgba(19, 26, 41, 0.75)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          borderRadius: '12px',
          padding: '1.25rem',
          boxShadow: '0 4px 15px rgba(56, 189, 248, 0.05)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#38bdf8', fontSize: '0.8rem', fontWeight: 600 }}>
            <span>Net Headcount Delta</span>
            <BarChart3 size={16} />
          </div>
          <div style={{
            fontSize: '2rem',
            fontWeight: 800,
            color: stats.net_headcount >= 0 ? '#38bdf8' : '#fb7185',
            marginTop: '0.4rem',
          }}>
            {stats.net_headcount >= 0 ? `+${stats.net_headcount.toLocaleString()}` : stats.net_headcount.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>
            Net workforce expansion balance
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
        gap: '1.5rem',
      }}>
        {/* Top Hiring Corporations Leaderboard */}
        <div style={{
          backgroundColor: 'rgba(19, 26, 41, 0.75)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '1.5rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Building2 size={18} style={{ color: 'var(--accent)' }} />
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>
                Corporate Labor Activity Leaderboard
              </h3>
            </div>
            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Sorted by Headcount Impact</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {stats.top_companies.map((comp) => {
              const isPositive = comp.net_headcount >= 0;
              const barPercent = Math.min(Math.round((Math.abs(comp.net_headcount) / maxCompanyHeadcount) * 100), 100);

              return (
                <div key={comp.company} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.84rem' }}>
                    <span style={{ fontWeight: 600, color: '#e2e8f0' }}>{comp.company}</span>
                    <span style={{
                      fontWeight: 700,
                      color: isPositive ? '#34d399' : '#fb7185',
                      fontSize: '0.8rem',
                    }}>
                      {isPositive ? `+${comp.net_headcount.toLocaleString()}` : comp.net_headcount.toLocaleString()}
                    </span>
                  </div>

                  <div style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '4px',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      width: `${barPercent}%`,
                      height: '100%',
                      borderRadius: '4px',
                      backgroundColor: isPositive ? '#10b981' : '#f43f5e',
                      boxShadow: isPositive ? '0 0 10px rgba(16, 185, 129, 0.5)' : '0 0 10px rgba(244, 63, 94, 0.5)',
                      transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Geographic Hotspots Ranking */}
        <div style={{
          backgroundColor: 'rgba(19, 26, 41, 0.75)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '1.5rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Globe2 size={18} style={{ color: 'var(--accent)' }} />
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>
                Active Regional Hotspots
              </h3>
            </div>
            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Tracked Signals Count</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            {stats.top_countries.map((item, idx) => (
              <div
                key={item.country}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.7rem 1rem',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(56, 189, 248, 0.1)',
                    color: 'var(--accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                  }}>
                    {idx + 1}
                  </span>
                  <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#e2e8f0' }}>
                    {item.country}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.6rem',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(56, 189, 248, 0.12)',
                    color: '#38bdf8',
                  }}>
                    {item.count} {item.count === 1 ? 'Signal' : 'Signals'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
