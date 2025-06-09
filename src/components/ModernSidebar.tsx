
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Grid, 
  Users, 
  Phone, 
  BarChart3, 
  GraduationCap, 
  Settings, 
  Brain,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Logo from '@/components/Logo';

interface SidebarProps {
  className?: string;
}

const ModernSidebar: React.FC<SidebarProps> = ({ className }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', href: '/sales/dashboard', icon: Grid },
    { label: 'Leads', href: '/sales/lead-management', icon: Users },
    { label: 'Dialer', href: '/sales/dialer', icon: Phone },
    { label: 'AI Agent', href: '/sales/ai', icon: Brain },
    { label: 'Analytics', href: '/sales/analytics', icon: BarChart3 },
    { label: 'Academy', href: '/sales/academy', icon: GraduationCap },
    { label: 'Settings', href: '/sales/settings', icon: Settings },
  ];

  return (
    <div className={cn(
      "bg-card border-r border-border transition-all duration-300 flex flex-col shadow-soft",
      isCollapsed ? "w-16" : "w-64",
      className
    )}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          {!isCollapsed && <Logo />}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = location.pathname === item.href ||
            (item.href.includes('dashboard') && location.pathname === '/sales') ||
            (item.href.includes('lead-management') && location.pathname.includes('lead-management'));
          
          return (
            <Link
              key={item.label}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group",
                isActive
                  ? "gradient-lavender text-white shadow-card"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <IconComponent className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && (
                <span className="font-medium text-sm">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className={cn(
          "flex items-center gap-3 p-3 rounded-xl bg-lavender-50",
          isCollapsed ? "justify-center" : ""
        )}>
          <div className="w-8 h-8 rounded-full gradient-lavender flex items-center justify-center">
            <Brain className="h-4 w-4 text-white" />
          </div>
          {!isCollapsed && (
            <div className="flex-1">
              <p className="text-xs font-medium text-lavender-700">AI Assistant</p>
              <p className="text-xs text-lavender-600">Always learning</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModernSidebar;
