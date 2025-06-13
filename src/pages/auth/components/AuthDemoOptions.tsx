
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { Role } from '@/contexts/auth/types';
import { useAuth } from '@/contexts/AuthContext';

interface AuthDemoOptionsProps {
  selectedRole: Role;
  setIsTransitioning: (value: boolean) => void;
  simulateLoginTransition: (role?: Role) => void;
  setFormData: (data: { email: string; password: string }) => void;
}

const AuthDemoOptions: React.FC<AuthDemoOptionsProps> = ({
  selectedRole,
  setIsTransitioning,
  simulateLoginTransition,
  setFormData
}) => {
  const { initializeDemoMode } = useAuth();

  const handleDemoMode = () => {
    setIsTransitioning(true);
    initializeDemoMode(selectedRole);
    simulateLoginTransition(selectedRole);
  };

  return (
    <div className="border-t pt-6">
      <div className="text-center mb-4">
        <p className="text-sm text-muted-foreground mb-4">
          Or try the demo to explore features instantly
        </p>
        <Button 
          variant="outline" 
          onClick={handleDemoMode}
          className="w-full bg-gradient-to-r from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100 border-purple-200 text-purple-700"
        >
          <Play className="mr-2 h-4 w-4" />
          Try Demo Mode
        </Button>
      </div>
    </div>
  );
};

export default AuthDemoOptions;
