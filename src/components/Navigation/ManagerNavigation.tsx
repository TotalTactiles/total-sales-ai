
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  Target,
  Brain,
  FileText,
  Activity,
  Settings,
  TrendingUp,
  Shield
} from 'lucide-react';

const ManagerNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/manager/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/manager/business-ops', label: 'Business Ops', icon: TrendingUp },
    { path: '/manager/team', label: 'Team Management', icon: Users },
    { path: '/manager/leads', label: 'Lead Management', icon: Target },
    { path: '/manager/ai', label: 'AI Assistant', icon: Brain },
    { path: '/manager/company-brain', label: 'Company Brain', icon: FileText },
    { path: '/manager/security', label: 'Security', icon: Shield },
    { path: '/manager/reports', label: 'Reports', icon: BarChart3 },
    { path: '/manager/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="fixed left-0 top-0 h-full w-64 bg-white/95 backdrop-blur-sm border-r border-gray-200 shadow-lg z-50">
      <div className="p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-blue-900">Manager OS</h2>
          <p className="text-sm text-blue-600">v2.1</p>
        </div>
        
        <div className="space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Button
                key={item.path}
                variant={isActive ? 'default' : 'ghost'}
                className={`w-full justify-start gap-3 ${
                  isActive ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'hover:bg-blue-50'
                }`}
                onClick={() => navigate(item.path)}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default ManagerNavigation;
