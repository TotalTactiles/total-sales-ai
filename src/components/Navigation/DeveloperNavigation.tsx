
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
    { href: '/developer/system-monitor', label: 'System Monitor', icon: Activity },
    { href: '/developer/ai-brain-logs', label: 'AI Logs', icon: Brain },
    { href: '/developer/api-logs', label: 'API Logs', icon: Database },
    { href: '/developer/error-logs', label: 'Error Logs', icon: Activity },
    { href: '/developer/qa-checklist', label: 'QA Checklist', icon: Activity },
    { href: '/developer/testing-sandbox', label: 'Testing Sandbox', icon: Activity },
    { href: '/developer/version-control', label: 'Version Control', icon: Activity },
    { href: '/developer/crm-integrations', label: 'CRM Integrations', icon: Database },
    { href: '/developer/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="flex items-center gap-4 p-4 bg-slate-800 text-white border-b border-slate-700">
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
