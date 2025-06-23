
import React from 'react';
import Logo from '@/components/Logo';

const AuthLoadingScreen = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="text-center">
        <Logo />
        <div className="mt-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Signing you in...</p>
          <p className="text-gray-500 text-sm mt-2">Setting up your workspace</p>
        </div>
      </div>
    </div>
  );
};

export default AuthLoadingScreen;
