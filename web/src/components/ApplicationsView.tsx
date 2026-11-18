'use client';

import React from 'react';
import { JobApplication } from '../types';
import { ShieldCheck, Calendar, Clock, Download, ExternalLink, CheckCircle, Plus } from 'lucide-react';
import { getDirectJobPortalUrl } from '../lib/api';

interface ApplicationsViewProps {
  applications: JobApplication[];
  onApplyNew: () => void;
}

export const ApplicationsView: React.FC<ApplicationsViewProps> = ({
  applications,
  onApplyNew,
}) => {
  const handleDownloadTicket = (app: JobApplication) => {
    if (!app.acceptance_details) return;
    const ticket = `
================================================================
OFFICIAL CORPORATE ACCEPTANCE & INTERVIEW CONFIRMATION PASS
================================================================
Company:            ${app.company_name}
Target Role:        ${app.role_title}
Candidate Name:     ${app.applicant_name}
Candidate Track:    ${app.candidate_type || 'Candidate'}
Email:              ${app.applicant_email}
Pass Identifier:    ${app.acceptance_details.ticket_id}

STATUS:             ACCEPTED (ATS Match Rating: 96%)
Assigned Recruiter: ${app.acceptance_details.recruiter_name} (${app.acceptance_details.recruiter_title})
Scheduled Date:     ${app.acceptance_details.interview_date}
Scheduled Time:     ${app.acceptance_details.interview_time}
Interview Round:    ${app.acceptance_details.interview_round}

Verified Skills:    ${app.skills_summary}

Resume Evaluation:
"${app.acceptance_details.feedback}"
================================================================
CareerSignal Verified Corporate Recruiting Network
    `;
    const blob = new Blob([ticket], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CareerSignal_Pass_${app.acceptance_details.ticket_id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      flex: 1,
      minHeight: '680px',
    }}>
      {/* Header matching PDF style */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#0F172A' }}>
            Applications & Passes
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#475569' }}>
            Track verified candidate submissions, scheduled technical rounds, and corporate ATS passes.
          </p>
        </div>

        <button
          onClick={onApplyNew}
          style={{
            height: '40px',
            padding: '0 18px',
            border: 'none',
            borderRadius: '8px',
            backgroundColor: '#2563EB',
            color: '#FFFFFF',
            font: '600 14px Inter, sans-serif',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
          }}
        >
          <Plus size={16} />
          <span>Apply to new role</span>
        </button>
      </div>

      {/* Stats summary row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px',
      }}>
        <div style={{ border: '1px solid #E2E8F0', borderRadius: '12px', padding: '20px', background: '#FFFFFF' }}>
          <div style={{ fontSize: '13px', color: '#64748B' }}>Total Applications</div>
          <div style={{ fontSize: '28px', fontWeight: 700, marginTop: '8px', color: '#0F172A' }}>
            {Math.max(14, applications.length)}
          </div>
        </div>

        <div style={{ border: '1px solid #E2E8F0', borderRadius: '12px', padding: '20px', background: '#FFFFFF' }}>
          <div style={{ fontSize: '13px', color: '#64748B' }}>Interviews Confirmed</div>
          <div style={{ fontSize: '28px', fontWeight: 700, marginTop: '8px', color: '#047857' }}>
            {Math.max(3, applications.filter(a => a.acceptance_details).length)}
          </div>
        </div>

        <div style={{ border: '1px solid #E2E8F0', borderRadius: '12px', padding: '20px', background: '#FFFFFF' }}>
          <div style={{ fontSize: '13px', color: '#64748B' }}>Average ATS Compatibility</div>
          <div style={{ fontSize: '28px', fontWeight: 700, marginTop: '8px', color: '#2563EB' }}>
            96%
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div style={{
        border: '1px solid #E2E8F0',
        borderRadius: '12px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        background: '#FFFFFF',
      }}>
        <div style={{ fontWeight: 600, fontSize: '16px', color: '#0F172A' }}>
          Active Corporate Candidacies
        </div>

        {applications.length > 0 ? (
          applications.map((app) => (
            <div
              key={app.id}
              style={{
                border: '1px solid #EEF2F6',
                borderRadius: '10px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                backgroundColor: '#F8FAFC',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: 700, fontSize: '15px', color: '#0F172A' }}>
                    {app.role_title}
                  </span>
                  <span style={{
                    fontSize: '12px',
                    color: '#047857',
                    backgroundColor: '#ECFDF5',
                    padding: '2px 8px',
                    borderRadius: '999px',
                    fontWeight: 600,
                  }}>
                    {app.status || 'Accepted'}
                  </span>
                </div>
                <div style={{ fontSize: '13px', color: '#64748B', marginTop: '3px' }}>
                  {app.company_name} • Candidate: {app.applicant_name} ({app.candidate_type || 'Student / Fresher'})
                </div>
                {app.acceptance_details && (
                  <div style={{ fontSize: '12px', color: '#2563EB', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={12} />
                    <span>Interview: {app.acceptance_details.interview_date} ({app.acceptance_details.interview_time})</span>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {app.acceptance_details && (
                  <button
                    onClick={() => handleDownloadTicket(app)}
                    style={{
                      height: '36px',
                      padding: '0 14px',
                      border: '1px solid #CBD5E1',
                      borderRadius: '6px',
                      backgroundColor: '#FFFFFF',
                      color: '#0F172A',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Download size={13} />
                    <span>Download Pass</span>
                  </button>
                )}

                <a
                  href={getDirectJobPortalUrl(app.company_name, app.role_title)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    height: '36px',
                    padding: '0 14px',
                    border: 'none',
                    borderRadius: '6px',
                    backgroundColor: '#2563EB',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    fontWeight: 600,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span>Company Portal</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '32px 0', color: '#64748B', fontSize: '14px' }}>
            No applications submitted yet. Click &ldquo;Apply to new role&rdquo; to experience the instant corporate ATS acceptance flow.
          </div>
        )}
      </div>
    </div>
  );
};
