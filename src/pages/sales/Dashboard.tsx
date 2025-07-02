import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoadingScreen from '@/components/LoadingScreen';
import EnhancedSalesRepDashboard from './EnhancedSalesRepDashboard';

export default function SalesDashboardPage() {
  const { session, loading } = useAuth();

  useEffect(() => {
    console.log('SESSION:', session);
  }, [session]);

  if (loading) return <LoadingScreen />;
  if (!session) return <Navigate to="/auth" replace />;

  return <EnhancedSalesRepDashboard />;
}
