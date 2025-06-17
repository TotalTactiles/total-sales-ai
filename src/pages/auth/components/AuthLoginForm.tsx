
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import { Role } from '@/contexts/auth/types';

interface AuthLoginFormProps {
  setIsTransitioning: (value: boolean) => void;
  simulateLoginTransition: (role?: Role) => void;
  formData?: {
    email: string;
    password: string;
  };
  setFormData?: (data: {
    email: string;
    password: string;
  }) => void;
  selectedRole?: Role;
}

const AuthLoginForm: React.FC<AuthLoginFormProps> = ({
  setIsTransitioning,
  simulateLoginTransition,
  formData: externalFormData,
  setFormData: externalSetFormData,
  selectedRole
}) => {
  const { signIn } = useAuth();
  
  // Get default credentials based on selected role
  const getDefaultCredentials = (role: Role) => {
    switch (role) {
      case 'developer':
        return { email: 'krishdev@tsam.com', password: 'badabing2024' };
      case 'manager':
        return { email: 'manager@salesos.com', password: 'manager123' };
      case 'sales_rep':
      default:
        return { email: 'rep@salesos.com', password: 'sales123' };
    }
  };

  const defaultCredentials = getDefaultCredentials(selectedRole || 'sales_rep');
  
  const [internalFormData, setInternalFormData] = useState(defaultCredentials);
  const [isLoading, setIsLoading] = useState(false);

  // Use either external or internal form data based on what's provided
  const formData = externalFormData || internalFormData;
  const setFormData = externalSetFormData || setInternalFormData;

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsTransitioning(true);
    
    try {
      const { error } = await signIn(formData.email, formData.password);
      
      if (error) {
        throw error;
      }

      // The AuthProvider will handle routing automatically
    } catch (error: any) {
      console.error('Authentication error:', error);
      setIsTransitioning(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleAuthSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email" 
          name="email" 
          type="email" 
          value={formData.email} 
          onChange={handleFormChange} 
          required 
          disabled={isLoading}
          autoComplete="email" 
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input 
          id="password" 
          name="password" 
          type="password" 
          value={formData.password} 
          onChange={handleFormChange} 
          required 
          disabled={isLoading}
          autoComplete="current-password" 
        />
      </div>
      
      <Button 
        type="submit" 
        disabled={isLoading} 
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white"
      >
        {isLoading ? (
          <>
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></div>
            Logging in...
          </>
        ) : (
          <>
            <LogIn className="mr-2 h-4 w-4" /> 
            Login as {selectedRole === 'developer' ? 'Developer' : selectedRole === 'manager' ? 'Manager' : 'Sales Rep'}
          </>
        )}
      </Button>
      
      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          Auto-filled with {selectedRole === 'developer' ? 'developer' : selectedRole === 'manager' ? 'manager' : 'sales rep'} credentials
        </p>
      </div>
    </form>
  );
};

export default AuthLoginForm;
