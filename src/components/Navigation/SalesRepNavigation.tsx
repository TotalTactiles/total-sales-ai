
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Users, 
  Phone, 
  GraduationCap, 
  Brain 
} from 'lucide-react';

const SalesRepNavigation: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { href: '/sales/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/sales/leads', label: 'Leads', icon: Users },
    { href: '/sales/dialer', label: 'Dialer', icon: Phone },
    { href: '/sales/academy', label: 'Academy', icon: GraduationCap },
    { href: '/sales/ai', label: 'AI Assistant', icon: Brain },
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

export default SalesRepNavigation;
