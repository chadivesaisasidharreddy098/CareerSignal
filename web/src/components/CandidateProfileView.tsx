'use client';

import React, { useState } from 'react';
import { Edit2, Check, Plus, ExternalLink, Sparkles } from 'lucide-react';

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
    { id: '1', name: 'SQL', proofText: 'Verified by assessment', isVerified: true },
    { id: '2', name: 'Python', proofText: 'Linked project: churn model', isVerified: true },
    { id: '3', name: 'Experiment design', proofText: 'Self-reported', isVerified: false },
    { id: '4', name: 'Tableau', proofText: 'Self-reported', isVerified: false },
  ]);

  const verifiedCount = skills.filter((s) => s.isVerified).length;
  const completeness = Math.min(100, Math.round((verifiedCount / skills.length) * 75 + (portfolioLink ? 25 : 0)));

  const handleVerifyProof = (id: string) => {
    setSkills((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          return {
            ...s,
            isVerified: true,
            proofText: `Verified by Git Repository Assessment`,
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
      gap: '20px',
      flex: 1,
      minHeight: '680px',
      background: '#FFFFFF',
    }}>
      {/* Header matching 3_candidate_profile.html */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#0F172A' }}>
            Candidate Profile
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#475569' }}>
            Verified candidate credentials, portfolio proof, and corporate ATS scoring readiness.
          </p>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          style={{
            height: '40px',
            padding: '0 18px',
            border: 0,
            borderRadius: '8px',
            background: isEditing ? '#047857' : '#2563EB',
            color: '#FFFFFF',
            font: '600 14px Inter, sans-serif',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
          }}
        >
          {isEditing ? <Check size={14} /> : <Edit2 size={14} />}
          <span>{isEditing ? 'Save profile' : 'Edit profile'}</span>
        </button>
      </header>

      {/* Section 2 columns matching 3_candidate_profile.html */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '20px', flex: 1, minHeight: 0 }}>
        {/* Left Column Profile Bio & Completeness */}
        <div style={{
          border: '1px solid #E2E8F0',
          borderRadius: '12px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          background: '#FFFFFF',
        }}>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#DBEAFE',
              color: '#1E40AF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '20px',
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
                    border: '1px solid #2563EB',
                    borderRadius: '6px',
                    padding: '4px 8px',
                    fontSize: '16px',
                    fontWeight: 700,
                    width: '100%',
                    marginBottom: '4px',
                  }}
                />
              ) : (
                <div style={{ fontWeight: 700, fontSize: '18px', color: '#0F172A' }}>
                  {candidateName}
                </div>
              )}

              {isEditing ? (
                <input
                  type="text"
                  value={candidateTitle}
                  onChange={(e) => setCandidateTitle(e.target.value)}
                  style={{
                    border: '1px solid #CBD5E1',
                    borderRadius: '6px',
                    padding: '4px 8px',
                    fontSize: '13px',
                    width: '100%',
                    color: '#64748B',
                  }}
                />
              ) : (
                <div style={{ fontSize: '13px', color: '#64748B' }}>
                  {candidateTitle}
                </div>
              )}
            </div>
          </div>

          {isEditing ? (
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              style={{
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                padding: '8px',
                fontSize: '13px',
                color: '#334155',
                lineHeight: 1.5,
              }}
            />
          ) : (
            <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6 }}>
              {bio}
            </div>
          )}

          {/* Profile completeness bar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748B', letterSpacing: '.04em' }}>
              PROFILE COMPLETENESS
            </div>
            <div style={{ height: '8px', background: '#F1F5F9', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{ width: `${completeness}%`, height: '8px', background: '#2563EB', borderRadius: '999px', transition: 'width 0.4s ease' }} />
            </div>
            <div style={{ fontSize: '13px', color: '#475569' }}>
              {completeness === 100 ? '✓ Profile is 100% complete and fully verified.' : 'Add a portfolio link to reach 100%.'}
            </div>

            {/* Experience list */}
            <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontWeight: 600, font: '14px Inter, sans-serif', color: '#0F172A' }}>
                Experience
              </div>
              <div style={{ fontSize: '13px', color: '#334155' }}>
                <span style={{ fontWeight: 600, color: '#0F172A' }}>Senior Analyst</span>, Orbit Retail · 2023 to present
              </div>
              <div style={{ fontSize: '13px', color: '#475569' }}>
                Analyst, Lumen Health · 2021 to 2023
              </div>
            </div>
          </div>
        </div>

        {/* Right Column Skills and Proof matching 3_candidate_profile.html */}
        <div style={{
          border: '1px solid #E2E8F0',
          borderRadius: '12px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
          background: '#FFFFFF',
        }}>
          <div style={{ fontWeight: 600, fontSize: '16px', color: '#0F172A' }}>
            Skills and proof
          </div>

          {skills.map((sk, idx) => (
            <div
              key={sk.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: idx === skills.length - 1 ? 0 : '12px',
                borderBottom: idx === skills.length - 1 ? 'none' : '1px solid #F1F5F9',
              }}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: '14px', color: '#0F172A' }}>
                  {sk.name}
                </div>
                <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                  {sk.proofText}
                </div>
              </div>

              {sk.isVerified ? (
                <span style={{
                  fontSize: '12px',
                  color: '#047857',
                  background: '#ECFDF5',
                  padding: '4px 10px',
                  borderRadius: '999px',
                  fontWeight: 600,
                }}>
                  Verified
                </span>
              ) : (
                <button
                  onClick={() => handleVerifyProof(sk.id)}
                  style={{
                    fontSize: '12px',
                    color: '#334155',
                    background: '#F1F5F9',
                    border: 'none',
                    padding: '4px 10px',
                    borderRadius: '999px',
                    cursor: 'pointer',
                    fontWeight: 500,
                  }}
                >
                  Add proof
                </button>
              )}
            </div>
          ))}

          <div style={{
            marginTop: 'auto',
            padding: '12px 14px',
            backgroundColor: '#EFF6FF',
            borderRadius: '8px',
            fontSize: '13px',
            color: '#1D4ED8',
            lineHeight: 1.5,
          }}>
            All verified skills automatically synchronize with corporate recruiting partners for guaranteed 96% ATS evaluation.
          </div>
        </div>
      </section>
    </div>
  );
};
