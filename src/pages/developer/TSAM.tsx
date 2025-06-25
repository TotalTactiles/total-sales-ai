
import React, { useState } from 'react';
import TSAMLayout from '@/components/Developer/TSAMLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Brain, Send, Zap, AlertTriangle, TrendingUp } from 'lucide-react';
import { useTSAM } from '@/hooks/useTSAM';

const TSAMPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [conversation, setConversation] = useState<Array<{
    type: 'user' | 'tsam';
    content: string;
    timestamp: Date;
  }>>([]);
  const { isDeveloper, ingestEvent } = useTSAM();

  if (!isDeveloper) {
    return <div>Access Denied</div>;
  }

  const quickPrompts = [
    "What part of the system is causing the most latency?",
    "Which AI agents are underperforming?", 
    "Suggest a patch to reduce cold start times.",
    "What are the most common user pain points?",
    "Show me optimization opportunities."
  ];

  const handleQuickPrompt = async (prompt: string) => {
    setQuery(prompt);
    await handleSubmit(prompt);
  };

  const handleSubmit = async (promptText?: string) => {
    const submitQuery = promptText || query;
    if (!submitQuery.trim()) return;

    // Add user message
    const userMessage = {
      type: 'user' as const,
      content: submitQuery,
      timestamp: new Date()
    };
    setConversation(prev => [...prev, userMessage]);

    // Ingest the query for learning
    await ingestEvent({
      type: 'tsam_query',
      metadata: { query: submitQuery },
      priority: 'medium'
    });

    // Mock TSAM response (in real implementation, this would call your AI service)
    setTimeout(() => {
      const mockResponse = generateMockResponse(submitQuery);
      const tsamMessage = {
        type: 'tsam' as const,
        content: mockResponse,
        timestamp: new Date()
      };
      setConversation(prev => [...prev, tsamMessage]);
    }, 1500);

    setQuery('');
  };

  const generateMockResponse = (query: string): string => {
    if (query.toLowerCase().includes('latency')) {
      return `🔍 **System Latency Analysis**

I've detected several latency bottlenecks:

1. **Database Queries**: The lead management queries are taking 340ms avg (should be <100ms)
   - *Suggested Fix*: Add index on \`leads.created_at\` and \`leads.company_id\`
   
2. **AI Agent Processing**: Sales agent responses averaging 1.2s
   - *Suggested Fix*: Implement response caching for common queries

3. **Frontend Bundle Size**: Main chunk is 2.3MB (recommended <1MB)
   - *Suggested Fix*: Code splitting and lazy loading for dashboard components

**Priority**: High - These fixes could improve overall performance by 45%`;
    }

    if (query.toLowerCase().includes('underperforming')) {
      return `📊 **AI Agent Performance Analysis**

Current agent performance metrics:

**Underperforming Agents**:
- Sales Assistant: 68% success rate (target: 85%)
- Lead Qualifier: 72% accuracy (target: 90%)

**Top Performing Agents**:
- Email Generator: 94% success rate ✅
- Meeting Scheduler: 91% success rate ✅

**Recommendations**:
1. Retrain sales assistant with recent successful interactions
2. Update lead qualification criteria based on latest conversion data
3. Implement A/B testing for agent responses`;
    }

    return `🧠 **TSAM Analysis Complete**

I've processed your query and identified several optimization opportunities:

- **System Performance**: Currently operating at 89% efficiency
- **User Experience**: 0.3% bounce rate detected in onboarding flow  
- **Resource Usage**: Memory utilization optimal at 67%

**Next Steps**:
1. Review suggested optimizations in the AI Suggestions tab
2. Consider implementing feature flags for gradual rollouts
3. Monitor real-time metrics for impact assessment

Would you like me to dive deeper into any specific area?`;
  };

  return (
    <TSAMLayout title="TSAM - Master AI Brain">
      <div className="max-w-4xl mx-auto">
        {/* TSAM Orb */}
        <div className="flex flex-col items-center mb-8">
          <button className="relative rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 p-8 shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 group">
            <Brain className="w-16 h-16 text-white animate-pulse" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 opacity-0 group-hover:opacity-20 transition-opacity"></div>
          </button>
          <h2 className="text-2xl font-bold text-white mt-4 mb-2">TSAM AI Brain</h2>
          <p className="text-gray-400 text-center max-w-md">
            Your intelligent system optimization assistant. Ask me anything about performance, bugs, or improvements.
          </p>
        </div>

        {/* Quick Prompts */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {quickPrompts.map((prompt, index) => (
            <Button
              key={index}
              variant="outline"
              onClick={() => handleQuickPrompt(prompt)}
              className="border-purple-500/30 text-gray-300 hover:bg-purple-500/10 hover:border-purple-400 text-sm"
            >
              {prompt}
            </Button>
          ))}
        </div>

        {/* Conversation */}
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 mb-6 min-h-[400px] max-h-[600px] overflow-y-auto">
          {conversation.length === 0 ? (
            <div className="text-center py-16">
              <Brain className="w-12 h-12 text-purple-400 mx-auto mb-4 opacity-50" />
              <p className="text-gray-400">Start a conversation with TSAM by asking a question or using the prompts above.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {conversation.map((message, index) => (
                <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800 text-gray-100'
                  }`}>
                    <div className="flex items-start gap-3">
                      {message.type === 'tsam' && (
                        <Brain className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                      )}
                      <div>
                        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                          {message.content}
                        </pre>
                        <p className="text-xs opacity-70 mt-2">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input */}
        <div className="flex gap-3">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask TSAM about system performance, bugs, or optimizations..."
            className="flex-1 bg-white/10 border-gray-600 text-white placeholder-gray-400"
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
          <Button 
            onClick={() => handleSubmit()}
            disabled={!query.trim()}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </TSAMLayout>
  );
};

export default TSAMPage;
