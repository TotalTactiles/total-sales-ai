
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ManagerNavigation from '@/components/Navigation/ManagerNavigation';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';

const ManagerDashboard = () => (
  <div className="p-6">
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-3xl font-bold">Manager Dashboard</h1>
      <Badge variant="secondary" className="bg-green-100 text-green-800">
        Manager OS
      </Badge>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Team Performance</h3>
        <p className="text-3xl font-bold text-green-600">92%</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Active Reps</h3>
        <p className="text-3xl font-bold text-blue-600">12</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Monthly Revenue</h3>
        <p className="text-3xl font-bold text-purple-600">$2.4M</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Pipeline Value</h3>
        <p className="text-3xl font-bold text-orange-600">$8.7M</p>
      </div>
    </div>
  </div>
);

const ManagerOS: React.FC = () => {
  const { isDemoMode } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <ManagerNavigation />
      {isDemoMode() && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2">
          <div className="flex items-center justify-center">
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              Demo Mode - Manager Experience
            </Badge>
          </div>
        </div>
      )}
      <main className="pt-16">
        <Routes>
          <Route index element={<ManagerDashboard />} />
          <Route path="dashboard" element={<ManagerDashboard />} />
          <Route path="*" element={<Navigate to="/manager/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default ManagerOS;
