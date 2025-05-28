
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from '@/pages/auth/AuthPage';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/80">
      <Routes>
        <Route path="/" element={<Navigate to="/auth" replace />} />
        <Route path="/*" element={<AuthPage />} />
      </Routes>
    </div>
  );
};

export default AuthLayout;
