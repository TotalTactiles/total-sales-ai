
import React from 'react';
import { Role } from '@/contexts/auth/types';
import Logo from '@/components/Logo';

interface AuthLoadingScreenProps {
  role: Role;
  isDemoMode: boolean;
}

const AuthLoadingScreen: React.FC<AuthLoadingScreenProps> = ({ role, isDemoMode }) => {
  const getRoleDisplayName = (role: Role) => {
    switch (role) {
      case 'manager':
        return 'Manager';
      case 'developer':
        return 'Developer';
      case 'sales_rep':
      default:
        return 'Sales Rep';
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-purple-50">
      <div className="text-center">
        <Logo />
        <div className="mt-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Loading {getRoleDisplayName(role)} Dashboard
          </h2>
          <p className="text-muted-foreground">
            {isDemoMode ? 'Initializing demo environment...' : 'Preparing your workspace...'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLoadingScreen;
