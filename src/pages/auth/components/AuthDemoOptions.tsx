
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Headphones, Info, ChevronDown } from 'lucide-react';
import { Role } from '@/contexts/auth/types';
import { toast } from 'sonner';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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
  const [isCredentialsOpen, setIsCredentialsOpen] = useState(false);
  const [isVoiceLogin, setIsVoiceLogin] = useState(false);
  const [voiceRecognized, setVoiceRecognized] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
  });

  const fillDemoCredentials = () => {
    if (selectedRole === 'manager') {
      setFormData({
        email: 'manager@salesos.com',
        password: 'manager123',
        fullName: 'John Manager',
      });
    } else {
      setFormData({
        email: 'rep@salesos.com',
        password: 'sales123',
        fullName: 'Sam Sales',
      });
    }
  };

  const simulateVoiceLogin = () => {
    setIsVoiceLogin(true);
    // Simulate voice recognition process
    setTimeout(() => {
      setVoiceRecognized(true);
      const userName = selectedRole === 'manager' ? 'John' : 'Sam';
      setWelcomeMessage(`Hey ${userName}, it's great to see you again!`);
      
      setTimeout(() => {
        setIsTransitioning(true);
        simulateLoginTransition();
      }, 1500);
    }, 2000);
  };

  const handleDemoMode = () => {
    try {
      toast.info(`Loading ${selectedRole === 'manager' ? 'Manager' : 'Sales Rep'} demo mode...`);
      
      // Initialize demo mode with the selected role
      initializeDemoMode(selectedRole);
      
      // Show transition screen before navigating
      setIsTransitioning(true);
      
      // Navigate after a short delay to allow state updates to complete
      simulateLoginTransition();
    } catch (error) {
      console.error('Demo mode error:', error);
      toast.error('Failed to load demo mode');
    }
  };

  // If voice login is active, render the voice login UI
  if (isVoiceLogin) {
    return (
      <div className="text-center p-6 space-y-4">
        {voiceRecognized ? (
          <div className="animate-fadeIn">
            <div className="text-2xl font-semibold text-salesCyan">{welcomeMessage}</div>
            <div className="mt-2">Logging you in...</div>
          </div>
        ) : (
          <>
            <div className="flex justify-center">
              <div className="relative">
                <div className="animate-ping absolute h-16 w-16 rounded-full bg-salesCyan opacity-50"></div>
                <div className="relative rounded-full h-16 w-16 bg-salesCyan flex items-center justify-center">
                  <Headphones className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
            <p className="text-lg font-medium">Listening...</p>
            <p className="text-sm text-slate-500">Please say "Hey SalesOS" to login</p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="border-t border-slate-200 pt-4 space-y-3">
      <Collapsible
        open={isCredentialsOpen}
        onOpenChange={setIsCredentialsOpen}
        className="w-full bg-slate-50 rounded-lg"
      >
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full flex items-center justify-between text-slate-600">
            <div className="flex items-center">
              <Info className="h-4 w-4 mr-2" />
              <span>Demo Login Credentials</span>
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${isCredentialsOpen ? "transform rotate-180" : ""}`} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="p-4">
          <div className="space-y-4">
            <div className="p-3 bg-white border border-slate-200 rounded-md">
              <h4 className="font-medium mb-2">Manager Credentials</h4>
              <p className="text-sm text-slate-600 mb-1"><strong>Email:</strong> manager@salesos.com</p>
              <p className="text-sm text-slate-600"><strong>Password:</strong> manager123</p>
            </div>
            
            <div className="p-3 bg-white border border-slate-200 rounded-md">
              <h4 className="font-medium mb-2">Sales Rep Credentials</h4>
              <p className="text-sm text-slate-600 mb-1"><strong>Email:</strong> rep@salesos.com</p>
              <p className="text-sm text-slate-600"><strong>Password:</strong> sales123</p>
            </div>
            
            <Button 
              onClick={fillDemoCredentials}
              className="w-full bg-slate-600 hover:bg-slate-700 text-white"
            >
              Fill in {selectedRole === 'manager' ? 'Manager' : 'Sales Rep'} Credentials
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
      
      <Button 
        variant="outline" 
        onClick={simulateVoiceLogin} 
        className="w-full border-salesCyan text-salesCyan hover:bg-salesCyan hover:text-white"
      >
        <Headphones className="mr-2 h-4 w-4" /> Voice Login
      </Button>
      
      <Button 
        variant="outline" 
        onClick={handleDemoMode} 
        className="w-full border-salesGreen text-salesGreen hover:bg-salesGreen hover:text-white"
      >
        Try Demo Mode <Badge className="ml-2 bg-white text-salesGreen">New</Badge>
      </Button>
    </div>
  );
};

export default AuthDemoOptions;
