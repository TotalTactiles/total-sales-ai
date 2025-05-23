import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface AuthLoginFormProps {
  setIsTransitioning: (value: boolean) => void;
  simulateLoginTransition: () => void;
  formData?: { email: string; password: string; };
  setFormData?: (data: { email: string; password: string; }) => void;
}

const AuthLoginForm: React.FC<AuthLoginFormProps> = ({ 
  setIsTransitioning, 
  simulateLoginTransition,
  formData: externalFormData,
  setFormData: externalSetFormData
}) => {
  const { signIn, initializeDemoMode } = useAuth();
  const navigate = useNavigate();
  const [internalFormData, setInternalFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  
  // Use either external or internal form data based on what's provided
  const formData = externalFormData || internalFormData;
  const setFormData = externalSetFormData || setInternalFormData;

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log('Attempting to sign in with:', formData.email);
      
      // Check if using demo credentials and switch to demo mode if so
      if ((formData.email === 'manager@salesos.com' && formData.password === 'manager123') ||
          (formData.email === 'rep@salesos.com' && formData.password === 'sales123')) {
        
        console.log('Using demo credentials, initializing demo mode');
        const role = formData.email === 'manager@salesos.com' ? 'manager' : 'sales_rep';
        
        // Use demo mode directly instead of trying to authenticate with Supabase
        initializeDemoMode(role);
        setIsTransitioning(true);
        
        // Direct navigation based on role
        const redirectPath = role === 'manager' ? '/dashboard/manager' : '/dashboard/rep';
        console.log("Redirecting to:", redirectPath);
        setTimeout(() => {
          navigate(redirectPath);
        }, 1500);
        
        toast.success('Demo mode activated!');
        return;
      }
      
      // Otherwise proceed with normal authentication
      await signIn(formData.email, formData.password);
      toast.success('Logged in successfully!');
      setIsTransitioning(true);
    } catch (error: any) {
      console.error('Authentication error:', error);
      toast.error(error.message || 'Invalid login credentials');
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
        className="w-full bg-salesBlue hover:bg-salesBlue-dark"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></div>
            Logging in...
          </>
        ) : (
          <>
            <LogIn className="mr-2 h-4 w-4" /> Login
          </>
        )}
      </Button>
    </form>
  );
};

export default AuthLoginForm;
