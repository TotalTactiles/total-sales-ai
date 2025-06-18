
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import MobileNavigation from '@/components/Navigation/MobileNavigation';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  children,
  title,
  subtitle,
  actions
}) => {
  const { profile } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b md:hidden">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <MobileNavigation />
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xs">
                T
              </div>
              <span className="font-semibold">TSAM</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {profile && (
              <Badge variant="secondary" className="text-xs">
                {profile.role.replace('_', ' ')}
              </Badge>
            )}
            <Button variant="ghost" size="sm" className="relative p-2">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                3
              </span>
            </Button>
          </div>
        </div>
        
        {title && (
          <div className="px-4 pb-4">
            <h1 className="text-xl font-bold">{title}</h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
        )}
      </header>

      {/* Desktop Header */}
      <header className="hidden md:block sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                T
              </div>
              <span className="font-bold text-lg">TSAM</span>
            </div>
            
            {title && (
              <div>
                <h1 className="text-xl font-bold">{title}</h1>
                {subtitle && (
                  <p className="text-sm text-muted-foreground">{subtitle}</p>
                )}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            {actions}
            {profile && (
              <div className="flex items-center gap-3">
                <Badge variant="secondary">
                  {profile.role.replace('_', ' ')}
                </Badge>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center font-medium">
                    {profile.full_name?.charAt(0) || 'U'}
                  </div>
                  <span className="text-sm font-medium">{profile.full_name}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6 md:px-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default ResponsiveLayout;
