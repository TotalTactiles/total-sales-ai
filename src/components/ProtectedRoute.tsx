import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoadingScreen from '@/components/LoadingScreen';

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const { session, loading } = useAuth();

  if (loading) return <LoadingScreen message="Checking session..." />;
  if (!session) {
    console.warn('🧯 No session found. Redirecting to /auth');
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default ProtectedRoute;
