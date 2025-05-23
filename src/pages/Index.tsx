
import React from 'react';
import Navigation from '@/components/Navigation';
import AIAssistant from '@/components/AIAssistant';
import QuickStats from '@/components/QuickStats';
import LeadQueue from '@/components/LeadQueue';
import PerformanceChart from '@/components/PerformanceChart';
import GameProgress from '@/components/GameProgress';
import TaskSuggestions from '@/components/TaskSuggestions';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Card, CardContent } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeProvider';
import { Info, ArrowRight, Filter, Map, BarChart3, List, Grid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Bell from '@/components/Bell';

const Dashboard = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <div className="flex-1 px-4 md:px-6 py-6 pb-20 md:pb-6">
        <div className="max-w-7xl mx-auto">
          {/* AI Greeting Strip */}
          <div className="mb-6 bg-gradient-to-r from-primary to-dashBlue p-4 rounded-xl text-primary-foreground animate-fade-in shadow-md">
            <div className="flex items-center">
              <span className="text-3xl mr-3 animate-float">👋</span>
              <div>
                <h2 className="text-xl font-semibold">Good morning, Sam!</h2>
                <p className="text-primary-foreground/90">You've got 5 high priority leads and 2 missions today. Your conversion rate is up 15% this week!</p>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Today's Dashboard</h1>
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
                
                {/* Filter Button */}
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                </Button>
                
                {/* Notification Feed Toggle */}
                <button className="bg-card p-2 rounded-lg shadow-sm border border-border flex items-center gap-2 hover:bg-accent/50 transition-colors">
                  <span className="relative">
                    <Bell />
                    <span className="absolute -top-1 -right-1 bg-dashRed rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold text-white">
                      3
                    </span>
                  </span>
                  <span className="hidden md:inline text-sm font-medium">Notifications</span>
                </button>
              </div>
            </div>
            
            <QuickStats />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 grid gap-6">
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-semibold">Weekly Performance</h2>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground bg-card py-1 px-2 rounded-full shadow-sm cursor-help">
                        <Info className="h-3.5 w-3.5" />
                        <span>Why This Matters</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>This tracks your daily activity and success rate. Higher conversion patterns early in the week correlate with 37% better monthly outcomes.</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Card className="p-4">
                  <CardContent className="p-0">
                    <PerformanceChart />
                  </CardContent>
                </Card>
              </div>
              <TaskSuggestions />
            </div>
            
            <div className="space-y-6">
              <LeadQueue />
              <GameProgress />
            </div>
          </div>
        </div>
      </div>
      
      <AIAssistant />
    </div>
  );
};

export default Dashboard;
