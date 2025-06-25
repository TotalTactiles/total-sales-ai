
import React from 'react';
import PersonalizedDashboard from '@/components/PersonalizedDashboard';
import { usePersonalizedProfile } from '@/hooks/usePersonalizedProfile';

const PersonalizedRepDashboard: React.FC = () => {
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
      
      {/* Sales Rep Specific Features */}
      <div className="max-w-7xl mx-auto px-6 pb-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-4">
            Welcome {profile?.assistant_name && `${profile.assistant_name}'s`} Sales Rep!
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold">Today's Calls</h3>
              <p className="text-2xl font-bold text-blue-600">0</p>
              <p className="text-sm text-gray-500">Ready to start dialing?</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold">Pipeline Value</h3>
              <p className="text-2xl font-bold text-green-600">$0</p>
              <p className="text-sm text-gray-500">Add your first lead</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold">AI Suggestions</h3>
              <p className="text-2xl font-bold text-purple-600">Ready</p>
              <p className="text-sm text-gray-500">Ask {profile?.assistant_name} anything</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalizedRepDashboard;
