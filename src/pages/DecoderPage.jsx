import React, { useState } from 'react';
import { FileSearch, Sparkles, AlertCircle, FileText, ChevronRight } from 'lucide-react';

const DecoderPage = () => {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('openai_key') || '');
  const [activeDoc, setActiveDoc] = useState(0);
  const [analysisMode, setAnalysisMode] = useState('legal'); 
  const [isDecoding, setIsDecoding] = useState(false);
  const [hasDecoded, setHasDecoded] = useState(false);

  const saveKey = (key) => {
    setApiKey(key);
    localStorage.setItem('openai_key', key);
  };

  const handleDecode = () => {
    setIsDecoding(true);
    setHasDecoded(false);
    setTimeout(() => {
      setIsDecoding(false);
      setHasDecoded(true);
    }, 1500); // simulate API call
  };

  const sendToJournalist = (doc) => {
    const to = "investigations@ndtv.com, ti.reporter@timesgroup.com";
    const subject = encodeURIComponent(`Whistleblower Alert: Hidden Violations in ${doc.title}`);
    const bodyText = `Dear Investigative Desk,\n\nI used an AI Transparency Decoder to translate a dense government compliance report and uncovered serious infractions.\n\nDocument: ${doc.title}\n\nKey Finding 1: ${doc.decoded.alert}\n${doc.decoded.alertBody}\n\nKey Finding 2: ${doc.decoded.insight}\n${doc.decoded.insightBody}\n\nPlease investigate this immediately. Find the raw text attached.`;
    window.location.href = `mailto:${to}?subject=${subject}&body=${encodeURIComponent(bodyText)}`;
  };

  const mockDocuments = [
    {
      id: 'doc1',
      title: 'NTPC_Dadri_2024_Emissions_Report.pdf',
      meta: 'Analyzed 128 pages • Official CPCB Filing',
      text: `Pursuant to Code 4A § 201.32 concerning atmospheric pollutant dispersion, the NTPC Dadri Plant recorded an annual volumetric flow rate equating to 15.2 ppmv of VOCs across primary thermal oxidizers...\n\nFurthermore, episodic flaring events resulted in a cumulative excursion of 2.1 metric tons of sulfur dioxide (SO2) beyond the Title V operating permit threshold during the reporting period Q3-Q4.\n\nCorrective action measures defined under subpart C-14 have been initiated, utilizing a non-catalytic reduction framework to sequester particulate matter ≤ 2.5 micrometers.`,
      decoded: {
        alert: 'Permit Violation Found!',
        alertBody: 'According to this document, the NTPC Dadri Plant actively broke the law between July and December. Their "episodic flaring events" means they burned off waste gas locally, releasing 2.1 tons of toxic Sulfur Dioxide (SO2) well over their legal limit.',
        insight: 'Inadequate Solutions',
        insightBody: 'The document internally claims they are using a "non-catalytic reduction framework" to fix it. Translated into plain English, they are using the absolute cheapest possible fix to reduce fine dust (PM2.5) rather than installing industry-standard mechanical scrubbers.'
      }
    },
    {
      id: 'doc2',
      title: 'Okhla_WTE_Operating_License_Renewal.pdf',
      meta: 'Analyzed 45 pages • MCD Joint Committee',
      text: `Section 4.1: Solid Waste Incineration Parameters. The facility is authorized to processes 1,950 metric tons of municipal solid waste (MSW) daily. Continuous Emission Monitoring Systems (CEMS) arrays indicated anomalous readings concerning polychlorinated dibenzo-p-dioxins (PCDDs) and polychlorinated dibenzofurans (PCDFs).\n\nSubsequent manual stack sampling confirmed furan concentrations at 0.4 ng TEQ/Nm3, exceeding the statutory ceiling of 0.1 ng TEQ/Nm3 as mandated by the Solid Waste Management Rules.`,
      decoded: {
        alert: 'Critical Toxin Exceedance!',
        alertBody: 'The Okhla Waste-to-Energy incinerator is secretly releasing Dioxins and Furans (highly toxic, cancer-causing chemicals created by burning municipal plastic) at exactly 4x the legal limit (0.4 vs 0.1 legal ceiling).',
        insight: 'Cover-Up Attempt',
        insightBody: 'The document proves the plant operators knew their continuous monitoring systems were showing "anomalous readings" for highly toxic chemicals, but they purposefully continued burning 1,950 tons of garbage daily anyway until forced into manual stack sampling.'
      }
    }
  ];

  const currentDoc = mockDocuments[activeDoc];

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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-glass)', paddingTop: '16px' }}>
              <select 
                value={activeDoc} 
                onChange={(e) => { setActiveDoc(Number(e.target.value)); setHasDecoded(false); }}
                style={{ flex: 1, padding: '10px 14px', background: 'var(--bg-panel-hover)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none', fontSize: '0.95rem', cursor: 'pointer' }}
              >
                {mockDocuments.map((doc, index) => (
                  <option key={doc.id} value={index}>{doc.title}</option>
                ))}
              </select>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderTop: '1px solid var(--border-glass)', paddingTop: '16px' }}>
               <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 'bold', width: '120px' }}>Interrogation Mode:</span>
               <select 
                 value={analysisMode}
                 onChange={(e) => setAnalysisMode(e.target.value)}
                 style={{ padding: '6px 12px', background: 'var(--bg-dark)', border: '1px solid var(--border-glass)', borderRadius: '6px', color: 'var(--primary)', outline: 'none', fontSize: '0.85rem', fontWeight: 'bold' }}
               >
                 <option value="legal">Scan for Legal Violations</option>
                 <option value="health">Extract Public Health Risks</option>
                 <option value="simple">Explain Like I'm 10 Years Old</option>
               </select>
               <button onClick={handleDecode} className="btn-primary" style={{ marginLeft: 'auto', padding: '6px 16px', fontSize: '0.9rem', display: 'flex', gap: '6px', alignItems: 'center' }}>
                 <Sparkles size={16} /> Decode
               </button>
            </div>
          </div>

          <div className="glass-panel" style={{ flex: 1, overflowY: 'auto', padding: '24px', background: 'var(--bg-panel-hover)', fontFamily: 'monospace', fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            <h4 style={{ borderBottom: '1px solid var(--border-glass)', paddingBottom: '12px', marginBottom: '16px', color: 'var(--text-primary)', display: 'flex', justifyContent: 'space-between' }}>
              RAW PDF EXTRACTION
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 'normal' }}>{currentDoc.meta}</span>
            </h4>
            {currentDoc.text.split('\n').map((paragraph, idx) => (
              <p key={idx} style={{ marginBottom: '16px' }}>{paragraph}</p>
            ))}
          </div>
        </div>

        {/* Divider icon */}
        <div style={{ display: 'flex', alignItems: 'center', color: 'var(--primary)' }}>
          <ChevronRight size={32} />
        </div>

        {/* Right Panel: AI Decoded View */}
        <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', border: `1px solid ${hasDecoded ? 'var(--primary)' : 'var(--border-glass)'}` }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-glass)', background: 'var(--bg-panel-hover)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} color="var(--primary)" />
            <h3 style={{ margin: 0 }}>AI Interrogation Matrix</h3>
          </div>

          <div style={{ padding: '32px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            {isDecoding ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                <Sparkles size={48} style={{ opacity: 0.5, marginBottom: '16px' }} />
                <h3 style={{ margin: 0 }}>Scanning 10,400 words...</h3>
                <p style={{ color: 'var(--text-muted)' }}>Executing {analysisMode.toUpperCase()} prompt matrix.</p>
              </div>
            ) : !hasDecoded ? (
               <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', textAlign: 'center' }}>
                 <FileSearch size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
                 <p style={{ maxWidth: '300px' }}>Select an interrogation mode and press <strong>Decode</strong> to sic the AI on this regulatory document.</p>
               </div>
            ) : (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ marginBottom: '24px', display: 'flex', gap: '16px' }}>
                  <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', flex: '0 0 auto', height: 'fit-content' }}>
                    <AlertCircle size={24} color="var(--danger)" />
                  </div>
                  <div>
                    <h4 style={{ color: 'var(--danger)', fontSize: '1.2rem', marginBottom: '8px' }}>{currentDoc.decoded.alert}</h4>
                    <p style={{ color: 'var(--text-primary)', lineHeight: 1.6, fontSize: '1.05rem' }}>
                      {currentDoc.decoded.alertBody}
                    </p>
                  </div>
                </div>

                <div style={{ marginBottom: '32px', display: 'flex', gap: '16px' }}>
                  <div style={{ padding: '12px', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '12px', flex: '0 0 auto', height: 'fit-content' }}>
                    <FileSearch size={24} color="var(--primary)" />
                  </div>
                  <div>
                    <h4 style={{ color: 'var(--primary)', fontSize: '1.2rem', marginBottom: '8px' }}>{currentDoc.decoded.insight}</h4>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '1.05rem' }}>
                      {currentDoc.decoded.insightBody}
                    </p>
                  </div>
                </div>

                <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-glass)', paddingTop: '24px' }}>
                  <h4 style={{ marginBottom: '16px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.85rem' }}>Whistleblower Toolkit</h4>
                  <button 
                    onClick={() => sendToJournalist(currentDoc)}
                    className="btn-primary" 
                    style={{ width: '100%', padding: '14px', fontSize: '1rem', background: '#ffffff', color: '#000000', border: '1px solid #ffffff' }}
                  >
                    🚨 Send Findings to Regional Journalists
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DecoderPage;
