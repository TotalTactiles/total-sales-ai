import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Brain, 
  X, 
  Mic,
  Volume2,
  Phone,
  Mail,
  Calendar,
  MessageSquare,
  Target,
  TrendingUp,
  User,
  Building,
  Clock,
  Star,
  Lightbulb,
  Zap
} from 'lucide-react';
import { Lead } from '@/types/lead';
import { toast } from 'sonner';
import { assistantVoiceService } from '@/services/ai/assistantVoiceService';

interface LeadIntelligencePanelProps {
  lead: Lead;
  isOpen: boolean;
  onClose: () => void;
}

const LeadIntelligencePanel: React.FC<LeadIntelligencePanelProps> = ({
  lead,
  isOpen,
  onClose
}) => {
  const [isListening, setIsListening] = useState(false);
  const [alwaysListening, setAlwaysListening] = useState(true);
  const [lastCommand, setLastCommand] = useState<string>('');
  const [conversationHistory, setConversationHistory] = useState<Array<{
    type: 'user' | 'ai' | 'system';
    message: string;
    timestamp: string;
  }>>([]);

  // Initialize always-on voice detection
  useEffect(() => {
    if (isOpen && alwaysListening) {
      initializeVoiceAssistant();
    }
  }, [isOpen, alwaysListening]);

  const initializeVoiceAssistant = async () => {
    try {
      assistantVoiceService.setLeadContext(lead);
      assistantVoiceService.setCommandCallback(handleVoiceCommand);
      assistantVoiceService.setWakeWordCallback(() => {
        toast.success('Hey TSAM detected! Listening...');
        setIsListening(true);
        
        // Add system message
        const systemMessage = {
          type: 'system' as const,
          message: '🎙️ Hey TSAM detected - processing your command...',
          timestamp: new Date().toLocaleTimeString()
        };
        setConversationHistory(prev => [...prev, systemMessage]);
      });

      const started = await assistantVoiceService.startWakeWordDetection();
      if (started) {
        console.log('Always-on voice assistant activated for', lead.name);
      }
    } catch (error) {
      console.error('Failed to initialize voice assistant:', error);
      toast.error('Voice assistant unavailable. Please check microphone permissions.');
    }
  };

  const handleVoiceCommand = async (command: string) => {
    setLastCommand(command);
    setIsListening(false);
    
    // Add user command to history
    const userMessage = {
      type: 'user' as const,
      message: command,
      timestamp: new Date().toLocaleTimeString()
    };
    setConversationHistory(prev => [...prev, userMessage]);

    // Process command based on context
    const response = await processLeadCommand(command);
    
    // Add AI response to history
    const aiMessage = {
      type: 'ai' as const,
      message: response,
      timestamp: new Date().toLocaleTimeString()
    };
    setConversationHistory(prev => [...prev, aiMessage]);
    
    toast.success('Command executed successfully');
  };

  const processLeadCommand = async (command: string): Promise<string> => {
    const lowerCommand = command.toLowerCase();
    
    // Context-aware command processing for Lead Profile
    if (lowerCommand.includes('update') && lowerCommand.includes('stage')) {
      const stages = ['qualified', 'discovery', 'demo', 'proposal', 'negotiation', 'closed'];
      const stage = stages.find(s => lowerCommand.includes(s));
      if (stage) {
        return `I've delegated to Lead Profile AI to update ${lead.name}'s stage to ${stage}. The update will be processed shortly.`;
      }
    }
    
    if (lowerCommand.includes('follow') && lowerCommand.includes('up')) {
      return `I've delegated to Automation Agent to set up a follow-up for ${lead.name}. You'll receive a reminder notification.`;
    }
    
    if (lowerCommand.includes('note') || lowerCommand.includes('add')) {
      return `I've prepared a note template for ${lead.name}. You can dictate the note content or I can suggest one based on recent interactions.`;
    }
    
    if (lowerCommand.includes('call') || lowerCommand.includes('phone')) {
      return `I've delegated to Dialer Agent to initiate a call to ${lead.name}. The dialer should open shortly.`;
    }
    
    if (lowerCommand.includes('email')) {
      return `I've delegated to Lead Profile AI to prepare an email for ${lead.name}. I'll use their recent interaction history to personalize the content.`;
    }
    
    if (lowerCommand.includes('analyze') || lowerCommand.includes('insights')) {
      return `I've delegated to TSAM Brain for deeper analysis of ${lead.name}. Based on their ${lead.conversionLikelihood}% conversion likelihood, I recommend focusing on ROI and implementation timeline.`;
    }
    
    return `I understand your request about ${lead.name} and I'm processing it through the appropriate AI agents. You'll receive an update shortly.`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] bg-white shadow-2xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                {lead.name.charAt(0)}
              </div>
              <div>
                <CardTitle className="text-xl">Lead Intelligence: {lead.name}</CardTitle>
                <p className="text-gray-600">{lead.company}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Always-on Voice Indicator */}
              <div className="flex items-center gap-2 px-3 py-1 bg-green-50 border border-green-200 rounded-full">
                <div className={`w-2 h-2 rounded-full ${alwaysListening ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
                <span className="text-xs font-medium text-green-700">
                  {isListening ? 'Listening...' : 'Say "Hey TSAM"'}
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="communications">Comms</TabsTrigger>
              <TabsTrigger value="ai-assistant">AI Assistant</TabsTrigger>
            </TabsList>
            
            <TabsContent value="summary" className="mt-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Lead Details */}
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold mb-3">Lead Details</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">Name: {lead.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">Company: {lead.company}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">Email: {lead.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">Phone: {lead.phone}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Conversion Likelihood */}
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-green-800">Conversion Likelihood</span>
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="text-3xl font-bold text-green-700 mb-1">
                      {lead.conversionLikelihood}%
                    </div>
                    <div className="w-full bg-green-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${lead.conversionLikelihood}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-green-700 mt-2">High Confidence</p>
                  </div>
                </div>
                
                {/* AI Insights */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Brain className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold text-blue-800">AI Lead Summary</h3>
                    </div>
                    <p className="text-sm text-blue-700 mb-3">
                      {lead.name} from {lead.company} was last contacted on {new Date(lead.lastContact || '').toLocaleDateString()}. 
                      They showed strong interest in our pricing but haven't responded to the last two follow-ups. 
                      Their engagement score is 91% with a 90% conversion likelihood. 
                      Recommend: Send value-focused follow-up highlighting ROI calculator.
                    </p>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <Volume2 className="h-3 w-3 mr-1" />
                      Listen
                    </Button>
                  </div>
                  
                  {/* Quick AI Insights */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="h-4 w-4 text-yellow-600" />
                        <span className="font-semibold text-yellow-800">High Intent Signal</span>
                      </div>
                      <p className="text-sm text-yellow-700 mb-2">
                        Downloaded pricing guide 3x in past week
                      </p>
                      <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                        89% confident
                      </Badge>
                    </div>
                    
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-purple-600" />
                        <span className="font-semibold text-purple-800">Optimal Contact Window</span>
                      </div>
                      <p className="text-sm text-purple-700 mb-2">
                        Best response rate: 2-4 PM EST
                      </p>
                      <Badge className="bg-purple-100 text-purple-800 text-xs">
                        76% confident
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="ai-assistant" className="mt-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Voice Commands */}
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Mic className="h-4 w-4" />
                      Voice Commands for {lead.name}
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="bg-white rounded p-2 border">
                        "Hey TSAM, update this lead's stage to Negotiation"
                      </div>
                      <div className="bg-white rounded p-2 border">
                        "Hey TSAM, set a follow-up for 2 weeks"
                      </div>
                      <div className="bg-white rounded p-2 border">
                        "Hey TSAM, call {lead.name}"
                      </div>
                      <div className="bg-white rounded p-2 border">
                        "Hey TSAM, analyze this lead's behavior"
                      </div>
                      <div className="bg-white rounded p-2 border">
                        "Hey TSAM, draft a follow-up email"
                      </div>
                    </div>
                  </div>
                  
                  {lastCommand && (
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <h4 className="font-semibold text-green-800 mb-2">Last Command:</h4>
                      <p className="text-sm text-green-700 italic">"{lastCommand}"</p>
                    </div>
                  )}
                </div>
                
                {/* Conversation History */}
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    AI Conversation
                  </h3>
                  <ScrollArea className="h-64 border rounded-lg p-4 bg-gray-50">
                    {conversationHistory.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Say "Hey TSAM" to start a conversation</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {conversationHistory.map((entry, index) => (
                          <div key={index} className={`p-2 rounded ${
                            entry.type === 'user' ? 'bg-blue-100 ml-4' : 
                            entry.type === 'ai' ? 'bg-white mr-4' : 
                            'bg-yellow-100'
                          }`}>
                            <div className="flex items-center gap-2 mb-1">
                              {entry.type === 'user' && <User className="h-3 w-3" />}
                              {entry.type === 'ai' && <Brain className="h-3 w-3" />}
                              {entry.type === 'system' && <Zap className="h-3 w-3" />}
                              <span className="text-xs font-medium capitalize">{entry.type}</span>
                              <span className="text-xs text-gray-500">{entry.timestamp}</span>
                            </div>
                            <p className="text-sm">{entry.message}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="notes" className="mt-4">
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 border">
                  <h3 className="font-semibold mb-3">Add Note</h3>
                  <textarea 
                    className="w-full h-24 p-3 border rounded-lg resize-none"
                    placeholder={`Add a note about ${lead.name}...`}
                  />
                  <div className="flex justify-end mt-2">
                    <Button size="sm">Save Note</Button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Sarah Johnson</span>
                      <span className="text-xs text-gray-500">540 days ago</span>
                    </div>
                    <p className="text-sm text-gray-700">
                      Initial discovery call completed. Emily expressed strong interest in ROI tracking features 
                      and mentioned budget approval for Q1 implementation. Key pain point: manual reporting taking 3+ hours weekly.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="timeline" className="mt-4">
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">Email Sent</span>
                    <span className="text-xs text-gray-500">2 days ago</span>
                  </div>
                  <p className="text-sm text-gray-600">Follow-up email with pricing information sent</p>
                </div>
                
                <div className="border-l-4 border-green-500 pl-4 py-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">Call Completed</span>
                    <span className="text-xs text-gray-500">1 week ago</span>
                  </div>
                  <p className="text-sm text-gray-600">Discovery call - 45 minutes, very positive response</p>
                </div>
                
                <div className="border-l-4 border-purple-500 pl-4 py-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">Lead Created</span>
                    <span className="text-xs text-gray-500">2 weeks ago</span>
                  </div>
                  <p className="text-sm text-gray-600">Lead imported from website form submission</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="communications" className="mt-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Call {lead.name}
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Send Email
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Schedule Meeting
                  </Button>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Communication History</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <Mail className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">Email: Follow-up with pricing</span>
                          <span className="text-xs text-gray-500">2 days ago</span>
                        </div>
                        <p className="text-sm text-gray-600">Sent detailed pricing breakdown and ROI calculator</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <Phone className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">Call: Discovery session</span>
                          <span className="text-xs text-gray-500">1 week ago</span>
                        </div>
                        <p className="text-sm text-gray-600">45-minute discovery call, identified key pain points</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadIntelligencePanel;
