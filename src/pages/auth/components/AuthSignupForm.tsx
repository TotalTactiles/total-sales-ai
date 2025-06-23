
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus, AlertCircle, CheckCircle } from 'lucide-react';
import { Role } from '@/contexts/auth/types';
import { logger } from '@/utils/logger';

interface AuthSignupFormProps {
  selectedRole: Role;
  setIsLogin: (isLogin: boolean) => void;
}

const AuthSignupForm: React.FC<AuthSignupFormProps> = ({ selectedRole, setIsLogin }) => {
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: selectedRole
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

  const handleRoleChange = (role: Role) => {
    setFormData({
      ...formData,
      role
    });
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password || !formData.fullName) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      logger.info('Attempting to sign up with:', { email: formData.email, role: formData.role });
      
      const { error: authError } = await signUp(
        formData.email, 
        formData.password,
        {
          full_name: formData.fullName,
          role: formData.role
        }
      );
      
      if (authError) {
        logger.error('Signup failed:', authError.message);
        if (authError.message.includes('already registered')) {
          setError('An account with this email already exists. Please try logging in instead.');
        } else {
          setError(authError.message);
        }
      } else {
        logger.info('Signup successful');
        setSuccess('Account created successfully! Please check your email to verify your account, then log in.');
        
        // Auto-switch to login after a delay
        setTimeout(() => {
          setIsLogin(true);
        }, 3000);
      }
    } catch (error: any) {
      logger.error('Signup error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSignupSubmit} className="space-y-4">
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
          <Label htmlFor="fullName" className="text-gray-700">Full Name</Label>
          <Input 
            id="fullName" 
            name="fullName" 
            type="text" 
            value={formData.fullName} 
            onChange={handleFormChange} 
            required 
            disabled={isLoading}
            placeholder="Enter your full name"
            className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

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
          <Label htmlFor="role" className="text-gray-700">Role</Label>
          <Select value={formData.role} onValueChange={handleRoleChange} disabled={isLoading}>
            <SelectTrigger className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sales_rep">Sales Representative</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="developer">Developer</SelectItem>
            </SelectContent>
          </Select>
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
            autoComplete="new-password"
            placeholder="Enter your password"
            className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <Label htmlFor="confirmPassword" className="text-gray-700">Confirm Password</Label>
          <Input 
            id="confirmPassword" 
            name="confirmPassword" 
            type="password" 
            value={formData.confirmPassword} 
            onChange={handleFormChange} 
            required 
            disabled={isLoading}
            autoComplete="new-password"
            placeholder="Confirm your password"
            className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        
        <Button 
          type="submit" 
          disabled={isLoading || !formData.email || !formData.password || !formData.fullName} 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
        >
          {isLoading ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></div>
              Creating account...
            </>
          ) : (
            <>
              <UserPlus className="mr-2 h-4 w-4" /> 
              Create Account
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default AuthSignupForm;
