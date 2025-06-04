
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  TestTube2, 
  Plus, 
  Play, 
  BarChart3,
  Lightbulb,
  Clock,
  TrendingUp,
  CheckCircle
} from 'lucide-react';
import { Lead } from '@/types/lead';
import { toast } from 'sonner';

interface ABTestInterfaceProps {
  currentLead: Lead | null;
  isCallActive: boolean;
}

const ABTestInterface: React.FC<ABTestInterfaceProps> = ({ currentLead, isCallActive }) => {
  const [isCreatingTest, setIsCreatingTest] = useState(false);
  const [testName, setTestName] = useState('');
  const [testScript, setTestScript] = useState('');
  const [activeTests, setActiveTests] = useState([
    {
      id: '1',
      name: 'Pricing Objection A/B',
      script: 'Totally fair — let me show you how this gets paid back in 3 months.',
      results: { successRate: 38, avgDuration: 5.1, confidence: 'high' },
      callCount: 5
    },
    {
      id: '2',
      name: 'Opening Hook Test',
      script: 'Hi [Name], I know you\'re busy, this will take 30 seconds...',
      results: { successRate: 24, avgDuration: 8.2, confidence: 'medium' },
      callCount: 8
    }
  ]);

  const handleCreateTest = () => {
    if (!testName.trim() || !testScript.trim()) {
      toast.error('Please enter test name and script');
      return;
    }

    const newTest = {
      id: Date.now().toString(),
      name: testName,
      script: testScript,
      results: { successRate: 0, avgDuration: 0, confidence: 'low' as const },
      callCount: 0
    };

    setActiveTests(prev => [...prev, newTest]);
    setTestName('');
    setTestScript('');
    setIsCreatingTest(false);
    toast.success('A/B test created successfully');
  };

  const handleTagCallSegment = (testId: string) => {
    const test = activeTests.find(t => t.id === testId);
    if (test) {
      // Simulate tagging current call segment
      const updatedTests = activeTests.map(t => 
        t.id === testId 
          ? { ...t, callCount: t.callCount + 1 }
          : t
      );
      setActiveTests(updatedTests);
      toast.success(`Call segment tagged for "${test.name}"`);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flat-heading-sm flex items-center gap-2">
          <TestTube2 className="h-4 w-4 text-orange-600" />
          A/B Testing
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Create New Test */}
        {isCreatingTest ? (
          <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
            <Input
              placeholder="Test name (e.g., 'Opening Hook V2')"
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
              className="text-sm"
            />
            <Textarea
              placeholder="Enter your test script..."
              value={testScript}
              onChange={(e) => setTestScript(e.target.value)}
              className="min-h-[60px] text-sm"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleCreateTest}>
                <CheckCircle className="h-3 w-3 mr-1" />
                Create
              </Button>
              <Button size="sm" variant="outline" onClick={() => setIsCreatingTest(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button 
            size="sm" 
            variant="outline" 
            className="w-full" 
            onClick={() => setIsCreatingTest(true)}
          >
            <Plus className="h-3 w-3 mr-2" />
            New A/B Test
          </Button>
        )}

        {/* Active Tests */}
        <div className="space-y-3">
          {activeTests.map((test) => (
            <div key={test.id} className="p-3 border rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">{test.name}</span>
                <Badge variant="outline" className="text-xs">
                  {test.callCount} calls
                </Badge>
              </div>
              
              <p className="text-xs text-gray-600 italic">"{test.script}"</p>
              
              {test.callCount > 0 && (
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="text-center">
                    <div className="font-bold text-green-600">{test.results.successRate}%</div>
                    <div className="text-gray-500">Success</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-blue-600">{test.results.avgDuration}s</div>
                    <div className="text-gray-500">Avg Time</div>
                  </div>
                  <div className="text-center">
                    <Badge variant="outline" className="text-xs">
                      {test.results.confidence}
                    </Badge>
                  </div>
                </div>
              )}
              
              {isCallActive && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full text-xs"
                  onClick={() => handleTagCallSegment(test.id)}
                >
                  <Play className="h-3 w-3 mr-1" />
                  Tag This Segment
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Best Performers */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="flat-heading-sm text-green-800">Top Performer</span>
          </div>
          <div className="text-xs space-y-1">
            <p className="font-medium">Pricing Objection Response</p>
            <p className="text-green-700 italic">"Let me show you the ROI in 90 days..."</p>
            <div className="flex justify-between">
              <span>42% success rate</span>
              <span>Industry-wide data</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1 text-xs">
            <BarChart3 className="h-3 w-3 mr-1" />
            View All
          </Button>
          <Button size="sm" variant="outline" className="flex-1 text-xs">
            <Lightbulb className="h-3 w-3 mr-1" />
            AI Suggest
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ABTestInterface;
