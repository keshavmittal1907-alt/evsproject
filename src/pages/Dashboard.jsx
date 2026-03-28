import React, { useState, useEffect } from 'react';
import { Activity, Wind, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { calculateIndianAQI } from '../utils/aqiCalc';

const regions = [
  { name: 'Anand Vihar', lat: 28.6469, lng: 77.3160 },
  { name: 'Punjabi Bagh', lat: 28.6619, lng: 77.1241 },
  { name: 'ITO', lat: 28.6284, lng: 77.2407 },
  { name: 'RK Puram', lat: 28.5659, lng: 77.1711 },
  { name: 'Okhla', lat: 28.5273, lng: 77.2800 },
  { name: 'Dwarka', lat: 28.5921, lng: 77.0460 },
  { name: 'Rohini', lat: 28.7041, lng: 77.1025 },
  { name: 'Patparganj', lat: 28.6293, lng: 77.3005 },
  { name: 'Bawana', lat: 28.8020, lng: 77.0600 },
  { name: 'Narela', lat: 28.8427, lng: 77.0913 },
  { name: 'Jahangirpuri', lat: 28.7287, lng: 77.1706 },
  { name: 'Wazirpur', lat: 28.6946, lng: 77.1643 },
  { name: 'Mayapuri', lat: 28.6277, lng: 77.1275 },
  { name: 'Mundka', lat: 28.6811, lng: 77.0289 },
  { name: 'Shadipur', lat: 28.6517, lng: 77.1517 },
  { name: 'Ashok Vihar', lat: 28.6917, lng: 77.1750 },
  { name: 'Najafgarh', lat: 28.6090, lng: 76.9855 },
  { name: 'Pusa', lat: 28.6369, lng: 77.1601 },
  { name: 'Connaught Place', lat: 28.6304, lng: 77.2177 },
  { name: 'Vasant Kunj', lat: 28.5292, lng: 77.1539 },
  { name: 'Karol Bagh', lat: 28.6538, lng: 77.1916 },
  { name: 'Lajpat Nagar', lat: 28.5630, lng: 77.2405 },
  { name: 'Hauz Khas', lat: 28.5494, lng: 77.2001 },
  { name: 'Saket', lat: 28.5245, lng: 77.2066 },
  { name: 'Shahdara', lat: 28.6853, lng: 77.2896 },
  { name: 'Janakpuri', lat: 28.6219, lng: 77.0878 },
  { name: 'Rajouri Garden', lat: 28.6433, lng: 77.1215 },
  { name: 'Pitampura', lat: 28.6989, lng: 77.1350 },
  { name: 'Vasundhara Enclave', lat: 28.6653, lng: 77.3308 },
  { name: 'Dilshad', lat: 28.6186, lng: 77.3195 }
];

const RegionalAqiWidget = () => {
  const [regionalData, setRegionalData] = useState(regions.map(r => ({ ...r, aqi: '...' })));
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchRegions = async () => {
      const results = await Promise.all(
        regions.map(async (r) => {
          try {
            const res = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${r.lat}&longitude=${r.lng}&current=pm2_5`);
            const json = await res.json();
            return { ...r, aqi: calculateIndianAQI(json?.current?.pm2_5) || '--' };
          } catch (e) {
            return { ...r, aqi: '--' };
          }
        })
      );
      setRegionalData(results);
    };
    fetchRegions();
  }, []);

  const filteredRegions = regionalData.filter(region => 
    region.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in" style={{ marginTop: '48px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Wind size={20} color="var(--primary)" /> Live Regional AQI (Delhi NCR)
        </h3>
        <input 
          type="text"
          placeholder="Search region (e.g. Rohini)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '10px 16px',
            background: 'rgba(0,0,0,0.2)',
            border: '1px solid var(--border-glass)',
            borderRadius: '8px',
            color: 'var(--text-primary)',
            outline: 'none',
            minWidth: '250px',
            fontSize: '0.95rem'
          }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
        {filteredRegions.map((region) => {
          const aqiColor = region.aqi === '...' || region.aqi === '--' ? 'var(--text-muted)' : region.aqi > 200 ? 'var(--danger)' : region.aqi > 100 ? 'var(--warning)' : 'var(--safe)';
          return (
            <div key={region.name} className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '4px', borderTop: `3px solid ${aqiColor}` }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.90rem', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{region.name}</span>
              <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: aqiColor }}>{region.aqi}</span>
            </div>
          );
        })}
        {filteredRegions.length === 0 && (
          <div style={{ color: 'var(--text-muted)', paddingTop: '16px' }}>
            No regions found matching "{searchTerm}".
          </div>
        )}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [aqiData, setAqiData] = useState({ aqi: '--', loading: true });

  useEffect(() => {
    fetch('https://air-quality-api.open-meteo.com/v1/air-quality?latitude=28.6139&longitude=77.2090&current=pm2_5')
      .then(res => res.json())
      .then(data => {
        if (data && data.current && data.current.pm2_5 !== undefined) {
          setAqiData({ aqi: calculateIndianAQI(data.current.pm2_5), loading: false });
        }
      })
      .catch(err => {
        console.error("Failed to fetch live AQI:", err);
        setAqiData({ aqi: 285, loading: false }); // Fallback on failure
      });
  }, []);

  const aqiColor = aqiData.loading ? 'var(--text-muted)' : (aqiData.aqi > 200 ? 'var(--danger)' : aqiData.aqi > 100 ? 'var(--warning)' : 'var(--safe)');

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '2.8rem', marginBottom: '8px' }}>Welcome back, <span className="text-gradient">Concerned Citizen.</span></h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Your local air quality dashboard and action center.</p>
        </div>
        
        <div className="glass-panel" style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px', borderLeft: `4px solid ${aqiColor}` }}>
          <div>
            <h4 style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem', textTransform: 'uppercase' }}>Current AQI (Delhi)</h4>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', color: aqiColor, lineHeight: '1' }}>
              {aqiData.loading ? '...' : aqiData.aqi}
            </div>
          </div>
          <Wind size={40} color={aqiColor} style={{ opacity: 0.5 }} />
        </div>
      </div>

      <h3 style={{ marginBottom: '24px' }}>Quick Actions</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        
        <Link to="/map" style={{ textDecoration: 'none' }}>
          <div className="glass-panel" style={{ padding: '24px', height: '100%', transition: 'all 0.3s' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(0, 229, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', color: 'var(--primary)' }}>
              <Activity size={24} />
            </div>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>Accountability Map</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Track real-time emissions from local factories and see who is violating guidelines.</p>
          </div>
        </Link>
        
        <Link to="/report" style={{ textDecoration: 'none' }}>
          <div className="glass-panel" style={{ padding: '24px', height: '100%', transition: 'all 0.3s' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255, 51, 102, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', color: 'var(--danger)' }}>
              <AlertCircle size={24} />
            </div>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>Report Incident</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>See illegal dumping or thick smoke? Submit a photo and we'll auto-file with the EPA.</p>
          </div>
        </Link>
      </div>
      
      <RegionalAqiWidget />
    </div>
  );
};

export default Dashboard;
