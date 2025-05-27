
import React from 'react';
import VoiceAssistantBubble from './VoiceAssistantBubble';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ContextAwareVoiceAssistantProps {
  currentLead?: any;
  isCallActive?: boolean;
  emailContext?: any;
  smsContext?: any;
  className?: string;
}

const ContextAwareVoiceAssistant: React.FC<ContextAwareVoiceAssistantProps> = ({
  currentLead,
  isCallActive,
  emailContext,
  smsContext,
  className
}) => {
  const location = useLocation();
  const { profile } = useAuth();

  const getContextFromRoute = () => {
    const path = location.pathname;
    
    if (path.includes('dialer')) return 'dialer';
    if (path.includes('lead-workspace')) return 'lead_details';
    if (path.includes('company-brain')) return 'company_brain';
    if (path.includes('analytics')) return 'analytics';
    if (path.includes('leads')) return 'leads';
    if (path.includes('email')) return 'email';
    if (path.includes('sms')) return 'sms';
    if (path.includes('meetings')) return 'meetings';
    if (path.includes('dashboard')) return 'dashboard';
    
    return 'general';
  };

  const getWakeWord = () => {
    const firstName = profile?.full_name?.split(' ')[0] || 'User';
    return `Hey Jarvis`;
  };

  const getWorkspaceData = () => {
    const context = getContextFromRoute();
    
    const baseData = {
      userRole: profile?.role,
      currentRoute: location.pathname,
      timestamp: new Date().toISOString()
    };

    switch (context) {
      case 'dialer':
        return {
          ...baseData,
          currentLead,
          isCallActive,
          callContext: 'active_dialer'
        };
        
      case 'lead_details':
        return {
          ...baseData,
          currentLead,
          leadWorkspace: true
        };
        
      case 'email':
        return {
          ...baseData,
          emailContext,
          currentLead
        };
        
      case 'sms':
        return {
          ...baseData,
          smsContext,
          currentLead
        };
        
      case 'company_brain':
        return {
          ...baseData,
          knowledgeManagement: true
        };
        
      default:
        return baseData;
    }
  };

  return (
    <VoiceAssistantBubble
      context={getContextFromRoute()}
      workspaceData={getWorkspaceData()}
      wakeWord={getWakeWord()}
      className={className}
      position="bottom-right"
    />
  );
};

export default ContextAwareVoiceAssistant;
