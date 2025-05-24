
import React from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Brain, Grid, Map, BarChart3, Filter } from 'lucide-react';
import Bell from '@/components/Bell';

interface DashboardHeaderProps {
  aiSummaryEnabled: boolean;
  setAiSummaryEnabled: (enabled: boolean) => void;
  isFullUser: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  aiSummaryEnabled, 
  setAiSummaryEnabled, 
  isFullUser 
}) => {
  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Sales Dashboard</h1>
          <p className="text-muted-foreground">Wednesday, May 22, 2025 • You have 5 high priority leads today</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Tabs defaultValue="dashboard" className="hidden md:flex">
            <TabsList>
              <TabsTrigger value="dashboard" className="flex gap-1 items-center">
                <Grid className="h-4 w-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="map" className="flex gap-1 items-center">
                <Map className="h-4 w-4" />
                Map View
              </TabsTrigger>
              <TabsTrigger value="statistics" className="flex gap-1 items-center">
                <BarChart3 className="h-4 w-4" />
                Statistics
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
          
          <button className="bg-card p-2 rounded-lg shadow-sm border border-border flex items-center gap-2 hover:bg-accent/50 transition-colors">
            <span className="relative">
              <Bell />
              <span className="absolute -top-1 -right-1 bg-dashRed rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold text-white">
                3
              </span>
            </span>
            <span className="hidden md:inline text-sm font-medium">Notifications</span>
          </button>

          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium">AI Summary</span>
            <Switch 
              checked={aiSummaryEnabled} 
              onCheckedChange={setAiSummaryEnabled}
            />
          </div>
          
          {!isFullUser && (
            <Button 
              variant="destructive"
              onClick={() => {
                localStorage.removeItem('demoMode');
                localStorage.removeItem('demoRole');
                localStorage.removeItem('userStatus');
                localStorage.removeItem('planType');
                window.location.href = '/auth';
              }}
            >
              Exit Demo
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
