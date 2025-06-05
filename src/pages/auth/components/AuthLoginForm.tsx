
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

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
    email: 'sales.rep@company.com',
    password: 'fulluser123',
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

  const checkCompanySettings = async (userId: string) => {
    try {
      // Get the user's profile to find company_id
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('company_id, role')
        .eq('id', userId)
        .single();
      
      if (profileError) throw profileError;
      
      // If no company_id, we can't check settings
      if (!profileData.company_id) {
        return null;
      }
      
      // Check if company settings exist and if onboarding is completed
      const { data: settingsData, error: settingsError } = await supabase
        .from('company_settings')
        .select('onboarding_completed_at')
        .eq('company_id', profileData.company_id)
        .maybeSingle();
      
      if (settingsError) throw settingsError;
      
      // Return combination of profile and settings
      return {
        hasSettings: !!settingsData,
        onboardingCompleted: !!settingsData?.onboarding_completed_at,
        isManager: profileData.role === 'manager',
        companyId: profileData.company_id
      };
    } catch (error) {
      console.error('Error checking company settings:', error);
      return null;
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log('Logging in as full paying user');
      
      // Simulate full user authentication with all features unlocked
      initializeDemoMode('sales_rep');
      
      // Set full user status in localStorage
      localStorage.setItem('userStatus', 'full');
      localStorage.setItem('planType', 'pro');
      localStorage.setItem('userEmail', formData.email);
      
      setIsTransitioning(true);
      
      // Check for company settings (only in real mode, not demo mode)
      // In a real implementation, you would check after actual authentication
      const userId = localStorage.getItem('userId') || '123e4567-e89b-12d3-a456-426614174000'; // Mock user ID for demo
      const companyStatus = await checkCompanySettings(userId);

      // Direct navigation based on settings status
      setTimeout(() => {
        if (companyStatus) {
          if (companyStatus.isManager && (!companyStatus.hasSettings || !companyStatus.onboardingCompleted)) {
            // Manager with no company settings or incomplete onboarding -> onboarding
            navigate('/onboarding');
          } else {
            // Regular navigation based on role
            navigate('/sales/dashboard');
          }
        } else {
          navigate('/sales/dashboard');
        }
      }, 1500);
      
      toast.success('Welcome back! Logged in as full user with Pro features.');
      return;
      
    } catch (error: unknown) {
      console.error('Authentication error:', error);
      const errMsg = error instanceof Error ? error.message : 'Login failed';
      toast.error(errMsg);
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
            <LogIn className="mr-2 h-4 w-4" /> Login as Full User
          </>
        )}
      </Button>
      
      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          Auto-filled with full user credentials
        </p>
      </div>
    </form>
  );
};

export default AuthLoginForm;
