
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  X, 
  Mic, 
  MicOff, 
  BarChart3, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  Lightbulb,
  Calendar,
  MessageSquare,
  Settings
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import ManagerAIPanel from './ManagerAIPanel';
import ManagerAIInsights from './ManagerAIInsights';
import { useManagerAI } from '@/hooks/useManagerAI';

interface ManagerAIAssistantProps {
  className?: string;
}

const ManagerAIAssistant: React.FC<ManagerAIAssistantProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const { profile } = useAuth();
  const location = useLocation();
  const { 
    contextualInsights, 
    isGenerating, 
    getContextualInsights,
    generateManagerReport,
    askJarvis
  } = useManagerAI();

  // Only show for managers
  if (profile?.role !== 'manager' && profile?.role !== 'admin') {
    return null;
  }

  useEffect(() => {
    // Get contextual insights based on current page
    if (isOpen) {
      getContextualInsights(location.pathname);
    }
  }, [isOpen, location.pathname, getContextualInsights]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = profile?.full_name?.split(' ')[0] || 'Manager';
    
    if (hour < 12) {
      return `Good morning, ${name}. Ready to drive results today?`;
    } else if (hour < 17) {
      return `Good afternoon, ${name}. Your team's momentum is building.`;
    } else {
      return `Good evening, ${name}. Let's review today's wins.`;
    }
  };

  const getContextualTitle = () => {
    const path = location.pathname;
    if (path.includes('analytics')) return 'Analytics Insights';
    if (path.includes('leads')) return 'Lead Management Intelligence';
    if (path.includes('company-brain')) return 'Knowledge Strategy';
    if (path.includes('reports')) return 'Performance Analysis';
    return 'Strategic Overview';
  };

  const handleVoiceToggle = () => {
    setVoiceEnabled(!voiceEnabled);
    if (!voiceEnabled) {
      // Start voice recognition logic here
      setIsListening(true);
    } else {
      setIsListening(false);
    }
  };

  return (
    <>
      {/* Floating AI Assistant Button */}
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        <div className="relative">
          <Button
            onClick={() => setIsOpen(true)}
            className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 border-0"
          >
            <Brain className="h-8 w-8 text-white" />
            <div className="absolute -top-1 -right-1">
              <div className="h-4 w-4 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </Button>
          
          {/* Status indicators */}
          {isListening && (
            <div className="absolute -top-2 -left-2">
              <div className="h-6 w-6 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                <Mic className="h-3 w-3 text-white" />
              </div>
            </div>
          )}
          
          {contextualInsights.length > 0 && !isOpen && (
            <div className="absolute -top-1 -left-1">
              <Badge className="bg-orange-500 text-xs px-1 animate-bounce">
                {contextualInsights.length}
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* AI Assistant Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-40 flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Side Panel */}
          <div className="ml-auto w-full max-w-2xl bg-white dark:bg-gray-900 shadow-2xl animate-slide-in-right">
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <div className="flex items-center gap-3">
                  <Brain className="h-6 w-6" />
                  <div>
                    <h2 className="text-xl font-bold">Jarvis</h2>
                    <p className="text-blue-100 text-sm">Manager AI Assistant</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleVoiceToggle}
                    className="text-white hover:bg-white/20"
                  >
                    {voiceEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:bg-white/20"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* Greeting */}
                <Card className="mb-6 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                  <CardContent className="p-4">
                    <p className="text-blue-800 dark:text-blue-200 font-medium">
                      {getGreeting()}
                    </p>
                  </CardContent>
                </Card>

                {/* Contextual Insights */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    {getContextualTitle()}
                  </h3>
                  <ManagerAIInsights 
                    insights={contextualInsights}
                    isGenerating={isGenerating}
                    currentPage={location.pathname}
                  />
                </div>

                {/* AI Panel */}
                <ManagerAIPanel 
                  voiceEnabled={voiceEnabled}
                  onVoiceToggle={handleVoiceToggle}
                  isListening={isListening}
                  onGenerateReport={generateManagerReport}
                  onAskJarvis={askJarvis}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ManagerAIAssistant;
