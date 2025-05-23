
import React from 'react';
import { Role } from '@/contexts/auth/types';
import { Button } from '@/components/ui/button';

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
    <div className="mt-6 pt-6 border-t border-muted">
      <p className="text-center text-sm mb-4">
        Try the <span className="font-semibold">demo version</span> instead
      </p>
      
      <div className="flex flex-col space-y-2">
        <Button
          onClick={handleDemoLogin}
          variant="outline"
          className="w-full py-2 border border-border hover:bg-accent text-sm font-medium transition-colors"
        >
          Fill in Demo Credentials
        </Button>
      </div>
      
      <p className="text-xs text-center text-muted-foreground mt-3">
        {selectedRole === 'manager' ? 'Demo Manager Account' : 'Demo Sales Rep Account'}
      </p>
    </div>
  );
};

export default AuthDemoOptions;
