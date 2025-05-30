
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AIAgentResponse {
  response: string;
  suggestedAction?: {
    type: string;
    data?: any;
  };
}

interface AIAgentRequest {
  prompt: string;
  context?: any;
  leadId?: string;
}

export const useAIAgent = () => {
  const [isLoading, setIsLoading] = useState(false);

  const callAIAgent = async (request: AIAgentRequest): Promise<AIAgentResponse | null> => {
    setIsLoading(true);
    
    try {
      console.log('Calling AI Agent with request:', request);

      // Mock AI response for now - in production this would call the AI service
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockResponse: AIAgentResponse = {
        response: "I understand you'd like me to help with that. Based on the context, I suggest we focus on the highest priority lead first.",
        suggestedAction: {
          type: 'highlight_lead',
          data: { leadId: request.leadId }
        }
      };

      console.log('AI Agent response:', mockResponse);
      return mockResponse;

    } catch (error) {
      console.error('AI Agent error:', error);
      toast.error('Failed to get AI response');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    callAIAgent,
    isLoading
  };
};
