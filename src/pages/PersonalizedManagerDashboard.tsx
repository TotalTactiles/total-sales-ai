
import React from 'react';
import PersonalizedDashboard from '@/components/PersonalizedDashboard';
import { usePersonalizedProfile } from '@/hooks/usePersonalizedProfile';

const PersonalizedManagerDashboard: React.FC = () => {
  const { profile, loading } = usePersonalizedProfile();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PersonalizedDashboard />
      
      {/* Manager Specific Features */}
      <div className="max-w-7xl mx-auto px-6 pb-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-4">
            Manager Dashboard - {profile?.assistant_name} is here to help!
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold">Team Performance</h3>
              <p className="text-2xl font-bold text-blue-600">100%</p>
              <p className="text-sm text-gray-500">All systems ready</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold">Active Reps</h3>
              <p className="text-2xl font-bold text-green-600">0</p>
              <p className="text-sm text-gray-500">Invite your team</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold">Goals Tracking</h3>
              <p className="text-2xl font-bold text-purple-600">Ready</p>
              <p className="text-sm text-gray-500">Set team targets</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold">AI Insights</h3>
              <p className="text-2xl font-bold text-orange-600">Active</p>
              <p className="text-sm text-gray-500">{profile?.assistant_name} monitoring</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalizedManagerDashboard;
