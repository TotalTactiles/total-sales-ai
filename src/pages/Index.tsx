
import React from 'react';
import Navigation from '@/components/Navigation';
import AIAssistant from '@/components/AIAssistant';
import QuickStats from '@/components/QuickStats';
import LeadQueue from '@/components/LeadQueue';
import PerformanceChart from '@/components/PerformanceChart';
import GameProgress from '@/components/GameProgress';
import TaskSuggestions from '@/components/TaskSuggestions';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import Bell from '@/components/Bell';

const Dashboard = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navigation />
      
      <div className="flex-1 px-4 md:px-6 py-6">
        <div className="max-w-7xl mx-auto">
          {/* AI Greeting Strip */}
          <div className="mb-6 bg-gradient-to-r from-salesBlue to-salesCyan p-4 rounded-lg text-white animate-fade-in shadow-md">
            <div className="flex items-center">
              <span className="text-3xl mr-3">👋</span>
              <div>
                <h2 className="text-xl font-semibold">Good morning, Sam!</h2>
                <p className="text-white/90">You've got 5 high priority leads and 2 missions today. Your conversion rate is up 15% this week!</p>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-salesBlue">Today's Dashboard</h1>
                <p className="text-slate-500">Wednesday, May 22, 2025 • You have 5 high priority leads today</p>
              </div>
              
              {/* Notification Feed Toggle */}
              <button className="bg-white p-2 rounded-lg shadow-sm border border-slate-200 flex items-center gap-2 hover:bg-slate-50 transition-colors">
                <span className="relative">
                  <Bell />
                  <span className="absolute -top-1 -right-1 bg-salesRed rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold text-white">
                    3
                  </span>
                </span>
                <span className="hidden md:inline text-sm font-medium">Notifications</span>
              </button>
            </div>
            
            <QuickStats />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 grid gap-6">
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-semibold text-salesBlue">Weekly Performance</h2>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1 text-xs text-slate-500 bg-white py-1 px-2 rounded-full shadow-sm cursor-help">
                        <Info className="h-3.5 w-3.5" />
                        <span>Why This Matters</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>This tracks your daily activity and success rate. Higher conversion patterns early in the week correlate with 37% better monthly outcomes.</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <PerformanceChart />
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
