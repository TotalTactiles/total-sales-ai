
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { isDemoMode, demoUsers } from '@/data/demo.mock.data';

interface DeveloperSecretLoginProps {
  isOpen: boolean;
  onClose: () => void;
}

const DeveloperSecretLogin: React.FC<DeveloperSecretLoginProps> = ({ isOpen, onClose }) => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto-fill developer credentials if available
  React.useEffect(() => {
    if (isDemoMode && isOpen) {
      const devUser = demoUsers.find(u => u.role === 'developer');
      if (devUser) {
        setEmail(devUser.email);
        setPassword(devUser.password);
      }
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn(email, password);
      
      if (result?.error) {
        setError(result.error.message || 'Developer login failed');
        setIsLoading(false);
        return;
      }

      onClose();
    } catch (error) {
      console.error('Developer login error:', error);
      setError('An unexpected error occurred');
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setPassword('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">🔧 Developer Access</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
              {error}
            </div>
          )}
          
          <div>
            <Label htmlFor="dev-email">Developer Email</Label>
            <Input
              id="dev-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="dev@tsam.local"
              required
              disabled={isLoading}
            />
          </div>
          
          <div>
            <Label htmlFor="dev-password">Password</Label>
            <Input
              id="dev-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-purple-600 hover:bg-purple-700"
            >
              {isLoading ? 'Logging in...' : 'Access Dev OS'}
            </Button>
          </div>
        </form>
        
        {isDemoMode && (
          <p className="text-xs text-gray-500 text-center mt-2">
            Demo credentials auto-filled
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DeveloperSecretLogin;
