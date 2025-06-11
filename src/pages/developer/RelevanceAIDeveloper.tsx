
import React from 'react';
import DeveloperNavigation from '@/components/Navigation/DeveloperNavigation';
import RelevanceAIMonitor from '@/components/Developer/RelevanceAIMonitor';

const RelevanceAIDeveloperPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <DeveloperNavigation />
      
      <main className="pt-[60px]">
        <div className="flex-1 px-4 md:px-6 py-6">
          <div className="max-w-7xl mx-auto">
            <RelevanceAIMonitor />
          </div>
        </div>
      </main>
    </div>
  );
};

export default RelevanceAIDeveloperPage;
