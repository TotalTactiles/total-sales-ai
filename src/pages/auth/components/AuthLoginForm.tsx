
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
    setError(null);
    setSuccess(null);
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
      const { error: authError } = await signIn(formData.email, formData.password);
      
      if (authError) {
        logger.error('Authentication failed:', authError.message);
        setError('Invalid email or password. Please try again.');
        setIsTransitioning(false);
      } else {
        logger.info('Authentication successful');
        setSuccess('Login successful! Redirecting...');
        
        // Small delay to show success message before redirect
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
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
    <div className="space-y-4">
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
          <Label htmlFor="email" className="text-gray-700">Email</Label>
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
            className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <Label htmlFor="password" className="text-gray-700">Password</Label>
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
            className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        
        <Button 
          type="submit" 
          disabled={isLoading || !formData.email || !formData.password} 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
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
          <p className="text-xs text-gray-500">
            Pre-filled with {selectedRole === 'developer' ? 'developer' : selectedRole === 'manager' ? 'manager' : 'sales rep'} credentials
          </p>
          <p className="text-xs text-green-600 mt-1">
            ✅ Demo accounts are ready to use
          </p>
        </div>
      </form>
    </div>
  );
};

export default AuthLoginForm;
