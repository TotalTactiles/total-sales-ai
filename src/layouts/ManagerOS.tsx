
import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ManagerNavigation from '@/components/Navigation/ManagerNavigation';
import ManagerAIBubble from '@/components/ManagerAI/ManagerAIBubble';
import { AIErrorBoundary } from '@/ai/utils/AIErrorBoundary';
import Dashboard from '@/pages/manager/Dashboard';

const ManagerOS: React.FC = () => {
  const location = useLocation();
  
  // Don't show AI bubble on the AI Assistant page
  const showAIBubble = !location.pathname.includes('/ai-assistant');

  return (
    <div className="min-h-screen bg-slate-50">
      <ManagerNavigation />
      <main className="pt-16">
        <Routes>
          <Route index element={<Navigate to="/manager/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/manager/dashboard" replace />} />
        </Routes>
        
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
