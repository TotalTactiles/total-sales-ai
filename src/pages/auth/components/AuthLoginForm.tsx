import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LogIn, AlertCircle, CheckCircle, Settings } from 'lucide-react';
import { logger } from '@/utils/logger';
import { toast } from 'sonner';
interface AuthLoginFormProps {
  setIsTransitioning: (value: boolean) => void;
}
const AuthLoginForm: React.FC<AuthLoginFormProps> = ({
  setIsTransitioning
}) => {
  const {
    signIn
  } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSettingUp, setIsSettingUp] = useState(false);
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
  const setupDemoUsers = async () => {
    setIsSettingUp(true);
    setError(null);
    try {
      logger.info('Setting up demo users...', {}, 'auth');
      const response = await fetch('/functions/v1/setup-demo-users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();
      if (response.ok) {
        logger.info('Demo users setup completed:', result, 'auth');
        toast.success('Demo users created successfully! You can now log in.');
        setSuccess('Demo users have been created. You can now use the login credentials.');
      } else {
        logger.error('Demo users setup failed:', result, 'auth');
        setError(`Setup failed: ${result.error || 'Unknown error'}`);
        toast.error('Failed to setup demo users');
      }
    } catch (error: any) {
      logger.error('Error setting up demo users:', error, 'auth');
      setError(`Setup error: ${error.message}`);
      toast.error('Failed to setup demo users');
    } finally {
      setIsSettingUp(false);
    }
  };
  const performLogin = async (email: string, password: string, context: string) => {
    logger.info(`${context} login attempt:`, {
      email
    }, 'auth');
    const {
      error: authError
    } = await signIn(email.trim(), password);
    if (authError) {
      logger.error(`${context} login failed:`, {
        message: authError.message,
        code: authError.status,
        fullError: authError
      }, 'auth');
      const errorMessage = authError.message || 'Login failed';
      if (errorMessage.includes('Invalid login credentials')) {
        setError('Invalid email or password. Try clicking "Setup Demo Users" first if this is your first time.');
      } else if (errorMessage.includes('Email not confirmed')) {
        setError('Please check your email and click the confirmation link before logging in.');
      } else if (errorMessage.includes('Too many requests')) {
        setError('Too many login attempts. Please wait a few minutes and try again.');
      } else {
        setError(`Login failed: ${errorMessage}`);
      }
      setIsTransitioning(false);
      return false;
    } else {
      logger.info(`${context} login successful`, {}, 'auth');
      setSuccess('Login successful! Redirecting to your workspace...');
      return true;
    }
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
      await performLogin(formData.email, formData.password, 'Manual');
    } catch (error: any) {
      logger.error('Authentication error:', error, 'auth');
      setError('An unexpected error occurred. Please try again.');
      setIsTransitioning(false);
    } finally {
      setIsLoading(false);
    }
  };
  const handleQuickLogin = async (email: string, password: string, role: string) => {
    setFormData({
      email,
      password
    });
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    setIsTransitioning(true);
    try {
      await performLogin(email, password, `Quick ${role}`);
    } catch (error: any) {
      logger.error(`Quick login error for ${role}:`, error, 'auth');
      setError('An unexpected error occurred. Please try again.');
      setIsTransitioning(false);
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="space-y-4">
      <form onSubmit={handleAuthSubmit} className="space-y-4">
        {error && <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>}
        
        {success && <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md flex items-center gap-2">
            <CheckCircle className="h-4 w-4 flex-shrink-0" />
            <span>{success}</span>
          </div>}
        
        <div>
          <Label htmlFor="email" className="text-gray-700">Email</Label>
          <Input id="email" name="email" type="email" value={formData.email} onChange={handleFormChange} required disabled={isLoading} autoComplete="email" placeholder="Enter your email" className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500" />
        </div>
        <div>
          <Label htmlFor="password" className="text-gray-700">Password</Label>
          <Input id="password" name="password" type="password" value={formData.password} onChange={handleFormChange} required disabled={isLoading} autoComplete="current-password" placeholder="Enter your password" className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500" />
        </div>
        
        <Button type="submit" disabled={isLoading || !formData.email || !formData.password} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium">
          {isLoading ? <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></div>
              Logging in...
            </> : <>
              <LogIn className="mr-2 h-4 w-4" /> 
              Login
            </>}
        </Button>
      </form>

      <div className="pt-2 border-t border-gray-200">
        <Button type="button" variant="outline" onClick={setupDemoUsers} disabled={isSettingUp || isLoading} className="w-full text-sm">
          {isSettingUp ? <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></div>
              Setting up demo users...
            </> : <>
              <Settings className="mr-2 h-4 w-4" />
              Setup Demo Users
            </>}
        </Button>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Click this button first if you're having login issues
        </p>
      </div>

      <div className="space-y-3 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600 text-center font-medium">Quick System Access:</p>
        <div className="grid grid-cols-1 gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => handleQuickLogin('dev@os.local', 'dev1234', 'Developer')} disabled={isLoading} className="text-xs justify-start hover:bg-purple-50 text-gray-950">
            <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
            Developer OS (dev@os.local)
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => handleQuickLogin('manager@os.local', 'manager123', 'Manager')} disabled={isLoading} className="text-xs justify-start hover:bg-blue-50 text-gray-950">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
            Manager OS (manager@os.local)
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => handleQuickLogin('rep@os.local', 'rep123', 'Sales Rep')} disabled={isLoading} className="text-xs justify-start hover:bg-green-50 text-gray-950">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            Sales Rep OS (rep@os.local)
          </Button>
        </div>
      </div>
    </div>;
};
export default AuthLoginForm;