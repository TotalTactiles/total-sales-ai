
import React from 'react';
import Navigation from '@/components/Navigation';
import AIBrainMonitor from '@/components/AIBrain/AIBrainMonitor';

const CompanyBrain = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navigation />
      
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <AIBrainMonitor />
        </div>
      </div>
    </div>
  );
};

export default CompanyBrain;
