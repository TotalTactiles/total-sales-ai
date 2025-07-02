
import React from 'react';
import { aiConfig, generateMockAIResponse } from '@/config/ai';
import { Brain, Sparkles } from 'lucide-react';

interface AIGreetingProps {
  userName: string;
  streak?: number;
  className?: string;
}

const AIGreeting: React.FC<AIGreetingProps> = ({ userName, streak, className = '' }) => {
  const greeting = aiConfig.enabled 
    ? generateMockAIResponse('sales') 
    : `Good morning, ${userName}! Your AI assistant has analyzed today's priorities and identified 5 high-value opportunities requiring immediate attention.`;

  const performanceTip = aiConfig.enabled
    ? generateMockAIResponse('generic')
    : `Your conversion rate improved by 23% this week! ${streak ? `Your ${streak}-day streak shows exceptional consistency.` : 'Ready to make some calls?'}`;

  return (
    <div className={`bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white shadow-lg ${className}`}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Brain className="h-6 w-6 text-white" />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-xl font-semibold">AI Daily Briefing</h2>
            <Sparkles className="h-4 w-4 text-yellow-300" />
            {!aiConfig.enabled && (
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Demo Mode</span>
            )}
          </div>
          <p className="text-blue-100 mb-3 leading-relaxed">
            {greeting}
          </p>
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-sm font-medium text-white">
              <strong>Performance Insight:</strong> {performanceTip}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIGreeting;
