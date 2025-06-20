
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Settings, 
  Monitor, 
  Brain, 
  Database, 
  AlertTriangle, 
  CheckSquare, 
  TestTube,
  GitBranch,
  Building2,
  Activity,
  FileText,
  Zap
} from 'lucide-react';
import Logo from '@/components/Logo';
import UserProfile from '@/components/UserProfile';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';

const DeveloperNavigation = () => {
  const location = useLocation();
  const { profile } = useAuth();

  const navItems = [
    { label: 'Dashboard', href: '/developer/dashboard', icon: BarChart3 },
    { label: 'Brain Monitor', href: '/developer/brain-monitor', icon: Zap },
    { label: 'System Monitor', href: '/developer/system-monitor', icon: Monitor },
    { label: 'Agent Health', href: '/developer/agent-health', icon: Brain },
    { label: 'API Logs', href: '/developer/api-logs', icon: Database },
    { label: 'Error Logs', href: '/developer/error-logs', icon: AlertTriangle },
    { label: 'AI Monitor', href: '/developer/ai-monitor', icon: Activity },
    { label: 'Users', href: '/developer/users', icon: CheckSquare },
    { label: 'System Health', href: '/developer/system', icon: TestTube },
    { label: 'Settings', href: '/developer/settings', icon: Settings },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-800 border-b border-slate-700 shadow-sm">
      <div className="h-[60px] flex items-center justify-between px-4 lg:px-6">
        {/* Left side - Logo and role indicator */}
        <div className="flex items-center space-x-2 min-w-0">
          <Logo />
          <div className="hidden sm:flex items-center space-x-1 text-sm text-slate-300">
            <Building2 className="h-4 w-4" />
            <span className="my-[8px] mx-[8px]">Developer</span>
          </div>
        </div>

        {/* Center - Navigation Icons */}
        <nav className="flex items-center space-x-1 sm:space-x-2 flex-1 justify-center max-w-4xl overflow-x-auto">
          {navItems.map(item => {
            const IconComponent = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.label}
                to={item.href}
                className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-md transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
                title={item.label}
              >
                <IconComponent className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            );
          })}
        </nav>

        {/* Right side - Theme toggle and user profile */}
        <div className="flex items-center space-x-2 lg:space-x-4 min-w-0">
          <ThemeToggle />
          <UserProfile 
            name={profile?.full_name || "Developer"} 
            role="Developer" 
          />
        </div>
      </div>
    </header>
  );
};

export default DeveloperNavigation;
