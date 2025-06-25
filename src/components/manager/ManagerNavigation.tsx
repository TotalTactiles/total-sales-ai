
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  UserPlus, 
  Target,
  Brain,
  FileText,
  Activity,
  Settings,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const ManagerNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();

  const navItems = [
    { path: '/manager/overview', label: 'Overview', icon: LayoutDashboard },
    { path: '/manager/rep-performance', label: 'Rep Performance', icon: Users },
    { path: '/manager/kpi-tracker', label: 'KPI Tracker', icon: BarChart3 },
    { path: '/manager/lead-management', label: 'Lead Management', icon: UserPlus },
    { path: '/manager/conversions', label: 'Conversions', icon: Target },
    { path: '/manager/ai-assistant', label: 'AI Assistant', icon: Brain },
    { path: '/manager/notes', label: 'Notes', icon: FileText },
    { path: '/manager/activity-log', label: 'Activity Log', icon: Activity },
    { path: '/manager/settings', label: 'Settings', icon: Settings },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <nav className="fixed left-0 top-0 h-full w-64 bg-white/70 backdrop-blur-sm border-r border-gray-200 shadow-lg z-50">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-8">Manager OS</h2>
        
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

export default ManagerNavigation;
