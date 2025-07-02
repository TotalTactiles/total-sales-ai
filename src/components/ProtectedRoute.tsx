import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoadingScreen from '@/components/LoadingScreen';

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const { session, loading } = useAuth();

  if (loading) return <LoadingScreen message="Validating session..." />;
  if (!session) return <Navigate to="/auth" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;
