
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { Brain } from 'lucide-react';

interface DeveloperSecretLoginProps {
  isOpen: boolean;
  onClose: () => void;
}

const DeveloperSecretLogin: React.FC<DeveloperSecretLoginProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('dev@tsam.ai');
  const [password, setPassword] = useState('DevTSAM2025');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await signIn(email, password);
      if (error) {
        console.error('Developer login error:', error);
      } else {
        onClose();
      }
    } catch (err) {
      console.error('Developer login exception:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-slate-900 to-purple-900 border-purple-500">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <Brain className="h-6 w-6 text-purple-400" />
            TSAM Developer Access
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="dev-email" className="text-gray-300">Email</Label>
            <Input
              id="dev-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/10 border-gray-600 text-white"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="dev-password" className="text-gray-300">Password</Label>
            <Input
              id="dev-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white/10 border-gray-600 text-white"
              required
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-purple-600 hover:bg-purple-700"
            >
              {isLoading ? 'Authenticating...' : 'Access TSAM'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-gray-600 text-gray-300"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DeveloperSecretLogin;
