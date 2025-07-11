
import React from 'react';
import { useLocation } from 'react-router-dom';
import ChatBubble from '@/components/AI/ChatBubble';
import { useAuth } from '@/contexts/AuthContext';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { profile } = useAuth();

  // Determine assistant type based on current route
  const getAssistantType = () => {
    if (location.pathname.includes('/manager/dashboard')) return 'dashboard';
    if (location.pathname.includes('/manager/business-ops')) return 'business-ops';
    if (location.pathname.includes('/manager/team')) return 'team';
    if (location.pathname.includes('/manager/leads')) return 'leads';
    if (location.pathname.includes('/manager/company-brain')) return 'company-brain';
    return null;
  };

  // Show chat bubble on manager pages only
  const assistantType = getAssistantType();
  const showChatBubble = profile?.role === 'manager' && assistantType;

  return (
    <div className="min-h-screen bg-background">
      {children}
      
      {showChatBubble && (
        <ChatBubble 
          assistantType={assistantType as 'dashboard' | 'business-ops' | 'team' | 'leads' | 'company-brain'}
          enabled={true}
          context={{}}
        />
      )}
    </div>
  );
};

export default MainLayout;
