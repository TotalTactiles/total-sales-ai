
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LogIn, AlertCircle, CheckCircle } from 'lucide-react';
import { logger } from '@/utils/logger';

interface AuthLoginFormProps {
  setIsTransitioning: (value: boolean) => void;
}

const AuthLoginForm: React.FC<AuthLoginFormProps> = ({
  setIsTransitioning
}) => {
  const { signIn } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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
      
      const { error: authError } = await signIn(formData.email.trim(), formData.password);
      
      if (authError) {
        logger.error('Authentication failed:', authError);
        setError(`Login failed: ${authError.message}`);
        setIsTransitioning(false);
      } else {
        logger.info('Authentication successful');
        setSuccess('Login successful! Redirecting...');
        // Don't set transitioning to false on success - let the redirect happen
      }
    } catch (error: any) {
      logger.error('Authentication error:', error);
      setError('An unexpected error occurred. Please try again.');
      setIsTransitioning(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Quick login with proper credentials
  const handleQuickLogin = async (email: string, password: string, role: string) => {
    setFormData({ email, password });
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    setIsTransitioning(true);
    
    try {
      logger.info(`Quick login attempt for ${role}:`, email);
      
      const { error: authError } = await signIn(email.trim(), password);
      
      if (authError) {
        logger.error(`Quick login failed for ${role}:`, authError);
        setError(`${role} login failed: ${authError.message}`);
        setIsTransitioning(false);
      } else {
        logger.info(`Quick login successful for ${role}`);
        setSuccess(`${role} login successful! Redirecting...`);
        // Don't set transitioning to false on success
      }
    } catch (error: any) {
      logger.error(`Quick login error for ${role}:`, error);
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
              Login
            </>
          )}
        </Button>
      </form>

      {/* Quick Login Section */}
      <div className="space-y-3 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600 text-center font-medium">Quick Access:</p>
        <div className="grid grid-cols-1 gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleQuickLogin('krishdev@tsam.com', 'badabing2024', 'Developer')}
            disabled={isLoading}
            className="text-xs justify-start"
          >
            <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
            Developer Access
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleQuickLogin('manager@salesos.com', 'manager123', 'Manager')}
            disabled={isLoading}
            className="text-xs justify-start"
          >
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
            Manager Access
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleQuickLogin('rep@salesos.com', 'sales123', 'Sales Rep')}
            disabled={isLoading}
            className="text-xs justify-start"
          >
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            Sales Rep Access
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AuthLoginForm;
