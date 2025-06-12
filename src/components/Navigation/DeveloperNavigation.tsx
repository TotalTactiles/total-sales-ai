
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Brain, 
  Database, 
  Activity, 
  Settings 
} from 'lucide-react';

const DeveloperNavigation: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { href: '/developer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/developer/agents', label: 'Agent Management', icon: Brain },
    { href: '/developer/database', label: 'Database', icon: Database },
    { href: '/developer/monitoring', label: 'Monitoring', icon: Activity },
    { href: '/developer/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="flex items-center gap-4 p-4 bg-white border-b">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.href;
        
        return (
          <Link key={item.href} to={item.href}>
            <Button
              variant={isActive ? 'default' : 'ghost'}
              className="flex items-center gap-2"
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Button>
          </Link>
        );
      })}
    </nav>
  );
};

export default DeveloperNavigation;
