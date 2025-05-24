
import React from 'react';
import ContextAwareAIBubble from './ContextAwareAIBubble';

interface AIContext {
  workspace: 'dashboard' | 'dialer' | 'lead_details' | 'email' | 'sms' | 'notes' | 'meetings' | 'company_brain' | 'agent_missions' | 'leads';
  currentLead?: any;
  isCallActive?: boolean;
  callDuration?: number;
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

interface UnifiedAIBubbleProps {
  context: AIContext;
  className?: string;
}

// Updated wrapper component to use the new context-aware AI bubble
const UnifiedAIBubble: React.FC<UnifiedAIBubbleProps> = ({ context, className }) => {
  return <ContextAwareAIBubble context={context} className={className} />;
};

export default UnifiedAIBubble;
