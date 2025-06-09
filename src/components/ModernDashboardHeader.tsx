
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Bell, Settings, Search, Calendar, Plus, Filter } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

interface ModernDashboardHeaderProps {
  userName: string;
  greeting?: string;
  notifications?: number;
}

const ModernDashboardHeader: React.FC<ModernDashboardHeaderProps> = ({
  userName,
  greeting = "What are your plans for today?",
  notifications = 3
}) => {
  return (
    <div className="space-y-6">
      {/* Main Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Hi, {userName}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">{greeting}</p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon">
            <Search className="h-4 w-4" />
          </Button>
          
          <div className="relative">
            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                {notifications}
              </span>
            )}
          </div>
          
          <ThemeToggle />
          
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Quick Actions Row */}
      <div className="flex items-center gap-3">
        <Button variant="pill" className="gap-2">
          <Plus className="h-4 w-4" />
          New Lead
        </Button>
        
        <Button variant="outline" className="gap-2">
          <Calendar className="h-4 w-4" />
          Schedule Call
        </Button>
        
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
        
        <div className="ml-auto">
          <Button variant="info" size="sm">
            Upgrade Plan
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModernDashboardHeader;
