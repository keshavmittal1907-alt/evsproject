import { Link, useLocation } from 'react-router-dom';
import { Home, Map as MapIcon, ShieldAlert, Calculator, FileText, HeartPulse, Activity, Megaphone } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    { name: 'Overview', path: '/', icon: <Home size={20} /> },
    { name: 'Accountability Map', path: '/map', icon: <MapIcon size={20} /> },
    { name: 'Community Reporting', path: '/report', icon: <ShieldAlert size={20} /> },
    { name: 'True Cost Calculator', path: '/calculator', icon: <Calculator size={20} /> },
    { name: 'Personal Impact', path: '/health', icon: <HeartPulse size={20} /> },
    { name: 'Take Action', path: '/action', icon: <Megaphone size={20} /> },
    { name: 'Data Decoder', path: '/decoder', icon: <FileText size={20} /> },
  ];

  return (
    <nav className="glass-panel" style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      height: '100vh', 
      width: '260px',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 100
    }}>
      <div style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ 
          width: '36px', 
          height: '36px', 
          borderRadius: '8px', 
          background: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--bg-dark)',
          fontWeight: 'bold'
        }}>
          <Activity size={24} />
        </div>
        <h2 style={{ fontSize: '1.5rem', margin: 0, letterSpacing: '-0.5px' }}>
          Eco<span className="text-gradient">Watch</span>
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.name}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 16px',
                borderRadius: '10px',
                color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                background: isActive ? 'var(--bg-panel-hover)' : 'transparent',
                textDecoration: 'none',
                fontWeight: isActive ? '600' : '500',
                transition: 'all 0.15s ease',
                border: isActive ? '1px solid var(--border-glass)' : '1px solid transparent'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = 'var(--text-primary)';
                  e.currentTarget.style.background = 'var(--bg-panel-hover)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              {item.icon}
              {item.name}
              {isActive && (
                <div style={{ 
                  marginLeft: 'auto', 
                  width: '6px', 
                  height: '6px', 
                  borderRadius: '50%', 
                  background: 'var(--primary)',
                  boxShadow: '0 0 8px var(--primary)'
                }} />
              )}
            </Link>
          );
        })}
      </div>
      
      <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid var(--border-glass)' }}>
        <button className="btn-secondary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          My Account
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
