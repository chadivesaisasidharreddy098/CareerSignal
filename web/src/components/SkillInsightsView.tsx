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
      { name: 'SQL', level: 'Strong', pct: 90 },
      { name: 'Experiment design', level: 'Developing', pct: 60 },
      { name: 'Stakeholder storytelling', level: 'Developing', pct: 55 },
      { name: 'Product sense', level: 'Gap', pct: 30 },
    ],
    inDemand: ['Experimentation', 'dbt', 'Stakeholder reporting'],
    recommendations: [
      { title: 'Complete an A/B testing mini-course', desc: 'Closes the experiment design gap. About 6 hours.' },
      { title: 'Publish a product case study', desc: 'Adds proof for stakeholder storytelling.' },
      { title: 'Take the SQL window functions assessment', desc: 'Raises SQL to verified advanced level.' },
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
      { name: 'Micro-interactions & Prototyping', level: 'Developing', pct: 58 },
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
      gap: '20px',
      flex: 1,
      minHeight: '680px',
      backgroundColor: '#FFFFFF',
    }}>
      {/* Header matching 4_skill_insights.html */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#0F172A' }}>
            Skill Insights
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#475569' }}>
            How your skills compare with roles you are targeting.
          </p>
        </div>

        {/* Role switcher pills */}
        <div style={{ display: 'flex', gap: '6px', background: '#F8FAFC', padding: '4px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
          {Object.keys(ROLE_INSIGHTS).map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: 'none',
                background: selectedRole === role ? '#EFF6FF' : 'transparent',
                color: selectedRole === role ? '#1D4ED8' : '#64748B',
                fontSize: '13px',
                fontWeight: selectedRole === role ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {role}
            </button>
          ))}
        </div>
      </header>

      {/* 2-Column Section matching 4_skill_insights.html */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        flex: 1,
        minHeight: 0,
      }}>
        {/* Left Column: Gap Analysis */}
        <div style={{
          border: '1px solid #E2E8F0',
          borderRadius: '12px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
          backgroundColor: '#FFFFFF',
        }}>
          <div style={{ fontWeight: 600, fontSize: '16px', color: '#0F172A' }}>
            Gap analysis: {currentData.roleTitle}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
            {currentData.skills.map((s) => {
              const isGap = s.level === 'Gap';
              return (
                <div key={s.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ color: '#0F172A', fontWeight: 500 }}>{s.name}</span>
                    <span style={{ color: isGap ? '#D97706' : '#64748B', fontWeight: isGap ? 600 : 400 }}>
                      {s.level}
                    </span>
                  </div>
                  <div style={{ height: '8px', background: '#F1F5F9', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${s.pct}%`,
                      height: '8px',
                      background: isGap ? '#F59E0B' : '#2563EB',
                      borderRadius: '999px',
                      transition: 'width 0.3s ease',
                    }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{
            marginTop: 'auto',
            padding: '12px 14px',
            backgroundColor: '#F8FAFC',
            borderRadius: '8px',
            border: '1px solid #E2E8F0',
            fontSize: '13px',
            color: '#475569',
            lineHeight: 1.5,
          }}>
            <strong style={{ color: '#0F172A', display: 'block', marginBottom: '4px' }}>
              Strategic Recommendation:
            </strong>
            Prioritizing resolving the <strong>{currentData.skills.find(s => s.level === 'Gap')?.name}</strong> domain increases qualification threshold for tier-1 recruiting pools by 45%.
          </div>
        </div>

        {/* Right Column: In Demand & Recommended next steps */}
        <div style={{
          border: '1px solid #E2E8F0',
          borderRadius: '12px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          backgroundColor: '#FFFFFF',
        }}>
          {/* IN DEMAND THIS QUARTER */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748B', letterSpacing: '.04em' }}>
              IN DEMAND THIS QUARTER
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {currentData.inDemand.map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontSize: '12px',
                    background: '#EFF6FF',
                    color: '#1D4ED8',
                    padding: '4px 10px',
                    borderRadius: '999px',
                    fontWeight: 500,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div style={{ fontWeight: 600, fontSize: '16px', color: '#0F172A', marginTop: '4px' }}>
            Recommended next steps
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {currentData.recommendations.map((rec) => {
              const done = !!completedSteps[rec.title];
              return (
                <div
                  key={rec.title}
                  onClick={() => toggleStep(rec.title)}
                  style={{
                    padding: '14px',
                    border: done ? '1px solid #10B981' : '1px solid #E2E8F0',
                    borderRadius: '10px',
                    background: done ? '#F0FDF4' : '#FFFFFF',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px', color: done ? '#047857' : '#0F172A' }}>
                      {done ? `✓ ${rec.title}` : rec.title}
                    </div>
                    <div style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>
                      {rec.desc}
                    </div>
                  </div>
                  <ChevronRight size={16} style={{ color: done ? '#047857' : '#94A3B8', flexShrink: 0 }} />
                </div>
              );
            })}
          </div>

          {/* Build my learning plan button */}
          <button
            onClick={() => {
              setLearningPlanBuilt(true);
              setTimeout(() => setLearningPlanBuilt(false), 3500);
            }}
            style={{
              marginTop: 'auto',
              height: '44px',
              border: 0,
              borderRadius: '8px',
              background: learningPlanBuilt ? '#047857' : '#2563EB',
              color: '#FFFFFF',
              font: '600 14px Inter, sans-serif',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'background-color 0.2s ease',
            }}
          >
            {learningPlanBuilt ? <Check size={16} /> : <Sparkles size={16} />}
            <span>{learningPlanBuilt ? 'Personalized Learning Plan Synced!' : 'Build my learning plan'}</span>
          </button>
        </div>
      </section>
    </div>
  );
};
