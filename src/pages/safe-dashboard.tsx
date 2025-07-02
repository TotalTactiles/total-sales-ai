import React, { useEffect } from 'react';

export default function SafeDash() {
  useEffect(() => {
    console.log('✅ SAFE DASHBOARD LOADED');
  }, []);

  return (
    <div style={{ padding: '2rem', fontSize: '1.2rem' }}>
      <h1>✅ SAFE DASHBOARD</h1>
      <p>This dashboard has NO AI logic, NO agent code, NO crashing hooks.</p>
      <button
        onClick={() => {
          localStorage.clear();
          window.location.href = '/auth';
        }}
      >
        Logout
      </button>
    </div>
  );
}
