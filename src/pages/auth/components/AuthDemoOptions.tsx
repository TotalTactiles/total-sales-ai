
import React from 'react';
import { Role } from '@/contexts/auth/types';

interface AuthDemoOptionsProps {
  selectedRole: Role;
  setIsTransitioning: (value: boolean) => void;
  simulateLoginTransition: () => void;
  setFormData: (data: { email: string; password: string }) => void;
}

const AuthDemoOptions: React.FC<AuthDemoOptionsProps> = ({ 
  selectedRole, 
  setIsTransitioning, 
  simulateLoginTransition,
  setFormData
}) => {
  const handleDemoLogin = () => {
    const email = selectedRole === 'manager' ? 'manager@salesos.com' : 'rep@salesos.com';
    const password = selectedRole === 'manager' ? 'manager123' : 'sales123';
    
    setFormData({ email, password });
  };

  return (
    <div className="mt-6 pt-6 border-t border-gray-200">
      <p className="text-center text-sm mb-4">
        Try the <span className="font-semibold">demo version</span> instead
      </p>
      
      <div className="flex flex-col space-y-2">
        <button
          onClick={handleDemoLogin}
          className="w-full py-2 border border-slate-300 rounded-md hover:bg-slate-50 text-sm font-medium transition-colors"
        >
          Fill in Demo Credentials
        </button>
      </div>
      
      <p className="text-xs text-center text-slate-500 mt-3">
        {selectedRole === 'manager' ? 'Demo Manager Account' : 'Demo Sales Rep Account'}
      </p>
    </div>
  );
};

export default AuthDemoOptions;
