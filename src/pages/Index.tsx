
import React from 'react';
import Navigation from '@/components/Navigation';
import AIAssistant from '@/components/AIAssistant';
import QuickStats from '@/components/QuickStats';
import LeadQueue from '@/components/LeadQueue';
import PerformanceChart from '@/components/PerformanceChart';
import GameProgress from '@/components/GameProgress';
import TaskSuggestions from '@/components/TaskSuggestions';

const Dashboard = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navigation />
      
      <div className="flex-1 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-1 text-salesBlue">Welcome back, Sam!</h1>
            <p className="text-slate-500">Wednesday, May 22, 2025 • You have 5 high priority leads today</p>
          </div>
          
          <div className="mb-6">
            <QuickStats />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 grid gap-6">
              <PerformanceChart />
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
