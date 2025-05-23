
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "sonner";

export interface AIResponse {
  response: string;
  suggestedAction: {
    type: "schedule_call" | "review_script" | "send_email" | "take_break" | "practice_objection";
    details: any;
  };
}

export interface AIAgentParams {
  currentPersona?: {
    name: string;
    tone?: string;
    delivery_style?: string;
  };
  prompt: string;
}

export function useAIAgent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
  const { user } = useAuth();

  const callAIAgent = async ({ currentPersona, prompt }: AIAgentParams) => {
    if (!user?.id) {
      setError("User must be authenticated to use AI Agent");
      toast.error("Authentication required to use AI features");
      return null;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('ai-agent', {
        body: {
          userId: user.id,
          currentPersona,
          prompt
        }
      });

      if (error) {
        console.error("Error calling AI agent:", error);
        setError(error.message || "Error communicating with AI agent");
        toast.error("AI assistant encountered an error");
        return null;
      }

      // Validate response format
      if (!data.response) {
        throw new Error("Invalid response format from AI agent");
      }

      const responseData = data as AIResponse;
      setAiResponse(responseData);
      return responseData;
      
    } catch (err: any) {
      console.error("Exception when calling AI agent:", err);
      setError(err.message || "Unknown error occurred");
      toast.error("Failed to get AI response");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    callAIAgent,
    isLoading,
    error,
    aiResponse,
    resetResponse: () => setAiResponse(null)
  };
}
