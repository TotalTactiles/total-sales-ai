import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Github, Google } from 'lucide-react';
import { Provider } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { Role } from '@/contexts/auth/types';
interface AuthSignupFormProps {
  selectedRole?: Role;
  setIsLogin?: (value: boolean) => void;
}
const AuthSignupForm: React.FC<AuthSignupFormProps> = ({
  selectedRole,
  setIsLogin
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const {
    signUp,
    signUpWithOAuth
  } = useAuth();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setIsLoading(true);
    try {
      const {
        error
      } = await signUp(email, password, {
        role: selectedRole
      });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Account created successfully! Please check your email.');
        if (setIsLogin) setIsLogin(true);
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuth = async (provider: Provider) => {
    setIsLoading(true);
    try {
      const { error } = await signUpWithOAuth(provider);
      if (error) {
        toast.error(error.message);
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  return <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input id="confirmPassword" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
          </div>
          <Button type="submit" disabled={isLoading} className="w-full bg-indigo-700 hover:bg-indigo-600">
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </Button>

          <div className="flex flex-col space-y-2 pt-2">
            <Button type="button" variant="outline" onClick={() => handleOAuth('google')} disabled={isLoading}>
              <Google className="mr-2 h-4 w-4" /> Sign Up with Google
            </Button>
            <Button type="button" variant="outline" onClick={() => handleOAuth('github')} disabled={isLoading}>
              <Github className="mr-2 h-4 w-4" /> Sign Up with GitHub
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>;
};
export default AuthSignupForm;