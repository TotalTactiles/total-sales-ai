
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Code, 
  Monitor, 
  Brain, 
  Activity, 
  AlertTriangle, 
  CheckSquare, 
  TestTube, 
  GitBranch, 
  Settings,
  LogOut,
  User
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const DeveloperNavigation: React.FC = () => {
  const location = useLocation();
  const { user, profile } = useAuth();
  const [sandboxMode, setSandboxMode] = useState(false);

  const navItems = [
    { href: '/developer', label: 'Dashboard', icon: Monitor },
    { href: '/developer/ai-brain-logs', label: 'AI Brain Logs', icon: Brain },
    { href: '/developer/system-monitor', label: 'System Monitor', icon: Activity },
    { href: '/developer/api-logs', label: 'API Logs', icon: Code },
    { href: '/developer/error-logs', label: 'Error Logs', icon: AlertTriangle },
    { href: '/developer/qa-checklist', label: 'QA Checklist', icon: CheckSquare },
    { href: '/developer/testing-sandbox', label: 'Testing Sandbox', icon: TestTube },
    { href: '/developer/version-control', label: 'Version Control', icon: GitBranch },
    { href: '/developer/settings', label: 'Settings', icon: Settings }
  ];

  const toggleSandboxMode = () => {
    setSandboxMode(!sandboxMode);
  };

  const handleLogout = async () => {
    try {
      window.location.href = '/auth';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-slate-800 border-b border-slate-700 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Code className="h-8 w-8 text-cyan-400" />
              <span className="ml-2 text-xl font-bold text-white">Developer OS</span>
              {sandboxMode && (
                <Badge className="ml-2 bg-orange-500 text-white animate-pulse">
                  SANDBOX MODE
                </Badge>
              )}
            </div>
          </div>

          <div className="hidden md:ml-6 md:flex md:space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'border-cyan-400 text-cyan-400'
                      : 'border-transparent text-slate-300 hover:border-slate-300 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center space-x-4">
            <Button
              onClick={toggleSandboxMode}
              variant={sandboxMode ? "destructive" : "outline"}
              size="sm"
              className="text-white border-slate-600"
            >
              <TestTube className="h-4 w-4 mr-2" />
              {sandboxMode ? 'Exit Sandbox' : 'Sandbox Mode'}
            </Button>

            <div className="flex items-center space-x-2 text-white">
              <User className="h-4 w-4" />
              <span className="text-sm">{profile?.full_name || 'Developer'}</span>
            </div>

            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="text-slate-300 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DeveloperNavigation;
