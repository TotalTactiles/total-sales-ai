
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

  // Show AI assistant in ALL key workspaces as instructed
  const isKeyWorkspace = location.pathname.includes('/dashboard') ||
                        location.pathname.includes('/dialer') || 
                        location.pathname.includes('/sales/dialer') ||
                        location.pathname.includes('/analytics') || 
                        location.pathname.includes('/sales/analytics') ||
                        location.pathname.includes('/leads') ||
                        location.pathname.includes('/sales/leads') ||
                        location.pathname.includes('/ai-agent') ||
                        location.pathname.includes('/tasks') ||
                        location.pathname.includes('/sales/tasks') ||
                        location.pathname.includes('/academy') ||
                        location.pathname.includes('/sales/academy') ||
                        location.pathname.includes('/sales/dashboard');
  
  // Always show ChatBubble when user is authenticated and in key workspaces
  const showChatBubble = profile && !location.pathname.includes('/auth') && isKeyWorkspace;

  return (
    <div className="min-h-screen bg-background">
      {children}
      
      {/* AI Assistant - Always visible in key workspaces */}
      {showChatBubble && <ChatBubble />}
    </div>
  );
};

export default MainLayout;
