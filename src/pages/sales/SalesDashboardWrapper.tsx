import React from 'react';
import ErrorBoundary from '@/components/ErrorBoundary';
import SalesDashboard from './Dashboard';

export default function SalesDashboardWrapper() {
  return (
    <ErrorBoundary fallback={<div className="p-8 text-center text-red-600">❌ Sales Dashboard Crashed</div>}>
      <SalesDashboard />
    </ErrorBoundary>
  );
}
