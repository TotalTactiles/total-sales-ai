
import React, { useState } from 'react';
import TSAMLayout from '@/components/Developer/TSAMLayout';
import AIInsightBox from '@/components/Developer/AIInsightBox';
import { Button } from '@/components/ui/button';
import { Brain, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const AISuggestionsPage: React.FC = () => {
  const { profile } = useAuth();
  const [suggestions, setSuggestions] = useState([
    {
      id: '1',
      type: 'suggestion' as const,
      title: 'Database Query Optimization',
      description: 'Lead management queries are taking 340ms average. Adding indexes on created_at and company_id could reduce this to <100ms.',
      priority: 'high' as const,
      action: {
        label: 'Apply Database Fix',
        handler: () => handleApplyFix('1')
      }
    },
    {
      id: '2',
      type: 'warning' as const,
      title: 'Memory Usage Alert',
      description: 'AI agent memory consumption is 78% above normal baseline. Consider implementing response caching.',
      priority: 'medium' as const,
      action: {
        label: 'Implement Caching',
        handler: () => handleApplyFix('2')
      }
    },
    {
      id: '3',
      type: 'suggestion' as const,
      title: 'Frontend Bundle Optimization',
      description: 'Main JavaScript bundle is 2.3MB. Code splitting could reduce initial load time by 45%.',
      priority: 'medium' as const,
      action: {
        label: 'Apply Code Splitting',
        handler: () => handleApplyFix('3')
      }
    },
    {
      id: '4',
      type: 'error' as const,
      title: 'API Rate Limiting',
      description: 'External API calls are approaching rate limits. Implement exponential backoff strategy.',
      priority: 'critical' as const,
      action: {
        label: 'Fix Rate Limiting',
        handler: () => handleApplyFix('4')
      }
    }
  ]);

  const isDeveloper = profile?.role === 'developer';

  if (!isDeveloper) {
    return <div>Access Denied</div>;
  }

  function handleApplyFix(id: string) {
    // In a real implementation, this would trigger the actual fix
    console.log('Applying fix for suggestion:', id);
    
    // Remove the suggestion after applying
    setSuggestions(prev => prev.filter(s => s.id !== id));
    
    // You could also show a success message here
  }

  const handleDismiss = (id: string) => {
    setSuggestions(prev => prev.filter(s => s.id !== id));
  };

  const handleRefresh = () => {
    // In a real implementation, this would fetch new suggestions from TSAM
    console.log('Refreshing AI suggestions...');
  };

  const criticalCount = suggestions.filter(s => s.priority === 'critical').length;
  const highCount = suggestions.filter(s => s.priority === 'high').length;

  return (
    <TSAMLayout title="AI Suggestions">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Brain className="h-8 w-8 text-purple-400" />
            <div>
              <h2 className="text-2xl font-bold text-white">TSAM AI Suggestions</h2>
              <p className="text-gray-400">
                {suggestions.length} active suggestions • {criticalCount} critical • {highCount} high priority
              </p>
            </div>
          </div>
          <Button onClick={handleRefresh} variant="outline" className="border-purple-500 text-purple-300">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {suggestions.length === 0 ? (
          <div className="text-center py-16">
            <Brain className="h-16 w-16 text-purple-400 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold text-white mb-2">All Caught Up!</h3>
            <p className="text-gray-400">TSAM hasn't found any new optimization opportunities.</p>
          </div>
        ) : (
          suggestions.map(suggestion => (
            <AIInsightBox
              key={suggestion.id}
              insight={suggestion}
              onDismiss={handleDismiss}
              onApply={handleApplyFix}
            />
          ))
        )}
      </div>
    </TSAMLayout>
  );
};

export default AISuggestionsPage;
