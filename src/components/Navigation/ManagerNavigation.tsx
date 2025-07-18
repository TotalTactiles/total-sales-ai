
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Users, 
  Target, 
  BarChart3, 
  MessageSquare,
  Settings,
  LogOut 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const ManagerNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();

  const navItems = [
    { path: '/manager/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/manager/leads', label: 'Leads', icon: Target },
    { path: '/manager/team', label: 'Team Management', icon: Users },
    { path: '/manager/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/manager/chat', label: 'Internal Chat', icon: MessageSquare },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Error signing out');
    }
  };

  return (
    <nav className="w-60 bg-card border-r border-border flex flex-col">
      <div className="p-5">
        <h1 className="text-lg font-bold text-foreground">Manager OS</h1>
      </div>
      
      <div className="flex-1 px-3">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Button
                key={item.path}
                variant={isActive ? 'default' : 'ghost'}
                className="w-full justify-start gap-3 h-10"
                onClick={() => navigate(item.path)}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="p-3 border-t border-border">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </nav>
  );
};

export default ManagerNavigation;
