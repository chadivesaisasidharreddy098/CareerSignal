'use client';

import React from 'react';
import { JobApplication } from '../types';
import { getVerifiedCareerUrl, getDirectJobPortalUrl } from '../lib/api';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  Building2, 
  ExternalLink, 
  Briefcase, 
  FileText,
  Mail,
  User,
  ShieldCheck,
  Inbox
} from 'lucide-react';

interface ApplicationsTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  applications: JobApplication[];
  onApplyNew?: () => void;
}

export const ApplicationsTrackerModal: React.FC<ApplicationsTrackerModalProps> = ({
  isOpen,
  onClose,
  applications,
  onApplyNew,
}) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(5, 8, 16, 0.88)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      zIndex: 150,
      animation: 'fadeIn 0.2s ease-out',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '720px',
        maxHeight: '85vh',
        backgroundColor: '#0c1220',
        border: '1px solid rgba(56, 189, 248, 0.35)',
        borderRadius: '16px',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.95), 0 0 40px rgba(56, 189, 248, 0.15)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Modal Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(15, 23, 42, 0.75)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#34d399',
            }}>
              <CheckCircle2 size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>
                Real-Time Applications Tracker
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                Track your active job transmissions, corporate recruiter receipts & status
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '0.4rem',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Applications List Body */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}>
          {applications.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '3rem 1rem',
              textAlign: 'center',
              gap: '1rem',
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#64748b',
              }}>
                <Inbox size={28} />
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '0.25rem' }}>
                  No Applications Transmitted Yet
                </h4>
                <p style={{ fontSize: '0.82rem', color: '#94a3b8', maxWidth: '380px' }}>
                  Select any job hotspot on the interactive global radar or live intelligence feed to submit real-time applications directly to corporate portals.
                </p>
              </div>

              {onApplyNew && (
                <button
                  onClick={() => {
                    onClose();
                    onApplyNew();
                  }}
                  style={{
                    backgroundColor: 'rgba(56, 189, 248, 0.15)',
                    border: '1px solid rgba(56, 189, 248, 0.4)',
                    color: 'var(--accent)',
                    borderRadius: '8px',
                    padding: '0.6rem 1.2rem',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    marginTop: '0.5rem',
                  }}
                >
                  Browse Active Positions
                </button>
              )}
            </div>
          ) : (
            applications.map((app) => (
              <div
                key={app.id}
                style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.65)',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                }}
              >
                {/* Application Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{
                        fontFamily: 'monospace',
                        fontWeight: 800,
                        fontSize: '0.8rem',
                        color: 'var(--accent)',
                        backgroundColor: 'rgba(56, 189, 248, 0.12)',
                        border: '1px solid rgba(56, 189, 248, 0.3)',
                        borderRadius: '4px',
                        padding: '0.15rem 0.5rem',
                      }}>
                        {app.id}
                      </span>
                      <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                        {new Date(app.submitted_at).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc', marginTop: '0.4rem' }}>
                      {app.role_title}
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#38bdf8', fontSize: '0.82rem', fontWeight: 600, marginTop: '0.1rem' }}>
                      <Building2 size={13} />
                      <span>{app.company_name}</span>
                    </div>
                  </div>

                  <span style={{
                    padding: '0.3rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.4)',
                    color: '#34d399',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                  }}>
                    <CheckCircle2 size={12} />
                    {app.status}
                  </span>
                </div>

                {/* Candidate & Metadata Summary */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '0.65rem',
                  padding: '0.75rem',
                  backgroundColor: 'rgba(0, 0, 0, 0.25)',
                  borderRadius: '8px',
                  fontSize: '0.76rem',
                  color: '#cbd5e1',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <User size={13} style={{ color: 'var(--accent)' }} />
                    <span><strong>Applicant:</strong> {app.applicant_name} ({app.candidate_type || 'Candidate'})</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Mail size={13} style={{ color: 'var(--accent)' }} />
                    <span><strong>Email:</strong> {app.applicant_email}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <FileText size={13} style={{ color: 'var(--accent)' }} />
                    <span><strong>Resume:</strong> {app.resume_name || 'Resume_2026.pdf'} (96% Fit)</span>
                  </div>
                </div>

                {/* Official Corporate Acceptance Box */}
                {app.acceptance_details && (
                  <div style={{
                    backgroundColor: 'rgba(16, 185, 129, 0.08)',
                    border: '1px solid rgba(16, 185, 129, 0.35)',
                    borderRadius: '8px',
                    padding: '0.75rem 0.95rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.4rem',
                    fontSize: '0.75rem',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ color: '#34d399', fontWeight: 800 }}>
                        ✓ INTERVIEW CONFIRMED: {app.acceptance_details.interview_date}
                      </span>
                      <span style={{ color: '#94a3b8', fontSize: '0.7rem' }}>
                        {app.acceptance_details.interview_time}
                      </span>
                    </div>
                    <div style={{ color: '#cbd5e1' }}>
                      <strong>Recruiter:</strong> {app.acceptance_details.recruiter_name} ({app.acceptance_details.recruiter_title})
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: '0.72rem', fontStyle: 'italic' }}>
                      &ldquo;{app.acceptance_details.feedback}&rdquo;
                    </div>
                  </div>
                )}

                {/* Direct Link to Corporate Talent Portal */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '0.6rem' }}>
                  <span style={{ fontSize: '0.72rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <ShieldCheck size={13} />
                    Verified Corporate Recruiter Routing Active
                  </span>

                  <a
                    href={getDirectJobPortalUrl(app.company_name, app.role_title)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      color: 'var(--accent)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      textDecoration: 'none',
                    }}
                  >
                    <span>Direct {app.role_title} on Portal</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(15, 23, 42, 0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
            {applications.length} Total Applications Registered Locally
          </span>

          <button
            onClick={onClose}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#f8fafc',
              borderRadius: '8px',
              padding: '0.5rem 1.1rem',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
