import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/auth';
import SafeDash from './pages/safe-dashboard';

export default function App() {
  useEffect(() => {
    const demoSession = localStorage.getItem('demo-auth');
    if (!demoSession && typeof window !== 'undefined') {
      console.log('⚠️ No session found. Redirecting to /auth');
      if (window.location.pathname !== '/auth') {
        window.location.href = '/auth';
      }
    } else {
      console.log('🔁 Demo session exists. Proceeding...');
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/safe-dashboard" element={<SafeDash />} />
        <Route path="/*" element={<Navigate to="/safe-dashboard" replace />} />
      </Routes>
    </Router>
  );
}
