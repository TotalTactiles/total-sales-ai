
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Mic, 
  MicOff, 
  X, 
  Minimize2, 
  Maximize2,
  Volume2,
  VolumeX,
  Zap,
  Users,
  BarChart3,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import { useVoiceInteraction } from '@/hooks/useVoiceInteraction';
import { useManagerAI } from '@/hooks/useManagerAI';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ManagerAIBubbleProps {
  className?: string;
}

const ManagerAIBubble: React.FC<ManagerAIBubbleProps> = ({ className }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const { profile } = useAuth();
  const location = useLocation();
  
  const { 
    contextualInsights, 
    isGenerating, 
    getContextualInsights,
    askJarvis 
  } = useManagerAI();

  const {
    isListening,
    isProcessing,
    isSpeaking,
    isWakeWordActive,
    transcript,
    response,
    error,
    startListening,
    stopListening,
    toggleWakeWord,
    clearError
  } = useVoiceInteraction({
    context: 'manager',
    workspaceData: {
      workspace: getWorkspaceFromPath(location.pathname),
      currentPage: location.pathname,
      userRole: 'manager'
    },
    wakeWords: ['hey tsam', 'hey jarvis', 'tsam'],
    autoListen: true
  });

  // Don't show on AI Assistant page
  if (location.pathname.includes('/manager/ai')) {
    return null;
  }

  // Only show for managers
  if (profile?.role !== 'manager' && profile?.role !== 'admin') {
    return null;
  }

  function getWorkspaceFromPath(pathname: string): string {
    const segments = pathname.split('/');
    if (segments[1] === 'manager') {
      return segments[2] || 'dashboard';
    }
    return 'dashboard';
  }

  function getWorkspaceLabel(workspace: string): string {
    const labels: Record<string, string> = {
      dashboard: 'Dashboard',
      'business-ops': 'Business Ops',
      team: 'Team Management',
      leads: 'Lead Management',
      'company-brain': 'Company Brain',
      security: 'Security',
      reports: 'Reports',
      settings: 'Settings'
    };
    return labels[workspace] || 'Manager OS';
  }

  function getContextualQuickActions(workspace: string) {
    const actions: Record<string, Array<{ label: string; command: string; icon: React.ReactNode }>> = {
      dashboard: [
        { label: 'Team Summary', command: 'Give me a team performance summary', icon: <Users className="h-3 w-3" /> },
        { label: 'Today\'s Priorities', command: 'What should I focus on today?', icon: <Zap className="h-3 w-3" /> }
      ],
      team: [
        { label: 'Performance Review', command: 'Analyze team performance this week', icon: <BarChart3 className="h-3 w-3" /> },
        { label: 'Coaching Insights', command: 'Show coaching opportunities for my team', icon: <Users className="h-3 w-3" /> }
      ],
      leads: [
        { label: 'Lead Insights', command: 'Analyze lead pipeline and conversion rates', icon: <BarChart3 className="h-3 w-3" /> },
        { label: 'Rep Performance', command: 'Show which reps need lead management support', icon: <Users className="h-3 w-3" /> }
      ],
      'business-ops': [
        { label: 'Operations Summary', command: 'Summarize key business operations metrics', icon: <BarChart3 className="h-3 w-3" /> },
        { label: 'Process Improvements', command: 'Show process improvement opportunities', icon: <Zap className="h-3 w-3" /> }
      ],
      reports: [
        { label: 'Generate Report', command: 'Generate executive summary report', icon: <BarChart3 className="h-3 w-3" /> },
        { label: 'Trend Analysis', command: 'Analyze performance trends and insights', icon: <MessageSquare className="h-3 w-3" /> }
      ]
    };
    return actions[workspace] || actions.dashboard;
  }

  const handleQuickAction = async (command: string) => {
    try {
      const response = await askJarvis(command);
      toast.success('AI command executed successfully');
      setIsExpanded(true);
    } catch (error) {
      toast.error('Failed to execute AI command');
    }
  };

  const handleVoiceCommand = async (command: string) => {
    try {
      await handleQuickAction(command);
    } catch (error) {
      toast.error('Voice command failed');
    }
  };

  // Get contextual insights when workspace changes
  useEffect(() => {
    if (!isMinimized) {
      getContextualInsights(location.pathname);
    }
  }, [location.pathname, getContextualInsights, isMinimized]);

  // Auto-start wake word detection
  useEffect(() => {
    if (!isWakeWordActive && profile?.role === 'manager') {
      toggleWakeWord();
    }
  }, [profile?.role, isWakeWordActive, toggleWakeWord]);

  if (isMinimized) {
    return (
      <div className={cn("fixed bottom-6 right-6 z-50", className)}>
        <Button
          onClick={() => setIsMinimized(false)}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Brain className="h-6 w-6 text-white" />
          {isListening && (
            <div className="absolute inset-0 rounded-full bg-purple-500 opacity-30 animate-ping" />
          )}
          {contextualInsights.length > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-orange-500 text-xs px-1">
              {contextualInsights.length}
            </Badge>
          )}
        </Button>
      </div>
    );
  }

  const currentWorkspace = getWorkspaceFromPath(location.pathname);
  const quickActions = getContextualQuickActions(currentWorkspace);

  return (
    <div className={cn("fixed bottom-6 right-6 z-50", className)}>
      <Card className={cn(
        "shadow-2xl border-purple-200 transition-all duration-300",
        isExpanded ? 'w-96 h-[500px]' : 'w-80 h-auto'
      )}>
        <div className="p-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Brain className="h-5 w-5" />
                {isListening && (
                  <div className="absolute inset-0 rounded-full bg-white opacity-30 animate-pulse" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-sm">TSAM Assistant</h3>
                <p className="text-xs text-purple-100">{getWorkspaceLabel(currentWorkspace)}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleWakeWord}
                className="text-white hover:bg-white/10 p-1 h-auto"
                title={isWakeWordActive ? 'Voice Active' : 'Voice Inactive'}
              >
                {isWakeWordActive ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-white hover:bg-white/10 p-1 h-auto"
              >
                {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(true)}
                className="text-white hover:bg-white/10 p-1 h-auto"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {isWakeWordActive && (
            <div className="mt-2 text-xs text-purple-100 flex items-center gap-1">
              <div className={cn(
                "w-2 h-2 rounded-full",
                isListening ? "bg-green-400 animate-pulse" : "bg-yellow-400"
              )} />
              {isListening ? 'Listening...' : 'Say "Hey TSAM" to activate'}
            </div>
          )}
        </div>

        <CardContent className="p-4 space-y-4">
          {/* Quick Actions */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Quick Actions</h4>
            <div className="grid grid-cols-1 gap-2">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAction(action.command)}
                  disabled={isGenerating}
                  className="justify-start text-xs h-8"
                >
                  {action.icon}
                  <span className="ml-1 truncate">{action.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Voice Status */}
          {(transcript || response || error) && (
            <div className="space-y-2">
              {transcript && (
                <div className="text-xs p-2 bg-blue-50 rounded border-l-4 border-blue-500">
                  <strong>You said:</strong> {transcript}
                </div>
              )}
              
              {response && (
                <div className="text-xs p-2 bg-green-50 rounded border-l-4 border-green-500">
                  <strong>TSAM:</strong> {response}
                </div>
              )}
              
              {error && (
                <div className="text-xs p-2 bg-red-50 rounded border-l-4 border-red-500">
                  <strong>Error:</strong> {error}
                  <Button
                    onClick={clearError}
                    variant="ghost"
                    size="sm"
                    className="ml-2 h-4 text-xs"
                  >
                    Clear
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Processing Status */}
          {(isProcessing || isGenerating) && (
            <div className="text-xs text-purple-600 flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
              {isProcessing ? 'Processing voice command...' : 'Generating response...'}
            </div>
          )}

          {/* Contextual Insights Preview */}
          {contextualInsights.length > 0 && !isExpanded && (
            <div className="text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <Zap className="h-3 w-3 text-orange-500" />
                <span>{contextualInsights.length} insights available</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ManagerAIBubble;
