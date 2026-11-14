'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Building2, User, Mail, FileText, ExternalLink, Inbox } from 'lucide-react';
import { getStoredApplications, getVerifiedCareerUrl } from '@/lib/api';
import { JobApplication } from '@/types';

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<JobApplication[]>([]);

  useEffect(() => {
    setApplications(getStoredApplications());
  }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#040711', color: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      <nav style={{
        backgroundColor: 'rgba(8, 12, 22, 0.9)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '0.85rem 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
            <span>Return to Global Radar</span>
          </Link>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            Real-Time Applicant Tracking Dashboard
          </span>
        </div>
      </nav>

      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem', width: '100%', flex: 1 }}>
        <div style={{ marginBottom: '1.75rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.35rem' }}>
            Transmitted Job Applications ({applications.length})
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Every job application submitted through CareerSignal is tracked locally with direct verified recruiter routing.
          </p>
        </div>

        {applications.length === 0 ? (
          <div style={{
            padding: '4rem 2rem',
            textAlign: 'center',
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
          }}>
            <Inbox size={42} style={{ color: '#64748b' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>No Applications Submitted Yet</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', maxWidth: '400px' }}>
              Select any hotspot on the world map or live feed to apply directly to top employers.
            </p>
            <Link
              href="/"
              style={{
                backgroundColor: '#38bdf8',
                color: '#040711',
                padding: '0.65rem 1.25rem',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.82rem',
                textDecoration: 'none',
                marginTop: '0.5rem',
              }}
            >
              Explore Job Opportunities
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {applications.map((app) => (
              <div
                key={app.id}
                style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.75)',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <span style={{
                        fontFamily: 'monospace',
                        fontWeight: 800,
                        fontSize: '0.8rem',
                        color: '#38bdf8',
                        backgroundColor: 'rgba(56, 189, 248, 0.12)',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                      }}>
                        {app.id}
                      </span>
                      <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                        {new Date(app.submitted_at).toLocaleString()}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>
                      {app.role_title}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#38bdf8', fontSize: '0.85rem', fontWeight: 600 }}>
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
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                  }}>
                    <CheckCircle2 size={13} />
                    {app.status}
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  fontSize: '0.78rem',
                  color: '#94a3b8',
                }}>
                  <span>Applicant: <strong>{app.applicant_name}</strong> ({app.applicant_email})</span>

                  <a
                    href={getVerifiedCareerUrl(app.company_name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      color: '#38bdf8',
                      textDecoration: 'none',
                      fontWeight: 600,
                    }}
                  >
                    <span>{app.company_name} Career Portal</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

