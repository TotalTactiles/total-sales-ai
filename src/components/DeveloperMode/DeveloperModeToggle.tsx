
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Code, Shield, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface DeveloperModeToggleProps {
  onModeChange?: (mode: 'sales_rep' | 'manager' | 'developer') => void;
}

const DeveloperModeToggle: React.FC<DeveloperModeToggleProps> = ({ onModeChange }) => {
  const { profile, updateProfile } = useAuth();
  const [isDeveloperMode, setIsDeveloperMode] = useState(false);
  const [currentViewMode, setCurrentViewMode] = useState<'sales_rep' | 'manager' | 'developer'>('sales_rep');

  useEffect(() => {
    const devMode = localStorage.getItem('developerMode') === 'true';
    setIsDeveloperMode(devMode);
    
    const viewMode = localStorage.getItem('viewMode') as 'sales_rep' | 'manager' | 'developer' || 'sales_rep';
    setCurrentViewMode(viewMode);
  }, []);

  const toggleDeveloperMode = () => {
    const newDevMode = !isDeveloperMode;
    setIsDeveloperMode(newDevMode);
    localStorage.setItem('developerMode', newDevMode.toString());
    
    if (!newDevMode) {
      // Exit developer mode, return to original role
      const originalRole = profile?.role || 'sales_rep';
      setCurrentViewMode(originalRole as 'sales_rep' | 'manager');
      localStorage.setItem('viewMode', originalRole);
      onModeChange?.(originalRole as 'sales_rep' | 'manager');
    }
  };

  const switchViewMode = (mode: 'sales_rep' | 'manager' | 'developer') => {
    setCurrentViewMode(mode);
    localStorage.setItem('viewMode', mode);
    onModeChange?.(mode);
  };

  if (!isDeveloperMode) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleDeveloperMode}
        className="fixed top-4 right-4 z-50 bg-black/80 text-white hover:bg-black/90"
      >
        <Code className="h-4 w-4 mr-2" />
        Dev Mode
      </Button>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-black/90 text-white p-2 rounded-lg">
      <Badge variant="destructive" className="animate-pulse">
        <Shield className="h-3 w-3 mr-1" />
        DEV MODE
      </Badge>
      
      <div className="flex gap-1">
        <Button
          variant={currentViewMode === 'sales_rep' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => switchViewMode('sales_rep')}
          className="text-xs"
        >
          Sales Rep
        </Button>
        <Button
          variant={currentViewMode === 'manager' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => switchViewMode('manager')}
          className="text-xs"
        >
          Manager
        </Button>
        <Button
          variant={currentViewMode === 'developer' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => switchViewMode('developer')}
          className="text-xs"
        >
          Developer
        </Button>
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleDeveloperMode}
        className="text-red-400 hover:text-red-300"
      >
        <EyeOff className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default DeveloperModeToggle;
