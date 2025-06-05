
import React from 'react';
import { Role } from '@/contexts/auth/types';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

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
  const navigate = useNavigate();
  const { initializeDemoMode } = useAuth();
  
  const handleDemoLogin = () => {
    // First fill in the form with demo credentials
    const email = selectedRole === 'manager' ? 'manager@salesos.com' : 'rep@salesos.com';
    const password = selectedRole === 'manager' ? 'manager123' : 'sales123';
    
    setFormData({ email, password });
  };
  
  const handleDirectDemoLogin = () => {
    // Skip the form and directly log in with demo mode
    console.log("Direct demo login with role:", selectedRole);
    initializeDemoMode(selectedRole);
    setIsTransitioning(true);
    
    // Direct navigation based on role - using correct existing routes
    const redirectPath = selectedRole === 'manager' ? '/manager/dashboard' : '/sales/dashboard';
    console.log("Redirecting to:", redirectPath);
    
    setTimeout(() => {
      navigate(redirectPath);
    }, 1500);
  };

  return (
    <div className="mt-6 pt-6 border-t border-muted">
      <p className="text-center text-sm mb-4">
        Try the <span className="font-semibold">demo version</span> instead
      </p>
      
      <div className="flex flex-col space-y-3">
        <Button
          onClick={handleDemoLogin}
          variant="outline"
          className="w-full py-2 border border-border hover:bg-accent text-sm font-medium transition-colors"
        >
          Fill in Demo Credentials
        </Button>
        
        <Button
          onClick={handleDirectDemoLogin}
          variant="default"
          className="w-full py-2 bg-salesBlue hover:bg-salesBlue/90 text-sm font-medium transition-colors"
        >
          Quick Demo Login
        </Button>
      </div>
      
      <p className="text-xs text-center text-muted-foreground mt-3">
        {selectedRole === 'manager' ? 'Demo Manager Account' : 'Demo Sales Rep Account'}
      </p>
    </div>
  );
};

export default AuthDemoOptions;
