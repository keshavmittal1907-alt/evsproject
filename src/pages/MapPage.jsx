import React from 'react';
import { MapContainer, TileLayer, Circle, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { mockFactories } from '../data/mockData';
import { AlertCircle, FileWarning, Factory, Activity, ShieldCheck } from 'lucide-react';
import { calculateIndianAQI } from '../utils/aqiCalc';
import { useState, useEffect, useMemo } from 'react';

const MapPage = () => {
  // Center map on Delhi where mock factories are
  const position = [28.6139, 77.2090];
  const [factories, setFactories] = useState(mockFactories);
  const [hoveredFactory, setHoveredFactory] = useState(null);

  useEffect(() => {
    const fetchLiveMapAqi = async () => {
      const liveFactories = await Promise.all(
        mockFactories.map(async (factory) => {
          try {
            const res = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${factory.lat}&longitude=${factory.lng}&current=pm2_5`);
            const data = await res.json();
            if (data?.current?.pm2_5 !== undefined) {
              const pm25 = data.current.pm2_5;
              const aqi = calculateIndianAQI(pm25);
              // Dynamically color code based on Indian NAQI thresholds
              let status = 'compliant';
              if (aqi > 200) status = 'critical'; // Poor or Severe
              else if (aqi > 100) status = 'warning'; // Moderate
              
              return { ...factory, aqi, pm25, status };
            }
          } catch (e) {
            console.error("Failed fetching factory live data", e);
          }
          return factory; // fallback to mock data
        })
      );
      setFactories(liveFactories);
    };
    
    fetchLiveMapAqi();
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'critical': return 'var(--danger)';
      case 'warning': return 'var(--warning)';
      case 'compliant': return 'var(--safe)';
      default: return 'var(--text-muted)';
    }
  };

  const memoizedMap = useMemo(() => {
    return (
      <MapContainer center={position} zoom={10} style={{ height: '600px', width: '100%', background: '#0a0b0e', position: 'absolute', top: 0, left: 0 }}>
        <TileLayer
          attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />
        
        {factories.map((factory) => (
          <Circle
            key={factory.id}
            center={[factory.lat, factory.lng]}
            pathOptions={{ 
              color: getStatusColor(factory.status), 
              fillColor: getStatusColor(factory.status),
              fillOpacity: 0.4
            }}
            radius={factory.status === 'compliant' ? 1000 : 3000}
            eventHandlers={{
              mouseover: (e) => {
                e.target.openPopup();
                setHoveredFactory(factory);
              },
              mouseout: (e) => {
                e.target.closePopup();
                // We no longer clear the state here so the data persists in the panel for the user to read
              }
            }}
          >
            <Tooltip permanent direction="center" className="aqi-tooltip">
              <div style={{ 
                fontWeight: 'bold', 
                fontSize: '1.2rem', 
                color: '#fff',
                textShadow: '0 2px 4px rgba(0,0,0,0.8)'
              }}>
                {factory.aqi}
              </div>
            </Tooltip>
            <Popup className="glass-popup">
              <div style={{ padding: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <Factory size={20} color={getStatusColor(factory.status)} />
                  <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#333' }}>{factory.name}</h3>
                </div>
                
                <div style={{ marginBottom: '8px', fontSize: '0.9rem', color: '#666', display: 'flex', justifyContent: 'space-between' }}>
                  <span><strong>Parent Company:</strong> {factory.parentCompany}</span>
                  <strong style={{ color: getStatusColor(factory.status) }}>AQI: {factory.aqi}</strong>
                </div>
                
                <div style={{ marginBottom: '8px' }}>
                  <strong style={{ fontSize: '0.9rem', color: '#333' }}>Reported Emissions:</strong>
                  <ul style={{ paddingLeft: '20px', margin: '4px 0', fontSize: '0.9rem', color: '#555' }}>
                    {Object.entries(factory.emissions).map(([key, val]) => (
                      <li key={key}><span style={{ textTransform: 'uppercase'}}>{key}</span>: {val}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ 
                  marginTop: '12px', 
                  padding: '8px', 
                  background: factory.status === 'critical' ? '#ffebee' : '#f5f5f5', 
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.85rem'
                }}>
                  <FileWarning size={16} color={factory.status === 'critical' ? '#c62828' : '#757575'} />
                  <span style={{ color: factory.status === 'critical' ? '#c62828' : '#757575' }}>
                    Last Infraction: {factory.lastInfraction}
                  </span>
                </div>
              </div>
            </Popup>
          </Circle>
        ))}
      </MapContainer>
    );
  }, [factories]); // Re-render ONLY when the factories array (with live AQI injections) updates.

  return (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Industrial Accountability Map</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '800px' }}>
          Real-time tracking of major industrial facilities and their emission levels. Red zones indicate facilities currently operating above legal emission thresholds or with recent infractions.
        </p>
      </div>

      <div className="glass-panel" style={{ 
        flex: 1, 
        minHeight: '600px', 
        padding: '8px', 
        position: 'relative',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Map Container - Memoized to prevent severe render lag on mouse hover */}
        <div style={{ flex: 1, borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
          {memoizedMap}
        </div>

        {/* Legend overlay */}
        <div className="glass-panel" style={{
          position: 'absolute',
          bottom: '24px',
          right: '24px',
          zIndex: 1000,
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <h4 style={{ margin: 0, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Facility Status</h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--danger)' }} />
            <span style={{ fontSize: '0.9rem' }}>Critical Violation</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--warning)' }} />
            <span style={{ fontSize: '0.9rem' }}>Warning / Audit</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--safe)' }} />
            <span style={{ fontSize: '0.9rem' }}>Compliant</span>
          </div>
        </div>
      </div>
      
      {/* Factory Details Panel (Below Map) */}
      <div className="glass-panel" style={{ marginTop: '24px', padding: '24px', minHeight: '180px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {hoveredFactory ? (
          <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Factory size={36} color={getStatusColor(hoveredFactory.status)} />
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.6rem' }}>{hoveredFactory.name}</h2>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginTop: '4px' }}>
                    Owned By: <strong style={{color: '#fff'}}>{hoveredFactory.parentCompany}</strong>
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right', display: 'flex', gap: '24px', alignItems: 'center' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>Global Safe AQI Limits</div>
                  <div style={{ fontSize: '1.4rem', color: 'var(--safe)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                    <ShieldCheck size={18} /> &lt; 50
                  </div>
                </div>
                <div style={{ paddingLeft: '24px', borderLeft: '1px solid rgba(255,255,255,0.1)', textAlign: 'right' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>Live Facility AQI</div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: getStatusColor(hoveredFactory.status), lineHeight: 1 }}>{hoveredFactory.aqi}</div>
                </div>
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '12px' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <strong style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.85rem' }}>
                  <Activity size={16} /> Real-Time PM2.5 vs WHO Safe Guidelines
                </strong>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px', background: 'var(--bg-dark)', padding: '16px 24px', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
                   <div style={{ flex: 1 }}>
                     <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>WHO Safe Limit</span>
                     <span style={{ fontSize: '1.4rem', color: 'var(--safe)', fontWeight: 'bold' }}>15 µg/m³</span>
                   </div>
                   <div style={{ width: '1px', height: '40px', background: 'var(--border-glass)' }} />
                   <div style={{ flex: 1 }}>
                     <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Live Local Concentration</span>
                     <span style={{ fontSize: '1.8rem', color: getStatusColor(hoveredFactory.status), fontWeight: 'bold' }}>{hoveredFactory.pm25} µg/m³</span>
                   </div>
                   {(hoveredFactory.pm25 !== '--') && (
                     <div style={{ background: hoveredFactory.pm25 <= 15 ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 51, 102, 0.2)', color: hoveredFactory.pm25 <= 15 ? 'var(--safe)' : 'var(--danger)', padding: '8px 16px', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', border: `1px solid ${hoveredFactory.pm25 <= 15 ? 'var(--safe)' : 'var(--danger)'}` }}>
                       {hoveredFactory.pm25 > 15 ? `${(hoveredFactory.pm25 / 15).toFixed(1)}x Legal Limit` : 'Safe Levels'}
                     </div>
                   )}
                </div>
              </div>

              <div>
                <strong style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.85rem' }}>
                  <AlertCircle size={16} /> Annual Emission Licenses
                </strong>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                  {Object.entries(hoveredFactory.emissions).map(([key, val]) => (
                    <div key={key} style={{ background: 'var(--bg-dark)', padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                      <span style={{ textTransform: 'uppercase', color: 'var(--primary)', fontWeight: 'bold', marginRight: '8px' }}>{key}</span> 
                      {val}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <strong style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.85rem' }}>
                  <FileWarning size={16} /> Legal & Compliance
                </strong>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: hoveredFactory.status === 'critical' ? 'var(--danger)' : 'var(--warning)', background: 'var(--bg-dark)', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                  <FileWarning size={20} />
                  <span style={{ fontSize: '1.05rem' }}>Last Incident Logged: <strong style={{ color: '#fff'}}>{hoveredFactory.lastInfraction}</strong></span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-fade-in" style={{ color: 'var(--text-muted)', textAlign: 'center', fontSize: '1.1rem', padding: '20px 0' }}>
            <AlertCircle size={32} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
            Hover over an industrial facility on the map to unlock its detailed compliance and emission records.
          </div>
        )}
      </div>

      {/* Required for Leaflet dark mode styling overrides */}
      <style>{`
        .leaflet-popup-content-wrapper, .leaflet-popup-tip {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          color: #333;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        .leaflet-container {
          background: #0a0b0e !important;
          font-family: var(--font-sans);
        }
        .aqi-tooltip {
          background: transparent;
          border: none;
          box-shadow: none;
        }
        .aqi-tooltip::before {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default MapPage;
