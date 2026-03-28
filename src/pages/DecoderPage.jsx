import React, { useState } from 'react';
import { FileSearch, Sparkles, AlertCircle, FileText, ChevronRight } from 'lucide-react';

const DecoderPage = () => {
  const [activeTab, setActiveTab] = useState('raw'); // raw or decoded
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('openai_key') || '');

  const saveKey = (key) => {
    setApiKey(key);
    localStorage.setItem('openai_key', key);
  };

  return (
    <div className="animate-fade-in" style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Open Data Decoder</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '800px' }}>
          Governments and corporations bury emission details in dense, unreadable PDFs. Upload a document and let our AI translate the jargon into plain English.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '24px', flex: 1, minHeight: 0 }}>
        
        {/* Left Panel: Document Select & Raw View */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div className="glass-panel" style={{ padding: '16px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <input 
                type="password" 
                placeholder="Enter OpenAI API Key (sk-...) to enable Live Translation..." 
                value={apiKey}
                onChange={(e) => saveKey(e.target.value)}
                style={{ flex: 1, padding: '8px 12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-glass)', borderRadius: '6px', color: '#fff', outline: 'none' }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <FileText size={24} color="var(--primary)" />
                <div>
                  <h4 style={{ margin: 0 }}>EPA_Annual_Report_Q4_2025.pdf</h4>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Analyzed 45 pages • Uploaded 2 hours ago</div>
                </div>
              </div>
              <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Upload New PDF</button>
            </div>
          </div>

          <div className="glass-panel" style={{ flex: 1, overflowY: 'auto', padding: '24px', background: 'rgba(0,0,0,0.3)', fontFamily: 'monospace', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            <h4 style={{ borderBottom: '1px solid #333', paddingBottom: '8px', marginBottom: '16px', color: 'var(--text-primary)' }}>EXHIBIT 4.2 - EMISSIONS SUMMARY</h4>
            <p>Pursuant to Code 4A § 201.32 concerning atmospheric pollutant dispersion, Facility #9481 (Apex Chem) recorded an annual volumetric flow rate equating to 15.2 ppmv of VOCs across primary thermal oxidizers.</p>
            <p style={{ background: 'rgba(255, 234, 0, 0.1)', color: 'var(--warning)', padding: '2px 4px', borderRadius: '4px' }}>
              Furthermore, episodic flaring events resulted in a cumulative excursion of 2.1 metric tons of sulfur dioxide (SO2) beyond the Title V operating permit threshold during the reporting period Q3-Q4.
            </p>
            <p>Corrective action measures defined under subpart C-14 have been initiated, utilizing a non-catalytic reduction framework to sequester particulate matter ≤ 2.5 micrometers.</p>
            <p>...</p>
          </div>
        </div>

        {/* Divider icon */}
        <div style={{ display: 'flex', alignItems: 'center', color: 'var(--primary)' }}>
          <ChevronRight size={32} />
        </div>

        {/* Right Panel: AI Decoded View */}
        <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', border: '1px solid rgba(0, 229, 255, 0.3)' }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-glass)', background: 'linear-gradient(90deg, rgba(0,229,255,0.1) 0%, transparent 100%)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} color="var(--primary)" />
            <h3 style={{ margin: 0 }}>AI Translation (Plain English)</h3>
          </div>

          <div style={{ padding: '32px', flex: 1, overflowY: 'auto' }}>
            <div style={{ marginBottom: '24px', display: 'flex', gap: '16px' }}>
              <div style={{ padding: '12px', background: 'rgba(255, 51, 102, 0.1)', borderRadius: '12px', flex: '0 0 auto', height: 'fit-content' }}>
                <AlertCircle size={24} color="var(--danger)" />
              </div>
              <div>
                <h4 style={{ color: 'var(--danger)', fontSize: '1.1rem', marginBottom: '4px' }}>Permit Violation Found!</h4>
                <p style={{ color: 'var(--text-primary)', lineHeight: 1.6 }}>
                  According to this document, <strong>Apex Chemical broke the law</strong> between July and December. Their "episodic flaring events" means they burned off waste gas, releasing 2.1 tons of toxic Sulfur Dioxide (SO2) over their legal limit.
                </p>
              </div>
            </div>

            <div style={{ marginBottom: '24px', display: 'flex', gap: '16px' }}>
              <div style={{ padding: '12px', background: 'rgba(0, 229, 255, 0.1)', borderRadius: '12px', flex: '0 0 auto', height: 'fit-content' }}>
                <FileSearch size={24} color="var(--primary)" />
              </div>
              <div>
                <h4 style={{ color: 'var(--primary)', fontSize: '1.1rem', marginBottom: '4px' }}>Inadequate Solutions</h4>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  The document claims they are using a "non-catalytic reduction framework" to fix it. In plain English, they are trying the cheapest possible fix to reduce fine dust (PM2.5) rather than installing industry-standard filters.
                </p>
              </div>
            </div>

            <div style={{ marginTop: '40px' }}>
              <h4 style={{ marginBottom: '12px', color: 'var(--text-secondary)' }}>Toolkit for Journalists</h4>
              <button className="btn-secondary" style={{ width: '100%', marginBottom: '12px', textAlign: 'left' }}>
                📋 Copy Summary to Clipboard
              </button>
              <button className="btn-secondary" style={{ width: '100%', textAlign: 'left' }}>
                🐦 Generate Tweet Exposing Violation
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DecoderPage;
