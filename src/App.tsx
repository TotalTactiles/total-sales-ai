
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/auth/AuthProvider';
import Auth from './pages/auth';
import SalesDash from './pages/sales-dashboard';

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
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/sales/dashboard" element={<SalesDash />} />
          <Route path="/sales-dashboard" element={<SalesDash />} />
          <Route path="/*" element={<Navigate to="/sales/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
