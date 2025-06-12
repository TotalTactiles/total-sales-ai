
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Upload, 
  Download, 
  Play, 
  Save,
  Trash2,
  MessageSquare,
  BarChart3,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';

interface TrainingExample {
  id: string;
  input: string;
  expectedOutput: string;
  category: string;
}

interface AgentModel {
  id: string;
  name: string;
  description: string;
  trainingExamples: number;
  accuracy: number;
  status: 'training' | 'ready' | 'error';
  lastTrained: Date;
}

const CustomAgentTraining: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<string>('sales-agent');
  const [trainingExamples, setTrainingExamples] = useState<TrainingExample[]>([
    {
      id: '1',
      input: 'Customer is interested but concerned about price',
      expectedOutput: 'Acknowledge their interest, present value proposition, offer flexible payment options',
      category: 'objection_handling'
    },
    {
      id: '2',
      input: 'Lead wants to think about it',
      expectedOutput: 'Respect their decision, provide additional resources, schedule follow-up',
      category: 'follow_up'
    }
  ]);
  
  const [newExample, setNewExample] = useState({
    input: '',
    expectedOutput: '',
    category: 'general'
  });

  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);

  const [agentModels] = useState<AgentModel[]>([
    {
      id: 'sales-agent',
      name: 'Sales Agent',
      description: 'Handles customer interactions and sales processes',
      trainingExamples: 150,
      accuracy: 87.5,
      status: 'ready',
      lastTrained: new Date('2024-01-10')
    },
    {
      id: 'manager-agent',
      name: 'Manager Agent',
      description: 'Provides team insights and performance analytics',
      trainingExamples: 85,
      accuracy: 92.1,
      status: 'ready',
      lastTrained: new Date('2024-01-08')
    }
  ]);

  const categories = [
    'general',
    'objection_handling',
    'follow_up',
    'lead_qualification',
    'closing_techniques',
    'product_knowledge'
  ];

  const addTrainingExample = () => {
    if (!newExample.input.trim() || !newExample.expectedOutput.trim()) {
      toast.error('Please fill in both input and expected output');
      return;
    }

    const example: TrainingExample = {
      id: crypto.randomUUID(),
      input: newExample.input,
      expectedOutput: newExample.expectedOutput,
      category: newExample.category
    };

    setTrainingExamples(prev => [...prev, example]);
    setNewExample({ input: '', expectedOutput: '', category: 'general' });
    toast.success('Training example added');
  };

  const removeTrainingExample = (id: string) => {
    setTrainingExamples(prev => prev.filter(ex => ex.id !== id));
    toast.success('Training example removed');
  };

  const startTraining = async () => {
    if (trainingExamples.length < 5) {
      toast.error('Need at least 5 training examples to start training');
      return;
    }

    setIsTraining(true);
    setTrainingProgress(0);

    // Simulate training progress
    const interval = setInterval(() => {
      setTrainingProgress(prev => {
        const next = prev + Math.random() * 15;
        if (next >= 100) {
          clearInterval(interval);
          setIsTraining(false);
          toast.success('Agent training completed successfully!');
          return 100;
        }
        return next;
      });
    }, 800);
  };

  const exportTrainingData = () => {
    const data = {
      agentId: selectedAgent,
      examples: trainingExamples,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedAgent}-training-data.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Training data exported');
  };

  const importTrainingData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.examples && Array.isArray(data.examples)) {
          setTrainingExamples(data.examples);
          toast.success('Training data imported successfully');
        } else {
          toast.error('Invalid training data format');
        }
      } catch (error) {
        toast.error('Failed to parse training data');
      }
    };
    reader.readAsText(file);
  };

  const selectedModel = agentModels.find(m => m.id === selectedAgent);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Custom Agent Training
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedAgent} onValueChange={setSelectedAgent}>
            <TabsList className="grid w-full grid-cols-2">
              {agentModels.map(model => (
                <TabsTrigger key={model.id} value={model.id}>
                  {model.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {agentModels.map(model => (
              <TabsContent key={model.id} value={model.id} className="space-y-6">
                {/* Model Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{model.trainingExamples}</div>
                    <div className="text-sm text-blue-600">Training Examples</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{model.accuracy}%</div>
                    <div className="text-sm text-green-600">Accuracy Score</div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <Badge variant={model.status === 'ready' ? 'default' : 'secondary'}>
                      {model.status}
                    </Badge>
                    <div className="text-sm text-purple-600 mt-1">
                      Last trained: {model.lastTrained.toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Training Progress */}
                {isTraining && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Training Progress</span>
                      <span className="text-sm text-gray-600">{trainingProgress.toFixed(1)}%</span>
                    </div>
                    <Progress value={trainingProgress} />
                  </div>
                )}

                {/* Add New Training Example */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Add Training Example</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Input Scenario</label>
                      <Textarea
                        value={newExample.input}
                        onChange={(e) => setNewExample(prev => ({ ...prev, input: e.target.value }))}
                        placeholder="Describe the input scenario or customer situation..."
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Expected Output</label>
                      <Textarea
                        value={newExample.expectedOutput}
                        onChange={(e) => setNewExample(prev => ({ ...prev, expectedOutput: e.target.value }))}
                        placeholder="Describe the ideal agent response..."
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Category</label>
                      <select
                        value={newExample.category}
                        onChange={(e) => setNewExample(prev => ({ ...prev, category: e.target.value }))}
                        className="mt-1 w-full p-2 border rounded-md"
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>
                            {cat.replace('_', ' ').toUpperCase()}
                          </option>
                        ))}
                      </select>
                    </div>

                    <Button onClick={addTrainingExample} className="w-full">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Add Training Example
                    </Button>
                  </CardContent>
                </Card>

                {/* Training Examples List */}
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">Training Examples ({trainingExamples.length})</CardTitle>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={exportTrainingData}>
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </Button>
                        <label className="cursor-pointer">
                          <Button variant="outline" size="sm" asChild>
                            <span>
                              <Upload className="h-4 w-4 mr-2" />
                              Import
                            </span>
                          </Button>
                          <input
                            type="file"
                            accept=".json"
                            onChange={importTrainingData}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {trainingExamples.map((example) => (
                        <div key={example.id} className="p-3 border rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <Badge variant="outline">{example.category}</Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeTrainingExample(example.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="space-y-2">
                            <div>
                              <div className="text-sm font-medium text-gray-600">Input:</div>
                              <div className="text-sm">{example.input}</div>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-600">Expected Output:</div>
                              <div className="text-sm">{example.expectedOutput}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Training Actions */}
                <div className="flex gap-2">
                  <Button
                    onClick={startTraining}
                    disabled={isTraining || trainingExamples.length < 5}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {isTraining ? 'Training...' : 'Start Training'}
                  </Button>
                  <Button variant="outline">
                    <Save className="h-4 w-4 mr-2" />
                    Save Draft
                  </Button>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomAgentTraining;
