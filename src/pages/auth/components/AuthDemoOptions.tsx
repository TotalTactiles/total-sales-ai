
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Role } from '@/contexts/auth/types';
import { Zap, Play } from 'lucide-react';
import { logger } from '@/utils/logger';

interface AuthDemoOptionsProps {
  selectedRole: Role;
  setIsTransitioning: (transitioning: boolean) => void;
  simulateLoginTransition: () => void;
  setFormData: (data: any) => void;
}

const AuthDemoOptions: React.FC<AuthDemoOptionsProps> = ({ 
  selectedRole, 
  setIsTransitioning, 
  simulateLoginTransition,
  setFormData 
}) => {
  const { initializeDemoMode } = useAuth();

  const handleDemoAccess = () => {
    logger.info('Initializing demo mode for role:', selectedRole);
    
    setIsTransitioning(true);
    simulateLoginTransition();
    
    // Initialize demo mode
    initializeDemoMode(selectedRole);
    
    // Set form data for demo
    const demoCredentials = {
      developer: { email: 'krishdev@tsam.com', password: 'badabing2024', fullName: 'Krish Developer' },
      manager: { email: 'manager@salesos.com', password: 'manager123', fullName: 'Sales Manager' },
      sales_rep: { email: 'rep@salesos.com', password: 'sales123', fullName: 'Sales Rep' }
    };
    
    const credentials = demoCredentials[selectedRole] || demoCredentials.sales_rep;
    setFormData(credentials);
  };

  return (
    <div className="pt-4 border-t">
      <div className="text-center mb-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Try Demo Mode</h3>
        <p className="text-xs text-gray-500">
          Explore the platform with sample data and full functionality
        </p>
      </div>
      
      <Button 
        onClick={handleDemoAccess}
        variant="outline" 
        className="w-full border-blue-200 hover:bg-blue-50 hover:border-blue-300"
      >
        <Play className="h-4 w-4 mr-2" />
        Launch {selectedRole === 'sales_rep' ? 'Sales Rep' : selectedRole === 'manager' ? 'Manager' : 'Developer'} Demo
      </Button>
      
      <div className="mt-3 text-center">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 border border-blue-200">
          <Zap className="h-3 w-3 text-blue-600 mr-1" />
          <span className="text-xs text-blue-700 font-medium">
            Instant access • No signup required
          </span>
        </div>
      </div>
    </div>
  );
};

export default AuthDemoOptions;
