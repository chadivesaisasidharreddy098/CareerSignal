'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { SignalItem, SignalType } from '../types';
import { getVerifiedCareerUrl } from '../lib/api';
import { 
  Activity, 
  MapPin, 
  ShieldCheck, 
  Sparkles,
  RefreshCw,
  Compass,
  ZoomIn,
  ZoomOut,
  Navigation,
  Globe2,
  Radio,
  Send,
  ExternalLink,
  Briefcase,
  TrendingUp,
  TrendingDown,
  Clock,
  Layers,
  Filter,
  X
} from 'lucide-react';

export interface GlobalMapProps {
  signals: SignalItem[];
  selectedSignalId?: number | null;
  onSelectSignal: (signal: SignalItem) => void;
  onApplySignal?: (signal: SignalItem) => void;
}

// Major Global Innovation Corridors (Talent Flow Arcs)
const GLOBAL_TALENT_ARCS = [
  { from: [-97.74, 30.27], to: [-0.12, 51.5], label: 'Austin → London (AI & FinTech)', speed: '3.2s' },
  { from: [-0.12, 51.5], to: [103.82, 1.35], label: 'London → Singapore (Frontier AI)', speed: '3.8s' },
  { from: [77.59, 12.97], to: [8.68, 50.11], label: 'Bengaluru → Frankfurt (Cloud & Cyber)', speed: '3.5s' },
  { from: [139.65, 35.68], to: [-122.42, 37.77], label: 'Tokyo → Silicon Valley (Autonomous Agents)', speed: '4.1s' },
  { from: [-46.63, -23.55], to: [-0.12, 51.5], label: 'São Paulo → London (Cross-Border Fintech)', speed: '3.9s' },
  { from: [-79.38, 43.65], to: [2.35, 48.86], label: 'Toronto → Paris (Open Source Models)', speed: '3.6s' },
  { from: [13.74, 51.05], to: [130.71, 32.80], label: 'Dresden → Kumamoto (Semiconductor Lithography)', speed: '4.4s' },
];

// Calibrated Region Viewport Presets for 1000x500 Equirectangular Viewport
const REGION_PRESETS: Record<string, { label: string; bounds: [number, number, number, number] }> = {
  global: { label: 'Global Radar', bounds: [0, 0, 1000, 500] },
  na: { label: 'North America', bounds: [90, 30, 360, 240] },
  europe: { label: 'Europe', bounds: [440, 45, 230, 185] },
  apac: { label: 'Asia-Pacific', bounds: [620, 60, 370, 310] },
  latam: { label: 'Latin America', bounds: [250, 205, 240, 270] },
  emea: { label: 'Middle East & Africa', bounds: [440, 140, 270, 280] },
};

// Global Tech Capital Timezones for Live Radar Clocks
const TECH_TIMEZONES = [
  { city: 'San Francisco', zone: 'America/Los_Angeles', label: 'SF / Silicon Valley' },
  { city: 'London', zone: 'Europe/London', label: 'London' },
  { city: 'Frankfurt', zone: 'Europe/Berlin', label: 'Frankfurt / Dresden' },
  { city: 'Bengaluru', zone: 'Asia/Kolkata', label: 'Bengaluru' },
  { city: 'Tokyo', zone: 'Asia/Tokyo', label: 'Tokyo' },
];

export const GlobalMap: React.FC<GlobalMapProps> = ({
  signals,
  selectedSignalId,
  onSelectSignal,
  onApplySignal,
}) => {
  const [activeRegion, setActiveRegion] = useState<string>('global');
  const [currentBounds, setCurrentBounds] = useState<[number, number, number, number]>([0, 0, 1000, 500]);
  const [filterType, setFilterType] = useState<string>('all');
  const [hoveredSignal, setHoveredSignal] = useState<SignalItem | null>(null);
  const [dismissedCardId, setDismissedCardId] = useState<number | null>(null);
  const [mouseCoords, setMouseCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [showArcs, setShowArcs] = useState<boolean>(true);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showScanner, setShowScanner] = useState<boolean>(true);
  const [clockTimes, setClockTimes] = useState<Record<string, string>>({});

  // Real-time world clocks update
  useEffect(() => {
    const updateTimes = () => {
      const times: Record<string, string> = {};
      TECH_TIMEZONES.forEach((tz) => {
        try {
          times[tz.city] = new Intl.DateTimeFormat('en-US', {
            timeZone: tz.zone,
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }).format(new Date());
        } catch {
          times[tz.city] = '--:--';
        }
      });
      setClockTimes(times);
    };

    updateTimes();
    const interval = setInterval(updateTimes, 15000);
    return () => clearInterval(interval);
  }, []);

  // Update bounds when preset changes
  useEffect(() => {
    if (REGION_PRESETS[activeRegion]) {
      setCurrentBounds(REGION_PRESETS[activeRegion].bounds);
    }
  }, [activeRegion]);

  // Project geographic coordinates to 1000x500 equirectangular viewport
  const projectCoords = (lat: number, lon: number) => {
    const x = ((lon + 180) / 360) * 1000;
    const y = ((90 - lat) / 180) * 500;
    return { x, y };
  };

  // Zoom controls
  const handleZoom = (factor: number) => {
    setCurrentBounds((prev) => {
      const [x, y, w, h] = prev;
      const newW = Math.max(160, Math.min(1000, w * factor));
      const newH = Math.max(80, Math.min(500, h * factor));
      const deltaX = (w - newW) / 2;
      const deltaY = (h - newH) / 2;
      return [
        Math.max(0, Math.min(1000 - newW, x + deltaX)),
        Math.max(0, Math.min(500 - newH, y + deltaY)),
        newW,
        newH
      ];
    });
  };

  // Quick jump to specific city epicenter
  const handleJumpToCity = (signal: SignalItem) => {
    if (signal.latitude !== undefined && signal.longitude !== undefined) {
      const { x, y } = projectCoords(signal.latitude, signal.longitude);
      const w = 220;
      const h = 140;
      setCurrentBounds([
        Math.max(0, Math.min(1000 - w, x - w / 2)),
        Math.max(0, Math.min(500 - h, y - h / 2)),
        w,
        h,
      ]);
      onSelectSignal(signal);
    }
  };

  // Filter signals based on type
  const filteredSignals = useMemo(() => {
    return signals.filter((s) => {
      if (filterType !== 'all' && s.signal_type !== filterType) return false;
      return s.latitude !== undefined && s.longitude !== undefined;
    });
  }, [signals, filterType]);

  const getSignalColor = (type: SignalType) => {
    switch (type) {
      case 'hiring_surge':
        return { primary: '#10b981', glow: 'rgba(16, 185, 129, 0.7)', text: '#34d399', badge: 'Hiring' };
      case 'layoff':
        return { primary: '#f43f5e', glow: 'rgba(244, 63, 94, 0.7)', text: '#fb7185', badge: 'Layoffs' };
      case 'expansion':
        return { primary: '#06b6d4', glow: 'rgba(6, 182, 212, 0.7)', text: '#38bdf8', badge: 'Expansion' };
      case 'restructuring':
        return { primary: '#f59e0b', glow: 'rgba(245, 158, 11, 0.7)', text: '#fbbf24', badge: 'Shift' };
      default:
        return { primary: '#38bdf8', glow: 'rgba(56, 189, 248, 0.7)', text: '#38bdf8', badge: 'Signal' };
    }
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    const relY = (e.clientY - rect.top) / rect.height;
    const [minX, minY, w, h] = currentBounds;
    const currentX = minX + relX * w;
    const currentY = minY + relY * h;
    const lon = Math.round((currentX / 1000) * 360 - 180);
    const lat = Math.round(90 - (currentY / 500) * 180);
    setMouseCoords({ lat, lon });
  };

  return (
    <div style={{
      position: 'relative',
      borderRadius: '18px',
      backgroundColor: '#030712',
      border: '1px solid rgba(56, 189, 248, 0.3)',
      boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.95), 0 0 35px rgba(56, 189, 248, 0.15)',
      overflow: 'hidden',
    }}>
      {/* Top Map HUD Command Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.85rem 1.25rem',
        borderBottom: '1px solid rgba(56, 189, 248, 0.2)',
        background: 'linear-gradient(90deg, rgba(8, 14, 28, 0.95) 0%, rgba(13, 22, 42, 0.95) 100%)',
        backdropFilter: 'blur(16px)',
        gap: '0.75rem',
        zIndex: 20,
        position: 'relative',
      }}>
        {/* Left Status & Coordinates */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.3rem 0.75rem',
            borderRadius: '9999px',
            backgroundColor: 'rgba(56, 189, 248, 0.12)',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#38bdf8',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            boxShadow: '0 0 12px rgba(56, 189, 248, 0.25)',
          }}>
            <span style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: '#38bdf8',
              boxShadow: '0 0 8px #38bdf8',
              animation: 'pulse 1.8s infinite',
            }} />
            Global Cyber Radar
          </div>

          <div style={{ color: '#94a3b8', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Activity size={14} style={{ color: '#38bdf8' }} />
            <span>{filteredSignals.length} Active Hotspots</span>
          </div>

          {mouseCoords && (
            <div style={{
              fontFamily: 'monospace',
              fontSize: '0.72rem',
              color: '#38bdf8',
              backgroundColor: 'rgba(56, 189, 248, 0.08)',
              border: '1px solid rgba(56, 189, 248, 0.2)',
              padding: '0.2rem 0.55rem',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
            }}>
              <Compass size={11} />
              <span>
                {mouseCoords.lat >= 0 ? `${mouseCoords.lat}°N` : `${Math.abs(mouseCoords.lat)}°S`},{' '}
                {mouseCoords.lon >= 0 ? `${mouseCoords.lon}°E` : `${Math.abs(mouseCoords.lon)}°W`}
              </span>
            </div>
          )}
        </div>

        {/* Center / Signal Type Chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Signals', color: '#38bdf8' },
            { id: 'hiring_surge', label: 'Hiring Surges', color: '#10b981' },
            { id: 'layoff', label: 'Layoff Alerts', color: '#f43f5e' },
            { id: 'expansion', label: 'Expansions', color: '#06b6d4' },
            { id: 'restructuring', label: 'Restructuring', color: '#f59e0b' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              style={{
                background: filterType === tab.id ? `${tab.color}25` : 'rgba(255, 255, 255, 0.03)',
                border: filterType === tab.id ? `1px solid ${tab.color}` : '1px solid rgba(255, 255, 255, 0.08)',
                color: filterType === tab.id ? tab.color : '#94a3b8',
                padding: '0.28rem 0.65rem',
                borderRadius: '6px',
                fontSize: '0.74rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right Region Presets & Feature Toggles */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowArcs(!showArcs)}
            style={{
              background: showArcs ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.03)',
              border: showArcs ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
              color: showArcs ? '#38bdf8' : '#64748b',
              padding: '0.28rem 0.55rem',
              borderRadius: '6px',
              fontSize: '0.72rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
            title="Toggle Global Talent Flow Arcs"
          >
            Flow Arcs
          </button>

          <button
            onClick={() => setShowGrid(!showGrid)}
            style={{
              background: showGrid ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.03)',
              border: showGrid ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
              color: showGrid ? '#38bdf8' : '#64748b',
              padding: '0.28rem 0.55rem',
              borderRadius: '6px',
              fontSize: '0.72rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
            title="Toggle Coordinate Grid"
          >
            Grid
          </button>

          <button
            onClick={() => setShowScanner(!showScanner)}
            style={{
              background: showScanner ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.03)',
              border: showScanner ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
              color: showScanner ? '#38bdf8' : '#64748b',
              padding: '0.28rem 0.55rem',
              borderRadius: '6px',
              fontSize: '0.72rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
            title="Toggle Radar Sweep Beam"
          >
            Radar Beam
          </button>

          {Object.entries(REGION_PRESETS).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => {
                setActiveRegion(key);
                setCurrentBounds(preset.bounds);
              }}
              style={{
                background: activeRegion === key ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.03)',
                border: activeRegion === key ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                color: activeRegion === key ? '#38bdf8' : '#64748b',
                padding: '0.28rem 0.55rem',
                borderRadius: '6px',
                fontSize: '0.72rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Epicenters Quick Jump Bar */}
      <div style={{
        backgroundColor: 'rgba(8, 14, 28, 0.85)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        padding: '0.45rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        overflowX: 'auto',
        fontSize: '0.72rem',
        color: '#94a3b8',
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#38bdf8', fontWeight: 700, whiteSpace: 'nowrap' }}>
          <Navigation size={11} /> Quick Jump:
        </span>
        {signals.slice(0, 10).map((sig) => (
          <button
            key={sig.id}
            onClick={() => handleJumpToCity(sig)}
            style={{
              background: selectedSignalId === sig.id ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.03)',
              border: selectedSignalId === sig.id ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.07)',
              color: selectedSignalId === sig.id ? '#ffffff' : '#cbd5e1',
              borderRadius: '9999px',
              padding: '0.15rem 0.6rem',
              fontSize: '0.72rem',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
            }}
          >
            <span>{sig.city || sig.country}</span>
            <span style={{ color: (sig.impact_headcount || 0) > 0 ? '#34d399' : '#fb7185', fontSize: '0.68rem' }}>
              {(sig.impact_headcount || 0) > 0 ? `+${sig.impact_headcount}` : sig.impact_headcount}
            </span>
          </button>
        ))}
      </div>

      {/* Main Vector Map Canvas Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '560px',
        backgroundColor: '#020617',
        overflow: 'hidden',
      }}>
        {/* Cyber Deep Gradient Space Background */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 50%, #081125 0%, #030712 75%, #01040a 100%)',
          pointerEvents: 'none',
        }} />

        {/* Ambient Nebula Glow Behind Major Continents */}
        <div style={{
          position: 'absolute',
          width: '320px',
          height: '240px',
          left: '20%',
          top: '25%',
          background: 'radial-gradient(ellipse, rgba(56, 189, 248, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          width: '300px',
          height: '220px',
          left: '55%',
          top: '22%',
          background: 'radial-gradient(ellipse, rgba(16, 185, 129, 0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          width: '340px',
          height: '250px',
          left: '72%',
          top: '30%',
          background: 'radial-gradient(ellipse, rgba(6, 182, 212, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Interactive Pure SVG Vector Map */}
        <svg
          viewBox={`${currentBounds[0]} ${currentBounds[1]} ${currentBounds[2]} ${currentBounds[3]}`}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            transition: 'viewBox 0.65s cubic-bezier(0.16, 1, 0.3, 1)',
            cursor: 'crosshair',
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setMouseCoords(null)}
        >
          <defs>
            {/* Coordinate Grid Pattern */}
            <pattern id="vectorGrid" width="25" height="25" patternUnits="userSpaceOnUse">
              <path d="M 25 0 L 0 0 0 25" fill="none" stroke="rgba(56, 189, 248, 0.05)" strokeWidth="0.5" />
            </pattern>

            {/* Neon Radar Sweep Gradient */}
            <linearGradient id="vectorRadarBeam" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="60%" stopColor="rgba(56, 189, 248, 0.02)" />
              <stop offset="95%" stopColor="rgba(56, 189, 248, 0.18)" />
              <stop offset="100%" stopColor="rgba(56, 189, 248, 0.55)" />
            </linearGradient>

            {/* Glowing Flow Arc Gradient */}
            <linearGradient id="talentArcGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#818cf8" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="0.85" />
            </linearGradient>

            {/* Filter for node glowing core */}
            <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Coordinate Graticule Grid */}
          {showGrid && (
            <rect width="1000" height="500" fill="url(#vectorGrid)" opacity="0.6" pointerEvents="none" />
          )}

          {/* Major Geographical Reference Lines */}
          <g stroke="rgba(56, 189, 248, 0.12)" strokeDasharray="3 5" strokeWidth="0.75" pointerEvents="none">
            {/* Equator (0° Latitude) */}
            <line x1="0" y1="250" x2="1000" y2="250" />
            {/* Prime Meridian (0° Longitude) */}
            <line x1="500" y1="0" x2="500" y2="500" />
            {/* Tropic of Cancer (23.5°N) */}
            <line x1="0" y1="185" x2="1000" y2="185" stroke="rgba(56, 189, 248, 0.07)" />
            {/* Tropic of Capricorn (23.5°S) */}
            <line x1="0" y1="315" x2="1000" y2="315" stroke="rgba(56, 189, 248, 0.07)" />
          </g>

          {/* BASE SILHOUETTE WORLD MAP IMAGE (User-Provided Equirectangular Silhouette) */}
          <image
            href="/world-map.jpg"
            x="0"
            y="0"
            width="1000"
            height="500"
            preserveAspectRatio="none"
            style={{
              filter: 'invert(1) hue-rotate(185deg) brightness(1.2) contrast(1.7)',
              mixBlendMode: 'screen',
              opacity: 0.88,
              pointerEvents: 'none',
            }}
          />

          {/* Cleanly mask the bottom-left watermark corner */}
          <rect x="0" y="380" width="45" height="120" fill="#020617" />

          {/* Radar Scanning Beam */}
          {showScanner && (
            <rect
              x="0"
              y="0"
              width="140"
              height="500"
              fill="url(#vectorRadarBeam)"
              style={{
                animation: 'radarScan 10s linear infinite',
                pointerEvents: 'none',
              }}
            />
          )}

          {/* Global Talent Flow Trajectory Arcs */}
          {showArcs && (
            <g pointerEvents="none">
              {GLOBAL_TALENT_ARCS.map((arc, i) => {
                const p1 = projectCoords(arc.from[1], arc.from[0]);
                const p2 = projectCoords(arc.to[1], arc.to[0]);
                const midX = (p1.x + p2.x) / 2;
                const midY = Math.min(p1.y, p2.y) - 55;
                const d = `M ${p1.x} ${p1.y} Q ${midX} ${midY} ${p2.x} ${p2.y}`;

                return (
                  <g key={i}>
                    {/* Background glow path */}
                    <path
                      d={d}
                      fill="none"
                      stroke="rgba(56, 189, 248, 0.15)"
                      strokeWidth="2.5"
                    />
                    {/* Animated dashed trajectory line */}
                    <path
                      d={d}
                      fill="none"
                      stroke="url(#talentArcGlow)"
                      strokeWidth="1.2"
                      strokeDasharray="5 7"
                      style={{
                        animation: `pulseRing ${arc.speed} linear infinite`,
                      }}
                    />
                  </g>
                );
              })}
            </g>
          )}

          {/* Dynamic Signal Hotspots */}
          {filteredSignals.map((signal) => {
            const { x, y } = projectCoords(signal.latitude!, signal.longitude!);
            const colors = getSignalColor(signal.signal_type);
            const isSelected = selectedSignalId === signal.id;
            const isHovered = hoveredSignal?.id === signal.id;
            const radius = isSelected ? 8 : isHovered ? 7 : 5;

            return (
              <g
                key={signal.id}
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setDismissedCardId(null);
                  onSelectSignal(signal);
                }}
                onMouseEnter={() => {
                  setDismissedCardId(null);
                  setHoveredSignal(signal);
                }}
              >
                {/* Concentric Pulse Rings */}
                <circle
                  cx={x}
                  cy={y}
                  r={radius + 8}
                  fill="none"
                  stroke={colors.primary}
                  strokeWidth="1.2"
                  opacity="0.5"
                  style={{
                    animation: `pulseRing 2.4s cubic-bezier(0.2, 0.8, 0.4, 1) infinite`,
                    transformOrigin: `${x}px ${y}px`,
                  }}
                />

                <circle
                  cx={x}
                  cy={y}
                  r={radius + 18}
                  fill="none"
                  stroke={colors.primary}
                  strokeWidth="0.8"
                  opacity="0.25"
                  style={{
                    animation: `pulseRing 2.4s cubic-bezier(0.2, 0.8, 0.4, 1) 0.8s infinite`,
                    transformOrigin: `${x}px ${y}px`,
                  }}
                />

                {/* Selected Node Targeting Reticle */}
                {isSelected && (
                  <g>
                    <circle cx={x} cy={y} r="20" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1={x - 24} y1={y} x2={x - 12} y2={y} stroke="#38bdf8" strokeWidth="1.5" />
                    <line x1={x + 12} y1={y} x2={x + 24} y2={y} stroke="#38bdf8" strokeWidth="1.5" />
                    <line x1={x} y1={y - 24} x2={x} y2={y - 12} stroke="#38bdf8" strokeWidth="1.5" />
                    <line x1={x} y1={y + 12} x2={x} y2={y + 24} stroke="#38bdf8" strokeWidth="1.5" />
                  </g>
                )}

                {/* Inner Core Hotspot */}
                <circle
                  cx={x}
                  cy={y}
                  r={radius}
                  fill={colors.primary}
                  filter="url(#nodeGlow)"
                  stroke="#ffffff"
                  strokeWidth={isSelected ? '2' : '1'}
                />

                {/* Center Core Dot */}
                <circle cx={x} cy={y} r="2.2" fill="#ffffff" />

                {/* Company Label Pill */}
                <g transform={`translate(${x + 10}, ${y - 4})`} style={{ pointerEvents: 'none' }}>
                  <rect
                    x="0"
                    y="-8"
                    width={((signal.company_name?.length || 8) * 6.4) + 14}
                    height="16"
                    rx="4"
                    fill="rgba(8, 14, 28, 0.88)"
                    stroke={isSelected ? '#38bdf8' : 'rgba(56, 189, 248, 0.28)'}
                    strokeWidth="0.8"
                  />
                  <text
                    x="6"
                    y="3.5"
                    fill={isSelected ? '#38bdf8' : '#f1f5f9'}
                    fontSize="8.5"
                    fontWeight={isSelected ? '800' : '700'}
                    fontFamily="system-ui, -apple-system, sans-serif"
                    letterSpacing="0.02em"
                  >
                    {signal.company_name}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>

        {/* Floating Zoom & Control Toolbar */}
        <div style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.35rem',
          zIndex: 10,
        }}>
          <button
            onClick={() => handleZoom(0.8)}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'rgba(8, 14, 28, 0.9)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              color: '#38bdf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
            }}
            title="Zoom In"
          >
            <ZoomIn size={15} />
          </button>

          <button
            onClick={() => handleZoom(1.25)}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'rgba(8, 14, 28, 0.9)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              color: '#38bdf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
            }}
            title="Zoom Out"
          >
            <ZoomOut size={15} />
          </button>

          <button
            onClick={() => {
              setActiveRegion('global');
              setCurrentBounds([0, 0, 1000, 500]);
            }}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'rgba(8, 14, 28, 0.9)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              color: '#38bdf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
            }}
            title="Reset Global View"
          >
            <Globe2 size={15} />
          </button>
        </div>

        {/* Floating Signal Intelligence Card */}
        {hoveredSignal && dismissedCardId !== hoveredSignal.id && (
          <div
            style={{
              position: 'absolute',
              bottom: '4rem',
              left: '1.25rem',
              maxWidth: '380px',
              backgroundColor: 'rgba(8, 14, 28, 0.95)',
              border: '1px solid rgba(56, 189, 248, 0.45)',
              borderRadius: '12px',
              padding: '1rem',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.8), 0 0 20px rgba(56, 189, 248, 0.2)',
              backdropFilter: 'blur(16px)',
              zIndex: 30,
              pointerEvents: 'auto',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <div>
                <span style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  padding: '0.15rem 0.45rem',
                  borderRadius: '4px',
                  backgroundColor: getSignalColor(hoveredSignal.signal_type).primary + '25',
                  color: getSignalColor(hoveredSignal.signal_type).text,
                  border: `1px solid ${getSignalColor(hoveredSignal.signal_type).primary}`,
                }}>
                  {getSignalColor(hoveredSignal.signal_type).badge}
                </span>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', marginTop: '0.35rem' }}>
                  {hoveredSignal.company_name}
                </h4>
              </div>

              <button
                onClick={() => setDismissedCardId(hoveredSignal.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'pointer',
                  padding: '0.2rem',
                }}
              >
                <X size={14} />
              </button>
            </div>

            <p style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.4, marginBottom: '0.75rem' }}>
              {hoveredSignal.title}
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '0.4rem',
              marginBottom: '0.85rem',
              fontSize: '0.72rem',
              color: '#94a3b8',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              padding: '0.5rem',
              borderRadius: '6px',
            }}>
              <div>
                <span style={{ color: '#64748b' }}>Location: </span>
                <strong style={{ color: '#f1f5f9' }}>{hoveredSignal.city || hoveredSignal.country}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>Impact: </span>
                <strong style={{
                  color: (hoveredSignal.impact_headcount || 0) > 0 ? '#34d399' : '#fb7185'
                }}>
                  {(hoveredSignal.impact_headcount || 0) > 0 ? `+${hoveredSignal.impact_headcount}` : hoveredSignal.impact_headcount} Roles
                </strong>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>Salary: </span>
                <strong style={{ color: '#f1f5f9' }}>{hoveredSignal.salary_range || 'Competitive'}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>Confidence: </span>
                <strong style={{ color: '#10b981' }}>{Math.round(hoveredSignal.confidence_score * 100)}%</strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (onApplySignal) {
                    onApplySignal(hoveredSignal);
                  } else {
                    onSelectSignal(hoveredSignal);
                  }
                }}
                style={{
                  flex: 1,
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.4rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.3rem',
                }}
              >
                <Send size={11} />
                <span>Quick Apply</span>
              </button>

              <a
                href={getVerifiedCareerUrl(hoveredSignal.company_name, hoveredSignal.careers_url || hoveredSignal.source_url)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                style={{
                  flex: 1,
                  backgroundColor: 'rgba(56, 189, 248, 0.15)',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  color: '#38bdf8',
                  borderRadius: '6px',
                  padding: '0.4rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.3rem',
                }}
              >
                <span>Official Portal</span>
                <ExternalLink size={11} />
              </a>
            </div>
          </div>
        )}

        {/* Global Tech Corridors Real-Time Clock Ribbon */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'rgba(4, 8, 18, 0.92)',
          borderTop: '1px solid rgba(56, 189, 248, 0.2)',
          padding: '0.4rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.72rem',
          color: '#94a3b8',
          zIndex: 10,
          backdropFilter: 'blur(10px)',
          overflowX: 'auto',
          gap: '1.5rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', whiteSpace: 'nowrap' }}>
            <Clock size={12} style={{ color: '#38bdf8' }} />
            <span style={{ fontWeight: 700, color: '#38bdf8' }}>GLOBAL TECH CLOCKS:</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', whiteSpace: 'nowrap' }}>
            {TECH_TIMEZONES.map((tz) => (
              <div key={tz.city} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ color: '#64748b' }}>{tz.city}:</span>
                <strong style={{ color: '#f8fafc', fontFamily: 'monospace' }}>
                  {clockTimes[tz.city] || '--:--'}
                </strong>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', whiteSpace: 'nowrap' }}>
            <Radio size={12} style={{ color: '#10b981' }} />
            <span style={{ color: '#10b981', fontWeight: 600 }}>LIVE RADAR ACTIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
};
