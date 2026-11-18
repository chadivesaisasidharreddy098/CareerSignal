'use client';

import React, { useState } from 'react';
import { Target, TrendingUp, CheckCircle2, BookOpen, Sparkles, Check, ChevronRight } from 'lucide-react';

interface RoleInsightData {
  roleTitle: string;
  skills: { name: string; level: 'Strong' | 'Developing' | 'Gap'; pct: number }[];
  inDemand: string[];
  recommendations: { title: string; desc: string; completed?: boolean }[];
}

const ROLE_INSIGHTS: Record<string, RoleInsightData> = {
  'Product Analyst': {
    roleTitle: 'Product Analyst',
    skills: [
      { name: 'SQL & Distributed Queries', level: 'Strong', pct: 90 },
      { name: 'Experiment design & A/B Testing', level: 'Developing', pct: 60 },
      { name: 'Stakeholder storytelling & Dashboards', level: 'Developing', pct: 55 },
      { name: 'Product sense & Metric trees', level: 'Gap', pct: 30 },
    ],
    inDemand: ['Experimentation', 'dbt', 'Stakeholder reporting', 'Amplitude', 'Metric Trees'],
    recommendations: [
      { title: 'Complete an A/B testing mini-course', desc: 'Closes the experiment design gap. About 6 hours.' },
      { title: 'Publish a product case study', desc: 'Adds proof for stakeholder storytelling on LinkedIn & GitHub.' },
      { title: 'Take the SQL window functions assessment', desc: 'Raises SQL to verified corporate advanced level.' },
    ],
  },
  'Software Analyst': {
    roleTitle: 'Software Analyst',
    skills: [
      { name: 'Software Architecture & APIs', level: 'Strong', pct: 94 },
      { name: 'Distributed Systems & Microservices', level: 'Strong', pct: 88 },
      { name: 'Performance Regression Analysis', level: 'Developing', pct: 65 },
      { name: 'Zero-Downtime Migration Protocols', level: 'Gap', pct: 35 },
    ],
    inDemand: ['FastAPI', 'Kafka', 'Docker', 'Prometheus', 'Redis Cache'],
    recommendations: [
      { title: 'Deploy a containerized microservice on AWS/Azure', desc: 'Validates distributed orchestration proficiency.' },
      { title: 'Complete distributed telemetry case study', desc: 'Provides proof for enterprise system resiliency.' },
      { title: 'Certify high-scale PostgreSQL benchmarking', desc: 'Elevates database competency to verified status.' },
    ],
  },
  'Product Designer': {
    roleTitle: 'Product Designer',
    skills: [
      { name: 'Figma & Design Systems', level: 'Strong', pct: 92 },
      { name: 'User Research & Personas', level: 'Strong', pct: 85 },
      { name: 'Micro-interactions & Framer Prototyping', level: 'Developing', pct: 58 },
      { name: 'WCAG 2.1 AA Accessibility Auditing', level: 'Gap', pct: 32 },
    ],
    inDemand: ['Design Tokens', 'Storybook', 'Design Ops', 'A/B Testing UI'],
    recommendations: [
      { title: 'Audit an enterprise portal for WCAG 2.1 AA', desc: 'Closes the enterprise compliance design gap.' },
      { title: 'Publish Figma community token system', desc: 'Provides public proof for design system architecture.' },
      { title: 'Run usability test recordings with 5 users', desc: 'Shows empirical user research methodology.' },
    ],
  },
};

export const SkillInsightsView: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<string>('Product Analyst');
  const [learningPlanBuilt, setLearningPlanBuilt] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  const currentData = ROLE_INSIGHTS[selectedRole] || ROLE_INSIGHTS['Product Analyst'];

  const toggleStep = (title: string) => {
    setCompletedSteps((prev) => ({ ...prev, [title]: !prev[title] }));
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
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc' }}>
            Skill Insights
          </h1>
          <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.78rem', color: '#94a3b8' }}>
            How your verified skills compare with corporate roles you are targeting.
          </p>
        </div>

        {/* Target role selector buttons */}
        <div style={{ display: 'flex', gap: '0.45rem', backgroundColor: '#1b1c21', padding: '0.3rem', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          {Object.keys(ROLE_INSIGHTS).map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              style={{
                padding: '0.35rem 0.85rem',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: selectedRole === role ? '#2563eb' : 'transparent',
                color: selectedRole === role ? '#ffffff' : '#94a3b8',
                fontSize: '0.74rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* 2-Column Split matching 4_skill_insights.html */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1.25rem',
        flex: 1,
      }}>
        {/* Left Card: Gap Analysis Progress Bars */}
        <div style={{
          border: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: '#1b1c21',
          borderRadius: '14px',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
        }}>
          <div style={{ fontWeight: 800, fontSize: '0.96rem', color: '#f8fafc' }}>
            Gap analysis: {currentData.roleTitle}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            {currentData.skills.map((s) => {
              const isGap = s.level === 'Gap';
              const isStrong = s.level === 'Strong';
              return (
                <div key={s.name} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                    <span style={{ color: '#f8fafc', fontWeight: 600 }}>{s.name}</span>
                    <span style={{
                      color: isStrong ? '#34d399' : isGap ? '#f59e0b' : '#38bdf8',
                      fontWeight: 700,
                      fontSize: '0.74rem',
                    }}>
                      {s.level} ({s.pct}%)
                    </span>
                  </div>

                  <div style={{ height: '8px', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${s.pct}%`,
                      height: '8px',
                      backgroundColor: isStrong ? '#10b981' : isGap ? '#f59e0b' : '#2563eb',
                      borderRadius: '9999px',
                      transition: 'width 0.4s ease',
                    }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{
            marginTop: 'auto',
            padding: '0.85rem 1rem',
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            fontSize: '0.74rem',
            color: '#94a3b8',
            lineHeight: 1.5,
          }}>
            <strong style={{ color: '#38bdf8', display: 'block', marginBottom: '0.2rem' }}>
              Strategic Recommendation:
            </strong>
            Prioritize resolving the <strong>{currentData.skills.find(s => s.level === 'Gap')?.name}</strong> domain to unlock automatic interview shortlisting at Tier-1 employers.
          </div>
        </div>

        {/* Right Card: In Demand & Recommended Next Steps */}
        <div style={{
          border: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: '#1b1c21',
          borderRadius: '14px',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.1rem',
        }}>
          {/* IN DEMAND THIS QUARTER from PDF */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.04em' }}>
              IN DEMAND THIS QUARTER
            </div>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {currentData.inDemand.map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontSize: '0.72rem',
                    backgroundColor: 'rgba(37, 99, 235, 0.15)',
                    color: '#93c5fd',
                    padding: '0.25rem 0.65rem',
                    borderRadius: '9999px',
                    border: '1px solid rgba(37, 99, 235, 0.3)',
                    fontWeight: 600,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Recommended next steps from PDF */}
          <div style={{ fontWeight: 800, fontSize: '0.96rem', color: '#f8fafc', marginTop: '0.25rem' }}>
            Recommended next steps
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {currentData.recommendations.map((rec) => {
              const done = !!completedSteps[rec.title];
              return (
                <div
                  key={rec.title}
                  onClick={() => toggleStep(rec.title)}
                  style={{
                    padding: '0.85rem 1rem',
                    border: done ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '10px',
                    backgroundColor: done ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.82rem', color: done ? '#34d399' : '#f8fafc' }}>
                      {done ? `✓ ${rec.title}` : rec.title}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                      {rec.desc}
                    </div>
                  </div>
                  <ChevronRight size={14} style={{ color: done ? '#10b981' : '#64748b', flexShrink: 0 }} />
                </div>
              );
            })}
          </div>

          {/* Action button matching PDF */}
          <button
            onClick={() => {
              setLearningPlanBuilt(true);
              setTimeout(() => setLearningPlanBuilt(false), 3500);
            }}
            style={{
              marginTop: 'auto',
              height: '44px',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: learningPlanBuilt ? '#10b981' : '#2563eb',
              color: '#ffffff',
              font: '700 0.84rem Inter, sans-serif',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
            }}
          >
            {learningPlanBuilt ? <Check size={16} /> : <Sparkles size={16} />}
            <span>{learningPlanBuilt ? 'Personalized Learning Plan Synced!' : 'Build my learning plan'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
