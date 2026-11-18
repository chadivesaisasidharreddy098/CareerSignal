'use client';

import React, { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

interface VacancyStatsChartProps {
  onMonthChange?: (month: string) => void;
}

export const VacancyStatsChart: React.FC<VacancyStatsChartProps> = () => {
  const [selectedMonth, setSelectedMonth] = useState('JAN 2023');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hoveredWeek, setHoveredWeek] = useState<number | null>(null);

  const months = ['JAN 2023', 'FEB 2023', 'MAR 2023', 'Q3 2026', 'NOV 2026'];

  // Month-adaptive data points
  const getMonthData = (m: string) => {
    if (m === 'NOV 2026') {
      return [
        { week: 'week 01', sent: 74, interviews: 42 },
        { week: 'week 02', sent: 62, interviews: 38 },
        { week: 'week 03', sent: 88, interviews: 54 },
        { week: 'week 04', sent: 96, interviews: 78 },
      ];
    }
    if (m === 'Q3 2026') {
      return [
        { week: 'week 01', sent: 55, interviews: 28 },
        { week: 'week 02', sent: 65, interviews: 40 },
        { week: 'week 03', sent: 72, interviews: 46 },
        { week: 'week 04', sent: 84, interviews: 58 },
      ];
    }
    if (m === 'FEB 2023') {
      return [
        { week: 'week 01', sent: 50, interviews: 24 },
        { week: 'week 02', sent: 70, interviews: 44 },
        { week: 'week 03', sent: 65, interviews: 36 },
        { week: 'week 04', sent: 90, interviews: 68 },
      ];
    }
    // Default JAN 2023
    return [
      { week: 'week 01', sent: 68, interviews: 32 },
      { week: 'week 02', sent: 48, interviews: 26 },
      { week: 'week 03', sent: 56, interviews: 38 },
      { week: 'week 04', sent: 82, interviews: 62 },
    ];
  };

  const weekData = getMonthData(selectedMonth);

  // SVG Coordinates mapping for 520x150 chart area (x: 40..480, y: 20..140)
  // Higher val = smaller y coordinate (higher up on graph)
  const sentPoints = weekData.map((d, i) => {
    const x = 50 + i * 140;
    const y = Math.round(140 - (d.sent / 100) * 115);
    return { x, y, val: d.sent };
  });

  const interviewPoints = weekData.map((d, i) => {
    const x = 50 + i * 140;
    const y = Math.round(140 - (d.interviews / 100) * 115);
    return { x, y, val: d.interviews };
  });

  // Smooth cubic spline curves
  const sentPathD = `M ${sentPoints[0].x} ${sentPoints[0].y} C ${sentPoints[0].x + 70} ${sentPoints[0].y}, ${sentPoints[1].x - 60} ${sentPoints[1].y}, ${sentPoints[1].x} ${sentPoints[1].y} C ${sentPoints[1].x + 60} ${sentPoints[1].y}, ${sentPoints[2].x - 60} ${sentPoints[2].y}, ${sentPoints[2].x} ${sentPoints[2].y} C ${sentPoints[2].x + 60} ${sentPoints[2].y}, ${sentPoints[3].x - 60} ${sentPoints[3].y}, ${sentPoints[3].x} ${sentPoints[3].y}`;
  const sentAreaD = `${sentPathD} L ${sentPoints[3].x} 140 L ${sentPoints[0].x} 140 Z`;

  const interviewPathD = `M ${interviewPoints[0].x} ${interviewPoints[0].y} C ${interviewPoints[0].x + 70} ${interviewPoints[0].y}, ${interviewPoints[1].x - 60} ${interviewPoints[1].y}, ${interviewPoints[1].x} ${interviewPoints[1].y} C ${interviewPoints[1].x + 60} ${interviewPoints[1].y}, ${interviewPoints[2].x - 60} ${interviewPoints[2].y}, ${interviewPoints[2].x} ${interviewPoints[2].y} C ${interviewPoints[2].x + 60} ${interviewPoints[2].y}, ${interviewPoints[3].x - 60} ${interviewPoints[3].y}, ${interviewPoints[3].x} ${interviewPoints[3].y}`;
  const interviewAreaD = `${interviewPathD} L ${interviewPoints[3].x} 140 L ${interviewPoints[0].x} 140 Z`;

  return (
    <div style={{
      backgroundColor: '#1b1c21',
      border: '1px solid rgba(255, 255, 255, 0.06)',
      borderRadius: '18px',
      padding: '1.25rem 1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.85rem',
      position: 'relative',
    }}>
      {/* Header with Title and Month Dropdown */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <h3 style={{
          color: '#38bdf8',
          fontSize: '0.82rem',
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          margin: 0,
        }}>
          VACANCY STATS
        </h3>

        {/* Dropdown Menu */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '0.35rem 0.75rem',
              color: '#cbd5e1',
              fontSize: '0.74rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <Calendar size={13} style={{ color: '#38bdf8' }} />
            <span>{selectedMonth}</span>
            <ChevronDown size={13} style={{ color: '#94a3b8' }} />
          </button>

          {isDropdownOpen && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '0.35rem',
              backgroundColor: '#16171b',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '8px',
              padding: '0.35rem',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.6)',
              zIndex: 30,
              minWidth: '120px',
            }}>
              {months.map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setSelectedMonth(m);
                    setIsDropdownOpen(false);
                  }}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.4rem 0.6rem',
                    backgroundColor: selectedMonth === m ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                    color: selectedMonth === m ? '#38bdf8' : '#cbd5e1',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {m}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* SVG Chart Area */}
      <div style={{ position: 'relative', width: '100%', height: '165px' }}>
        <svg
          viewBox="0 0 520 160"
          style={{ width: '100%', height: '100%', overflow: 'visible' }}
        >
          <defs>
            {/* Green Area Gradient */}
            <linearGradient id="vacancyGreenArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.28" />
              <stop offset="85%" stopColor="#10b981" stopOpacity="0.02" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>

            {/* Blue Area Gradient */}
            <linearGradient id="vacancyBlueArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.32" />
              <stop offset="85%" stopColor="#06b6d4" stopOpacity="0.03" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
            </linearGradient>

            {/* Dot Glow Filters */}
            <filter id="chartGlowGreen" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" />
            </filter>
            <filter id="chartGlowBlue" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" />
            </filter>
          </defs>

          {/* Horizontal Grid Lines & Y-Axis Labels */}
          {[
            { val: '80', y: 20 },
            { val: '60', y: 50 },
            { val: '40', y: 80 },
            { val: '20', y: 110 },
            { val: '0', y: 140 },
          ].map((grid) => (
            <g key={grid.val}>
              <text
                x="18"
                y={grid.y + 4}
                fill="#555d6e"
                fontSize="9"
                fontWeight="600"
                textAnchor="end"
                fontFamily="system-ui, -apple-system, sans-serif"
              >
                {grid.val}
              </text>
              <line
                x1="28"
                y1={grid.y}
                x2="500"
                y2={grid.y}
                stroke="rgba(255, 255, 255, 0.04)"
                strokeDasharray={grid.val === '0' ? 'none' : '3 4'}
              />
            </g>
          ))}

          {/* Area Fills */}
          <path d={interviewAreaD} fill="url(#vacancyBlueArea)" />
          <path d={sentAreaD} fill="url(#vacancyGreenArea)" />

          {/* Spline Lines */}
          <path
            d={interviewPathD}
            fill="none"
            stroke="#06b6d4"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d={sentPathD}
            fill="none"
            stroke="#10b981"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Interactive Week Vertical Trigger Bands */}
          {weekData.map((w, idx) => {
            const xCoords = [50, 190, 330, 470];
            const x = xCoords[idx];
            const isHovered = hoveredWeek === idx;

            return (
              <g
                key={w.week}
                onMouseEnter={() => setHoveredWeek(idx)}
                onMouseLeave={() => setHoveredWeek(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* Invisible Hover Rect */}
                <rect
                  x={x - 30}
                  y="10"
                  width="60"
                  height="140"
                  fill="transparent"
                />

                {/* Hover Guide Line */}
                {isHovered && (
                  <line
                    x1={x}
                    y1="15"
                    x2={x}
                    y2="140"
                    stroke="rgba(255, 255, 255, 0.2)"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                )}

                {/* Green Point */}
                <circle
                  cx={sentPoints[idx].x}
                  cy={sentPoints[idx].y}
                  r="7"
                  fill="#10b981"
                  opacity="0.3"
                  filter="url(#chartGlowGreen)"
                />
                <circle
                  cx={sentPoints[idx].x}
                  cy={sentPoints[idx].y}
                  r="4"
                  fill="#10b981"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />

                {/* Blue Point */}
                <circle
                  cx={interviewPoints[idx].x}
                  cy={interviewPoints[idx].y}
                  r="7"
                  fill="#06b6d4"
                  opacity="0.3"
                  filter="url(#chartGlowBlue)"
                />
                <circle
                  cx={interviewPoints[idx].x}
                  cy={interviewPoints[idx].y}
                  r="4"
                  fill="#06b6d4"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />

                {/* Week Label on X-Axis */}
                <text
                  x={x}
                  y="156"
                  fill={isHovered ? '#38bdf8' : '#64748b'}
                  fontSize="9.5"
                  fontWeight={isHovered ? '700' : '500'}
                  textAnchor="middle"
                  fontFamily="system-ui, -apple-system, sans-serif"
                >
                  {w.week}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Floating Tooltip */}
        {hoveredWeek !== null && (
          <div style={{
            position: 'absolute',
            top: '10px',
            left: `${[50, 190, 330, 470][hoveredWeek] * 0.95}px`,
            transform: 'translateX(-50%)',
            backgroundColor: '#0f172a',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            borderRadius: '6px',
            padding: '0.35rem 0.65rem',
            boxShadow: '0 8px 16px rgba(0,0,0,0.6)',
            pointerEvents: 'none',
            zIndex: 10,
            whiteSpace: 'nowrap',
          }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.2rem' }}>
              {weekData[hoveredWeek].week.toUpperCase()}
            </div>
            <div style={{ fontSize: '0.68rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span>● Sent:</span>
              <strong>{weekData[hoveredWeek].sent}</strong>
            </div>
            <div style={{ fontSize: '0.68rem', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span>● Interviews:</span>
              <strong>{weekData[hoveredWeek].interviews}</strong>
            </div>
          </div>
        )}
      </div>

      {/* Chart Legend Footer */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.5rem',
        paddingTop: '0.25rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.04)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.74rem', color: '#94a3b8' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 6px #10b981' }} />
          <span>Application sent</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.74rem', color: '#94a3b8' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#06b6d4', boxShadow: '0 0 6px #06b6d4' }} />
          <span>Interviews</span>
        </div>
      </div>
    </div>
  );
};

