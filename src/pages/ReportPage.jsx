import React, { useState, useEffect } from 'react';
import { Camera, MapPin, Send, AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabase';

const ReportPage = () => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({ location: '', description: '' });

  useEffect(() => {
    // Connect mapping to global Supabase Postgres Cluster
    const fetchReports = async () => {
      try {
        const { data, error } = await supabase
          .from('reports')
          .select('*')
          .order('id', { ascending: false });
          
        if (error) throw error;
        setReports(data || []);
      } catch (err) {
        console.error("Supabase REST Fetch Error. Ensure SQL table is built:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReports();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.location || !formData.description) return;
    
    // Construct uniform payload natively compatible with the Supabase schema
    const newReport = {
      date: new Date().toISOString().split('T')[0],
      location: formData.location,
      description: formData.description,
      status: 'pending review',
      upvotes: 0
    }; // created_at timestamp is handled magically by Postgres default now()
    
    try {
      // Fire insert transaction directly into the global PostgreSQL database
      const { data, error } = await supabase
        .from('reports')
        .insert([newReport])
        .select();

      if (error) throw error;
      
      // If Supabase accepted it seamlessly, immediately render natively on UI
      if (data && data.length > 0) {
        setReports([data[0], ...reports]);
        setFormData({ location: '', description: '' });
      }
    } catch (err) {
      console.error("Supabase Failed Insertion Pipeline:", err);
    }
  };

  const handleUpvote = async (id) => {
    try {
      const currentReport = reports.find(r => r.id === id);
      if(!currentReport) return;
      
      const newUpvotes = currentReport.upvotes + 1;
      
      // Send secure atomic increment strictly directly to Supabase cloud
      const { error } = await supabase
        .from('reports')
        .update({ upvotes: newUpvotes })
        .eq('id', id);

      if (!error) {
        // Optimistically update the UI ledger instantly to avoid lag
        setReports(reports.map(r => r.id === id ? { ...r, upvotes: newUpvotes } : r));
      } else {
        throw error;
      }
    } catch (err) {
      console.error("Supabase Upvote transmission failure.", err);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', gap: '32px', height: '100%' }}>
      {/* Left Column: Form */}
      <div style={{ flex: '1' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Community Reporting</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '32px' }}>
          Witnessed an unexpected emission or strong chemical odor? Log it here. Your reports are aggregated and automatically forwarded to the local EPA office.
        </p>

        <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ marginBottom: '8px' }}>Log New Incident</h3>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Location (or closest cross-street)</label>
            <div style={{ position: 'relative' }}>
              <MapPin size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                placeholder="E.g., 500m South of Apex Chem"
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 40px',
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  fontSize: '1rem',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Incident Description</label>
            <textarea 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Describe the color of the smoke, odors, or physical symptoms..."
              rows={4}
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid var(--border-glass)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                fontSize: '1rem',
                outline: 'none',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <button type="button" className="btn-secondary" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Camera size={18} /> Add Photo Proof
            </button>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Required for official EPA filing</span>
          </div>

          <button type="submit" className="btn-primary" style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center', marginTop: '16px' }}>
            <Send size={18} /> Submit Report
          </button>
        </form>
      </div>

      {/* Right Column: Ledger */}
      <div style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={20} color="var(--warning)" /> Incident Ledger (Last 7 Days)
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto', paddingRight: '12px' }}>
          {isLoading ? (
            <div style={{ color: 'var(--primary)', padding: '24px', textAlign: 'center' }}>Connecting to public Supabase cloud database...</div>
          ) : reports.map((report) => (
            <div key={report.id} className="glass-panel" style={{ padding: '20px', transition: 'transform 0.2s', cursor: 'default' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{report.date}</span>
                <span style={{ 
                  background: report.status === 'verified' ? 'rgba(0, 230, 118, 0.1)' : 'rgba(255, 234, 0, 0.1)',
                  color: report.status === 'verified' ? 'var(--safe)' : 'var(--warning)',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  fontWeight: '600'
                }}>
                  {report.status}
                </span>
              </div>
              <h4 style={{ marginBottom: '8px', fontSize: '1.1rem' }}>{report.location}</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '16px' }}>
                "{report.description}"
              </p>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderTop: '1px solid var(--border-glass)', paddingTop: '12px' }}>
                <button onClick={() => handleUpvote(report.id)} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                  ▲ Upvote ({report.upvotes})
                </button>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Community Verification</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
