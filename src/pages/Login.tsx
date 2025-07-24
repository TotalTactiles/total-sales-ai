
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Login: React.FC = () => {
  const { user } = useAuth();

  // If user is already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/sales/dashboard" replace />;
  }

  // Redirect to the main auth page
  return <Navigate to="/auth" replace />;
};

export default Login;
