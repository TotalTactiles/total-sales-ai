
import React from 'react';
import { useLocation } from 'react-router-dom';
import EnhancedRelevanceAIBubble from '@/components/RelevanceAI/EnhancedRelevanceAIBubble';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { useAIContext } from '@/contexts/AIContext';
import { useRelevanceAITriggers } from '@/hooks/useRelevanceAITriggers';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { profile } = useAuth();
  const { workspace, currentLead, isCallActive, callDuration } = useAIContext();
  
  // Initialize real-time triggers
  useRelevanceAITriggers();

  // Show enhanced Relevance AI bubble on all authenticated pages except auth pages
  const showAIBubble = profile && !location.pathname.includes('/auth');

  return (
    <div className="min-h-screen bg-background">
      {children}
      
      {showAIBubble && (
        <EnhancedRelevanceAIBubble
          context={{
            workspace,
            currentLead,
            isCallActive,
            callDuration
          }}
        />
      )}
    </div>
  );
};

export default MainLayout;
