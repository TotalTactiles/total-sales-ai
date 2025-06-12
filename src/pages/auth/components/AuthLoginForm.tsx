
import { logger } from '@/utils/logger';
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
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
  const [internalFormData, setInternalFormData] = useState({
    email: 'sales.rep@company.com',
    password: 'fulluser123'
  });
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

      // Retrieve the current session after sign in
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      
      if (!userId) {
        // For demo mode or when no session, use selected role
        simulateLoginTransition(selectedRole);
        return;
      }

      // Fetch profile to get actual role
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (profileError || !profileData) {
        // Fallback to selected role if profile fetch fails
        simulateLoginTransition(selectedRole);
        return;
      }

      simulateLoginTransition(profileData.role as Role);
    } catch (error: any) {
      logger.error('Authentication error:', error);
      toast.error(error.message || 'Login failed');
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
          Auto-filled with demo credentials
        </p>
      </div>
    </form>
  );
};

export default AuthLoginForm;
