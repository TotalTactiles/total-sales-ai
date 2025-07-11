
import React from 'react';
import ManagerNavigation from '@/components/Navigation/ManagerNavigation';
import TeamAI from '@/components/AI/TeamAI';

const ManagerTeam = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <ManagerNavigation />
      
      <div className="ml-64 p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
          <p className="text-gray-600">Team performance and reward optimization</p>
        </div>
        
        <TeamAI />
      </div>
    </div>
  );
};

export default ManagerTeam;
