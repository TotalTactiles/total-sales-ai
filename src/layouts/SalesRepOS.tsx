
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SalesNavigation from '@/components/Navigation/SalesNavigation';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';

// Import your sales pages here when they exist
const SalesRepDashboard = () => (
  <div className="p-6">
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-3xl font-bold">Sales Dashboard</h1>
      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
        Sales Rep OS
      </Badge>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Today's Calls</h3>
        <p className="text-3xl font-bold text-blue-600">23</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Leads Generated</h3>
        <p className="text-3xl font-bold text-green-600">8</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Conversion Rate</h3>
        <p className="text-3xl font-bold text-purple-600">34.8%</p>
      </div>
    </div>
  </div>
);

const SalesRepOS: React.FC = () => {
  const { isDemoMode } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <SalesNavigation />
      {isDemoMode() && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2">
          <div className="flex items-center justify-center">
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              Demo Mode - Sales Rep Experience
            </Badge>
          </div>
        </div>
      )}
      <main className="pt-16">
        <Routes>
          <Route index element={<SalesRepDashboard />} />
          <Route path="dashboard" element={<SalesRepDashboard />} />
          <Route path="*" element={<Navigate to="/sales/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default SalesRepOS;
