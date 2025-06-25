
import React from 'react';
import TestUserCreator from '@/components/TestUserCreator';

const TestUsersPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Test Environment</h1>
          <p className="text-gray-600">Create and manage test users for onboarding flows</p>
        </div>
        
        <div className="flex justify-center">
          <TestUserCreator />
        </div>
      </div>
    </div>
  );
};

export default TestUsersPage;
