
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { Role } from '@/contexts/auth/types';
import { toast } from 'sonner';

interface AuthSignupFormProps {
  selectedRole: Role;
  setIsLogin: (value: boolean) => void;
}

const AuthSignupForm: React.FC<AuthSignupFormProps> = ({ selectedRole, setIsLogin }) => {
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!formData.fullName.trim()) {
        toast.error("Please enter your full name");
        return;
      }
      await signUp(formData.email, formData.password, formData.fullName, selectedRole);
      setIsLogin(true);
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  return (
    <form onSubmit={handleAuthSubmit} className="space-y-4">
      <div>
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          name="fullName"
          type="text"
          value={formData.fullName}
          onChange={handleFormChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleFormChange}
          required
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
        />
      </div>
      
      <Button type="submit" className="w-full bg-salesBlue hover:bg-salesBlue-dark">
        <UserPlus className="mr-2 h-4 w-4" /> Sign Up
      </Button>
    </form>
  );
};

export default AuthSignupForm;
