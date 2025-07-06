
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Users, 
  Phone, 
  BarChart3, 
  Brain,
  Settings,
  Target,
  GraduationCap,
  Zap
} from 'lucide-react';

const SalesNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/sales/dashboard', label: 'Dashboard', icon: Home },
    { path: '/sales/leads', label: 'Lead Management', icon: Users },
    { path: '/sales/ai-agent', label: 'AI Agent', icon: Brain },
    { path: '/sales/dialer', label: 'Dialer', icon: Phone },
    { path: '/sales/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/sales/academy', label: 'Academy', icon: GraduationCap },
    { path: '/sales/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="fixed left-0 top-0 h-full w-64 bg-white/95 backdrop-blur-sm border-r border-gray-200 shadow-lg z-50">
      <div className="p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Sales OS</h2>
          <p className="text-sm text-gray-500">v2.1</p>
        </div>
        
        <div className="space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Button
                key={item.path}
                variant={isActive ? 'default' : 'ghost'}
                className={`w-full justify-start gap-3 ${
                  isActive ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'hover:bg-gray-100'
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

export default SalesNavigation;
