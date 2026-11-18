'use client';

import React, { useState } from 'react';
import { User, CheckCircle2, Award, Briefcase, ExternalLink, Plus, Edit2, Check, Sparkles } from 'lucide-react';

interface SkillProofItem {
  id: string;
  name: string;
  proofText: string;
  isVerified: boolean;
}

export const CandidateProfileView: React.FC = () => {
  const [candidateName, setCandidateName] = useState('Alex Lindqvist');
  const [candidateTitle, setCandidateTitle] = useState('Data & Systems Analyst · 4 years experience');
  const [bio, setBio] = useState('Analytics professional focused on product metrics, experimentation, distributed cloud architectures, and clear stakeholder reporting.');
  const [portfolioLink, setPortfolioLink] = useState('https://github.com/alex-lindqvist');
  const [isEditing, setIsEditing] = useState(false);

  const [skills, setSkills] = useState<SkillProofItem[]>([
    { id: '1', name: 'SQL & Distributed Databases', proofText: 'Verified by HackerRank Assessment (Top 1%)', isVerified: true },
    { id: '2', name: 'Python & FastAPI', proofText: 'Linked project: github.com/alex/cloud-pipeline', isVerified: true },
    { id: '3', name: 'Experiment Design & A/B Testing', proofText: 'Self-reported (Internal A/B testing framework)', isVerified: false },
    { id: '4', name: 'Tableau & Executive Dashboards', proofText: 'Self-reported (Enterprise KPI dashboards)', isVerified: false },
    { id: '5', name: 'Software Architecture & Systems Analysis', proofText: 'Verified by AWS Solutions Architect Certification', isVerified: true },
  ]);

  const verifiedCount = skills.filter((s) => s.isVerified).length;
  const completeness = Math.min(100, Math.round((verifiedCount / skills.length) * 80 + (portfolioLink ? 20 : 0)));

  const handleVerifyProof = (id: string) => {
    setSkills((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          return {
            ...s,
            isVerified: true,
            proofText: `Verified by Git Repository & Assessment Match`,
          };
        }
        return s;
      })
    );
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1.25rem',
      flex: 1,
      minHeight: '680px',
    }}>
      {/* Header matching PDF */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc' }}>
            Candidate Profile
          </h1>
          <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.78rem', color: '#94a3b8' }}>
            Verified candidate credentials, portfolio proof, and corporate ATS scoring readiness.
          </p>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          style={{
            height: '40px',
            padding: '0 1.25rem',
            border: 'none',
            borderRadius: '8px',
            backgroundColor: isEditing ? 'rgba(56, 189, 248, 0.2)' : '#2563eb',
            color: '#ffffff',
            font: '600 0.82rem Inter, sans-serif',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
          }}
        >
          {isEditing ? <Check size={14} /> : <Edit2 size={14} />}
          <span>{isEditing ? 'Save Changes' : 'Edit profile'}</span>
        </button>
      </div>

      {/* 2-Column Split matching 3_candidate_profile.html */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.35fr',
        gap: '1.25rem',
        flex: 1,
      }}>
        {/* Left Column: Candidate Bio & Completeness */}
        <div style={{
          border: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: '#1b1c21',
          borderRadius: '14px',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
        }}>
          {/* Avatar & Title Row */}
          <div style={{ display: 'flex', gap: '0.9rem', alignItems: 'center' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#1e3a8a',
              color: '#38bdf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.3rem',
              boxShadow: '0 0 20px rgba(37, 99, 235, 0.35)',
            }}>
              {candidateName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </div>

            <div style={{ flex: 1 }}>
              {isEditing ? (
                <input
                  type="text"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid #38bdf8',
                    borderRadius: '6px',
                    padding: '0.3rem 0.5rem',
                    color: '#f8fafc',
                    fontWeight: 700,
                    fontSize: '1rem',
                    width: '100%',
                    marginBottom: '0.3rem',
                  }}
                />
              ) : (
                <div style={{ fontWeight: 800, fontSize: '1.15rem', color: '#f8fafc' }}>
                  {candidateName}
                </div>
              )}

              {isEditing ? (
                <input
                  type="text"
                  value={candidateTitle}
                  onChange={(e) => setCandidateTitle(e.target.value)}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '6px',
                    padding: '0.25rem 0.5rem',
                    color: '#94a3b8',
                    fontSize: '0.74rem',
                    width: '100%',
                  }}
                />
              ) : (
                <div style={{ fontSize: '0.76rem', color: '#94a3b8' }}>
                  {candidateTitle}
                </div>
              )}
            </div>
          </div>

          {/* Bio paragraph */}
          {isEditing ? (
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                padding: '0.5rem',
                color: '#cbd5e1',
                fontSize: '0.78rem',
                lineHeight: 1.5,
                outline: 'none',
              }}
            />
          ) : (
            <div style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.6 }}>
              {bio}
            </div>
          )}

          {/* Profile Completeness Bar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#38bdf8', letterSpacing: '0.04em' }}>
                PROFILE COMPLETENESS
              </span>
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#34d399' }}>
                {completeness}%
              </span>
            </div>

            <div style={{ height: '8px', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '9999px', overflow: 'hidden' }}>
              <div style={{
                width: `${completeness}%`,
                height: '8px',
                backgroundColor: '#2563eb',
                borderRadius: '9999px',
                transition: 'width 0.4s ease',
              }} />
            </div>

            <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
              {completeness === 100
                ? '✓ Profile is 100% complete and fully verified for automated recruiter pass.'
                : 'Add verified skill proofs to reach 100% automated acceptance guarantee.'}
            </div>
          </div>

          {/* Experience Section from PDF */}
          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ fontWeight: 700, fontSize: '0.86rem', color: '#f8fafc' }}>
              Industry & Academic Experience
            </div>
            <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
              <span style={{ fontWeight: 700, color: '#ffffff' }}>Senior Systems Analyst</span>, Orbit Enterprise Platforms · 2023 to present
            </div>
            <div style={{ fontSize: '0.76rem', color: '#94a3b8' }}>
              Analyst & Software Associate, Lumen Health Labs · 2021 to 2023
            </div>
          </div>
        </div>

        {/* Right Column: Skills and Proof from PDF */}
        <div style={{
          border: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: '#1b1c21',
          borderRadius: '14px',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.1rem',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#f8fafc' }}>
              Skills and proof ({verifiedCount}/{skills.length} Verified)
            </div>
            <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 600 }}>
              Corporate ATS Grounded
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {skills.map((sk) => (
              <div
                key={sk.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: '0.85rem',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.86rem', color: '#f8fafc' }}>
                    {sk.name}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.15rem' }}>
                    {sk.proofText}
                  </div>
                </div>

                {sk.isVerified ? (
                  <span style={{
                    fontSize: '0.72rem',
                    color: '#34d399',
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.35)',
                    padding: '0.25rem 0.65rem',
                    borderRadius: '9999px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                  }}>
                    <Check size={12} />
                    <span>Verified</span>
                  </span>
                ) : (
                  <button
                    onClick={() => handleVerifyProof(sk.id)}
                    style={{
                      fontSize: '0.72rem',
                      color: '#38bdf8',
                      backgroundColor: 'rgba(56, 189, 248, 0.12)',
                      border: '1px solid rgba(56, 189, 248, 0.3)',
                      padding: '0.25rem 0.65rem',
                      borderRadius: '9999px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                    }}
                  >
                    <Plus size={12} />
                    <span>Add proof</span>
                  </button>
                )}
              </div>
            ))}
          </div>

          <div style={{
            marginTop: 'auto',
            padding: '0.85rem 1rem',
            backgroundColor: 'rgba(37, 99, 235, 0.08)',
            border: '1px solid rgba(37, 99, 235, 0.25)',
            borderRadius: '10px',
            fontSize: '0.74rem',
            color: '#93c5fd',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            <Sparkles size={16} style={{ color: '#38bdf8', flexShrink: 0 }} />
            <span>
              All verified competencies in your profile automatically sync with the <strong>Job Application Portal</strong> to ensure 96%+ ATS match rates.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
