import React, { useState } from 'react';
import { HeartPulse, Stethoscope, Cigarette, Hourglass } from 'lucide-react';

const HealthPage = () => {
  const [location, setLocation] = useState('Delhi');
  const [isCalculating, setIsCalculating] = useState(false);
  const [metrics, setMetrics] = useState({ pm25: '--', label: 'Delhi' });

  const handleCalculate = async () => {
    setIsCalculating(true);
    try {
      const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`);
      const geoData = await geoRes.json();
      if (!geoData || geoData.length === 0) throw new Error("Location not found");
      
      const latitude = parseFloat(geoData[0].lat);
      const longitude = parseFloat(geoData[0].lon);
      const name = geoData[0].display_name.split(',')[0]; 

      const aqiRes = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=pm2_5`);
      const aqiData = await aqiRes.json();
      
      if (aqiData?.current?.pm2_5) {
        setMetrics({ pm25: aqiData.current.pm2_5, label: name });
      }
    } catch (err) {
      console.error(err);
      alert("Failed to find data. Please enter a valid city name or pincode (e.g., Delhi, 110020).");
    }
    setIsCalculating(false);
  };

  return (
    <div className="animate-fade-in" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <HeartPulse size={40} color="var(--primary)" /> Personal Health Impact
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '800px' }}>
          Translate raw air quality data into tangible, physiological health impacts. Find out exactly how the air in your city compares to smoking and how it affects your life expectancy.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '24px', flex: 1, flexWrap: 'wrap' }}>
        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '24px', minWidth: '400px' }}>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <label style={{ display: 'block', marginBottom: '12px', color: 'var(--text-secondary)' }}>Enter Your Pincode or City</label>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <input 
                type="text" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={{ 
                  flex: 1, 
                  padding: '12px 16px', 
                  background: 'rgba(0,0,0,0.2)', 
                  border: '1px solid var(--border-glass)', 
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '1rem',
                  outline: 'none',
                  minWidth: '200px'
                }} 
              />
              <button 
                className="btn-primary" 
                onClick={handleCalculate}
                style={{ padding: '0 24px', display: 'flex', alignItems: 'center', gap: '8px' }}
                disabled={isCalculating}
              >
                <Stethoscope size={18} /> {isCalculating ? 'Analyzing...' : 'Analyze Health Risk'}
              </button>
            </div>
            {metrics.pm25 !== '--' && (
              <div style={{ marginTop: '16px', color: 'var(--primary)', fontWeight: '500' }}>
                Live PM2.5 in {metrics.label}: {metrics.pm25} µg/m³
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            <div className="glass-panel" style={{ padding: '24px', background: 'rgba(255, 234, 0, 0.05)', border: '1px solid rgba(255, 234, 0, 0.2)' }}>
              <div style={{ color: 'var(--warning)', fontSize: '1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
                <Cigarette size={20} /> Passive Smoking
              </div>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#94a3b8' }}>
                {metrics.pm25 !== '--' ? (metrics.pm25 / 22).toFixed(1) : '--'}
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '8px' }}>
                Equivalent cigarettes smoked per day from ambient air pollution.
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '24px', background: 'rgba(255, 51, 102, 0.05)', border: '1px solid rgba(255, 51, 102, 0.2)' }}>
              <div style={{ color: 'var(--danger)', fontSize: '1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
                <Hourglass size={20} /> Life Expectancy
              </div>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--danger)' }}>
                {metrics.pm25 !== '--' ? '-' + ((metrics.pm25 / 10) * 0.98).toFixed(1) : '--'}
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '8px' }}>
                Years lost to chronic PM2.5 exposure over a lifetime.
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '24px', gridColumn: '1 / -1' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '16px', fontWeight: 'bold' }}>
                Long-Term Health Risks Associated with {metrics.pm25 !== '--' ? ((metrics.pm25 > 50) ? 'Hazardous' : 'Elevated') : 'Current'} PM2.5
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                {['COPD', 'Stroke', 'Ischemic Heart Disease', 'Lung Cancer', 'Respiratory Infections', 'Type 2 Diabetes', 'Neonatal Disorders'].map(condition => (
                  <span key={condition} style={{ 
                    background: 'var(--bg-dark)', 
                    padding: '8px 16px', 
                    borderRadius: '24px', 
                    fontSize: '0.95rem', 
                    border: '1px solid rgba(255, 51, 102, 0.3)', 
                    color: 'var(--danger)' 
                  }}>
                    {condition}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Info Col */}
        <div className="glass-panel" style={{ width: '100%', maxWidth: '380px', padding: '24px', background: 'var(--bg-panel-hover)' }}>
          <h3 style={{ color: 'var(--primary)', marginBottom: '16px', fontSize: '1.2rem' }}>How The Science Works</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.6' }}>
            <strong style={{ color: '#fff' }}>Cigarette Rule of Thumb:</strong> Research by Berkeley Earth equates 1 cigarette to an air pollution level of roughly 22 µg/m³ PM2.5. Breathing heavily polluted air all day deposits the same particulate matter in your lungs as smoking directly.
          </p>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.6' }}>
            <strong style={{ color: '#fff' }}>Life Expectancy:</strong> The Air Quality Life Index (AQLI) demonstrates that for every 10 µg/m³ of long-term PM2.5 exposure, life expectancy decreases by roughly 0.98 years dynamically worldwide.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HealthPage;
