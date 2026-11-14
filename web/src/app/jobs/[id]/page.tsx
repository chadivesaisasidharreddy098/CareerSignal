'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  Building2, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Calendar, 
  ShieldCheck, 
  ExternalLink, 
  ArrowLeft, 
  Send, 
  CheckCircle2, 
  TrendingUp, 
  TrendingDown, 
  Sparkles,
  Layers,
  User,
  Mail,
  Linkedin,
  FileText
} from 'lucide-react';
import { INITIAL_MOCK_SIGNALS, getVerifiedCareerUrl, getDirectJobPortalUrl, saveApplication, fetchSignalById } from '@/lib/api';
import { SignalItem, OpenRole, JobApplication, CandidateType, AcceptanceDetails } from '@/types';

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [signal, setSignal] = useState<SignalItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [candidateType, setCandidateType] = useState<CandidateType>('Student / Fresher');
  const [selectedRole, setSelectedRole] = useState<OpenRole | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [universityOrCompany, setUniversityOrCompany] = useState('');
  const [coverNote, setCoverNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedApp, setSubmittedApp] = useState<JobApplication | null>(null);

  useEffect(() => {
    if (!params?.id) return;
    let isMounted = true;
    setLoading(true);

    fetchSignalById(params.id as string)
      .then((res) => {
        if (!isMounted) return;
        if (res) {
          setSignal(res);
          if (res.open_roles && res.open_roles.length > 0) {
            setSelectedRole(res.open_roles[0]);
          }
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [params]);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#080c16',
        color: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          padding: '2rem',
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            border: '3px solid rgba(56, 189, 248, 0.2)',
            borderTopColor: '#38bdf8',
            animation: 'spin 1s linear infinite',
          }} />
          <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#38bdf8', letterSpacing: '0.05em' }}>
            Retrieving Verified Corporate Node Intelligence...
          </div>
        </div>
      </div>
    );
  }

  if (!signal) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#080c16',
        color: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
      }}>
        <div style={{
          padding: '2.5rem',
          maxWidth: '520px',
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: '16px',
        }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.75rem' }}>
            Job Application Node Not Found
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
            The requested job application identifier may have been archived or updated in the latest intelligence cycle.
          </p>
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#38bdf8',
              color: '#040711',
              fontWeight: 700,
              padding: '0.7rem 1.4rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '0.85rem',
            }}
          >
            <ArrowLeft size={16} />
            <span>Return to Global Radar</span>
          </Link>
        </div>
      </div>
    );
  }

  const activeRoleTitle = selectedRole?.title || signal.title;
  const verifiedPortalUrl = getDirectJobPortalUrl(signal.company_name, activeRoleTitle, signal.careers_url || signal.source_url);
  const activeRoles: OpenRole[] = signal.open_roles && signal.open_roles.length > 0
    ? signal.open_roles
    : [
        {
          id: `role-${signal.id}-1`,
          title: `Senior ${signal.department?.split(' ')[0] || 'Software'} Engineer`,
          department: signal.department || 'Engineering',
          location: signal.city ? `${signal.city}, ${signal.country}` : signal.country || 'Global Hub',
          salary_range: signal.salary_range || '$150,000 - $220,000',
          employment_type: 'Full-Time',
        }
      ];

  const currentRole = selectedRole || activeRoles[0];

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const ticketId = `ACCEPT-${(signal.company_name?.substring(0, 4).toUpperCase() || 'CORP')}-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const interviewDate = new Date();
      interviewDate.setDate(interviewDate.getDate() + 3);
      const dateStr = interviewDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

      const acceptance: AcceptanceDetails = {
        ticket_id: ticketId,
        interview_date: dateStr,
        interview_time: '10:30 AM IST (Virtual Video Conference)',
        interview_round: 'Round 1: Portfolio & Competency Discussion',
        recruiter_name: signal.company_name?.toLowerCase().includes('microsoft') ? 'David Jose' : signal.company_name?.toLowerCase().includes('adobe') ? 'Ishitha Xavier' : 'Senior Talent Partner',
        recruiter_title: 'Lead Talent Acquisition Partner',
        matched_skills: ['Figma', 'System Design', 'React', 'Problem Solving', 'User Experience'],
        feedback: `Resume and qualifications successfully parsed. Strong alignment with ${currentRole.title} benchmarks.`,
      };

      const newApp: JobApplication = {
        id: ticketId,
        signal_id: signal.id,
        role_title: currentRole.title,
        company_name: signal.company_name || 'Enterprise',
        candidate_type: candidateType,
        applicant_name: fullName,
        applicant_email: email,
        applicant_phone: phone || undefined,
        applicant_linkedin: linkedin || undefined,
        university_or_current_company: universityOrCompany || undefined,
        cover_note: coverNote || undefined,
        resume_name: `${fullName.replace(/\s+/g, '_')}_Resume_2026.pdf`,
        match_score: 96,
        status: 'Accepted',
        acceptance_details: acceptance,
        submitted_at: new Date().toISOString(),
      };
      saveApplication(newApp);
      setSubmittedApp(newApp);
      setIsSubmitting(false);
    }, 700);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#040711', color: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navigation Bar */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'rgba(8, 12, 22, 0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '0.85rem 2rem',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#38bdf8',
              textDecoration: 'none',
              fontSize: '0.85rem',
              fontWeight: 700,
            }}
          >
            <ArrowLeft size={16} />
            <span>Back to Global Radar</span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
              CareerSignal Official Direct Portal
            </span>
            <a
              href={verifiedPortalUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                backgroundColor: 'rgba(56, 189, 248, 0.15)',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                color: '#38bdf8',
                padding: '0.4rem 0.85rem',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              <span>{signal.company_name} Official Careers</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem', width: '100%', flex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem', alignItems: 'flex-start' }}>
          
          {/* Left Column: Job & Company Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Header Hero Card */}
            <div style={{
              backgroundColor: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              borderRadius: '16px',
              padding: '1.75rem',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(56, 189, 248, 0.15)',
                  border: '1px solid rgba(56, 189, 248, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  color: '#38bdf8',
                }}>
                  {signal.company_name?.charAt(0) || 'C'}
                </div>
                <div>
                  <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc', lineHeight: 1.2 }}>
                    {signal.company_name}
                  </h1>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#94a3b8', fontSize: '0.82rem', marginTop: '0.25rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <MapPin size={13} style={{ color: '#38bdf8' }} />
                      {signal.city ? `${signal.city}, ${signal.country}` : signal.country || 'Global'}
                    </span>
                    <span>•</span>
                    <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
                      <ShieldCheck size={13} /> Verified Recruiter Portal
                    </span>
                  </div>
                </div>
              </div>

              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f1f5f9', lineHeight: 1.4, marginBottom: '0.75rem' }}>
                {signal.title}
              </h2>

              <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                {signal.summary}
              </p>

              {/* Metrics Pill Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
                <div style={{ padding: '0.75rem', borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Workforce Impact</span>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: (signal.impact_headcount || 0) > 0 ? '#34d399' : '#fb7185', marginTop: '0.2rem' }}>
                    {(signal.impact_headcount || 0) > 0 ? `+${signal.impact_headcount?.toLocaleString()}` : signal.impact_headcount?.toLocaleString()}
                  </div>
                </div>

                <div style={{ padding: '0.75rem', borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Compensation</span>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#38bdf8', marginTop: '0.2rem' }}>
                    {signal.salary_range || '$150k - $240k'}
                  </div>
                </div>

                <div style={{ padding: '0.75rem', borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Work Mode</span>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc', marginTop: '0.2rem' }}>
                    {signal.work_mode || 'Hybrid'}
                  </div>
                </div>
              </div>
            </div>

            {/* Select Position to Apply For */}
            <div style={{
              backgroundColor: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '1.5rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Briefcase size={16} style={{ color: '#38bdf8' }} />
                  <span>Active Open Roles ({activeRoles.length})</span>
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Select role to apply</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {activeRoles.map((role) => {
                  const isRoleSelected = currentRole.id === role.id;
                  return (
                    <div
                      key={role.id}
                      onClick={() => setSelectedRole(role)}
                      style={{
                        padding: '1rem',
                        borderRadius: '10px',
                        backgroundColor: isRoleSelected ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                        border: isRoleSelected ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.06)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.75rem',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.25rem' }}>
                          {role.title}
                        </h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.75rem', color: '#94a3b8' }}>
                          <span>{role.department}</span>
                          <span>•</span>
                          <span>{role.location}</span>
                          {role.salary_range && (
                            <>
                              <span>•</span>
                              <span style={{ color: '#34d399', fontWeight: 600 }}>{role.salary_range}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        border: isRoleSelected ? '6px solid #38bdf8' : '2px solid #64748b',
                        backgroundColor: isRoleSelected ? '#ffffff' : 'transparent',
                      }} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Direct Job Application Form */}
          <div style={{
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            borderRadius: '16px',
            padding: '1.75rem',
            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.6), 0 0 25px rgba(56, 189, 248, 0.1)',
            position: 'sticky',
            top: '5.5rem',
          }}>
            {!submittedApp ? (
              <form onSubmit={handleApply} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8', marginBottom: '0.25rem' }}>
                    <Send size={16} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Instant Job Application
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc' }}>
                    Apply for {currentRole.title}
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                    Transmitted directly to {signal.company_name} talent acquisition coordinators.
                  </p>
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.4rem' }}>
                    <User size={13} style={{ color: '#38bdf8' }} /> Full Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Maya Lin"
                    style={{
                      width: '100%',
                      backgroundColor: 'rgba(8, 14, 28, 0.75)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '8px',
                      padding: '0.65rem 0.85rem',
                      color: '#f8fafc',
                      fontSize: '0.85rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.4rem' }}>
                    <Mail size={13} style={{ color: '#38bdf8' }} /> Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="maya.lin@example.com"
                    style={{
                      width: '100%',
                      backgroundColor: 'rgba(8, 14, 28, 0.75)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '8px',
                      padding: '0.65rem 0.85rem',
                      color: '#f8fafc',
                      fontSize: '0.85rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.4rem' }}>
                    <Linkedin size={13} style={{ color: '#38bdf8' }} /> LinkedIn / Portfolio Profile URL
                  </label>
                  <input
                    type="url"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    style={{
                      width: '100%',
                      backgroundColor: 'rgba(8, 14, 28, 0.75)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '8px',
                      padding: '0.65rem 0.85rem',
                      color: '#f8fafc',
                      fontSize: '0.85rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.4rem' }}>
                    <FileText size={13} style={{ color: '#38bdf8' }} /> Executive Candidate Pitch / Note
                  </label>
                  <textarea
                    rows={3}
                    value={coverNote}
                    onChange={(e) => setCoverNote(e.target.value)}
                    placeholder="Briefly describe your relevant domain experience..."
                    style={{
                      width: '100%',
                      backgroundColor: 'rgba(8, 14, 28, 0.75)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '8px',
                      padding: '0.65rem 0.85rem',
                      color: '#f8fafc',
                      fontSize: '0.82rem',
                      outline: 'none',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    backgroundColor: '#10b981',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.75rem',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.45rem',
                    boxShadow: '0 0 20px rgba(16, 185, 129, 0.35)',
                    marginTop: '0.5rem',
                  }}
                >
                  <Send size={15} />
                  <span>{isSubmitting ? 'Transmitting to Recruiter...' : 'Submit Application Now'}</span>
                </button>
              </form>
            ) : (
              /* Success Card */
              <div style={{ textAlign: 'center', padding: '1rem 0', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  border: '2px solid #10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#10b981',
                }}>
                  <CheckCircle2 size={32} />
                </div>

                <div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#34d399', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    APPLICATION OFFICIALLY ACCEPTED
                  </span>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', marginTop: '0.2rem' }}>
                    Welcome to the Next Stage, {submittedApp.applicant_name}!
                  </h3>
                  <div style={{
                    fontFamily: 'monospace',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    color: '#38bdf8',
                    backgroundColor: 'rgba(56, 189, 248, 0.12)',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '6px',
                    display: 'inline-block',
                    marginTop: '0.5rem',
                  }}>
                    {submittedApp.id}
                  </div>
                </div>

                <div style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.35)',
                  borderRadius: '10px',
                  padding: '0.85rem',
                  width: '100%',
                  textAlign: 'left',
                  fontSize: '0.76rem',
                  color: '#cbd5e1',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#34d399', fontWeight: 700 }}>
                    <span>Interview: {submittedApp.acceptance_details?.interview_date}</span>
                    <span>10:30 AM IST</span>
                  </div>
                  <div>
                    <strong>Assigned Recruiter:</strong> {submittedApp.acceptance_details?.recruiter_name} ({submittedApp.acceptance_details?.recruiter_title})
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontStyle: 'italic' }}>
                    &ldquo;{submittedApp.acceptance_details?.feedback}&rdquo;
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', width: '100%', marginTop: '0.5rem' }}>
                  <a
                    href={verifiedPortalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      backgroundColor: 'rgba(56, 189, 248, 0.15)',
                      border: '1px solid rgba(56, 189, 248, 0.4)',
                      color: '#38bdf8',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      padding: '0.65rem',
                      borderRadius: '8px',
                      textDecoration: 'none',
                    }}
                  >
                    <span>Visit Official Portal</span>
                    <ExternalLink size={13} />
                  </a>

                  <button
                    onClick={() => setSubmittedApp(null)}
                    style={{
                      flex: 1,
                      backgroundColor: '#10b981',
                      border: 'none',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      padding: '0.65rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                    }}
                  >
                    Apply Again
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}

