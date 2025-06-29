
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Users, 
  User,
  Activity,
  Brain,
  Settings,
  LogOut,
  Target
} from 'lucide-react';
import { useOptimizedLogout } from '@/utils/logoutOptimizer';

const SalesRepNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useOptimizedLogout();

  // Prefetch auth page for faster logout
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = '/auth';
    document.head.appendChild(link);
    
    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);

  const navItems = [
    { path: '/sales/dashboard', label: 'Dashboard', icon: Home },
    { path: '/sales/leads', label: 'My Leads', icon: Users },
    { path: '/sales/activity', label: 'Activity', icon: Activity },
    { path: '/sales/ai-insights', label: 'AI Insights', icon: Brain },
    { path: '/sales/profile', label: 'Profile', icon: User },
  ];

  const handleSignOut = () => {
    logout();
  };

  return (
    <nav className="fixed left-0 top-0 h-full w-64 bg-white/70 backdrop-blur-sm border-r border-gray-200 shadow-lg z-50">
      <div className="p-6">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900">Sales Rep OS</h2>
          <p className="text-sm text-gray-600">TSAM Sales</p>
        </div>
        
        <div className="space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Button
                key={item.path}
                variant={isActive ? 'default' : 'ghost'}
                className={`w-full justify-start gap-3 ${
                  isActive ? 'bg-blue-600 hover:bg-blue-700' : 'hover:bg-gray-100'
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
            className="w-full justify-start gap-3 text-red-600 border-red-200 hover:bg-red-50"
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

export default SalesRepNavigation;
