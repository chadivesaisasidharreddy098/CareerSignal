'use client';

import React, { useState, useEffect } from 'react';
import { 
  SignalItem, 
  JobApplication,
  OpenRole 
} from '../types';
import { 
  fetchSignals, 
  INITIAL_MOCK_SIGNALS, 
  getStoredApplications,
  saveApplication
} from '../lib/api';
import { JobDiscoveryView } from '../components/JobDiscoveryView';
import { CandidateProfileView } from '../components/CandidateProfileView';
import { SkillInsightsView } from '../components/SkillInsightsView';
import { ApplicationsView } from '../components/ApplicationsView';
import { SettingsView } from '../components/SettingsView';
import { JobApplicationModal } from '../components/JobApplicationModal';
import { 
  LayoutDashboard, 
  Compass, 
  User, 
  Sparkles, 
  FileText, 
  Settings, 
  Search,
  ArrowRight,
  Briefcase
} from 'lucide-react';

export type NavView = 'dashboard' | 'discovery' | 'profile' | 'insights' | 'applications' | 'settings';

export default function HomePage() {
  const [currentNav, setCurrentNav] = useState<NavView>('dashboard');
  const [signals, setSignals] = useState<SignalItem[]>(INITIAL_MOCK_SIGNALS);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [signalForApp, setSignalForApp] = useState<SignalItem | null>(null);
  const [selectedRoleForApp, setSelectedRoleForApp] = useState<OpenRole | null>(null);

  useEffect(() => {
    setApplications(getStoredApplications());

    async function load() {
      try {
        const fetched = await fetchSignals();
        if (fetched && fetched.length > 0) {
          const initialIds = new Set(INITIAL_MOCK_SIGNALS.map((s) => s.id));
          const combined = [...INITIAL_MOCK_SIGNALS];
          fetched.forEach((s) => {
            if (!initialIds.has(s.id) && !combined.some((c) => c.title === s.title && c.company_name === s.company_name)) {
              combined.push(s);
            }
          });
          setSignals(combined);
        }
      } catch (e) {
        console.warn('Backend signals offline, using verified local signals:', e);
      }
    }
    load();
  }, []);

  const handleOpenApply = (signal: SignalItem, role?: OpenRole) => {
    setSignalForApp(signal);
    setSelectedRoleForApp(role || null);
    setIsApplyModalOpen(true);
  };

  const handleApplicationSubmitted = (newApp: JobApplication) => {
    setApplications((prev) => [newApp, ...prev.filter((a) => a.id !== newApp.id)]);
  };

  // Curated list for the PDF Dashboard "Recommended for you" section
  const recommendedJobs = [
    {
      title: 'Product Analyst',
      company: 'Northwind Labs',
      location: 'Remote',
      matchPct: 92,
      signal: signals.find((s) => s.company_name?.includes('Northwind')) || signals[0],
    },
    {
      title: 'Data Engineer II',
      company: 'Brightpath',
      location: 'Hybrid',
      matchPct: 88,
      signal: signals.find((s) => s.company_name?.includes('Brightpath')) || signals[1] || signals[0],
    },
    {
      title: 'UX Researcher',
      company: 'Kestrel',
      location: 'On-site',
      matchPct: 74,
      signal: signals.find((s) => s.company_name?.includes('Kestrel')) || signals[2] || signals[0],
    },
    {
      title: 'Software Systems Analyst',
      company: 'Microsoft',
      location: 'Hyderabad, India (Hybrid)',
      matchPct: 96,
      signal: signals.find((s) => s.company_name?.includes('Microsoft')) || signals[0],
    },
    {
      title: 'Product Designer',
      company: 'Adobe',
      location: 'Bengaluru, India (Remote)',
      matchPct: 94,
      signal: signals.find((s) => s.company_name?.includes('Adobe')) || signals[1] || signals[0],
    },
  ];

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      boxSizing: 'border-box',
      display: 'flex',
      backgroundColor: '#FFFFFF',
      fontFamily: 'Inter, Helvetica, Arial, sans-serif',
      color: '#0F172A',
    }}>
      {/* PDF Left Navigation Sidebar (240px) */}
      <aside style={{
        width: '240px',
        borderRight: '1px solid #E2E8F0',
        padding: '24px 16px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        backgroundColor: '#FFFFFF',
        position: 'sticky',
        top: 0,
        height: '100vh',
        flexShrink: 0,
      }}>
        {/* Brand Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '0 8px 24px',
          fontWeight: 700,
          fontSize: '18px',
          color: '#0F172A',
        }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '6px',
            backgroundColor: '#2563EB',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '13px',
            fontWeight: 800,
          }}>
            CS
          </div>
          <span>CareerSignal</span>
        </div>

        {/* Navigation Links matching CareerSignal.pdf */}
        <button
          onClick={() => setCurrentNav('dashboard')}
          style={{
            padding: '10px 12px',
            borderRadius: '8px',
            border: 'none',
            background: currentNav === 'dashboard' ? '#EFF6FF' : 'transparent',
            color: currentNav === 'dashboard' ? '#1D4ED8' : '#475569',
            fontWeight: currentNav === 'dashboard' ? 600 : 500,
            fontSize: '14px',
            textAlign: 'left',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            transition: 'all 0.15s ease',
          }}
        >
          <LayoutDashboard size={16} />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => setCurrentNav('discovery')}
          style={{
            padding: '10px 12px',
            borderRadius: '8px',
            border: 'none',
            background: currentNav === 'discovery' ? '#EFF6FF' : 'transparent',
            color: currentNav === 'discovery' ? '#1D4ED8' : '#475569',
            fontWeight: currentNav === 'discovery' ? 600 : 500,
            fontSize: '14px',
            textAlign: 'left',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            transition: 'all 0.15s ease',
          }}
        >
          <Compass size={16} />
          <span>Job Discovery</span>
        </button>

        <button
          onClick={() => setCurrentNav('profile')}
          style={{
            padding: '10px 12px',
            borderRadius: '8px',
            border: 'none',
            background: currentNav === 'profile' ? '#EFF6FF' : 'transparent',
            color: currentNav === 'profile' ? '#1D4ED8' : '#475569',
            fontWeight: currentNav === 'profile' ? 600 : 500,
            fontSize: '14px',
            textAlign: 'left',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            transition: 'all 0.15s ease',
          }}
        >
          <User size={16} />
          <span>Candidate Profile</span>
        </button>

        <button
          onClick={() => setCurrentNav('insights')}
          style={{
            padding: '10px 12px',
            borderRadius: '8px',
            border: 'none',
            background: currentNav === 'insights' ? '#EFF6FF' : 'transparent',
            color: currentNav === 'insights' ? '#1D4ED8' : '#475569',
            fontWeight: currentNav === 'insights' ? 600 : 500,
            fontSize: '14px',
            textAlign: 'left',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            transition: 'all 0.15s ease',
          }}
        >
          <Sparkles size={16} />
          <span>Skill Insights</span>
        </button>

        <button
          onClick={() => setCurrentNav('applications')}
          style={{
            padding: '10px 12px',
            borderRadius: '8px',
            border: 'none',
            background: currentNav === 'applications' ? '#EFF6FF' : 'transparent',
            color: currentNav === 'applications' ? '#1D4ED8' : '#475569',
            fontWeight: currentNav === 'applications' ? 600 : 500,
            fontSize: '14px',
            textAlign: 'left',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            transition: 'all 0.15s ease',
          }}
        >
          <FileText size={16} />
          <span>Applications</span>
        </button>

        <button
          onClick={() => setCurrentNav('settings')}
          style={{
            padding: '10px 12px',
            borderRadius: '8px',
            border: 'none',
            background: currentNav === 'settings' ? '#EFF6FF' : 'transparent',
            color: currentNav === 'settings' ? '#1D4ED8' : '#475569',
            fontWeight: currentNav === 'settings' ? 600 : 500,
            fontSize: '14px',
            textAlign: 'left',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginTop: 'auto',
            transition: 'all 0.15s ease',
          }}
        >
          <Settings size={16} />
          <span>Settings</span>
        </button>
      </aside>

      {/* Main View Container */}
      <main style={{
        flex: 1,
        padding: '32px 40px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        overflowY: 'auto',
        backgroundColor: '#FFFFFF',
      }}>
        {/* Render View based on currentNav */}
        {currentNav === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Header matching 1_dashboard.html */}
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#0F172A' }}>
                  Good morning, Alex
                </h1>
                <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#475569' }}>
                  Here is where your job search stands this week.
                </p>
              </div>
              <button
                onClick={() => setCurrentNav('discovery')}
                style={{
                  height: '40px',
                  padding: '0 16px',
                  border: '1px solid #CBD5E1',
                  borderRadius: '8px',
                  background: '#FFFFFF',
                  color: '#334155',
                  font: '500 14px Inter, sans-serif',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Search size={15} />
                <span>Search roles</span>
              </button>
            </header>

            {/* 4 Stats Cards matching 1_dashboard.html */}
            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              <div style={{ border: '1px solid #E2E8F0', borderRadius: '12px', padding: '20px', background: '#FFFFFF' }}>
                <div style={{ fontSize: '13px', color: '#64748B' }}>Profile strength</div>
                <div style={{ fontSize: '28px', fontWeight: 700, marginTop: '8px', color: '#0F172A' }}>82%</div>
              </div>
              <div style={{ border: '1px solid #E2E8F0', borderRadius: '12px', padding: '20px', background: '#FFFFFF' }}>
                <div style={{ fontSize: '13px', color: '#64748B' }}>Active applications</div>
                <div style={{ fontSize: '28px', fontWeight: 700, marginTop: '8px', color: '#0F172A' }}>{applications.length || 14}</div>
              </div>
              <div style={{ border: '1px solid #E2E8F0', borderRadius: '12px', padding: '20px', background: '#FFFFFF' }}>
                <div style={{ fontSize: '13px', color: '#64748B' }}>Interviews scheduled</div>
                <div style={{ fontSize: '28px', fontWeight: 700, marginTop: '8px', color: '#0F172A' }}>3</div>
              </div>
              <div style={{ border: '1px solid #E2E8F0', borderRadius: '12px', padding: '20px', background: '#FFFFFF' }}>
                <div style={{ fontSize: '13px', color: '#64748B' }}>Skill matches this week</div>
                <div style={{ fontSize: '28px', fontWeight: 700, marginTop: '8px', color: '#0F172A' }}>27</div>
              </div>
            </section>

            {/* 2-Column Split: Recommended for you + Upcoming & Activity */}
            <section style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '16px', flex: 1 }}>
              {/* Left Column: Recommended for you */}
              <div style={{
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                background: '#FFFFFF',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 600, fontSize: '16px', color: '#0F172A' }}>
                    Recommended for you
                  </div>
                  <button
                    onClick={() => setCurrentNav('discovery')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#2563EB',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <span>View all</span>
                    <ArrowRight size={13} />
                  </button>
                </div>

                {recommendedJobs.map((job, idx) => {
                  const isHighMatch = job.matchPct >= 80;
                  return (
                    <div
                      key={job.title + idx}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 0',
                        borderBottom: idx < recommendedJobs.length - 1 ? '1px solid #F1F5F9' : 'none',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '14px', color: '#0F172A' }}>
                          {job.title}
                        </div>
                        <div style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>
                          {job.company} · {job.location}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{
                          fontSize: '12px',
                          color: isHighMatch ? '#047857' : '#334155',
                          background: isHighMatch ? '#ECFDF5' : '#F1F5F9',
                          padding: '4px 10px',
                          borderRadius: '999px',
                          fontWeight: 500,
                        }}>
                          {job.matchPct}% match
                        </span>

                        <button
                          onClick={() => handleOpenApply(job.signal)}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '6px',
                            border: '1px solid #CBD5E1',
                            background: '#FFFFFF',
                            color: '#0F172A',
                            fontSize: '13px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#2563EB';
                            e.currentTarget.style.color = '#FFFFFF';
                            e.currentTarget.style.borderColor = '#2563EB';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#FFFFFF';
                            e.currentTarget.style.color = '#0F172A';
                            e.currentTarget.style.borderColor = '#CBD5E1';
                          }}
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Column: Upcoming Milestones + Weekly Activity */}
              <div style={{
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                background: '#FFFFFF',
              }}>
                <div style={{ fontWeight: 600, fontSize: '16px', color: '#0F172A' }}>
                  Upcoming
                </div>
                <div style={{
                  fontSize: '14px',
                  padding: '10px 12px',
                  borderLeft: '3px solid #2563EB',
                  background: '#F8FAFC',
                  borderRadius: '0 6px 6px 0',
                  color: '#0F172A',
                }}>
                  Interview with Northwind Labs · Thu 2:00 PM
                </div>
                <div style={{
                  fontSize: '14px',
                  padding: '10px 12px',
                  borderLeft: '3px solid #94A3B8',
                  background: '#F8FAFC',
                  borderRadius: '0 6px 6px 0',
                  color: '#0F172A',
                }}>
                  Follow up: Brightpath recruiter · Fri
                </div>
                <div style={{
                  fontSize: '14px',
                  padding: '10px 12px',
                  borderLeft: '3px solid #94A3B8',
                  background: '#F8FAFC',
                  borderRadius: '0 6px 6px 0',
                  color: '#0F172A',
                }}>
                  Skill assessment: SQL · Mon
                </div>

                {/* Weekly Activity Bar Chart matching 1_dashboard.html */}
                <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '10px', marginTop: 'auto' }}>
                  <div style={{ fontWeight: 600, fontSize: '14px', color: '#0F172A' }}>
                    Weekly activity
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', height: '110px' }}>
                    <div title="Mon: 45%" style={{ flex: 1, height: '45%', background: '#BFDBFE', borderRadius: '4px 4px 0 0' }} />
                    <div title="Tue: 70%" style={{ flex: 1, height: '70%', background: '#BFDBFE', borderRadius: '4px 4px 0 0' }} />
                    <div title="Wed: 55%" style={{ flex: 1, height: '55%', background: '#BFDBFE', borderRadius: '4px 4px 0 0' }} />
                    <div title="Thu: 90%" style={{ flex: 1, height: '90%', background: '#2563EB', borderRadius: '4px 4px 0 0' }} />
                    <div title="Fri: 65%" style={{ flex: 1, height: '65%', background: '#BFDBFE', borderRadius: '4px 4px 0 0' }} />
                    <div title="Sat: 35%" style={{ flex: 1, height: '35%', background: '#BFDBFE', borderRadius: '4px 4px 0 0' }} />
                    <div title="Sun: 50%" style={{ flex: 1, height: '50%', background: '#BFDBFE', borderRadius: '4px 4px 0 0' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748B' }}>
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {currentNav === 'discovery' && (
          <JobDiscoveryView
            signals={signals}
            onApply={handleOpenApply}
          />
        )}

        {currentNav === 'profile' && (
          <CandidateProfileView />
        )}

        {currentNav === 'insights' && (
          <SkillInsightsView />
        )}

        {currentNav === 'applications' && (
          <ApplicationsView
            applications={applications}
            onApplyNew={() => handleOpenApply(signals[0])}
          />
        )}

        {currentNav === 'settings' && (
          <SettingsView />
        )}
      </main>

      {/* Global Interactive Modal */}
      {isApplyModalOpen && signalForApp && (
        <JobApplicationModal
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
          signal={signalForApp}
          selectedRole={selectedRoleForApp}
          onApplicationSubmitted={handleApplicationSubmitted}
        />
      )}
    </div>
  );
}
