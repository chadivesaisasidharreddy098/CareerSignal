'use client';

import React, { useState } from 'react';
import { extractSignalAI } from '../lib/api';
import { SignalItem } from '../types';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  MapPin, 
  Building2, 
  TrendingUp, 
  TrendingDown, 
  Loader2, 
  Layers,
  ArrowRight
} from 'lucide-react';

interface AIExtractorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignalAdded: (signal: SignalItem) => void;
}

const TEMPLATES = [
  {
    title: 'Stripe European Expansion',
    text: 'Stripe announces major expansion of its Dublin European engineering headquarters, creating 1,000 specialized roles across billing infrastructure and fraud AI systems.',
    url: 'https://stripe.com/jobs',
  },
  {
    title: 'Intel Global Restructuring',
    text: 'Intel initiates multi-phase workforce restructuring plan to streamline semiconductor foundry operations, eliminating approximately 15,000 roles across US and European facilities.',
    url: 'https://jobs.intel.com/',
  },
  {
    title: 'Databricks Tokyo AI Lab',
    text: 'Databricks unveils advanced artificial intelligence and lakehouse research laboratory in Tokyo, recruiting 300 machine learning scientists and cloud solutions architects.',
    url: 'https://www.databricks.com/company/careers',
  },
];

export const AIExtractorModal: React.FC<AIExtractorModalProps> = ({
  isOpen,
  onClose,
  onSignalAdded,
}) => {
  const [inputText, setInputText] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [extractedSignal, setExtractedSignal] = useState<SignalItem | null>(null);
  const [analysisText, setAnalysisText] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRunExtraction = async () => {
    if (!inputText.trim()) return;

    setIsProcessing(true);
    setStepIndex(1);
    setExtractedSignal(null);
    setAnalysisText(null);

    // Multi-step animated progress simulation
    setTimeout(() => setStepIndex(2), 600);
    setTimeout(() => setStepIndex(3), 1200);

    try {
      const res = await extractSignalAI(inputText, sourceUrl || undefined);
      setStepIndex(4);
      if (res.success && res.extracted_signal) {
        setExtractedSignal(res.extracted_signal);
        setAnalysisText(res.raw_analysis || null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePublish = () => {
    if (extractedSignal) {
      onSignalAdded(extractedSignal);
      onClose();
      // Reset
      setInputText('');
      setExtractedSignal(null);
      setStepIndex(0);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(5, 8, 16, 0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      zIndex: 120,
      animation: 'fadeIn 0.2s ease-out',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '680px',
        backgroundColor: '#0c1220',
        border: '1px solid rgba(56, 189, 248, 0.3)',
        borderRadius: '16px',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 30px rgba(56, 189, 248, 0.15)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(15, 23, 42, 0.6)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'rgba(56, 189, 248, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent)',
            }}>
              <Sparkles size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>
                AI Signal Extraction & Ingestion
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                Powered by Gemini 3.8 Flash Neural Engine
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

        {/* Body */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Quick Preset Templates */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: '0.4rem' }}>
              Quick Templates (Click to Test):
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.title}
                  onClick={() => {
                    setInputText(tmpl.text);
                    setSourceUrl(tmpl.url);
                  }}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    padding: '0.35rem 0.65rem',
                    color: '#e2e8f0',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {tmpl.title}
                </button>
              ))}
            </div>
          </div>

          {/* Text Input */}
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', display: 'block', marginBottom: '0.4rem' }}>
              Paste Corporate News, WARN Notice, or Hiring Announcement:
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="e.g., Stripe announced an expansion of its engineering team in Dublin, adding 1,000 software and payment specialists over the next 24 months..."
              rows={4}
              style={{
                width: '100%',
                backgroundColor: 'rgba(15, 23, 42, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '8px',
                padding: '0.75rem 1rem',
                color: '#f8fafc',
                fontSize: '0.85rem',
                lineHeight: 1.5,
                outline: 'none',
                resize: 'vertical',
                fontFamily: 'inherit',
              }}
            />
          </div>

          {/* Source URL Optional */}
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: '0.4rem' }}>
              Canonical Source URL (Optional):
            </label>
            <input
              type="text"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder="https://reuters.com/news/article"
              style={{
                width: '100%',
                backgroundColor: 'rgba(15, 23, 42, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '8px',
                padding: '0.6rem 1rem',
                color: '#f8fafc',
                fontSize: '0.82rem',
                outline: 'none',
                fontFamily: 'inherit',
              }}
            />
          </div>

          {/* Execution Progress Steps */}
          {isProcessing && (
            <div style={{
              backgroundColor: 'rgba(56, 189, 248, 0.08)',
              border: '1px solid rgba(56, 189, 248, 0.2)',
              borderRadius: '8px',
              padding: '0.85rem 1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8', fontSize: '0.82rem', fontWeight: 600 }}>
                <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />
                <span>AI Ingestion Pipeline Executing...</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', paddingLeft: '1.4rem' }}>
                {stepIndex === 1 && 'Step 1/3: Extracting company entities and sentiment...'}
                {stepIndex === 2 && 'Step 2/3: Computing headcount delta & classification...'}
                {stepIndex === 3 && 'Step 3/3: Geospatial geo-coding & confidence scoring...'}
              </div>
            </div>
          )}

          {/* Extracted Signal Preview Card */}
          {extractedSignal && (
            <div style={{
              backgroundColor: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '12px',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={18} style={{ color: '#10b981' }} />
                  <span style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.95rem' }}>
                    {extractedSignal.company_name}
                  </span>
                </div>

                <span style={{
                  padding: '0.2rem 0.55rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  backgroundColor: extractedSignal.signal_type === 'layoff' ? 'rgba(244, 63, 94, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                  color: extractedSignal.signal_type === 'layoff' ? '#fb7185' : '#34d399',
                }}>
                  {extractedSignal.impact_headcount !== undefined && extractedSignal.impact_headcount > 0
                    ? `+${extractedSignal.impact_headcount.toLocaleString()} Roles`
                    : `${extractedSignal.impact_headcount?.toLocaleString()} Cuts`}
                </span>
              </div>

              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#e2e8f0' }}>
                {extractedSignal.title}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.75rem', color: '#94a3b8' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <MapPin size={12} style={{ color: 'var(--accent)' }} />
                  {extractedSignal.city}, {extractedSignal.country}
                </span>
                <span>•</span>
                <span style={{ color: '#10b981', fontWeight: 600 }}>
                  {Math.round(extractedSignal.confidence_score * 100)}% Confidence
                </span>
              </div>

              {analysisText && (
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '0.5rem' }}>
                  {analysisText}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(15, 23, 42, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '0.75rem',
        }}>
          <button
            onClick={onClose}
            style={{
              backgroundColor: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '8px',
              padding: '0.65rem 1.1rem',
              color: '#94a3b8',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>

          {!extractedSignal ? (
            <button
              onClick={handleRunExtraction}
              disabled={isProcessing || !inputText.trim()}
              style={{
                backgroundColor: 'var(--accent)',
                border: 'none',
                borderRadius: '8px',
                padding: '0.65rem 1.25rem',
                color: '#090d16',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: isProcessing || !inputText.trim() ? 'not-allowed' : 'pointer',
                opacity: isProcessing || !inputText.trim() ? 0.6 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'all 0.15s ease',
              }}
            >
              {isProcessing ? (
                <>
                  <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                  <span>Extracting...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Extract Signal with AI</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handlePublish}
              style={{
                backgroundColor: '#10b981',
                border: 'none',
                borderRadius: '8px',
                padding: '0.65rem 1.25rem',
                color: '#ffffff',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: '0 0 15px rgba(16, 185, 129, 0.4)',
              }}
            >
              <span>Publish to Live Radar</span>
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
