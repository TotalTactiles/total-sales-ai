
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import ManagerNavbar from '@/components/ManagerNavbar';
import ManagerAIBubble from '@/components/ManagerAI/ManagerAIBubble';
import { AIErrorBoundary } from '@/ai/utils/AIErrorBoundary';

const ManagerOS: React.FC = () => {
  const location = useLocation();
  
  // Don't show AI bubble on the AI Assistant page
  const showAIBubble = !location.pathname.includes('/ai-assistant');

  return (
    <div className="min-h-screen bg-slate-50">
      <ManagerNavbar />
      <main className="pt-16">
        <Outlet />
        
        {showAIBubble && (
          <AIErrorBoundary feature="Manager AI Assistant">
            <ManagerAIBubble 
              workspace="manager" 
              context={{ 
                currentPath: location.pathname,
                workspace: 'manager_os'
              }} 
            />
          </AIErrorBoundary>
        )}
      </main>
    </div>
  );
};

export default ManagerOS;
