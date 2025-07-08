
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

  // Show chat bubble on all authenticated pages except auth pages
  const showChatBubble = profile && !location.pathname.includes('/auth');

  return (
    <div className="min-h-screen bg-background">
      {children}
      
      {showChatBubble && <ChatBubble />}
    </div>
  );
};

export default MainLayout;
