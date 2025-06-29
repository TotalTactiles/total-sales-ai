
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface LoginLoadingStateProps {
  role: string;
  stage: 'authenticating' | 'loading_profile' | 'preparing_dashboard';
}

const LoginLoadingState: React.FC<LoginLoadingStateProps> = ({ role, stage }) => {
  const getStageMessage = () => {
    switch (stage) {
      case 'authenticating':
        return 'Authenticating...';
      case 'loading_profile':
        return 'Loading profile...';
      case 'preparing_dashboard':
        return `Preparing ${role} dashboard...`;
      default:
        return 'Loading...';
    }
  };

  const getRoleColor = () => {
    switch (role) {
      case 'manager':
        return 'text-blue-600';
      case 'sales_rep':
        return 'text-green-600';
      case 'developer':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
      <Card className="bg-white backdrop-blur-sm border-0 shadow-lg rounded-2xl w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7B61FF] mx-auto mb-6"></div>
          <h2 className={`text-xl font-semibold ${getRoleColor()} mb-2`}>
            {role.replace('_', ' ').toUpperCase()} OS
          </h2>
          <p className="text-gray-600 text-sm mb-4">{getStageMessage()}</p>
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-[#7B61FF] rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-[#7B61FF] rounded-full animate-pulse" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-[#7B61FF] rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginLoadingState;
