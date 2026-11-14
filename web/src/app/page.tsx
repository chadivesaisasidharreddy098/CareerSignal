'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  SignalItem, 
  SignalStats, 
  SignalType,
  JobApplication,
  OpenRole 
} from '../types';
import { 
  fetchSignals, 
  fetchStats, 
  INITIAL_MOCK_SIGNALS, 
  computeLocalStats,
  getStoredApplications,
  saveApplication,
  getVerifiedCareerUrl
} from '../lib/api';
import { GlobalMap } from '../components/GlobalMap';
import { SignalDrawer } from '../components/SignalDrawer';
import { AnalyticsRadar } from '../components/AnalyticsRadar';
import { AIExtractorModal } from '../components/AIExtractorModal';
import { MobileSyncModal } from '../components/MobileSyncModal';
import { JobApplicationModal } from '../components/JobApplicationModal';
import { ApplicationsTrackerModal } from '../components/ApplicationsTrackerModal';
import { VacancyStatsChart } from '../components/VacancyStatsChart';
import { RightRailDashboard } from '../components/RightRailDashboard';
import { JobSearchSidebar } from '../components/JobSearchSidebar';
import { FeaturedJobCards } from '../components/FeaturedJobCards';
import { 
  Home, 
  BarChart3, 
  TrendingUp, 
  MessageSquare, 
  Settings, 
  Star, 
  Sparkles, 
  Eye, 
  Bookmark, 
  Globe2, 
  Radio, 
  Smartphone, 
  Grid2X2,
  Briefcase,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function HomePage() {
  const [signals, setSignals] = useState<SignalItem[]>(INITIAL_MOCK_SIGNALS);
  const [stats, setStats] = useState<SignalStats>(computeLocalStats(INITIAL_MOCK_SIGNALS));
  const [currentNav, setCurrentNav] = useState<'dashboard' | 'map' | 'analytics' | 'messages' | 'saved'>('dashboard');
  const [selectedSignal, setSelectedSignal] = useState<SignalItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isApplicationsModalOpen, setIsApplicationsModalOpen] = useState(false);
  const [signalForApp, setSignalForApp] = useState<SignalItem | null>(null);
  const [selectedRoleForApp, setSelectedRoleForApp] = useState<OpenRole | null>(null);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load signals & stats & saved applications on mount
  useEffect(() => {
    setApplications(getStoredApplications());

    async function loadData() {
      setIsLoading(true);
      try {
        const [fetchedSignals, fetchedStats] = await Promise.all([
          fetchSignals(),
          fetchStats(),
        ]);
        if (fetchedSignals && fetchedSignals.length > 0) {
          // Retain all curated job opportunities (Microsoft Product Designer, Adobe UI/UX, Microsoft Software Analyst)
          const initialIds = new Set(INITIAL_MOCK_SIGNALS.map((s) => s.id));
          const combined = [...INITIAL_MOCK_SIGNALS];
          fetchedSignals.forEach((s) => {
            if (!initialIds.has(s.id) && !combined.some((c) => c.title === s.title && c.company_name === s.company_name)) {
              combined.push(s);
            }
          });
          setSignals(combined);
        }
        if (fetchedStats) {
          setStats(fetchedStats);
        }
      } catch (err) {
        console.warn('Backend offline, using high-fidelity local intelligence:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter signals based on search and type
  const filteredSignals = useMemo(() => {
    return signals.filter((s) => {
      const matchesType = selectedType === 'all' || s.signal_type === selectedType;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesType;

      const matchesSearch =
        s.title.toLowerCase().includes(q) ||
        s.company_name?.toLowerCase().includes(q) ||
        s.city?.toLowerCase().includes(q) ||
        s.country?.toLowerCase().includes(q) ||
        s.summary?.toLowerCase().includes(q) ||
        (s.open_roles && s.open_roles.some((r) => 
          r.title.toLowerCase().includes(q) || 
          r.department?.toLowerCase().includes(q)
        ));
      return matchesType && matchesSearch;
    });
  }, [signals, selectedType, searchQuery]);

  // Handle adding an AI extracted signal
  const handleSignalAdded = (newSignal: SignalItem) => {
    const updated = [newSignal, ...signals];
    setSignals(updated);
    setStats(computeLocalStats(updated));
    setSelectedSignal(newSignal);
  };

  // Handle opening real-time application modal
  const handleOpenApply = (signal: SignalItem, role?: OpenRole) => {
    setSignalForApp(signal);
    setSelectedRoleForApp(role || null);
    setIsApplyModalOpen(true);
  };

  // Handle saving a job for later
  const handleSaveJob = (signal: SignalItem) => {
    const existing = getStoredApplications();
    const alreadySaved = existing.some((a) => a.signal_id === signal.id);
    if (!alreadySaved) {
      const newApp: JobApplication = {
        id: `saved-${Date.now()}`,
        signal_id: signal.id,
        role_title: signal.open_roles?.[0]?.title || signal.title,
        company_name: signal.company_name || 'Enterprise Partner',
        applicant_name: 'Current User',
        applicant_email: 'user@example.com',
        status: 'Submitted',
        submitted_at: new Date().toISOString(),
      };
      saveApplication(newApp);
      setApplications(getStoredApplications());
    }
  };

  // Handle application completion
  const handleApplicationSubmitted = (newApp: JobApplication) => {
    setApplications((prev) => [newApp, ...prev]);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0e0e13',
      backgroundImage: `
        radial-gradient(ellipse at 85% 15%, rgba(88, 28, 135, 0.16) 0%, transparent 55%),
        radial-gradient(ellipse at 15% 85%, rgba(30, 58, 138, 0.14) 0%, transparent 55%)
      `,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      color: '#f8fafc',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      {/* Main High-End Dashboard Card Shell */}
      <div style={{
        width: '100%',
        maxWidth: '1440px',
        backgroundColor: '#141518',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '28px',
        boxShadow: '0 40px 100px -20px rgba(0, 0, 0, 0.95), 0 0 50px rgba(37, 99, 235, 0.06)',
        display: 'flex',
        overflow: 'hidden',
        minHeight: '840px',
      }}>
        {/* ========================================================= */}
        {/* 1. LEFT-MOST COMPACT NAVIGATION ICON RAIL (64px)         */}
        {/* ========================================================= */}
        <nav style={{
          width: '64px',
          backgroundColor: '#111215',
          borderRight: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.5rem 0.5rem',
          flexShrink: 0,
          zIndex: 10,
        }}>
          {/* Top Brand Grid Logo */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.5rem',
          }}>
            <button
              onClick={() => setCurrentNav('dashboard')}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38bdf8',
                cursor: 'pointer',
              }}
              title="CareerSignal Executive Dashboard"
            >
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 4px)',
                gap: '2.5px',
              }}>
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#38bdf8' }} />
                ))}
              </div>
            </button>

            {/* Navigation Buttons Stack */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.9rem',
            }}>
              {/* Home / Dashboard */}
              <button
                onClick={() => setCurrentNav('dashboard')}
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: currentNav === 'dashboard' ? '#2563eb' : 'transparent',
                  color: currentNav === 'dashboard' ? '#ffffff' : '#64748b',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: currentNav === 'dashboard' ? '0 0 16px rgba(37, 99, 235, 0.5)' : 'none',
                  transition: 'all 0.15s ease',
                }}
                title="Dashboard View"
              >
                <Home size={18} />
              </button>

              {/* Analytics / Bar Chart */}
              <button
                onClick={() => setCurrentNav(currentNav === 'analytics' ? 'dashboard' : 'analytics')}
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: currentNav === 'analytics' ? '#2563eb' : 'transparent',
                  color: currentNav === 'analytics' ? '#ffffff' : '#64748b',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                title="Labor Analytics"
              >
                <BarChart3 size={18} />
              </button>

              {/* Global Cyber World Map / Trending */}
              <button
                onClick={() => setCurrentNav(currentNav === 'map' ? 'dashboard' : 'map')}
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: currentNav === 'map' ? '#2563eb' : 'transparent',
                  color: currentNav === 'map' ? '#ffffff' : '#64748b',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                title="Global Radar Map"
              >
                <TrendingUp size={18} />
              </button>

              {/* Messages / Recruiter Chat */}
              <button
                onClick={() => alert('Recruiter Inquiries: David Jose (Microsoft) and Ishitha Xavier (Adobe) are currently active.')}
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: 'transparent',
                  color: '#64748b',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                title="Direct Messages"
              >
                <MessageSquare size={18} />
              </button>

              {/* Settings */}
              <button
                onClick={() => setIsMobileModalOpen(true)}
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: 'transparent',
                  color: '#64748b',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                title="Settings & Mobile Companion"
              >
                <Settings size={18} />
              </button>

              {/* Saved Applications / Favorites */}
              <button
                onClick={() => setIsApplicationsModalOpen(true)}
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: 'transparent',
                  color: '#64748b',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                title="Saved Applications Tracker"
              >
                <Star size={18} />
              </button>
            </div>
          </div>

          {/* Bottom AI Ingest Button */}
          <button
            onClick={() => setIsAiModalOpen(true)}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: 'rgba(56, 189, 248, 0.12)',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              color: '#38bdf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
            title="AI Ingest Press Wire"
          >
            <Sparkles size={16} />
          </button>
        </nav>

        {/* ========================================================= */}
        {/* 2. INNER DASHBOARD BODY (3 SECTIONS: LEFT, CENTER, RIGHT) */}
        {/* ========================================================= */}
        <div style={{
          display: 'flex',
          flex: 1,
          padding: '1.4rem 1.6rem',
          gap: '1.5rem',
          overflowX: 'auto',
        }}>
          {/* ----------------------------------------------------- */}
          {/* COLUMN 2: JOB SEARCH & FILTER SIDEBAR (265px)         */}
          {/* ----------------------------------------------------- */}
          <JobSearchSidebar
            searchQuery={searchQuery}
            onSearchChange={(q) => setSearchQuery(q)}
            onSelectCompany={(c) => setSearchQuery(c)}
            onSelectRoleFilter={(r) => setSearchQuery(r)}
            onOpenProModal={() => setIsMobileModalOpen(true)}
          />

          {/* ----------------------------------------------------- */}
          {/* COLUMN 3: CENTER MAIN CONTENT (METRICS, CHART, CARDS) */}
          {/* ----------------------------------------------------- */}
          <main style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.15rem',
            flex: 1,
            minWidth: '540px',
          }}>
            {/* Conditional Views: Dashboard VS Global Map VS Analytics */}
            {currentNav === 'map' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <Globe2 size={16} style={{ color: '#38bdf8' }} />
                    <span>Global Cyber World Map Radar</span>
                  </h3>
                  <button
                    onClick={() => setCurrentNav('dashboard')}
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#cbd5e1',
                      borderRadius: '6px',
                      padding: '0.3rem 0.75rem',
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    ← Back to Dashboard
                  </button>
                </div>
                <GlobalMap
                  signals={filteredSignals}
                  selectedSignalId={selectedSignal?.id}
                  onSelectSignal={(sig) => setSelectedSignal(sig)}
                  onApplySignal={(sig) => handleOpenApply(sig)}
                />
              </div>
            ) : currentNav === 'analytics' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <BarChart3 size={16} style={{ color: '#38bdf8' }} />
                    <span>Labor Market Analytics & Distribution</span>
                  </h3>
                  <button
                    onClick={() => setCurrentNav('dashboard')}
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#cbd5e1',
                      borderRadius: '6px',
                      padding: '0.3rem 0.75rem',
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    ← Back to Dashboard
                  </button>
                </div>
                <AnalyticsRadar stats={stats} signals={signals} />
              </div>
            ) : (
              /* DEFAULT: EXECUTIVE DASHBOARD MATCHING USER REFERENCE IMAGE */
              <>
                {/* 3 Pastel Stat Cards Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '1rem',
                }}>
                  {/* 1. Lavender: Profile Views */}
                  <div style={{
                    backgroundColor: '#dbe4ff',
                    borderRadius: '16px',
                    padding: '1.15rem 1.25rem',
                    color: '#0f172a',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '105px',
                    boxShadow: '0 4px 15px rgba(219, 228, 255, 0.15)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1e293b' }}>
                        Profile Views
                      </span>
                      <Eye size={16} style={{ color: '#1e293b' }} />
                    </div>
                    <div style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1 }}>
                      1957
                    </div>
                  </div>

                  {/* 2. Soft Butter Yellow: Ideal Matches */}
                  <div style={{
                    backgroundColor: '#fef08a',
                    borderRadius: '16px',
                    padding: '1.15rem 1.25rem',
                    color: '#0f172a',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '105px',
                    boxShadow: '0 4px 15px rgba(254, 240, 138, 0.15)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1e293b' }}>
                        Ideal Matches
                      </span>
                      <Star size={16} style={{ color: '#1e293b' }} />
                    </div>
                    <div style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1 }}>
                      56
                    </div>
                  </div>

                  {/* 3. Soft Blush Pink: Saved */}
                  <div 
                    onClick={() => setIsApplicationsModalOpen(true)}
                    style={{
                      backgroundColor: '#fecdd3',
                      borderRadius: '16px',
                      padding: '1.15rem 1.25rem',
                      color: '#0f172a',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      minHeight: '105px',
                      boxShadow: '0 4px 15px rgba(254, 205, 211, 0.15)',
                      cursor: 'pointer',
                    }}
                    title="Click to view saved applications"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1e293b' }}>
                        Saved
                      </span>
                      <Bookmark size={16} style={{ color: '#1e293b' }} />
                    </div>
                    <div style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1 }}>
                      {String(Math.max(7, applications.length)).padStart(2, '0')}
                    </div>
                  </div>
                </div>

                {/* Vacancy Stats Chart Card */}
                <VacancyStatsChart />

                {/* Featured Active Opportunities (Microsoft & Adobe Cards) */}
                <FeaturedJobCards
                  signals={filteredSignals}
                  onApply={(sig, role) => handleOpenApply(sig, role)}
                  onSaveJob={(sig) => handleSaveJob(sig)}
                  onSelectSignal={(sig) => setSelectedSignal(sig)}
                />
              </>
            )}
          </main>

          {/* ----------------------------------------------------- */}
          {/* COLUMN 4: RIGHT-SIDEBAR (TOP BAR, CALENDAR, NETWORKING, MESSAGES) */}
          {/* ----------------------------------------------------- */}
          <RightRailDashboard applications={applications} />
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. OPERATIONAL MODALS & DRAWERS                          */}
      {/* ========================================================= */}

      {/* Signal Details Drawer */}
      <SignalDrawer
        signal={selectedSignal}
        onClose={() => setSelectedSignal(null)}
        onApply={(sig, role) => handleOpenApply(sig, role)}
      />

      {/* Real-Time Job Application Modal */}
      {signalForApp && (
        <JobApplicationModal
          signal={signalForApp}
          selectedRole={selectedRoleForApp}
          isOpen={isApplyModalOpen}
          onClose={() => {
            setIsApplyModalOpen(false);
            setSignalForApp(null);
            setSelectedRoleForApp(null);
          }}
          onApplicationSubmitted={handleApplicationSubmitted}
        />
      )}

      {/* Applications Tracker Dashboard Modal */}
      <ApplicationsTrackerModal
        isOpen={isApplicationsModalOpen}
        onClose={() => setIsApplicationsModalOpen(false)}
        applications={applications}
        onApplyNew={() => {
          setIsApplicationsModalOpen(false);
          if (signals.length > 0) handleOpenApply(signals[0]);
        }}
      />

      {/* AI Ingest Modal */}
      <AIExtractorModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onSignalAdded={handleSignalAdded}
      />

      {/* Mobile Sync / Settings Modal */}
      <MobileSyncModal
        isOpen={isMobileModalOpen}
        onClose={() => setIsMobileModalOpen(false)}
      />
    </div>
  );
}
