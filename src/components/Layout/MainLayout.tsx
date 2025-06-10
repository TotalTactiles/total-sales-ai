
import React from 'react';
import { useLocation } from 'react-router-dom';
import RelevanceAIBubble from '@/components/RelevanceAI/RelevanceAIBubble';
import { useAuth } from '@/contexts/AuthContext';
import { useAIContext } from '@/contexts/AIContext';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { profile } = useAuth();
  const { workspace, currentLead, isCallActive } = useAIContext();

  // Show Relevance AI bubble on all authenticated pages except auth pages
  const showAIBubble = profile && !location.pathname.includes('/auth');

  return (
    <div className="min-h-screen bg-background">
      {children}
      
      {showAIBubble && (
        <RelevanceAIBubble
          context={{
            workspace,
            currentLead,
            isCallActive
          }}
        />
      )}
    </div>
  );
};

export default MainLayout;
