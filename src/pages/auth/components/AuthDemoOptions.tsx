
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlayCircle, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Role } from '@/contexts/auth/types';
import { toast } from 'sonner';

interface AuthDemoOptionsProps {
  selectedRole: Role;
  setIsTransitioning: (value: boolean) => void;
  simulateLoginTransition: () => void;
}

const AuthDemoOptions: React.FC<AuthDemoOptionsProps> = ({ 
  selectedRole, 
  setIsTransitioning, 
  simulateLoginTransition 
}) => {
  const { initializeDemoMode } = useAuth();

  const handleDemoAccess = () => {
    console.log('Starting demo mode for role:', selectedRole);
    setIsTransitioning(true);
    
    // Initialize demo mode with selected role
    initializeDemoMode(selectedRole);
    
    toast.success(`Welcome to ${selectedRole === 'developer' ? 'Developer' : selectedRole === 'manager' ? 'Manager' : 'Sales Rep'} OS demo!`);
  };

  const getRoleDescription = () => {
    switch (selectedRole) {
      case 'developer':
        return 'Explore system monitoring, AI brain configuration, and developer tools';
      case 'manager':
        return 'View team analytics, performance tracking, and management features';
      case 'sales_rep':
      default:
        return 'Try the smart dialer, AI assistant, and sales automation tools';
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or try demo mode</span>
        </div>
      </div>
      
      <div className="space-y-3">
        <Button 
          onClick={handleDemoAccess}
          variant="outline" 
          className="w-full border-primary/20 hover:border-primary/40 hover:bg-primary/5"
        >
          <PlayCircle className="mr-2 h-4 w-4" />
          Enter {selectedRole === 'developer' ? 'Developer' : selectedRole === 'manager' ? 'Manager' : 'Sales Rep'} Demo
        </Button>
        
        <p className="text-xs text-center text-muted-foreground">
          {getRoleDescription()}
        </p>
      </div>
      
      <div className="text-center">
        <div className="flex items-center justify-center space-x-1 text-xs text-muted-foreground">
          <Zap className="h-3 w-3" />
          <span>No registration required for demo</span>
        </div>
      </div>
    </div>
  );
};

export default AuthDemoOptions;
