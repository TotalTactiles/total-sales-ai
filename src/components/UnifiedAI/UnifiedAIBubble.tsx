
import React from 'react';
import EnhancedUnifiedAIBubble from './EnhancedUnifiedAIBubble';

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

// Wrapper component to maintain backward compatibility
const UnifiedAIBubble: React.FC<UnifiedAIBubbleProps> = ({ context, className }) => {
  return <EnhancedUnifiedAIBubble context={context} className={className} />;
};

export default UnifiedAIBubble;
