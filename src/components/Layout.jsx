import React from 'react';
import Navigation from './Navigation';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Navigation />
      <main style={{ 
        marginLeft: '260px', // width of the sidebar
        flex: 1, 
        padding: '32px 48px',
        maxWidth: '1200px',
        margin: '0 auto',
        paddingLeft: '308px' // 260px + 48px padding
      }}>
        <div className="animate-fade-in" style={{ padding: '0 24px', maxWidth: '1400px', margin: '0 auto' }}>
           <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
