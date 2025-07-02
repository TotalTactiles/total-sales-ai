import React, { useEffect } from 'react';

export default function Auth() {
  useEffect(() => {
    console.log('🔐 Auth page loaded');
  }, []);

  return (
    <div style={{ padding: '2rem', fontSize: '1.2rem' }}>
      <h1>🔑 AUTH PAGE</h1>
      <button
        onClick={() => {
          localStorage.setItem('demo-auth', 'true');
          window.location.href = '/safe-dashboard';
        }}
      >
        Simulate Login
      </button>
    </div>
  );
}
