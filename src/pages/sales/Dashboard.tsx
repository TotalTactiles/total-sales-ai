import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoadingScreen from '@/components/LoadingScreen';
import EnhancedSalesRepDashboard from './EnhancedSalesRepDashboard';
import { useSomeSalesData } from '@/hooks/useSomeSalesData';

export function SalesDashboard() {
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

export default function SalesDashboardDebugger() {
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    console.log('📦 SalesDashboardDebugger mounted');

    try {
      const el = document.createElement('div');
      el.innerText = '✅ Dashboard Loaded';
      el.style.position = 'fixed';
      el.style.top = '16px';
      el.style.right = '16px';
      el.style.background = '#d1e7dd';
      el.style.padding = '8px';
      el.style.zIndex = '9999';
      document.body.appendChild(el);
    } catch (e) {
      console.error('🚨 SalesDashboardDebugger mount error:', e);
      setError(e as Error);
    }
  }, []);

  if (error) {
    return <div className="p-8 text-red-600">❌ SalesDashboard crashed. Check console.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">🧪 Sales Dashboard</h1>
      <p>This confirms dashboard is loading successfully.</p>
    </div>
  );
}
