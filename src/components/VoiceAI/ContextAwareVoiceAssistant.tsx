
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import VoiceAssistantBubble from './VoiceAssistantBubble';
import UnifiedAIAssistant from '@/components/UnifiedAI/UnifiedAIAssistant';
import { useAuth } from '@/contexts/AuthContext';

interface ContextAwareVoiceAssistantProps {
  currentLead?: any;
  isCallActive?: boolean;
  emailContext?: {
    to?: string;
    subject?: string;
    thread?: any[];
  };
  smsContext?: {
    phoneNumber?: string;
    conversation?: any[];
  };
}

const ContextAwareVoiceAssistant: React.FC<ContextAwareVoiceAssistantProps> = ({
  currentLead,
  isCallActive,
  emailContext,
  smsContext
}) => {
  const location = useLocation();
  const { user, profile } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeMode, setActiveMode] = useState<'voice' | 'chat'>('voice');

  // Determine workspace context from current route
  const getWorkspaceContext = () => {
    const path = location.pathname;
    
    if (path.includes('/dialer')) {
      return 'dialer';
    } else if (path.includes('/lead-management') || path.includes('/lead/')) {
      return 'lead_details';
    } else if (path.includes('/email')) {
      return 'email';
    } else if (path.includes('/sms')) {
      return 'sms';
    } else if (path.includes('/company-brain')) {
      return 'company_brain';
    } else if (path.includes('/dashboard')) {
      return 'dashboard';
    } else {
      return 'general';
    }
  };

  const workspaceContext = getWorkspaceContext();

  // Determine assistant name based on user profile
  const getAssistantName = () => {
    if (profile?.ai_assistant_name) {
      return profile.ai_assistant_name;
    }
    return 'SalesOS AI';
  };

  const aiContext = {
    workspace: workspaceContext as any,
    currentLead,
    isCallActive,
    emailContext,
    smsContext
  };

  const handleAction = (action: string, data?: any) => {
    console.log('AI Action:', action, data);
    // Handle various AI actions based on the action type
    switch (action) {
      case 'initiate_call':
        // Navigate to dialer or initiate call
        break;
      case 'draft_email':
        // Open email composer
        break;
      case 'show_objection_scripts':
        // Show objection handling scripts
        break;
      default:
        console.log('Unhandled action:', action);
    }
  };

  const toggleMode = () => {
    setActiveMode(prev => prev === 'voice' ? 'chat' : 'voice');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Voice Assistant Bubble */}
      {activeMode === 'voice' && (
        <VoiceAssistantBubble
          context={workspaceContext}
          workspaceData={{
            currentLead,
            isCallActive,
            emailContext,
            smsContext
          }}
          wakeWord={`Hey ${getAssistantName()}`}
          position="bottom-right"
        />
      )}

      {/* Unified AI Assistant */}
      {activeMode === 'chat' && (
        <UnifiedAIAssistant
          context={aiContext}
          onAction={handleAction}
        />
      )}

      {/* Mode Toggle Button */}
      <div className="absolute -top-12 right-0">
        <button
          onClick={toggleMode}
          className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full px-3 py-1 text-xs font-medium text-gray-600 hover:bg-white hover:text-gray-900 transition-all duration-200 shadow-sm"
        >
          {activeMode === 'voice' ? '💬 Chat' : '🎤 Voice'}
        </button>
      </div>
    </div>
  );
};

export default ContextAwareVoiceAssistant;
