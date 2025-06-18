
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LogIn, AlertCircle, CheckCircle } from 'lucide-react';
import { Role } from '@/contexts/auth/types';
import { logger } from '@/utils/logger';

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
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Use either external or internal form data based on what's provided
  const formData = externalFormData || internalFormData;
  const setFormData = externalSetFormData || setInternalFormData;

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null); // Clear error when user types
    setSuccess(null); // Clear success when user types
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);
    setIsTransitioning(true);
    
    try {
      logger.info('Attempting to sign in with:', formData.email);
      const { error: authError, profile } = await signIn(formData.email, formData.password);
      
      if (authError) {
        logger.error('Authentication failed:', authError.message);
        
        // Provide helpful error messages
        if (authError.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please check your credentials and try again.');
        } else if (authError.message.includes('Email not confirmed')) {
          setError('Please check your email and click the confirmation link before signing in.');
        } else if (authError.message.includes('Too many requests')) {
          setError('Too many login attempts. Please wait a moment before trying again.');
        } else {
          setError(authError.message || 'Login failed');
        }
        
        setIsTransitioning(false);
      } else {
        logger.info('Authentication successful');
        setSuccess('Login successful! Redirecting...');
        // The AuthProvider will handle routing automatically on success
      }
    } catch (error: any) {
      logger.error('Authentication error:', error);
      setError('An unexpected error occurred. Please try again.');
      setIsTransitioning(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleAuthSubmit} className="space-y-4">
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
      {success && (
        <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md flex items-center gap-2">
          <CheckCircle className="h-4 w-4 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}
      
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
          placeholder="Enter your email"
          className="font-mono text-sm"
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
          placeholder="Enter your password"
          className="font-mono text-sm"
        />
      </div>
      
      <Button 
        type="submit" 
        disabled={isLoading || !formData.email || !formData.password} 
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
          Pre-filled with {selectedRole === 'developer' ? 'developer' : selectedRole === 'manager' ? 'manager' : 'sales rep'} credentials
        </p>
        <p className="text-xs text-green-600 mt-1">
          ✅ Demo accounts are auto-created
        </p>
      </div>
    </form>
  );
};

export default AuthLoginForm;
