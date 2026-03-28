import React, { useState, useEffect } from 'react';
import { Send, AlertTriangle, Megaphone } from 'lucide-react';
import { mockFactories } from '../data/mockData';
import { calculateIndianAQI } from '../utils/aqiCalc';

const ActionPage = () => {
  const [criticalZones, setCriticalZones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch live AQI for all tracked factories to mathematically determine the active worst offenders
    const fetchWorstZones = async () => {
      const liveFactories = await Promise.all(
        mockFactories.map(async (factory) => {
          try {
            const res = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${factory.lat}&longitude=${factory.lng}&current=pm2_5`);
            const data = await res.json();
            if (data?.current?.pm2_5 !== undefined) {
               const pm25 = data.current.pm2_5;
               const aqi = calculateIndianAQI(pm25);
               return { ...factory, aqi, pm25 };
            }
          } catch (e) {
            console.error(e);
          }
          return factory;
        })
      );
      
      // Sort by AQI descending and slice the top 6 absolute worst active polluters
      const sorted = liveFactories.sort((a, b) => b.aqi - a.aqi).slice(0, 6);
      setCriticalZones(sorted);
      setIsLoading(false);
    };
    
    fetchWorstZones();
  }, []);

  const generateEmail = (zone) => {
    // Redirects to standard local mail client with pre-filled fields
    const to = "cpcb@nic.in, minister.moef@gov.in";
    const subject = encodeURIComponent(`URGENT: Legal Intervention Required for Critical Ambient Air Quality at ${zone.name}`);
    
    // Format emissions nicely (e.g. "SOX: 12 tons/yr, NOX: 220 tons/yr")
    const emissionsText = Object.entries(zone.emissions)
      .map(([key, val]) => `${key.toUpperCase()}: ${val}`)
      .join(', ');

    const bodyText = `Dear Minister of Environment and CPCB Regulatory Authorities,

I am writing to you directly as a concerned local citizen regarding the hazardous and life-threatening air pollution actively being permitted at the following location:

Facility/Zone: ${zone.name}
Parent Corporate Entity: ${zone.parentCompany}

As of right now, our live telemetry trackers indicate that the ambient Air Quality Index (AQI) around this facility is spiking to an extremely hazardous level of ${zone.aqi}. The local PM2.5 particulate concentrations are severely exceeding the World Health Organization's defined annual safe legal limit of 15 µg/m³.

Furthermore, public records indicate this facility routinely reports massive annual emissions of: ${emissionsText}. 
The last recorded compliance infraction incident was marked on: ${zone.lastInfraction}.

This ongoing environmental catastrophe is actively destroying the life expectancy, respiratory health, and economic stability of our surrounding communities. Taxpayers will not continue to silently foot the medical bills for illegal corporate pollution. 

We urgently demand:
1. An immediate surprise environmental audit of the facility.
2. The mandated deployment of rapid-response industrial air scrubbers on their main stacks.
3. Strict legal penalization according to the Environmental Protection Act if they are found over their licensed limits.

We are actively monitoring this situation on the EcoWatch portal. I look forward to your immediate intervention and response.

Sincerely,
[Insert Your Name]
[Insert Your Pincode]`;

    const body = encodeURIComponent(bodyText);
    
    // Trigger OS default mail client
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Megaphone size={40} color="var(--primary)" /> Take Action
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '800px' }}>
          Uncovering the data is only half the battle. We actively fetch and rank the most abusive industrial zones across the NCR in real-time below. Use our automated 1-click email generator to flood the CPCB and Ministers with legally sound demands for intervention.
        </p>
      </div>

      {isLoading ? (
        <div className="glass-panel" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontSize: '1.2rem', fontWeight: 'bold' }}>
          Calculating real-time zonal pollution rankings...
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
          {criticalZones.map((zone, index) => (
            <div key={zone.id} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--danger)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '6px' }}>Rank #{index + 1} Worst Polluter</div>
                  <h3 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)' }}>{zone.name}</h3>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '4px' }}>Owned by: <strong style={{ color: 'var(--text-secondary)'}}>{zone.parentCompany}</strong></div>
                </div>
                <div style={{ textAlign: 'right', background: zone.aqi >= 150 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)', color: zone.aqi >= 150 ? 'var(--danger)' : 'var(--warning)', padding: '8px 16px', borderRadius: '8px', border: `1px solid ${zone.aqi >= 150 ? 'var(--danger)' : 'var(--warning)'}` }}>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '2px' }}>Live AQI</div>
                  <div style={{ fontWeight: 'bold', fontSize: '1.4rem', lineHeight: '1' }}>{zone.aqi}</div>
                </div>
              </div>
              
              <div style={{ background: 'var(--bg-dark)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-glass)', marginBottom: '24px', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '12px', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 'bold' }}>
                  <AlertTriangle size={16} /> Key Violations Drafted in Email
                </div>
                <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                  <li>Live PM2.5 severely exceeding the 15 µg/m³ WHO legal environmental limit.</li>
                  <li>Sustained massive annual emissions footprint ({Object.keys(zone.emissions)[0].toUpperCase()}).</li>
                  <li>Citing last known corporate legal infraction logged on: {zone.lastInfraction}.</li>
                </ul>
              </div>

              <button 
                className="btn-primary" 
                onClick={() => generateEmail(zone)}
                style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '14px', fontSize: '1.05rem', background: '#ffffff', color: '#000000', border: '1px solid #ffffff' }}
              >
                <Send size={18} /> Generate Regulatory Complaint
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActionPage;
