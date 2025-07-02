import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoadingScreen from '@/components/LoadingScreen';
import EnhancedSalesRepDashboard from './EnhancedSalesRepDashboard';
import { useSomeSalesData } from '@/hooks/useSomeSalesData';

export default function SalesDashboard() {
  const { user, loading } = useAuth();
  const { data, error, isLoading } = useSomeSalesData();

  useEffect(() => {
    console.log('🧩 SalesDashboard mounted');
  }, []);

  if (loading) return <LoadingScreen />;
  if (!user) {
    console.warn('🚫 No user in SalesDashboard');
    return <Navigate to="/auth" replace />;
  }

  if (error) {
    console.error('🔥 Sales data fetch error:', error);
    return <div className="text-red-600">Failed to load sales data</div>;
  }

  if (isLoading || !data) {
    return <LoadingScreen message="Loading sales insights..." />;
  }

  const insights = data?.insights ?? [];
  const name = data?.rep?.name ?? 'Unknown Rep';

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Welcome back, {name}</h1>
      {insights.length === 0 ? (
        <p>No insights yet.</p>
      ) : (
        <ul>
          {insights.map((i) => (
            <li key={i.id}>{i.title}</li>
          ))}
        </ul>
      )}
      {/* Existing dashboard content */}
      <EnhancedSalesRepDashboard />
    </div>
  );
}
