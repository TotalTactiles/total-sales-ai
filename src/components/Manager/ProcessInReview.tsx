import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  ArrowRight, 
  Brain,
  Target,
  TrendingUp,
  TrendingDown,
  Clock,
  Users,
  Save,
  RotateCcw,
  Download,
  Workflow,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';
import ProcessStageEditor from './ProcessStageEditor';

interface SalesStage {
  id: string;
  name: string;
  description: string;
  avgTimeInStage: number;
  conversionRate: number;
  dropOffRate: number;
  conditions: string[];
  triggers: string[];
  isCustom: boolean;
  managerNotes?: string;
  exampleReplies?: string;
  internalTips?: string;
}

interface SalesProcess {
  id: string;
  name: string;
  industry: string;
  stages: SalesStage[];
  isDefault: boolean;
  createdAt: string;
  lastModified: string;
}

const ProcessInReview: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('builder');
  const [editingStage, setEditingStage] = useState<string | null>(null);
  const [selectedStageForEdit, setSelectedStageForEdit] = useState<SalesStage | null>(null);
  const [aiOptimizationEnabled, setAiOptimizationEnabled] = useState(false);

  // Mock sales process data
  const [currentProcess, setCurrentProcess] = useState<SalesProcess>({
    id: 'proc-001',
    name: 'Inbound B2B Tech Sales',
    industry: 'Technology',
    stages: [
      {
        id: 'stage-001',
        name: 'Lead Capture',
        description: 'Initial lead enters system via form, call, or referral',
        avgTimeInStage: 0.5,
        conversionRate: 85,
        dropOffRate: 15,
        conditions: ['Valid contact info', 'Meets ICP criteria'],
        triggers: ['Form submission', 'Demo request', 'Inbound call'],
        isCustom: false,
        managerNotes: 'Focus on speed to lead - respond within 5 minutes for best conversion rates',
        exampleReplies: 'Thank you for your interest! I\'d love to learn more about your current challenges with [relevant topic].',
        internalTips: 'Use lead scoring to prioritize responses. Check LinkedIn profile before calling.'
      },
      {
        id: 'stage-002',
        name: 'Qualification',
        description: 'Determine if lead meets BANT criteria',
        avgTimeInStage: 2.3,
        conversionRate: 68,
        dropOffRate: 32,
        conditions: ['Budget confirmed', 'Authority identified', 'Need established'],
        triggers: ['Qualification call completed', 'BANT checklist done'],
        isCustom: false,
        managerNotes: 'Don\'t rush this stage - thorough qualification saves time later',
        exampleReplies: 'What\'s driving you to look for a solution like this now? What happens if you don\'t solve this?',
        internalTips: 'Use MEDDIC framework. Always identify the decision-making process.'
      },
      {
        id: 'stage-003',
        name: 'Discovery',
        description: 'Deep dive into customer needs and pain points',
        avgTimeInStage: 5.2,
        conversionRate: 72,
        dropOffRate: 28,
        conditions: ['Pain points identified', 'Current solution mapped'],
        triggers: ['Discovery call scheduled', 'Needs analysis completed'],
        isCustom: false,
        managerNotes: 'Ask open-ended questions to uncover deeper needs',
        exampleReplies: 'Can you walk me through your current process for [relevant task]? What are the biggest challenges you face?',
        internalTips: 'Use the 5 Whys technique. Document everything in CRM.'
      },
      {
        id: 'stage-004',
        name: 'Demo/Presentation',
        description: 'Product demonstration tailored to customer needs',
        avgTimeInStage: 4.1,
        conversionRate: 78,
        dropOffRate: 22,
        conditions: ['Demo completed', 'Technical questions answered'],
        triggers: ['Demo scheduled', 'Follow-up questions received'],
        isCustom: false,
        managerNotes: 'Focus on the top 3 benefits that address the customer\'s pain points',
        exampleReplies: 'Based on what you\'ve shared, I think you\'ll be most excited about [feature 1], [feature 2], and [feature 3].',
        internalTips: 'Practice demo beforehand. Record and review demos for improvement.'
      },
      {
        id: 'stage-005',
        name: 'Proposal',
        description: 'Formal proposal or quote sent to prospect',
        avgTimeInStage: 8.7,
        conversionRate: 62,
        dropOffRate: 38,
        conditions: ['Proposal sent', 'Pricing discussed'],
        triggers: ['Proposal requested', 'Quote approved internally'],
        isCustom: false,
        managerNotes: 'Clearly outline the value proposition and ROI',
        exampleReplies: 'Here\'s a proposal that outlines how we can help you achieve [specific goals] and improve [key metrics].',
        internalTips: 'Customize proposal for each client. Offer flexible payment options.'
      },
      {
        id: 'stage-006',
        name: 'Negotiation',
        description: 'Terms and pricing negotiations',
        avgTimeInStage: 6.4,
        conversionRate: 85,
        dropOffRate: 15,
        conditions: ['Terms agreed', 'Pricing finalized'],
        triggers: ['Counter-offer received', 'Contract review started'],
        isCustom: false,
        managerNotes: 'Be prepared to offer concessions, but hold firm on key terms',
        exampleReplies: 'I understand your concerns about pricing. Let\'s explore some options that could work for both of us.',
        internalTips: 'Know your walk-away point. Get creative with value-added services.'
      },
      {
        id: 'stage-007',
        name: 'Closed Won',
        description: 'Deal successfully closed',
        avgTimeInStage: 1.0,
        conversionRate: 100,
        dropOffRate: 0,
        conditions: ['Contract signed', 'Payment terms agreed'],
        triggers: ['Signature received', 'Implementation started'],
        isCustom: false,
        managerNotes: 'Celebrate the win and ensure a smooth onboarding process',
        exampleReplies: 'Congratulations! We\'re excited to have you as a customer and look forward to helping you achieve your goals.',
        internalTips: 'Send a thank-you note. Schedule a kickoff call with the implementation team.'
      }
    ],
    isDefault: true,
    createdAt: '2025-01-01',
    lastModified: '2025-07-04'
  });

  // Mock AI optimization suggestions
  const aiSuggestions = [
    {
      id: 'ai-001',
      type: 'warning',
      stage: 'Qualification',
      message: 'Qualification stage takes 3.2 days longer than industry average',
      suggestion: 'Consider implementing automated qualification scoring',
      impact: 'Could reduce sales cycle by 12%'
    },
    {
      id: 'ai-002',
      type: 'opportunity', 
      stage: 'Discovery',
      message: 'Discovery and Demo stages have similar activities',
      suggestion: 'Consider merging Discovery and Demo into one comprehensive stage',
      impact: 'Could increase conversion rate by 8%'
    },
    {
      id: 'ai-003',
      type: 'success',
      stage: 'Negotiation',
      message: 'Negotiation stage performs 23% above industry benchmark',
      suggestion: 'Document and replicate negotiation best practices across team',
      impact: 'Could improve overall close rate'
    }
  ];

  const handleStageClick = (stage: SalesStage) => {
    setSelectedStageForEdit(stage);
  };

  const handleSaveStage = (updatedStage: SalesStage) => {
    setCurrentProcess(prev => ({
      ...prev,
      stages: prev.stages.map(stage => 
        stage.id === updatedStage.id ? updatedStage : stage
      ),
      lastModified: new Date().toISOString()
    }));
    
    // AI ingestion simulation
    console.log('Pushing stage data to Company Brain:', updatedStage);
    toast.success('Stage updated and synced to Company Brain');
  };

  const addNewStage = () => {
    const newStage: SalesStage = {
      id: `stage-${Date.now()}`,
      name: 'New Stage',
      description: 'Enter stage description',
      avgTimeInStage: 1,
      conversionRate: 50,
      dropOffRate: 50,
      conditions: ['Add condition'],
      triggers: ['Add trigger'],
      isCustom: true,
      managerNotes: '',
      exampleReplies: '',
      internalTips: ''
    };
    
    setCurrentProcess(prev => ({
      ...prev,
      stages: [...prev.stages.slice(0, -1), newStage, prev.stages[prev.stages.length - 1]]
    }));
    
    setSelectedStageForEdit(newStage);
    toast.success('New stage added');
  };

  const removeStage = (stageId: string) => {
    setCurrentProcess(prev => ({
      ...prev,
      stages: prev.stages.filter(stage => stage.id !== stageId)
    }));
    toast.success('Stage removed');
  };

  const saveProcess = () => {
    // AI ingestion simulation
    console.log('Pushing complete process to Company Brain:', currentProcess);
    toast.success('Sales process saved and synced to Company Brain');
  };

  const resetToDefault = () => {
    toast.success('Process reset to default template');
  };

  const exportProcess = () => {
    toast.success('Process exported successfully');
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'opportunity': return <TrendingUp className="h-4 w-4 text-blue-600" />;
      case 'success': return <Target className="h-4 w-4 text-green-600" />;
      default: return <Brain className="h-4 w-4 text-purple-600" />;
    }
  };

  const getSuggestionColor = (type: string) => {
    switch (type) {
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      case 'opportunity': return 'bg-blue-50 border-blue-200';
      case 'success': return 'bg-green-50 border-green-200';
      default: return 'bg-purple-50 border-purple-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="rounded-lg shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Workflow className="h-5 w-5" />
                Sales Process Lab
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  Advanced
                </Badge>
              </CardTitle>
              <p className="text-sm text-slate-600 mt-1">
                Design, optimize, and manage your company's sales process
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={exportProcess}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" onClick={resetToDefault}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset to Default
              </Button>
              <Button onClick={saveProcess}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="builder" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Stage Builder
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Performance Mapping
          </TabsTrigger>
          <TabsTrigger value="optimization" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI Optimization
          </TabsTrigger>
        </TabsList>

        {/* Stage Builder Tab */}
        <TabsContent value="builder" className="mt-6">
          <Card className="rounded-lg shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Current Process: {currentProcess.name}</CardTitle>
                <Button onClick={addNewStage} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Stage
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentProcess.stages.map((stage, index) => (
                  <div key={stage.id} className="flex items-center gap-4">
                    <div className="flex-1">
                      <Card 
                        className="p-4 hover:shadow-md transition-shadow cursor-pointer hover:bg-gray-50"
                        onClick={() => handleStageClick(stage)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                              {index + 1}
                            </div>
                            <div>
                              <h4 className="font-semibold">{stage.name}</h4>
                              <p className="text-sm text-gray-600">{stage.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {stage.isCustom && (
                              <Badge variant="outline" className="text-xs">Custom</Badge>
                            )}
                            <Button variant="ghost" size="sm" onClick={(e) => {
                              e.stopPropagation();
                              handleStageClick(stage);
                            }}>
                              <Edit className="h-3 w-3" />
                            </Button>
                            {stage.isCustom && (
                              <Button variant="ghost" size="sm" onClick={(e) => {
                                e.stopPropagation();
                                removeStage(stage.id);
                              }}>
                                <Trash2 className="h-3 w-3 text-red-600" />
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-4 gap-4 mt-3">
                          <div className="text-center">
                            <div className="flex items-center gap-1 justify-center">
                              <Clock className="h-3 w-3 text-gray-400" />
                              <span className="text-sm font-medium">{stage.avgTimeInStage}d</span>
                            </div>
                            <p className="text-xs text-gray-500">Avg Time</p>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-medium text-green-600">{stage.conversionRate}%</div>
                            <p className="text-xs text-gray-500">Conversion</p>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-medium text-red-600">{stage.dropOffRate}%</div>
                            <p className="text-xs text-gray-500">Drop-off</p>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-medium">{stage.conditions.length}</div>
                            <p className="text-xs text-gray-500">Conditions</p>
                          </div>
                        </div>
                      </Card>
                    </div>
                    
                    {index < currentProcess.stages.length - 1 && (
                      <ArrowRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Mapping Tab */}
        <TabsContent value="performance" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Drop-off Analysis */}
            <Card className="rounded-lg shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-red-600" />
                  Drop-off Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentProcess.stages.slice(0, -1).map((stage) => (
                    <div key={stage.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium">{stage.name}</h4>
                        <p className="text-sm text-gray-600">Avg: {stage.avgTimeInStage} days</p>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${stage.dropOffRate > 30 ? 'text-red-600' : 'text-yellow-600'}`}>
                          {stage.dropOffRate}%
                        </div>
                        <p className="text-xs text-gray-500">Drop-off rate</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Time Analysis */}
            <Card className="rounded-lg shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  Time Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Total Sales Cycle</span>
                      <span className="text-lg font-bold text-blue-600">
                        {currentProcess.stages.reduce((acc, stage) => acc + stage.avgTimeInStage, 0).toFixed(1)} days
                      </span>
                    </div>
                  </div>
                  
                  {currentProcess.stages.slice(0, -1).map((stage) => (
                    <div key={stage.id} className="flex items-center justify-between">
                      <span className="text-sm">{stage.name}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ 
                              width: `${(stage.avgTimeInStage / 10) * 100}%` 
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{stage.avgTimeInStage}d</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AI Optimization Tab */}
        <TabsContent value="optimization" className="mt-6">
          <div className="space-y-6">
            {/* AI Toggle */}
            <Card className="rounded-lg shadow-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    AI Process Optimization
                  </CardTitle>
                  <Badge variant="outline" className="bg-gray-100 text-gray-600">
                    Demo Mode
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  AI optimization is currently disabled. Enable "Goal-Aware AI Suggestions" in Company Brain settings to activate full optimization features.
                </p>
              </CardContent>
            </Card>

            {/* Mock AI Suggestions */}
            <Card className="rounded-lg shadow-md">
              <CardHeader>
                <CardTitle>Process Optimization Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {aiSuggestions.map((suggestion) => (
                    <div
                      key={suggestion.id}
                      className={`p-4 rounded-lg border-2 ${getSuggestionColor(suggestion.type)} hover:shadow-md transition-all duration-200`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {getSuggestionIcon(suggestion.type)}
                          <div>
                            <h4 className="font-semibold text-gray-900 text-sm">
                              {suggestion.stage}: {suggestion.message}
                            </h4>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-700 mb-3">{suggestion.suggestion}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="bg-white/60 p-2 rounded-md">
                          <p className="text-xs font-medium text-gray-800">
                            Projected Impact: {suggestion.impact}
                          </p>
                        </div>
                        <Button size="sm" variant="outline" className="text-xs">
                          Apply Suggestion
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Stage Editor Modal */}
      {selectedStageForEdit && (
        <ProcessStageEditor
          stage={selectedStageForEdit}
          isOpen={!!selectedStageForEdit}
          onClose={() => setSelectedStageForEdit(null)}
          onSave={handleSaveStage}
        />
      )}
    </div>
  );
};

export default ProcessInReview;
