
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  Activity,
  Brain,
  LogOut,
  Code,
  Zap,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const DeveloperNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();

  const navItems = [
    { path: '/developer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/developer/logs', label: 'TSAM Logs', icon: FileText },
    { path: '/developer/flags', label: 'Feature Flags', icon: Settings },
    { path: '/developer/system-updates', label: 'System Updates', icon: Activity },
    { path: '/developer/tsam-brain', label: 'TSAM Brain (JARVIS)', icon: Brain },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <nav className="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white shadow-lg z-50">
      <div className="p-6">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-green-400">Developer OS</h2>
          <p className="text-sm text-gray-400">TSAM Development</p>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-400">JARVIS Active</span>
          </div>
        </div>
        
        <div className="space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Button
                key={item.path}
                variant={isActive ? 'default' : 'ghost'}
                className={`w-full justify-start gap-3 ${
                  isActive 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'hover:bg-gray-800 text-gray-300'
                }`}
                onClick={() => navigate(item.path)}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            );
          })}
        </div>

        <div className="absolute bottom-6 left-6 right-6">
          <Button
            variant="outline"
            className="w-full justify-start gap-3 text-red-400 border-red-400 hover:bg-red-900/20"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default DeveloperNavigation;
