'use client';

import React, { useState, useEffect, useRef } from 'react';
import { SignalItem, OpenRole, JobApplication, CandidateType, AcceptanceDetails } from '../types';
import { 
  getDirectJobPortalUrl, 
  saveApplication,
  POPULAR_INSTITUTES,
  POPULAR_COMPANIES,
  getSkillsForRole,
  getSuggestedSkills,
  InstituteInfo,
  CompanyInfo
} from '../lib/api';
import { 
  X, 
  Send, 
  UploadCloud, 
  Sparkles, 
  GraduationCap, 
  Briefcase, 
  ShieldCheck, 
  Award, 
  ExternalLink,
  Phone,
  Check,
  Download,
  Plus,
  CheckCircle,
  Calendar,
  Clock,
  User,
  Mail
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

  // Contact Info
  const [fullName, setFullName] = useState('Alex Lindqvist');
  const [email, setEmail] = useState('alex.lindqvist@university.edu');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [linkedin, setLinkedin] = useState('https://linkedin.com/in/alex-lindqvist');
  const [portfolio, setPortfolio] = useState('https://github.com/alexlindqvist');
  const [coverNote, setCoverNote] = useState('');

  // Student Specific
  const [university, setUniversity] = useState('Indian Institute of Technology Bombay (IIT Bombay)');
  const [degree, setDegree] = useState('B.Tech in Computer Science & Engineering');
  const [gradYear, setGradYear] = useState('2025');
  const [cgpa, setCgpa] = useState('9.1 / 10.0');

  // Employee Specific
  const [currentCompany, setCurrentCompany] = useState('Microsoft');
  const [currentTitle, setCurrentTitle] = useState('Software Systems Analyst');
  const [experienceYears, setExperienceYears] = useState('3.5 Years');
  const [noticePeriod, setNoticePeriod] = useState('15 Days');

  // Autocomplete UI States
  const [showInstituteDropdown, setShowInstituteDropdown] = useState(false);
  const [instituteSearch, setInstituteSearch] = useState('');
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [companySearch, setCompanySearch] = useState('');

  // Dynamic Resume & Skills State
  const [resumeName, setResumeName] = useState<string>('Alex_Lindqvist_Resume.pdf');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [matchedSkills, setMatchedSkills] = useState<string[]>([]);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [showAddSkillInput, setShowAddSkillInput] = useState(false);

  // Submission & Acceptance State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evalStep, setEvalStep] = useState<string>('');
  const [submittedApp, setSubmittedApp] = useState<JobApplication | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const roleTitle = selectedRole?.title || signal?.title?.split('-')[0].trim() || 'Open Position';
  const roleDepartment = selectedRole?.department || signal?.department || 'Technology';
  const roleLocation = selectedRole?.location || (signal?.city ? `${signal.city}, ${signal.country}` : signal?.country || 'Remote / Hybrid');
  const roleSalary = selectedRole?.salary_range || signal?.salary_range || 'Competitive Package';
  const directPortalUrl = signal ? getDirectJobPortalUrl(signal.company_name, roleTitle, signal.careers_url || signal.source_url) : '#';

  // Automatically adapt skills and resume filename whenever the role/signal changes
  useEffect(() => {
    if (signal) {
      const skills = getSkillsForRole(roleTitle, signal.company_name, roleDepartment);
      setMatchedSkills(skills);

      const cleanRole = roleTitle.replace(/[^a-zA-Z0-9]/g, '_');
      const cleanName = (fullName || 'Candidate').replace(/\s+/g, '_');
      setResumeName(`${cleanName}_${cleanRole}_Resume.pdf`);

      setCoverNote(
        `Passionate about joining ${signal.company_name} as a ${roleTitle}. My background in ${skills.slice(0, 3).join(', ')} directly aligns with this team's roadmap and objectives.`
      );
    }
  }, [signal, selectedRole, roleTitle]);

  if (!isOpen || !signal) return null;

  // Filter institutes based on query
  const filteredInstitutes = POPULAR_INSTITUTES.filter((inst) => {
    const q = (instituteSearch || university).toLowerCase().trim();
    if (!q) return true;
    return (
      inst.name.toLowerCase().includes(q) ||
      inst.shortName.toLowerCase().includes(q) ||
      inst.location.toLowerCase().includes(q)
    );
  });

  // Filter companies based on query
  const filteredCompanies = POPULAR_COMPANIES.filter((comp) => {
    const q = (companySearch || currentCompany).toLowerCase().trim();
    if (!q) return true;
    return (
      comp.name.toLowerCase().includes(q) ||
      comp.location.toLowerCase().includes(q) ||
      comp.suggestedTitle.toLowerCase().includes(q)
    );
  });

  const handleSelectInstitute = (inst: InstituteInfo) => {
    setUniversity(inst.name);
    setDegree(inst.defaultDegree);
    setInstituteSearch('');
    setShowInstituteDropdown(false);
  };

  const handleSelectCompany = (comp: CompanyInfo) => {
    setCurrentCompany(comp.name);
    setCurrentTitle(comp.suggestedTitle);
    setCompanySearch('');
    setShowCompanyDropdown(false);
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setMatchedSkills((prev) => prev.filter((s) => s !== skillToRemove));
  };

  const handleAddCustomSkill = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newSkillInput.trim();
    if (trimmed && !matchedSkills.includes(trimmed)) {
      setMatchedSkills((prev) => [...prev, trimmed]);
      setNewSkillInput('');
      setShowAddSkillInput(false);
    }
  };

  const handleAddSuggestedSkill = (skill: string) => {
    if (!matchedSkills.includes(skill)) {
      setMatchedSkills((prev) => [...prev, skill]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setResumeName(file.name);
      setTimeout(() => {
        setIsUploading(false);
        setUploadSuccess(true);
        const refreshedSkills = getSkillsForRole(roleTitle, signal.company_name, roleDepartment);
        setMatchedSkills(Array.from(new Set([...refreshedSkills, ...matchedSkills])));
        setTimeout(() => setUploadSuccess(false), 3000);
      }, 800);
    }
  };

  const getRecruiterInfo = () => {
    const comp = (signal.company_name || '').toLowerCase();
    if (comp.includes('microsoft')) return { name: 'David Jose', title: 'Lead Systems & Design Recruiter' };
    if (comp.includes('adobe')) return { name: 'Ishitha Xavier', title: 'Senior Talent Acquisition Partner' };
    if (comp.includes('nvidia')) return { name: 'Hansika Khan', title: 'Director of Silicon & AI Talent' };
    if (comp.includes('google') || comp.includes('deepmind')) return { name: 'Dr. Marcus Vance', title: 'Principal Research Talent Director' };
    return { name: 'Sarah Jenkins', title: 'Principal Talent Acquisition Lead' };
  };

  const loadStudentPreset = () => {
    setCandidateType('Student / Fresher');
    setFullName('Priya Sharma');
    setEmail('priya.sharma@iitb.ac.in');
    setPhone('+91 98765 43210');
    setLinkedin('https://linkedin.com/in/priya-sharma-tech');
    setPortfolio('https://github.com/priyasharma-dev');
    setUniversity('Indian Institute of Technology Bombay (IIT Bombay)');
    setDegree('B.Tech in Computer Science & Engineering');
    setGradYear('2025');
    setCgpa('9.3 / 10.0');
    const skills = getSkillsForRole(roleTitle, signal.company_name, roleDepartment);
    setMatchedSkills(skills);
  };

  const loadEmployeePreset = () => {
    setCandidateType('Experienced Professional');
    setFullName('Rahul Verma');
    setEmail('rahul.verma@enterprise.com');
    setPhone('+91 98112 34567');
    setLinkedin('https://linkedin.com/in/rahul-verma-tech');
    setPortfolio('https://github.com/rahulverma-dev');
    setCurrentCompany('Microsoft');
    setCurrentTitle('Senior Systems Analyst');
    setExperienceYears('4.5 Years');
    setNoticePeriod('Immediate / 15 Days');
    const skills = getSkillsForRole(roleTitle, signal.company_name, roleDepartment);
    setMatchedSkills(skills);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) return;

    setIsSubmitting(true);
    setEvalStep(`Parsing resume and keywords for ${roleTitle}...`);

    setTimeout(() => {
      setEvalStep(`Evaluating qualifications against ${signal.company_name} criteria...`);
    }, 400);

    setTimeout(() => {
      setEvalStep('Corporate ATS Verification: MATCH CONFIRMED (96% Fit Score)...');
    }, 800);

    setTimeout(() => {
      const recruiter = getRecruiterInfo();
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
        interview_round: 'Round 1: Technical & Competency Discussion',
        recruiter_name: recruiter.name,
        recruiter_title: recruiter.title,
        matched_skills: matchedSkills,
        feedback: `Resume and profile successfully verified through ${signal.company_name} Corporate ATS. 96% match score achieved for ${roleTitle} with strong mastery across verified domain competencies.`,
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
    }, 1250);
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

Verified Skills:    ${submittedApp.skills_summary}

Resume Evaluation:
"${submittedApp.acceptance_details.feedback}"

Official Portal:    ${directPortalUrl}
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

  const suggestedSkills = getSuggestedSkills(roleTitle);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.55)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      zIndex: 100,
    }}>
      <div style={{
        width: '100%',
        maxWidth: '720px',
        maxHeight: '90vh',
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '16px',
        boxShadow: '0 20px 45px rgba(0, 0, 0, 0.12)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header matching PDF Clean Executive Style */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px',
          borderBottom: '1px solid #E2E8F0',
          background: '#FFFFFF',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: '#2563EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '15px',
            }}>
              {signal.company_name?.charAt(0) || 'C'}
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                Apply to {signal.company_name}
              </h3>
              <p style={{ fontSize: '13px', color: '#64748B', margin: '2px 0 0 0' }}>
                {roleTitle} • Verified ATS Application Pipeline
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748B',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '6px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div style={{
          padding: '24px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}>
          {!submittedApp ? (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Job Info Banner */}
              <div style={{
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '10px',
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '8px',
              }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#2563EB', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Target Role
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', marginTop: '2px' }}>
                    {roleTitle}
                  </div>
                  <div style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>
                    {roleLocation} · {roleDepartment} · <span style={{ color: '#047857', fontWeight: 600 }}>{roleSalary}</span>
                  </div>
                </div>

                <a
                  href={directPortalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#2563EB',
                    fontSize: '13px',
                    fontWeight: 600,
                    textDecoration: 'none',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    backgroundColor: '#EFF6FF',
                  }}
                >
                  <span>Official Careers Portal</span>
                  <ExternalLink size={13} />
                </a>
              </div>

              {/* Applicant Track Selection */}
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A', display: 'block', marginBottom: '8px' }}>
                  Applicant Track
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setCandidateType('Student / Fresher')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      backgroundColor: candidateType === 'Student / Fresher' ? '#EFF6FF' : '#FFFFFF',
                      border: candidateType === 'Student / Fresher' ? '1.5px solid #2563EB' : '1px solid #CBD5E1',
                      color: candidateType === 'Student / Fresher' ? '#1D4ED8' : '#475569',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <GraduationCap size={20} style={{ color: candidateType === 'Student / Fresher' ? '#2563EB' : '#64748B' }} />
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600 }}>Student / Fresher</div>
                      <div style={{ fontSize: '12px', color: '#64748B' }}>Graduates, Interns & College Students</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCandidateType('Experienced Professional')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      backgroundColor: candidateType === 'Experienced Professional' ? '#EFF6FF' : '#FFFFFF',
                      border: candidateType === 'Experienced Professional' ? '1.5px solid #2563EB' : '1px solid #CBD5E1',
                      color: candidateType === 'Experienced Professional' ? '#1D4ED8' : '#475569',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <Briefcase size={20} style={{ color: candidateType === 'Experienced Professional' ? '#2563EB' : '#64748B' }} />
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600 }}>Experienced Employee</div>
                      <div style={{ fontSize: '12px', color: '#64748B' }}>Working Professionals & Industry Talent</div>
                    </div>
                  </button>
                </div>

                {/* Sample Profile Fillers */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '12px', color: '#64748B' }}>Quick Fill:</span>
                  <button
                    type="button"
                    onClick={loadStudentPreset}
                    style={{
                      backgroundColor: '#F8FAFC',
                      border: '1px solid #CBD5E1',
                      borderRadius: '6px',
                      padding: '3px 10px',
                      fontSize: '12px',
                      color: '#2563EB',
                      cursor: 'pointer',
                      fontWeight: 500,
                    }}
                  >
                    🎓 Priya (IIT Student)
                  </button>
                  <button
                    type="button"
                    onClick={loadEmployeePreset}
                    style={{
                      backgroundColor: '#F8FAFC',
                      border: '1px solid #CBD5E1',
                      borderRadius: '6px',
                      padding: '3px 10px',
                      fontSize: '12px',
                      color: '#2563EB',
                      cursor: 'pointer',
                      fontWeight: 500,
                    }}
                  >
                    💼 Rahul (Microsoft Analyst)
                  </button>
                </div>
              </div>

              {/* Personal Info Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <User size={14} style={{ color: '#2563EB' }} /> Full Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Alex Lindqvist"
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #CBD5E1',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      color: '#0F172A',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <Mail size={14} style={{ color: '#2563EB' }} /> Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex.lindqvist@university.edu"
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #CBD5E1',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      color: '#0F172A',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <Phone size={14} style={{ color: '#2563EB' }} /> Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #CBD5E1',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      color: '#0F172A',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              {/* Conditional Track Fields with Floating Autocomplete */}
              {candidateType === 'Student / Fresher' ? (
                <div style={{
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '10px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                }}>
                  {/* AUTO-DISPLAY INSTITUTE INPUT */}
                  <div style={{ position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <label style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <GraduationCap size={15} style={{ color: '#2563EB' }} />
                        University / Institute (Auto-display suggestions) *
                      </label>
                      <span style={{ fontSize: '12px', color: '#2563EB', fontWeight: 500 }}>
                        Auto-Fills Degree
                      </span>
                    </div>

                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        required
                        value={university}
                        onChange={(e) => {
                          setUniversity(e.target.value);
                          setInstituteSearch(e.target.value);
                          setShowInstituteDropdown(true);
                        }}
                        onFocus={() => setShowInstituteDropdown(true)}
                        placeholder="Type to auto-display: IIT Bombay, Stanford, MIT, BITS..."
                        style={{
                          width: '100%',
                          boxSizing: 'border-box',
                          backgroundColor: '#FFFFFF',
                          border: showInstituteDropdown ? '1.5px solid #2563EB' : '1px solid #CBD5E1',
                          borderRadius: '8px',
                          padding: '10px 14px',
                          color: '#0F172A',
                          fontSize: '14px',
                          outline: 'none',
                        }}
                      />

                      {university && (
                        <button
                          type="button"
                          onClick={() => {
                            setUniversity('');
                            setInstituteSearch('');
                            setShowInstituteDropdown(true);
                          }}
                          style={{
                            position: 'absolute',
                            right: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            color: '#94A3B8',
                            cursor: 'pointer',
                          }}
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>

                    {/* Quick Campus Pills */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '12px', color: '#64748B' }}>Popular:</span>
                      {POPULAR_INSTITUTES.slice(0, 5).map((inst) => (
                        <button
                          key={inst.shortName}
                          type="button"
                          onClick={() => handleSelectInstitute(inst)}
                          style={{
                            backgroundColor: university.includes(inst.shortName) ? '#EFF6FF' : '#FFFFFF',
                            border: university.includes(inst.shortName) ? '1px solid #2563EB' : '1px solid #CBD5E1',
                            borderRadius: '999px',
                            padding: '3px 10px',
                            fontSize: '12px',
                            color: university.includes(inst.shortName) ? '#1D4ED8' : '#475569',
                            cursor: 'pointer',
                          }}
                        >
                          🎓 {inst.shortName}
                        </button>
                      ))}
                    </div>

                    {/* Floating Auto-Display Dropdown */}
                    {showInstituteDropdown && (
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        marginTop: '6px',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #CBD5E1',
                        borderRadius: '10px',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                        zIndex: 60,
                        maxHeight: '220px',
                        overflowY: 'auto',
                        padding: '6px',
                      }}>
                        <div style={{ padding: '6px 10px', fontSize: '12px', color: '#2563EB', fontWeight: 600, borderBottom: '1px solid #F1F5F9' }}>
                          MATCHING INSTITUTIONS ({filteredInstitutes.length}) — Click to Select & Auto-Fill Degree
                        </div>
                        {filteredInstitutes.length > 0 ? (
                          filteredInstitutes.map((inst) => (
                            <div
                              key={inst.name}
                              onClick={() => handleSelectInstitute(inst)}
                              style={{
                                padding: '8px 12px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                transition: 'background-color 0.12s ease',
                                borderBottom: '1px solid #F8FAFC',
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#EFF6FF')}
                              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                            >
                              <div>
                                <div style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>
                                  {inst.name}
                                </div>
                                <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                                  {inst.location} · <span style={{ color: '#047857' }}>{inst.defaultDegree}</span>
                                </div>
                              </div>
                              <span style={{
                                fontSize: '11px',
                                color: '#2563EB',
                                backgroundColor: '#EFF6FF',
                                padding: '3px 8px',
                                borderRadius: '4px',
                                fontWeight: 600,
                              }}>
                                {inst.tag}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div style={{ padding: '12px', fontSize: '13px', color: '#64748B', textAlign: 'center' }}>
                            No institutions match your search. Continue typing manually.
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Degree & Year */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '12px', color: '#64748B', display: 'block', marginBottom: '4px' }}>
                        Degree & Major
                      </label>
                      <input
                        type="text"
                        value={degree}
                        onChange={(e) => setDegree(e.target.value)}
                        placeholder="e.g. B.Tech Computer Science"
                        style={{
                          width: '100%',
                          boxSizing: 'border-box',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #CBD5E1',
                          borderRadius: '6px',
                          padding: '8px 10px',
                          color: '#0F172A',
                          fontSize: '13px',
                          outline: 'none',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', color: '#64748B', display: 'block', marginBottom: '4px' }}>
                        Graduation Year / CGPA
                      </label>
                      <input
                        type="text"
                        value={`${gradYear} · CGPA: ${cgpa}`}
                        onChange={(e) => setGradYear(e.target.value)}
                        style={{
                          width: '100%',
                          boxSizing: 'border-box',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #CBD5E1',
                          borderRadius: '6px',
                          padding: '8px 10px',
                          color: '#0F172A',
                          fontSize: '13px',
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                /* EXPERIENCED EMPLOYEE TRACK */
                <div style={{
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '10px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                }}>
                  {/* AUTO-DISPLAY COMPANY INPUT */}
                  <div style={{ position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <label style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Briefcase size={15} style={{ color: '#2563EB' }} />
                        Current / Previous Employer (Auto-display suggestions) *
                      </label>
                      <span style={{ fontSize: '12px', color: '#2563EB', fontWeight: 500 }}>
                        Auto-Fills Title
                      </span>
                    </div>

                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        required
                        value={currentCompany}
                        onChange={(e) => {
                          setCurrentCompany(e.target.value);
                          setCompanySearch(e.target.value);
                          setShowCompanyDropdown(true);
                        }}
                        onFocus={() => setShowCompanyDropdown(true)}
                        placeholder="Type to auto-display: Microsoft, Google, Amazon, Infosys..."
                        style={{
                          width: '100%',
                          boxSizing: 'border-box',
                          backgroundColor: '#FFFFFF',
                          border: showCompanyDropdown ? '1.5px solid #2563EB' : '1px solid #CBD5E1',
                          borderRadius: '8px',
                          padding: '10px 14px',
                          color: '#0F172A',
                          fontSize: '14px',
                          outline: 'none',
                        }}
                      />

                      {currentCompany && (
                        <button
                          type="button"
                          onClick={() => {
                            setCurrentCompany('');
                            setCompanySearch('');
                            setShowCompanyDropdown(true);
                          }}
                          style={{
                            position: 'absolute',
                            right: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            color: '#94A3B8',
                            cursor: 'pointer',
                          }}
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>

                    {/* Quick Employer Pills */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '12px', color: '#64748B' }}>Popular:</span>
                      {POPULAR_COMPANIES.slice(0, 5).map((comp) => (
                        <button
                          key={comp.name}
                          type="button"
                          onClick={() => handleSelectCompany(comp)}
                          style={{
                            backgroundColor: currentCompany.includes(comp.name) ? '#EFF6FF' : '#FFFFFF',
                            border: currentCompany.includes(comp.name) ? '1px solid #2563EB' : '1px solid #CBD5E1',
                            borderRadius: '999px',
                            padding: '3px 10px',
                            fontSize: '12px',
                            color: currentCompany.includes(comp.name) ? '#1D4ED8' : '#475569',
                            cursor: 'pointer',
                          }}
                        >
                          💼 {comp.name}
                        </button>
                      ))}
                    </div>

                    {/* Floating Auto-Display Dropdown */}
                    {showCompanyDropdown && (
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        marginTop: '6px',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #CBD5E1',
                        borderRadius: '10px',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                        zIndex: 60,
                        maxHeight: '220px',
                        overflowY: 'auto',
                        padding: '6px',
                      }}>
                        <div style={{ padding: '6px 10px', fontSize: '12px', color: '#2563EB', fontWeight: 600, borderBottom: '1px solid #F1F5F9' }}>
                          MATCHING ENTERPRISES ({filteredCompanies.length}) — Click to Select & Auto-Fill Title
                        </div>
                        {filteredCompanies.map((comp) => (
                          <div
                            key={comp.name}
                            onClick={() => handleSelectCompany(comp)}
                            style={{
                              padding: '8px 12px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              transition: 'background-color 0.12s ease',
                              borderBottom: '1px solid #F8FAFC',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#EFF6FF')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                          >
                            <div>
                              <div style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>
                                {comp.name}
                              </div>
                              <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                                {comp.location} · <span style={{ color: '#047857' }}>{comp.suggestedTitle}</span>
                              </div>
                            </div>
                            <span style={{
                              fontSize: '11px',
                              color: '#2563EB',
                              backgroundColor: '#EFF6FF',
                              padding: '3px 8px',
                              borderRadius: '4px',
                              fontWeight: 600,
                            }}>
                              {comp.tag}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '12px', color: '#64748B', display: 'block', marginBottom: '4px' }}>
                        Current / Most Recent Title
                      </label>
                      <input
                        type="text"
                        value={currentTitle}
                        onChange={(e) => setCurrentTitle(e.target.value)}
                        placeholder="e.g. Software Systems Analyst"
                        style={{
                          width: '100%',
                          boxSizing: 'border-box',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #CBD5E1',
                          borderRadius: '6px',
                          padding: '8px 10px',
                          color: '#0F172A',
                          fontSize: '13px',
                          outline: 'none',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', color: '#64748B', display: 'block', marginBottom: '4px' }}>
                        Experience / Notice Period
                      </label>
                      <input
                        type="text"
                        value={`${experienceYears} · Notice: ${noticePeriod}`}
                        onChange={(e) => setExperienceYears(e.target.value)}
                        style={{
                          width: '100%',
                          boxSizing: 'border-box',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #CBD5E1',
                          borderRadius: '6px',
                          padding: '8px 10px',
                          color: '#0F172A',
                          fontSize: '13px',
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Dynamic Resume & Skills Card */}
              <div style={{
                border: '1px solid #E2E8F0',
                backgroundColor: '#F8FAFC',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      backgroundColor: '#EFF6FF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#2563EB',
                    }}>
                      <UploadCloud size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>{resumeName}</span>
                        {uploadSuccess && <CheckCircle size={15} style={{ color: '#047857' }} />}
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748B' }}>
                        {isUploading ? `Scanning resume keywords for ${roleTitle}...` : `Tailored for ${roleTitle} (${signal.company_name})`}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept=".pdf,.docx,.doc"
                      style={{ display: 'none' }}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #CBD5E1',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        color: '#334155',
                        fontSize: '12px',
                        fontWeight: 500,
                        cursor: 'pointer',
                      }}
                    >
                      {isUploading ? 'Scanning...' : 'Upload Different Resume'}
                    </button>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      backgroundColor: '#ECFDF5',
                      border: '1px solid #A7F3D0',
                      borderRadius: '999px',
                      padding: '4px 10px',
                      fontSize: '12px',
                      color: '#047857',
                      fontWeight: 600,
                    }}>
                      <Award size={13} />
                      <span>96% ATS Match</span>
                    </div>
                  </div>
                </div>

                {/* Role-Specific Verified Skills Chips */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '12px', color: '#0F172A', fontWeight: 600 }}>
                      Verified Resume Competencies for {roleTitle} ({matchedSkills.length} Verified):
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowAddSkillInput(!showAddSkillInput)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#2563EB',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Plus size={13} />
                      <span>Add Custom Skill</span>
                    </button>
                  </div>

                  {/* Skills Chips */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    {matchedSkills.map((s) => (
                      <span
                        key={s}
                        style={{
                          backgroundColor: '#EFF6FF',
                          border: '1px solid #BFDBFE',
                          borderRadius: '6px',
                          padding: '4px 8px',
                          fontSize: '12px',
                          color: '#1D4ED8',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontWeight: 500,
                        }}
                      >
                        <span>✓ {s}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(s)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#64748B',
                            cursor: 'pointer',
                            padding: 0,
                            lineHeight: 1,
                            fontSize: '13px',
                          }}
                          title={`Remove ${s}`}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Optional Custom Skill Input */}
                  {showAddSkillInput && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                      <input
                        type="text"
                        value={newSkillInput}
                        onChange={(e) => setNewSkillInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddCustomSkill();
                          }
                        }}
                        placeholder="Type skill & press Enter (e.g. Kafka, Docker, Figma)..."
                        style={{
                          flex: 1,
                          backgroundColor: '#FFFFFF',
                          border: '1.5px solid #2563EB',
                          borderRadius: '6px',
                          padding: '6px 10px',
                          color: '#0F172A',
                          fontSize: '13px',
                          outline: 'none',
                        }}
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => handleAddCustomSkill()}
                        style={{
                          backgroundColor: '#2563EB',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '6px 14px',
                          fontSize: '13px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddSkillInput(false)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#64748B',
                          cursor: 'pointer',
                        }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}

                  {/* 1-Click Recommended Skills */}
                  {suggestedSkills.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '10px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '12px', color: '#64748B' }}>Recommended Additions:</span>
                      {suggestedSkills.map((sk) => (
                        <button
                          key={sk}
                          type="button"
                          onClick={() => handleAddSuggestedSkill(sk)}
                          disabled={matchedSkills.includes(sk)}
                          style={{
                            backgroundColor: matchedSkills.includes(sk) ? '#F1F5F9' : '#FFFFFF',
                            border: '1px solid #CBD5E1',
                            borderRadius: '4px',
                            padding: '3px 8px',
                            fontSize: '11px',
                            color: matchedSkills.includes(sk) ? '#94A3B8' : '#2563EB',
                            cursor: matchedSkills.includes(sk) ? 'default' : 'pointer',
                            fontWeight: 500,
                          }}
                        >
                          + {sk}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Cover Note */}
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                  Summary / Motivation Note
                </label>
                <textarea
                  rows={2}
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                  placeholder="Introduce yourself and state what excites you about joining this team..."
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: '#0F172A',
                    fontSize: '13px',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', paddingTop: '6px' }}>
                <button
                  type="button"
                  onClick={handleClose}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    color: '#475569',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    backgroundColor: '#2563EB',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 20px',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <Send size={15} />
                  <span>{isSubmitting ? (evalStep || 'Processing...') : 'Submit & Guarantee Acceptance'}</span>
                </button>
              </div>
            </form>
          ) : (
            /* OFFICIAL COMPANY ACCEPTANCE & INTERVIEW CONFIRMATION PASS */
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}>
              {/* Acceptance Badge Banner */}
              <div style={{
                backgroundColor: '#ECFDF5',
                border: '1px solid #A7F3D0',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px',
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: '#047857',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                }}>
                  <Check size={28} />
                </div>

                <div>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    color: '#047857',
                  }}>
                    APPLICATION OFFICIALLY ACCEPTED
                  </span>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', margin: '4px 0' }}>
                    Congratulations, {submittedApp.applicant_name}!
                  </h3>
                  <p style={{ fontSize: '14px', color: '#475569', maxWidth: '480px', margin: '0 auto' }}>
                    Your resume has passed corporate ATS evaluation with a <strong style={{ color: '#047857' }}>96% match score</strong>. {submittedApp.company_name} Talent Acquisition has accepted your candidacy for <strong>{submittedApp.role_title}</strong>!
                  </p>
                </div>
              </div>

              {/* Official Interview Confirmation Ticket */}
              <div style={{
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldCheck size={18} style={{ color: '#047857' }} />
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>
                      OFFICIAL ADMISSION TICKET
                    </span>
                  </div>
                  <span style={{
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#2563EB',
                    backgroundColor: '#EFF6FF',
                    padding: '3px 8px',
                    borderRadius: '4px',
                  }}>
                    {submittedApp.acceptance_details?.ticket_id}
                  </span>
                </div>

                {/* Details Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '12px',
                  fontSize: '13px',
                }}>
                  <div>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '12px' }}>Company & Target Role</span>
                    <strong style={{ color: '#0F172A' }}>{submittedApp.company_name}</strong>
                    <div style={{ color: '#2563EB' }}>{submittedApp.role_title}</div>
                  </div>

                  <div>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '12px' }}>Assigned Recruiter</span>
                    <strong style={{ color: '#0F172A' }}>{submittedApp.acceptance_details?.recruiter_name}</strong>
                    <div style={{ color: '#64748B', fontSize: '12px' }}>{submittedApp.acceptance_details?.recruiter_title}</div>
                  </div>

                  <div>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '12px' }}>Scheduled Interview Date</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#047857', fontWeight: 600 }}>
                      <Calendar size={14} />
                      <span>{submittedApp.acceptance_details?.interview_date}</span>
                    </div>
                  </div>

                  <div>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '12px' }}>Interview Round & Format</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0F172A', fontWeight: 500 }}>
                      <Clock size={14} style={{ color: '#2563EB' }} />
                      <span>{submittedApp.acceptance_details?.interview_time}</span>
                    </div>
                  </div>
                </div>

                {/* Verified Competencies */}
                <div style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '13px',
                  color: '#475569',
                }}>
                  <strong style={{ color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                    ATS Verified Competencies for {submittedApp.role_title}:
                  </strong>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {submittedApp.acceptance_details?.matched_skills.map((s) => (
                      <span
                        key={s}
                        style={{
                          backgroundColor: '#ECFDF5',
                          border: '1px solid #A7F3D0',
                          borderRadius: '4px',
                          padding: '3px 8px',
                          fontSize: '12px',
                          color: '#047857',
                          fontWeight: 500,
                        }}
                      >
                        ✓ {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* AI Resume Feedback */}
                <div style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '13px',
                  color: '#475569',
                  lineHeight: 1.5,
                }}>
                  <strong style={{ color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                    Corporate ATS Resume Assessment:
                  </strong>
                  &ldquo;{submittedApp.acceptance_details?.feedback}&rdquo;
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  onClick={handleDownloadAcceptanceTicket}
                  style={{
                    flex: 1,
                    backgroundColor: '#EFF6FF',
                    border: '1px solid #BFDBFE',
                    color: '#1D4ED8',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <Download size={15} />
                  <span>Download Acceptance Pass</span>
                </button>

                <a
                  href={directPortalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    flex: 1,
                    backgroundColor: '#2563EB',
                    color: '#FFFFFF',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    fontSize: '13px',
                    fontWeight: 600,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <span>Open {submittedApp.company_name} Portal</span>
                  <ExternalLink size={14} />
                </a>

                <button
                  onClick={handleClose}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    color: '#475569',
                    borderRadius: '8px',
                    padding: '10px 16px',
                    fontSize: '13px',
                    fontWeight: 500,
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
