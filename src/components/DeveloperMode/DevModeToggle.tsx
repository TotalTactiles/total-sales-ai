
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Code, Shield, User, Settings } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const DevModeToggle: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useAuth();
  const [showOptions, setShowOptions] = useState(false);

  // Determine current OS view
  const getCurrentOS = () => {
    if (location.pathname.startsWith('/developer')) return 'developer';
    if (location.pathname.startsWith('/manager')) return 'manager';
    if (location.pathname.startsWith('/sales')) return 'sales';
    return 'unknown';
  };

  const currentOS = getCurrentOS();

  const handleOSSwitch = (targetOS: string) => {
    switch (targetOS) {
      case 'developer':
        navigate('/developer');
        break;
      case 'manager':
        navigate('/manager');
        break;
      case 'sales':
        navigate('/sales');
        break;
    }
    setShowOptions(false);
  };

  const getOSDisplay = (os: string) => {
    switch (os) {
      case 'developer': return { label: 'DEV OS', icon: Code, color: 'bg-slate-800 text-cyan-400' };
      case 'manager': return { label: 'MGR OS', icon: Settings, color: 'bg-blue-800 text-blue-200' };
      case 'sales': return { label: 'SALES OS', icon: User, color: 'bg-green-800 text-green-200' };
      default: return { label: 'OS', icon: Code, color: 'bg-gray-800 text-gray-200' };
    }
  };

  const currentDisplay = getOSDisplay(currentOS);
  const CurrentIcon = currentDisplay.icon;

  return (
    <div className="fixed top-4 right-4 z-50">
      {showOptions ? (
        <div className="bg-black/90 backdrop-blur-sm border border-gray-700 rounded-lg p-3 space-y-2">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-700">
            <Shield className="h-4 w-4 text-cyan-400" />
            <span className="text-white text-sm font-medium">Switch OS View</span>
          </div>
          
          <Button
            onClick={() => handleOSSwitch('developer')}
            variant={currentOS === 'developer' ? 'default' : 'ghost'}
            size="sm"
            className="w-full justify-start text-left"
          >
            <Code className="h-4 w-4 mr-2 text-cyan-400" />
            Developer OS
            {currentOS === 'developer' && <Badge className="ml-auto text-xs">ACTIVE</Badge>}
          </Button>
          
          <Button
            onClick={() => handleOSSwitch('manager')}
            variant={currentOS === 'manager' ? 'default' : 'ghost'}
            size="sm"
            className="w-full justify-start text-left"
          >
            <Settings className="h-4 w-4 mr-2 text-blue-400" />
            Manager OS
            {currentOS === 'manager' && <Badge className="ml-auto text-xs">ACTIVE</Badge>}
          </Button>
          
          <Button
            onClick={() => handleOSSwitch('sales')}
            variant={currentOS === 'sales' ? 'default' : 'ghost'}
            size="sm"
            className="w-full justify-start text-left"
          >
            <User className="h-4 w-4 mr-2 text-green-400" />
            Sales Rep OS
            {currentOS === 'sales' && <Badge className="ml-auto text-xs">ACTIVE</Badge>}
          </Button>
          
          <Button
            onClick={() => setShowOptions(false)}
            variant="outline"
            size="sm"
            className="w-full border-gray-600 text-gray-300"
          >
            Cancel
          </Button>
        </div>
      ) : (
        <Button
          onClick={() => setShowOptions(true)}
          variant="outline"
          size="sm"
          className={`${currentDisplay.color} border-current hover:opacity-80`}
        >
          <CurrentIcon className="h-4 w-4 mr-2" />
          {currentDisplay.label}
        </Button>
      )}
    </div>
  );
};

export default DevModeToggle;
