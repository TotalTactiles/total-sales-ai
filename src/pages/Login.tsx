
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Login: React.FC = () => {
  const { user } = useAuth();

  // If user is already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Sign in to TSAM</h2>
          <p className="mt-2 text-gray-600">Access your sales management platform</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <p className="text-center text-gray-600">
            This is a demo environment. Authentication will be handled by your existing auth system.
          </p>
          <button 
            className="w-full mt-4 bg-[#7B61FF] text-white py-2 px-4 rounded-lg hover:bg-[#6B51E5] transition-colors"
            onClick={() => window.location.href = '/'}
          >
            Continue to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
