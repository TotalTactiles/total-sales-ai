
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Users, 
  Inbox, 
  GraduationCap, 
  Brain,
  BarChart3,
  User,
  Settings,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const SalesRepNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();

  const navItems = [
    { path: '/os/rep/dashboard', label: 'Home', icon: Home },
    { path: '/os/rep/pipeline', label: 'Pipeline', icon: Users },
    { path: '/os/rep/inbox', label: 'Inbox', icon: Inbox },
    { path: '/os/rep/academy', label: 'Academy', icon: GraduationCap },
    { path: '/os/rep/ai-coach', label: 'AI Coach', icon: Brain },
    { path: '/os/rep/performance', label: 'Performance', icon: BarChart3 },
    { path: '/os/rep/profile', label: 'Profile', icon: User },
    { path: '/os/rep/settings', label: 'Settings', icon: Settings },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <nav className="fixed left-0 top-0 h-full w-64 bg-white/70 backdrop-blur-sm border-r border-gray-200 shadow-lg z-50">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-8">Sales Rep OS</h2>
        
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
