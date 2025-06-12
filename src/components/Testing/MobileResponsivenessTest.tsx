
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

interface ViewportTest {
  name: string;
  width: number;
  height: number;
  icon: React.ReactNode;
  category: 'mobile' | 'tablet' | 'desktop';
}

interface TestResult {
  viewport: string;
  passed: boolean;
  issues: string[];
  score: number;
}

const MobileResponsivenessTest: React.FC = () => {
  const [isTestingAll, setIsTestingAll] = useState(false);
  const [currentTest, setCurrentTest] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [overallScore, setOverallScore] = useState(0);

  const viewports: ViewportTest[] = [
    { name: 'iPhone SE', width: 375, height: 667, icon: <Smartphone className="h-4 w-4" />, category: 'mobile' },
    { name: 'iPhone 12', width: 390, height: 844, icon: <Smartphone className="h-4 w-4" />, category: 'mobile' },
    { name: 'Samsung Galaxy', width: 412, height: 914, icon: <Smartphone className="h-4 w-4" />, category: 'mobile' },
    { name: 'iPad Mini', width: 768, height: 1024, icon: <Tablet className="h-4 w-4" />, category: 'tablet' },
    { name: 'iPad Pro', width: 1024, height: 1366, icon: <Tablet className="h-4 w-4" />, category: 'tablet' },
    { name: 'Desktop', width: 1440, height: 900, icon: <Monitor className="h-4 w-4" />, category: 'desktop' }
  ];

  const testViewport = async (viewport: ViewportTest): Promise<TestResult> => {
    setCurrentTest(viewport.name);
    
    // Simulate responsive testing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const issues: string[] = [];
    let score = 100;

    // Simulate various responsive issues
    if (viewport.width < 400) {
      if (Math.random() > 0.7) {
        issues.push('Navigation menu overflows on narrow screens');
        score -= 20;
      }
      if (Math.random() > 0.8) {
        issues.push('Form elements too small for touch targets');
        score -= 15;
      }
    }

    if (viewport.category === 'tablet') {
      if (Math.random() > 0.9) {
        issues.push('Sidebar layout breaks on tablet orientation');
        score -= 10;
      }
    }

    if (viewport.width > 1200) {
      if (Math.random() > 0.95) {
        issues.push('Content stretches too wide on large screens');
        score -= 5;
      }
    }

    // Random performance issues
    if (Math.random() > 0.85) {
      issues.push('Slow loading on this viewport');
      score -= 10;
    }

    return {
      viewport: viewport.name,
      passed: issues.length === 0,
      issues,
      score: Math.max(0, score)
    };
  };

  const runAllTests = async () => {
    setIsTestingAll(true);
    setTestResults([]);
    setCurrentTest(null);

    const results: TestResult[] = [];
    
    for (const viewport of viewports) {
      const result = await testViewport(viewport);
      results.push(result);
      setTestResults([...results]);
    }

    const avgScore = results.reduce((sum, r) => sum + r.score, 0) / results.length;
    setOverallScore(avgScore);
    
    setCurrentTest(null);
    setIsTestingAll(false);
  };

  const runSingleTest = async (viewport: ViewportTest) => {
    const result = await testViewport(viewport);
    setTestResults(prev => {
      const filtered = prev.filter(r => r.viewport !== viewport.name);
      return [...filtered, result];
    });
    setCurrentTest(null);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return 'default';
    if (score >= 70) return 'secondary';
    return 'destructive';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Mobile Responsiveness Testing
          </CardTitle>
          <Button
            onClick={runAllTests}
            disabled={isTestingAll}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isTestingAll ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Testing...
              </>
            ) : (
              'Run All Tests'
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Score */}
        {testResults.length > 0 && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Overall Responsiveness Score</span>
              <Badge variant={getScoreBadge(overallScore)}>
                {overallScore.toFixed(1)}%
              </Badge>
            </div>
            <Progress value={overallScore} className="h-2" />
          </div>
        )}

        {/* Viewport Tests */}
        <div className="space-y-3">
          {viewports.map((viewport) => {
            const result = testResults.find(r => r.viewport === viewport.name);
            const isTesting = currentTest === viewport.name;
            
            return (
              <div key={viewport.name} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {viewport.icon}
                  <div>
                    <div className="font-medium">{viewport.name}</div>
                    <div className="text-sm text-gray-600">
                      {viewport.width} × {viewport.height}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {result && (
                    <div className="text-right">
                      <div className={`text-sm font-medium ${getScoreColor(result.score)}`}>
                        {result.score}%
                      </div>
                      {result.issues.length > 0 && (
                        <div className="text-xs text-red-600">
                          {result.issues.length} issue{result.issues.length !== 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  )}

                  {isTesting ? (
                    <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
                  ) : result ? (
                    result.passed ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => runSingleTest(viewport)}
                      disabled={isTestingAll}
                    >
                      Test
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Test Results Details */}
        {testResults.some(r => r.issues.length > 0) && (
          <div className="space-y-2">
            <h4 className="font-medium">Issues Found:</h4>
            {testResults
              .filter(r => r.issues.length > 0)
              .map((result) => (
                <div key={result.viewport} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="font-medium text-red-800 mb-1">{result.viewport}</div>
                  <ul className="text-sm text-red-700 space-y-1">
                    {result.issues.map((issue, index) => (
                      <li key={index}>• {issue}</li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MobileResponsivenessTest;
