
import React from 'react';
import { Role } from '@/contexts/auth/types';
import Logo from '@/components/Logo';

interface AuthLoadingScreenProps {
  role: Role;
  isDemoMode: boolean;
}

const AuthLoadingScreen: React.FC<AuthLoadingScreenProps> = ({ role, isDemoMode }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-salesBlue-dark text-white">
      <div className="max-w-md w-full p-8 text-center">
        <div className="animate-pulse mb-8">
          <Logo />
        </div>
        
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-salesCyan mx-auto mb-6"></div>
        
        <div className="typewriter">
          <h2 className="text-xl font-medium mb-2">
            {isDemoMode ? "Loading demo workspace..." : "Loading your workspace..."}
          </h2>
          {role === 'manager' ? (
            <p className="text-salesCyan">Preparing manager dashboard and team analytics</p>
          ) : (
            <p className="text-salesCyan">Optimizing your sales toolkit for maximum results</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthLoadingScreen;
