'use client';

import React, { useState } from 'react';
import { 
  Bell, 
  ChevronDown, 
  Calendar as CalendarIcon, 
  UserPlus, 
  MessageSquare,
  Check,
  Send,
  X
} from 'lucide-react';

import { JobApplication } from '../types';

interface RightRailDashboardProps {
  onOpenMessageModal?: (contactName: string) => void;
  applications?: JobApplication[];
}

export const RightRailDashboard: React.FC<RightRailDashboardProps> = ({
  onOpenMessageModal,
  applications = [],
}) => {
  const [selectedMonth, setSelectedMonth] = useState('Feb 2023');
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(5);
  const [dayTooltip, setDayTooltip] = useState<string | null>('Microsoft Interview: 10:30 AM IST');
  const [connectedUsers, setConnectedUsers] = useState<Record<string, boolean>>({});
  const [activeMessageContact, setActiveMessageContact] = useState<string | null>(null);
  const [quickMsgText, setQuickMsgText] = useState('');
  const [sentConfirm, setSentConfirm] = useState<string | null>(null);

  const months = ['Feb 2023', 'Nov 2026', 'Dec 2026', 'Jan 2027'];

  const latestAccepted = applications.find((a) => a.acceptance_details);

  const handleDayClick = (num: number) => {
    setSelectedDay(num);
    if (num >= 4 && num <= 7) {
      setDayTooltip(`Active Technical Evaluation: ${latestAccepted?.company_name || 'Microsoft'} · Round 1 Portfolio`);
    } else if (num === 12 || num === 15) {
      setDayTooltip('Follow-up with Adobe Talent Acquisition Partner');
    } else {
      setDayTooltip(`Scheduled focus day: Practice System Design`);
    }
  };

  const recruiterMessages = applications
    .filter((a) => a.acceptance_details)
    .map((a) => ({
      name: `${a.acceptance_details!.recruiter_name} (${a.company_name})`,
      snippet: `Accepted: Round 1 interview confirmed for ${a.role_title}!`,
      time: 'Just now',
      avatarBg: a.company_name.toLowerCase().includes('microsoft') ? '#2563eb' : '#eb1000',
      isOfficial: true,
    }));

  const messageList = [
    ...recruiterMessages,
    { name: 'Rohit Bhatt', snippet: 'Hope you are doing good', time: '04.15 PM', avatarBg: '#6366f1', isOfficial: false },
    { name: 'Freddy Jose', snippet: 'I want to connect.', time: '02.46 PM', avatarBg: '#0ea5e9', isOfficial: false },
    { name: 'Priya Ravi', snippet: 'Contact me via E-mail.', time: '11.37 AM', avatarBg: '#f59e0b', isOfficial: false },
  ];

  const toggleConnect = (name: string) => {
    setConnectedUsers((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickMsgText.trim() || !activeMessageContact) return;
    setSentConfirm(activeMessageContact);
    setQuickMsgText('');
    setTimeout(() => {
      setActiveMessageContact(null);
      setSentConfirm(null);
    }, 2000);
  };

  return (
    <aside style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      width: '275px',
      flexShrink: 0,
    }}>
      {/* Top Header Bar: Notification & Profile */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: '0.9rem',
        padding: '0.2rem 0.5rem',
      }}>
        {/* Notification Bell with Active Indicator */}
        <button
          style={{
            position: 'relative',
            background: 'none',
            border: 'none',
            color: '#cbd5e1',
            cursor: 'pointer',
            padding: '0.4rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title="Notifications"
        >
          <Bell size={18} />
          <span style={{
            position: 'absolute',
            top: '4px',
            right: '5px',
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            backgroundColor: '#2563eb',
            boxShadow: '0 0 6px #2563eb',
          }} />
        </button>

        {/* User Avatar & Dropdown */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          cursor: 'pointer',
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#334155',
            border: '2px solid rgba(255, 255, 255, 0.15)',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#ffffff',
            backgroundImage: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          }}>
            SS
          </div>
          <ChevronDown size={14} style={{ color: '#64748b' }} />
        </div>
      </div>

      {/* 1. CALENDAR WIDGET */}
      <div style={{
        backgroundColor: '#1b1c21',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        borderRadius: '18px',
        padding: '1.1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <h4 style={{
            color: '#2563eb',
            fontSize: '0.76rem',
            fontWeight: 800,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            margin: 0,
          }}>
            CALENDAR
          </h4>
          <span style={{ color: '#64748b', fontSize: '0.72rem', cursor: 'pointer' }}>
            View all
          </span>
        </div>

        {/* Month Selector with Interactive Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.4rem', position: 'relative' }}>
          <button
            type="button"
            onClick={() => setIsMonthPickerOpen(!isMonthPickerOpen)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '6px',
              padding: '0.25rem 0.55rem',
              fontSize: '0.72rem',
              color: '#cbd5e1',
              cursor: 'pointer',
            }}
          >
            <CalendarIcon size={12} style={{ color: '#38bdf8' }} />
            <span>{selectedMonth}</span>
            <ChevronDown size={12} style={{ color: '#94a3b8' }} />
          </button>

          {isMonthPickerOpen && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              marginTop: '0.35rem',
              backgroundColor: '#1b1d24',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              borderRadius: '8px',
              padding: '0.3rem',
              zIndex: 40,
              boxShadow: '0 8px 20px rgba(0,0,0,0.7)',
            }}>
              {months.map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setSelectedMonth(m);
                    setIsMonthPickerOpen(false);
                  }}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.3rem 0.6rem',
                    backgroundColor: selectedMonth === m ? 'rgba(37, 99, 235, 0.2)' : 'transparent',
                    color: selectedMonth === m ? '#38bdf8' : '#cbd5e1',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {m}
                </button>
              ))}
            </div>
          )}

          {latestAccepted && latestAccepted.acceptance_details && (
            <span style={{
              fontSize: '0.66rem',
              color: '#34d399',
              backgroundColor: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              padding: '0.15rem 0.45rem',
              borderRadius: '4px',
              fontWeight: 700,
            }}>
              ● Interview: {latestAccepted.company_name}
            </span>
          )}
        </div>

        {dayTooltip && (
          <div style={{
            fontSize: '0.68rem',
            color: '#38bdf8',
            backgroundColor: 'rgba(56, 189, 248, 0.08)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            padding: '0.25rem 0.5rem',
            borderRadius: '6px',
            lineHeight: 1.3,
          }}>
            {dayTooltip}
          </div>
        )}

        {/* Calendar Days Matrix */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          rowGap: '0.45rem',
          textAlign: 'center',
          fontSize: '0.7rem',
        }}>
          {/* Weekday Headers */}
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
            <span key={idx} style={{ color: '#525866', fontWeight: 600, fontSize: '0.68rem' }}>
              {day}
            </span>
          ))}

          {/* Row 1 (Late Jan / Early Feb) */}
          {[27, 28, 29, 30, 31, 1, 2].map((num, i) => (
            <span key={`r1-${i}`} style={{ color: i < 5 ? '#3f4450' : '#8c93a3', padding: '0.2rem 0' }}>
              {num}
            </span>
          ))}

          {/* Row 2 with Active Schedule Span (4, 5, 6, 7) */}
          <span onClick={() => handleDayClick(3)} style={{ color: '#8c93a3', padding: '0.2rem 0', cursor: 'pointer' }}>3</span>
          {/* Span Highlight Container */}
          <span onClick={() => handleDayClick(4)} style={{
            backgroundColor: selectedDay === 4 ? '#38bdf8' : '#2563eb',
            color: '#ffffff',
            fontWeight: 700,
            borderTopLeftRadius: '9999px',
            borderBottomLeftRadius: '9999px',
            padding: '0.2rem 0',
            cursor: 'pointer',
          }}>
            4
          </span>
          <span onClick={() => handleDayClick(5)} style={{
            backgroundColor: selectedDay === 5 ? '#38bdf8' : '#2563eb',
            color: '#ffffff',
            fontWeight: 700,
            padding: '0.2rem 0',
            cursor: 'pointer',
          }}>
            5
          </span>
          <span onClick={() => handleDayClick(6)} style={{
            backgroundColor: selectedDay === 6 ? '#38bdf8' : '#2563eb',
            color: '#ffffff',
            fontWeight: 700,
            padding: '0.2rem 0',
            cursor: 'pointer',
          }}>
            6
          </span>
          <span onClick={() => handleDayClick(7)} style={{
            backgroundColor: selectedDay === 7 ? '#38bdf8' : '#2563eb',
            color: '#ffffff',
            fontWeight: 700,
            borderTopRightRadius: '9999px',
            borderBottomRightRadius: '9999px',
            padding: '0.2rem 0',
            cursor: 'pointer',
          }}>
            7
          </span>
          <span onClick={() => handleDayClick(8)} style={{ color: '#8c93a3', padding: '0.2rem 0', cursor: 'pointer' }}>8</span>
          <span onClick={() => handleDayClick(9)} style={{ color: '#8c93a3', padding: '0.2rem 0', cursor: 'pointer' }}>9</span>

          {/* Row 3 */}
          {[10, 11, 12, 13, 14, 15, 16].map((num) => (
            <span key={num} onClick={() => handleDayClick(num)} style={{ color: selectedDay === num ? '#38bdf8' : '#8c93a3', fontWeight: selectedDay === num ? 700 : 400, padding: '0.2rem 0', cursor: 'pointer' }}>
              {num}
            </span>
          ))}

          {/* Row 4 */}
          {[17, 18, 19, 20, 21, 22, 23].map((num) => (
            <span key={num} onClick={() => handleDayClick(num)} style={{ color: selectedDay === num ? '#38bdf8' : '#8c93a3', fontWeight: selectedDay === num ? 700 : 400, padding: '0.2rem 0', cursor: 'pointer' }}>
              {num}
            </span>
          ))}

          {/* Row 5 */}
          {[24, 25, 26, 27, 28, 29, 30].map((num) => (
            <span key={num} style={{ color: '#8c93a3', padding: '0.2rem 0' }}>
              {num}
            </span>
          ))}
        </div>
      </div>

      {/* 2. NETWORKING WIDGET */}
      <div style={{
        backgroundColor: '#1b1c21',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        borderRadius: '18px',
        padding: '1.1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <h4 style={{
            color: '#2563eb',
            fontSize: '0.76rem',
            fontWeight: 800,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            margin: 0,
          }}>
            NETWORKING
          </h4>
          <span style={{ color: '#64748b', fontSize: '0.72rem', cursor: 'pointer' }}>
            View all
          </span>
        </div>

        {/* Contacts List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[
            { name: 'David Jose', role: 'Product Designer', company: 'Microsoft', avatarBg: '#2563eb' },
            { name: 'Ishitha Xavier', role: 'HR Manager', company: 'Adobe', avatarBg: '#e11d48' },
            { name: 'Hansika Khan', role: 'Lead Design', company: 'NVIDIA', avatarBg: '#10b981' },
          ].map((contact) => (
            <div
              key={contact.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.5rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: contact.avatarBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  flexShrink: 0,
                }}>
                  {contact.name.split(' ').map(n => n[0]).join('')}
                </div>

                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#f1f5f9', lineHeight: 1.2 }}>
                    {contact.name}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
                    {contact.role}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <button
                  onClick={() => toggleConnect(contact.name)}
                  style={{
                    background: connectedUsers[contact.name] ? 'rgba(37, 99, 235, 0.2)' : 'transparent',
                    border: 'none',
                    color: connectedUsers[contact.name] ? '#2563eb' : '#64748b',
                    cursor: 'pointer',
                    padding: '0.25rem',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  title={connectedUsers[contact.name] ? 'Connected' : 'Connect'}
                >
                  {connectedUsers[contact.name] ? <Check size={14} /> : <UserPlus size={14} />}
                </button>

                <button
                  onClick={() => setActiveMessageContact(contact.name)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#2563eb',
                    cursor: 'pointer',
                    padding: '0.25rem',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  title={`Message ${contact.name}`}
                >
                  <MessageSquare size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. MESSAGE WIDGET */}
      <div style={{
        backgroundColor: '#1b1c21',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        borderRadius: '18px',
        padding: '1.1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <h4 style={{
            color: '#2563eb',
            fontSize: '0.76rem',
            fontWeight: 800,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            margin: 0,
          }}>
            MESSAGE
          </h4>
          <span style={{ color: '#64748b', fontSize: '0.72rem', cursor: 'pointer' }}>
            View all
          </span>
        </div>

        {/* Message Threads List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {messageList.map((thread) => (
            <div
              key={thread.name}
              onClick={() => setActiveMessageContact(thread.name)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.5rem',
                cursor: 'pointer',
                padding: '0.2rem',
                borderRadius: '6px',
                transition: 'background 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', overflow: 'hidden' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: thread.avatarBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  flexShrink: 0,
                }}>
                  {thread.name.split(' ').map(n => n[0]).join('')}
                </div>

                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#f1f5f9', lineHeight: 1.2 }}>
                    {thread.name}
                  </div>
                  <div style={{
                    fontSize: '0.68rem',
                    color: '#64748b',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {thread.snippet}
                  </div>
                </div>
              </div>

              <span style={{ fontSize: '0.66rem', color: '#525866', whiteSpace: 'nowrap' }}>
                {thread.time}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Interactive Direct Message Drawer/Popup */}
      {activeMessageContact && (
        <div style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          width: '300px',
          backgroundColor: '#16171b',
          border: '1px solid rgba(37, 99, 235, 0.4)',
          borderRadius: '14px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.8)',
          padding: '1rem',
          zIndex: 50,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f1f5f9' }}>
              Message {activeMessageContact}
            </span>
            <button
              onClick={() => setActiveMessageContact(null)}
              style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
            >
              <X size={14} />
            </button>
          </div>

          {sentConfirm ? (
            <div style={{ color: '#10b981', fontSize: '0.78rem', padding: '0.5rem 0', fontWeight: 600 }}>
              ✓ Message delivered to recruiter!
            </div>
          ) : (
            <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '0.4rem' }}>
              <input
                type="text"
                placeholder="Type your message..."
                value={quickMsgText}
                onChange={(e) => setQuickMsgText(e.target.value)}
                style={{
                  flex: 1,
                  backgroundColor: '#0f172a',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '6px',
                  padding: '0.45rem 0.6rem',
                  fontSize: '0.74rem',
                  color: '#f8fafc',
                  outline: 'none',
                }}
                autoFocus
              />
              <button
                type="submit"
                style={{
                  backgroundColor: '#2563eb',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.45rem 0.75rem',
                  color: '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Send size={12} />
              </button>
            </form>
          )}
        </div>
      )}
    </aside>
  );
};

