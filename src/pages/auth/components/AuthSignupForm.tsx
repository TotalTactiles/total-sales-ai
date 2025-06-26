
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';

interface AuthSignupFormProps {
  setIsLogin: (isLogin: boolean) => void;
}

const AuthSignupForm: React.FC<AuthSignupFormProps> = ({ setIsLogin }) => {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await signUp(email, password, {
        full_name: fullName,
        role: 'sales_rep'
      });
      
      if (result?.error) {
        console.error('❌ Signup error:', result.error);
        return;
      }

      console.log('✅ Signup successful');
    } catch (error) {
      console.error('❌ Signup exception:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSignUp} className="space-y-4">
      <div>
        <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
          Full Name
        </Label>
        <Input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="mt-1 w-full border-gray-300 rounded-lg focus:ring-[#7B61FF] focus:border-[#7B61FF]"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="signupEmail" className="text-sm font-medium text-gray-700">
          Email
        </Label>
        <Input
          id="signupEmail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full border-gray-300 rounded-lg focus:ring-[#7B61FF] focus:border-[#7B61FF]"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="signupPassword" className="text-sm font-medium text-gray-700">
          Password
        </Label>
        <Input
          id="signupPassword"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full border-gray-300 rounded-lg focus:ring-[#7B61FF] focus:border-[#7B61FF]"
          required
        />
      </div>
      
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-12 bg-[#7B61FF] hover:bg-[#674edc] text-white font-semibold transition-colors"
      >
        {isSubmitting ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            Creating account...
          </div>
        ) : (
          'Create Account'
        )}
      </Button>
      
      <div className="text-center">
        <Button
          type="button"
          variant="ghost"
          onClick={() => setIsLogin(true)}
          className="text-sm text-gray-600 hover:text-[#7B61FF]"
        >
          Already have an account? Login
        </Button>
      </div>
    </form>
  );
};

export default AuthSignupForm;
