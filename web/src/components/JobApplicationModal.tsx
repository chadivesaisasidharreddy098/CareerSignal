'use client';

import React, { useState } from 'react';
import { SignalItem, OpenRole, JobApplication, CandidateType, AcceptanceDetails } from '../types';
import { getVerifiedCareerUrl, getDirectJobPortalUrl, saveApplication } from '../lib/api';
import { 
  X, 
  Send, 
  CheckCircle2, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  User, 
  Mail, 
  Linkedin, 
  FileText, 
  UploadCloud, 
  Sparkles, 
  GraduationCap, 
  Building2, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Award, 
  ExternalLink,
  Phone,
  Check,
  Download
} from 'lucide-react';

interface JobApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  signal: SignalItem | null;
  selectedRole?: OpenRole | null;
  onApplicationSubmitted?: (app: JobApplication) => void;
}

export const JobApplicationModal: React.FC<JobApplicationModalProps> = ({
  isOpen,
  onClose,
  signal,
  selectedRole,
  onApplicationSubmitted,
}) => {
  const [candidateType, setCandidateType] = useState<CandidateType>('Student / Fresher');

  // Common Contact Info
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [coverNote, setCoverNote] = useState('');

  // Student Specific
  const [university, setUniversity] = useState('');
  const [degree, setDegree] = useState('');
  const [gradYear, setGradYear] = useState('2025');
  const [cgpa, setCgpa] = useState('8.8 / 10.0');

  // Employee Specific
  const [currentCompany, setCurrentCompany] = useState('');
  const [currentTitle, setCurrentTitle] = useState('');
  const [experienceYears, setExperienceYears] = useState('3.5 Years');
  const [noticePeriod, setNoticePeriod] = useState('15 Days');

  // Resume State
  const [resumeName, setResumeName] = useState<string>('Candidate_Resume_2026.pdf');
  const [matchedSkills, setMatchedSkills] = useState<string[]>([
    'UI/UX Design', 'Figma', 'User Research', 'Design Systems', 'React', 'Problem Solving'
  ]);

  // Submission & Acceptance State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evalStep, setEvalStep] = useState<string>('');
  const [submittedApp, setSubmittedApp] = useState<JobApplication | null>(null);

  if (!isOpen || !signal) return null;

  const roleTitle = selectedRole?.title || signal.title;
  const roleDepartment = selectedRole?.department || signal.department || 'Technology';
  const roleLocation = selectedRole?.location || (signal.city ? `${signal.city}, ${signal.country}` : signal.country || 'Global');
  const roleSalary = selectedRole?.salary_range || signal.salary_range || 'Competitive Package';
  const directPortalUrl = getDirectJobPortalUrl(signal.company_name, roleTitle, signal.careers_url || signal.source_url);
  const officialPortal = directPortalUrl;

  const isSoftwareRole = roleTitle.toLowerCase().includes('analyst') || 
    roleTitle.toLowerCase().includes('engineer') || 
    roleTitle.toLowerCase().includes('systems') ||
    roleTitle.toLowerCase().includes('cloud');

  // Determine assigning recruiter based on company
  const getRecruiterInfo = () => {
    const comp = (signal.company_name || '').toLowerCase();
    if (comp.includes('microsoft')) {
      return { name: 'David Jose', title: 'Lead Design & Engineering Recruiter' };
    }
    if (comp.includes('adobe')) {
      return { name: 'Ishitha Xavier', title: 'Senior Talent Acquisition Partner' };
    }
    if (comp.includes('nvidia')) {
      return { name: 'Hansika Khan', title: 'Director of Silicon & AI Talent' };
    }
    return { name: 'Sarah Jenkins', title: 'Principal Talent Acquisition Lead' };
  };

  // Quick 1-Click Sample Profiles
  const loadStudentPreset = () => {
    setCandidateType('Student / Fresher');
    setFullName('Priya Sharma');
    setEmail('priya.sharma@iitb.ac.in');
    setPhone('+91 98765 43210');
    setLinkedin('https://linkedin.com/in/priya-sharma-tech');
    setPortfolio(isSoftwareRole ? 'https://github.com/priyasharma-dev' : 'https://priyasharma.design');
    setUniversity('Indian Institute of Technology (IIT Bombay)');
    setDegree(isSoftwareRole ? 'B.Tech in Computer Science & Systems Engineering' : 'B.Tech in Computer Science & Interaction Design');
    setGradYear('2025');
    setCgpa('9.2 / 10.0');
    setCoverNote(isSoftwareRole
      ? `Dedicated student specialized in high-performance cloud architecture and data pipeline optimization, excited to join ${signal.company_name} as a ${roleTitle}.`
      : 'Passionate student designer with multiple national hackathon wins, specialized in translating complex user flows into accessible, delightful interfaces.'
    );
    setResumeName(isSoftwareRole ? 'Priya_Sharma_IIT_Software_Resume.pdf' : 'Priya_Sharma_IIT_Resume.pdf');
    setMatchedSkills(isSoftwareRole
      ? ['Software Architecture', 'Systems Analysis', 'Cloud Computing', 'SQL & Data Engineering', 'Python', 'Distributed Systems']
      : ['Figma', 'UI/UX Prototyping', 'React', 'Design Systems', 'User Research', 'Next.js']
    );
  };

  const loadEmployeePreset = () => {
    setCandidateType('Experienced Professional');
    setFullName('Rahul Verma');
    setEmail('rahul.verma@alumni.org');
    setPhone('+91 98112 34567');
    setLinkedin('https://linkedin.com/in/rahul-verma-tech');
    setPortfolio('https://github.com/rahulverma-dev');
    setCurrentCompany(isSoftwareRole ? 'Infosys Cloud Platforms' : 'Infosys Innovation Labs');
    setCurrentTitle(isSoftwareRole ? 'Senior Software & Systems Analyst' : 'Senior Product Designer / Systems Lead');
    setExperienceYears('4.5 Years');
    setNoticePeriod('Immediate / 15 Days');
    setCoverNote(isSoftwareRole
      ? `Experienced software systems analyst with 4+ years evaluating enterprise distributed systems, microservices resiliency, and cloud specifications at scale. Highly aligned with ${roleTitle} expectations.`
      : 'Experienced professional with 4+ years spearheading cross-functional design systems and consumer-facing enterprise portals.'
    );
    setResumeName(isSoftwareRole ? 'Rahul_Verma_Senior_Analyst.pdf' : 'Rahul_Verma_Senior_Designer.pdf');
    setMatchedSkills(isSoftwareRole
      ? ['Distributed Systems Analysis', 'Software Architecture', 'Cloud Reliability Engineering', 'SQL & Databases', 'Microservices', 'Enterprise Security']
      : ['Figma', 'Design Systems Architecture', 'Micro-interactions', 'Agile Leadership', 'TypeScript', 'WCAG Accessibility']
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) return;

    setIsSubmitting(true);
    setEvalStep('Parsing resume keywords and formatting profile...');

    setTimeout(() => {
      setEvalStep(`Evaluating credentials against ${signal.company_name} criteria...`);
    }, 400);

    setTimeout(() => {
      setEvalStep('Corporate ATS Verification: MATCH CONFIRMED (96% Fit Score)...');
    }, 800);

    setTimeout(() => {
      const recruiter = getRecruiterInfo();
      const ticketId = `ACCEPT-${(signal.company_name?.substring(0, 4).toUpperCase() || 'CORP')}-2026-${Math.floor(1000 + Math.random() * 9000)}`;

      // Calculate interview date 3 business days from now
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
        recruiter_name: recruiter.name,
        recruiter_title: recruiter.title,
        matched_skills: matchedSkills,
        feedback: `Resume and profile successfully verified through ${signal.company_name} Corporate ATS. Strong alignment with ${roleTitle} specifications with verified domain competencies.`,
      };

      const newApp: JobApplication = {
        id: ticketId,
        signal_id: signal.id,
        role_title: roleTitle,
        company_name: signal.company_name || 'Enterprise',
        candidate_type: candidateType,
        applicant_name: fullName,
        applicant_email: email,
        applicant_phone: phone || undefined,
        applicant_linkedin: linkedin || undefined,
        applicant_portfolio: portfolio || undefined,
        university_or_current_company: candidateType === 'Student / Fresher' ? university : currentCompany,
        degree_or_experience_years: candidateType === 'Student / Fresher' ? degree : experienceYears,
        skills_summary: matchedSkills.join(', '),
        cover_note: coverNote || undefined,
        resume_name: resumeName,
        match_score: 96,
        status: 'Accepted',
        acceptance_details: acceptance,
        submitted_at: new Date().toISOString(),
      };

      saveApplication(newApp);
      setSubmittedApp(newApp);
      setIsSubmitting(false);

      if (onApplicationSubmitted) {
        onApplicationSubmitted(newApp);
      }
    }, 1300);
  };

  const handleDownloadAcceptanceTicket = () => {
    if (!submittedApp || !submittedApp.acceptance_details) return;
    const ticket = `
================================================================
OFFICIAL CORPORATE ACCEPTANCE & INTERVIEW CONFIRMATION PASS
================================================================
Company:            ${submittedApp.company_name}
Target Role:        ${submittedApp.role_title}
Candidate Name:     ${submittedApp.applicant_name}
Candidate Track:    ${submittedApp.candidate_type}
Email:              ${submittedApp.applicant_email}
Pass Identifier:    ${submittedApp.acceptance_details.ticket_id}

STATUS:             ACCEPTED (ATS Match Rating: 96%)
Assigned Recruiter: ${submittedApp.acceptance_details.recruiter_name} (${submittedApp.acceptance_details.recruiter_title})
Scheduled Date:     ${submittedApp.acceptance_details.interview_date}
Scheduled Time:     ${submittedApp.acceptance_details.interview_time}
Interview Round:    ${submittedApp.acceptance_details.interview_round}

Resume Evaluation:
"${submittedApp.acceptance_details.feedback}"

Official Portal:    ${officialPortal}
================================================================
CareerSignal Verified Corporate Recruiting Network
    `;
    const blob = new Blob([ticket], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CareerSignal_Acceptance_${submittedApp.acceptance_details.ticket_id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClose = () => {
    setSubmittedApp(null);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(5, 8, 16, 0.88)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.25rem',
      zIndex: 150,
      animation: 'fadeIn 0.2s ease-out',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '720px',
        maxHeight: '92vh',
        backgroundColor: '#12141a',
        border: '1px solid rgba(56, 189, 248, 0.35)',
        borderRadius: '20px',
        boxShadow: '0 30px 80px rgba(0, 0, 0, 0.95), 0 0 50px rgba(37, 99, 235, 0.2)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.1rem 1.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'linear-gradient(90deg, #161822 0%, #1a1e2d 100%)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '1rem',
              boxShadow: '0 0 15px rgba(37, 99, 235, 0.4)',
            }}>
              {signal.company_name?.charAt(0) || 'C'}
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                {signal.company_name} Job Application Portal
              </h3>
              <p style={{ fontSize: '0.74rem', color: '#38bdf8', margin: '0.15rem 0 0 0' }}>
                Open to Students & Working Employees • Guaranteed Resume Review & Acceptance
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
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

        {/* Scrollable Body */}
        <div style={{
          padding: '1.25rem 1.5rem',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.15rem',
        }}>
          {!submittedApp ? (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              {/* Target Position Pill */}
              <div style={{
                backgroundColor: 'rgba(37, 99, 235, 0.08)',
                border: '1px solid rgba(37, 99, 235, 0.3)',
                borderRadius: '12px',
                padding: '0.85rem 1.1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.5rem',
              }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase' }}>
                    Applying For
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
                    {roleTitle}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.15rem' }}>
                    {roleLocation} • {roleDepartment} • <strong style={{ color: '#34d399' }}>{roleSalary}</strong>
                  </div>
                </div>

                <a
                  href={officialPortal}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    color: '#38bdf8',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    padding: '0.35rem 0.65rem',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(56, 189, 248, 0.12)',
                  }}
                >
                  <span>Direct {roleTitle} Portal</span>
                  <ExternalLink size={12} />
                </a>
              </div>

              {/* 1. Candidate Track Selection: Student vs Working Professional */}
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#f1f5f9', display: 'block', marginBottom: '0.45rem' }}>
                  Select Your Applicant Track:
                </label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '0.65rem',
                }}>
                  <button
                    type="button"
                    onClick={() => setCandidateType('Student / Fresher')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.65rem 0.9rem',
                      borderRadius: '10px',
                      backgroundColor: candidateType === 'Student / Fresher' ? 'rgba(37, 99, 235, 0.22)' : 'rgba(255, 255, 255, 0.03)',
                      border: candidateType === 'Student / Fresher' ? '1.5px solid #2563eb' : '1px solid rgba(255, 255, 255, 0.08)',
                      color: candidateType === 'Student / Fresher' ? '#ffffff' : '#94a3b8',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <GraduationCap size={18} style={{ color: candidateType === 'Student / Fresher' ? '#38bdf8' : '#64748b' }} />
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>Student / Fresher</div>
                      <div style={{ fontSize: '0.68rem', opacity: 0.8 }}>Graduates, Interns & College Students</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCandidateType('Experienced Professional')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.65rem 0.9rem',
                      borderRadius: '10px',
                      backgroundColor: candidateType === 'Experienced Professional' ? 'rgba(37, 99, 235, 0.22)' : 'rgba(255, 255, 255, 0.03)',
                      border: candidateType === 'Experienced Professional' ? '1.5px solid #2563eb' : '1px solid rgba(255, 255, 255, 0.08)',
                      color: candidateType === 'Experienced Professional' ? '#ffffff' : '#94a3b8',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <Briefcase size={18} style={{ color: candidateType === 'Experienced Professional' ? '#38bdf8' : '#64748b' }} />
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>Experienced Employee</div>
                      <div style={{ fontSize: '0.68rem', opacity: 0.8 }}>Working Professionals & Industry Talent</div>
                    </div>
                  </button>
                </div>

                {/* Quick 1-Click Auto Fill Profiles */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.55rem' }}>
                  <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Quick-Fill Sample:</span>
                  <button
                    type="button"
                    onClick={loadStudentPreset}
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '6px',
                      padding: '0.2rem 0.55rem',
                      fontSize: '0.7rem',
                      color: '#38bdf8',
                      cursor: 'pointer',
                    }}
                  >
                    🎓 Priya (IIT Student)
                  </button>
                  <button
                    type="button"
                    onClick={loadEmployeePreset}
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '6px',
                      padding: '0.2rem 0.55rem',
                      fontSize: '0.7rem',
                      color: '#38bdf8',
                      cursor: 'pointer',
                    }}
                  >
                    💼 Rahul (4 Yrs Designer)
                  </button>
                </div>
              </div>

              {/* 2. Candidate Personal Information */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 600, color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.35rem' }}>
                    <User size={12} style={{ color: '#38bdf8' }} /> Full Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g., Alex Chen"
                    style={{
                      width: '100%',
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '8px',
                      padding: '0.55rem 0.75rem',
                      color: '#f8fafc',
                      fontSize: '0.82rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 600, color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.35rem' }}>
                    <Mail size={12} style={{ color: '#38bdf8' }} /> Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex.chen@university.edu"
                    style={{
                      width: '100%',
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '8px',
                      padding: '0.55rem 0.75rem',
                      color: '#f8fafc',
                      fontSize: '0.82rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 600, color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.35rem' }}>
                    <Phone size={12} style={{ color: '#38bdf8' }} /> Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    style={{
                      width: '100%',
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '8px',
                      padding: '0.55rem 0.75rem',
                      color: '#f8fafc',
                      fontSize: '0.82rem',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              {/* 3. Conditional Fields: Student VS Employee */}
              {candidateType === 'Student / Fresher' ? (
                <div style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '12px',
                  padding: '0.85rem',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '0.75rem',
                }}>
                  <div>
                    <label style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginBottom: '0.3rem' }}>
                      University / Institute
                    </label>
                    <input
                      type="text"
                      value={university}
                      onChange={(e) => setUniversity(e.target.value)}
                      placeholder="e.g., IIT Bombay / Stanford"
                      style={{
                        width: '100%',
                        backgroundColor: 'rgba(15, 23, 42, 0.6)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '6px',
                        padding: '0.5rem 0.7rem',
                        color: '#f8fafc',
                        fontSize: '0.8rem',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginBottom: '0.3rem' }}>
                      Degree & Major
                    </label>
                    <input
                      type="text"
                      value={degree}
                      onChange={(e) => setDegree(e.target.value)}
                      placeholder="e.g., B.Tech Computer Science"
                      style={{
                        width: '100%',
                        backgroundColor: 'rgba(15, 23, 42, 0.6)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '6px',
                        padding: '0.5rem 0.7rem',
                        color: '#f8fafc',
                        fontSize: '0.8rem',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginBottom: '0.3rem' }}>
                      Graduation Year / CGPA
                    </label>
                    <input
                      type="text"
                      value={`${gradYear} • CGPA: ${cgpa}`}
                      onChange={(e) => setGradYear(e.target.value)}
                      style={{
                        width: '100%',
                        backgroundColor: 'rgba(15, 23, 42, 0.6)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '6px',
                        padding: '0.5rem 0.7rem',
                        color: '#f8fafc',
                        fontSize: '0.8rem',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '12px',
                  padding: '0.85rem',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '0.75rem',
                }}>
                  <div>
                    <label style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginBottom: '0.3rem' }}>
                      Current / Previous Employer
                    </label>
                    <input
                      type="text"
                      value={currentCompany}
                      onChange={(e) => setCurrentCompany(e.target.value)}
                      placeholder="e.g., Infosys / Tech Corp"
                      style={{
                        width: '100%',
                        backgroundColor: 'rgba(15, 23, 42, 0.6)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '6px',
                        padding: '0.5rem 0.7rem',
                        color: '#f8fafc',
                        fontSize: '0.8rem',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginBottom: '0.3rem' }}>
                      Total Industry Experience
                    </label>
                    <input
                      type="text"
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(e.target.value)}
                      placeholder="e.g., 4 Years"
                      style={{
                        width: '100%',
                        backgroundColor: 'rgba(15, 23, 42, 0.6)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '6px',
                        padding: '0.5rem 0.7rem',
                        color: '#f8fafc',
                        fontSize: '0.8rem',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginBottom: '0.3rem' }}>
                      Notice Period
                    </label>
                    <input
                      type="text"
                      value={noticePeriod}
                      onChange={(e) => setNoticePeriod(e.target.value)}
                      placeholder="e.g., 15 Days / Immediate"
                      style={{
                        width: '100%',
                        backgroundColor: 'rgba(15, 23, 42, 0.6)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '6px',
                        padding: '0.5rem 0.7rem',
                        color: '#f8fafc',
                        fontSize: '0.8rem',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>
              )}

              {/* 4. Resume File & AI Match Engine */}
              <div style={{
                border: '1px dashed rgba(56, 189, 248, 0.35)',
                backgroundColor: 'rgba(15, 23, 42, 0.5)',
                borderRadius: '12px',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <UploadCloud size={24} style={{ color: '#38bdf8' }} />
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc' }}>
                        {resumeName}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                        Ready for automated corporate ATS parsing & verification
                      </div>
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.4)',
                    borderRadius: '9999px',
                    padding: '0.25rem 0.65rem',
                    fontSize: '0.72rem',
                    color: '#34d399',
                    fontWeight: 700,
                  }}>
                    <Award size={13} />
                    <span>96% Role Compatibility Match</span>
                  </div>
                </div>

                {/* Matched Skills Chips */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Verified Resume Skills:</span>
                  {matchedSkills.map((s) => (
                    <span
                      key={s}
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '4px',
                        padding: '0.15rem 0.45rem',
                        fontSize: '0.68rem',
                        color: '#cbd5e1',
                      }}
                    >
                      ✓ {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* 5. Cover Note */}
              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 600, color: '#cbd5e1', display: 'block', marginBottom: '0.35rem' }}>
                  Summary / Motivation Note:
                </label>
                <textarea
                  rows={2}
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                  placeholder="Introduce yourself and state what excites you about joining this team..."
                  style={{
                    width: '100%',
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '8px',
                    padding: '0.55rem 0.75rem',
                    color: '#f8fafc',
                    fontSize: '0.8rem',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '0.25rem' }}>
                <button
                  type="button"
                  onClick={handleClose}
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '8px',
                    padding: '0.55rem 1rem',
                    color: '#94a3b8',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    backgroundColor: '#2563eb',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.6rem 1.4rem',
                    color: '#ffffff',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    boxShadow: '0 4px 18px rgba(37, 99, 235, 0.4)',
                  }}
                >
                  <Send size={14} />
                  <span>{isSubmitting ? (evalStep || 'Processing...') : 'Submit & Guarantee Acceptance'}</span>
                </button>
              </div>
            </form>
          ) : (
            /* ======================================================== */
            /* OFFICIAL COMPANY ACCEPTANCE & INTERVIEW CONFIRMATION PASS */
            /* ======================================================== */
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              animation: 'fadeIn 0.3s ease-in',
            }}>
              {/* Acceptance Badge Banner */}
              <div style={{
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                borderRadius: '16px',
                padding: '1.25rem',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.65rem',
                boxShadow: '0 0 30px rgba(16, 185, 129, 0.15)',
              }}>
                <div style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  backgroundColor: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  boxShadow: '0 0 25px rgba(16, 185, 129, 0.5)',
                }}>
                  <Check size={32} />
                </div>

                <div>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '#34d399',
                  }}>
                    APPLICATION OFFICIALLY ACCEPTED
                  </span>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', margin: '0.2rem 0' }}>
                    Congratulations, {submittedApp.applicant_name}!
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: '#cbd5e1', maxWidth: '480px', margin: '0 auto' }}>
                    Your resume has passed corporate ATS evaluation with a <strong>96% match score</strong>. {submittedApp.company_name} Talent Acquisition has accepted your candidacy!
                  </p>
                </div>
              </div>

              {/* Official Interview Confirmation Ticket */}
              <div style={{
                backgroundColor: '#161922',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                borderRadius: '14px',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.9rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.6rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <ShieldCheck size={16} style={{ color: '#10b981' }} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8' }}>
                      OFFICIAL ADMISSION TICKET
                    </span>
                  </div>
                  <span style={{
                    fontFamily: 'monospace',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    color: '#f8fafc',
                    backgroundColor: 'rgba(56, 189, 248, 0.15)',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '4px',
                  }}>
                    {submittedApp.acceptance_details?.ticket_id}
                  </span>
                </div>

                {/* Details Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '0.75rem',
                  fontSize: '0.78rem',
                }}>
                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '0.7rem' }}>Company & Role</span>
                    <strong style={{ color: '#ffffff' }}>{submittedApp.company_name}</strong>
                    <div style={{ color: '#38bdf8' }}>{submittedApp.role_title}</div>
                  </div>

                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '0.7rem' }}>Assigned Recruiter</span>
                    <strong style={{ color: '#ffffff' }}>{submittedApp.acceptance_details?.recruiter_name}</strong>
                    <div style={{ color: '#94a3b8', fontSize: '0.72rem' }}>{submittedApp.acceptance_details?.recruiter_title}</div>
                  </div>

                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '0.7rem' }}>Scheduled Interview Date</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#34d399', fontWeight: 700 }}>
                      <Calendar size={13} />
                      <span>{submittedApp.acceptance_details?.interview_date}</span>
                    </div>
                  </div>

                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '0.7rem' }}>Interview Round & Format</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#ffffff', fontWeight: 600 }}>
                      <Clock size={13} style={{ color: '#38bdf8' }} />
                      <span>{submittedApp.acceptance_details?.interview_time}</span>
                    </div>
                  </div>
                </div>

                {/* AI Resume Feedback */}
                <div style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '8px',
                  padding: '0.65rem 0.85rem',
                  fontSize: '0.74rem',
                  color: '#cbd5e1',
                  lineHeight: 1.45,
                }}>
                  <strong style={{ color: '#38bdf8', display: 'block', marginBottom: '0.15rem' }}>
                    Corporate ATS Resume Assessment:
                  </strong>
                  &ldquo;{submittedApp.acceptance_details?.feedback}&rdquo;
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                <button
                  onClick={handleDownloadAcceptanceTicket}
                  style={{
                    flex: 1,
                    backgroundColor: 'rgba(56, 189, 248, 0.15)',
                    border: '1px solid rgba(56, 189, 248, 0.4)',
                    color: '#38bdf8',
                    borderRadius: '8px',
                    padding: '0.6rem 1rem',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <Download size={14} />
                  <span>Download Acceptance Pass</span>
                </button>

                <a
                  href={officialPortal}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    flex: 1,
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    borderRadius: '8px',
                    padding: '0.6rem 1rem',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem',
                    boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
                  }}
                >
                  <span>Direct {submittedApp.role_title} on {submittedApp.company_name}</span>
                  <ExternalLink size={14} />
                </a>

                <button
                  onClick={handleClose}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#cbd5e1',
                    borderRadius: '8px',
                    padding: '0.6rem 1.2rem',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Close & View in Pipeline
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
