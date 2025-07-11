
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  BarChart3, 
  TrendingUp, 
  Calculator, 
  Target,
  Zap,
  PlayCircle
} from 'lucide-react';
import { useManagerAI } from '@/hooks/useManagerAI';
import ChatBubble from './ChatBubble';
import AIChartRenderer from './AIChartRenderer';

interface ScenarioSimulation {
  id: string;
  name: string;
  description: string;
  parameters: Record<string, number>;
  results: {
    projectedROAS: number;
    estimatedRevenue: number;
    riskLevel: 'low' | 'medium' | 'high';
    confidence: number;
  };
  chartData?: any;
}

const BusinessOpsAI: React.FC = () => {
  const { askJarvis, isGenerating } = useManagerAI();
  const [scenarios, setScenarios] = useState<ScenarioSimulation[]>([]);
  const [currentKPIs, setCurrentKPIs] = useState<any>(null);
  const [adSpendInput, setAdSpendInput] = useState('');
  const [channelInput, setChannelInput] = useState('');

  useEffect(() => {
    // Load current KPIs
    setCurrentKPIs({
      type: 'scorecard',
      data: {
        ROAS: 3.2,
        CAC: 125,
        LTV: 890,
        ConversionRate: 2.8,
        Revenue: 45600
      }
    });

    // Load example scenarios
    setScenarios([
      {
        id: '1',
        name: 'Increase Google Ads Budget',
        description: 'Shift 20% more budget to Google Ads',
        parameters: { budget_increase: 20, channel: 'google_ads' },
        results: {
          projectedROAS: 3.8,
          estimatedRevenue: 52000,
          riskLevel: 'low',
          confidence: 85
        }
      }
    ]);
  }, []);

  const runScenarioSimulation = async () => {
    if (!adSpendInput || !channelInput) return;

    try {
      const response = await askJarvis(
        `Run scenario simulation: increase ${channelInput} ad spend by ${adSpendInput}%`,
        {
          simulationType: 'ad_spend_optimization',
          parameters: {
            channel: channelInput,
            budgetIncrease: parseFloat(adSpendInput)
          }
        }
      );

      if (response.insights) {
        const newScenario: ScenarioSimulation = {
          id: Date.now().toString(),
          name: `${channelInput} Budget Increase`,
          description: `Increase ${channelInput} spend by ${adSpendInput}%`,
          parameters: { 
            budget_increase: parseFloat(adSpendInput), 
            channel: channelInput 
          },
          results: {
            projectedROAS: response.insights.projectedROAS || 3.5,
            estimatedRevenue: response.insights.estimatedRevenue || 48000,
            riskLevel: response.insights.riskLevel || 'medium',
            confidence: response.insights.confidence || 75
          },
          chartData: response.chartData
        };

        setScenarios(prev => [newScenario, ...prev]);
        setAdSpendInput('');
        setChannelInput('');
      }
    } catch (error) {
      console.error('Scenario simulation failed:', error);
    }
  };

  const generateKPIProjections = async () => {
    try {
      const response = await askJarvis('Generate KPI projections for next quarter', {
        includeChart: true,
        kpiTypes: ['ROAS', 'CAC', 'LTV', 'Revenue']
      });

      if (response.chartData) {
        setCurrentKPIs(response.chartData);
      }
    } catch (error) {
      console.error('KPI projection failed:', error);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Current KPIs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Current KPIs
            </CardTitle>
            <Button 
              onClick={generateKPIProjections}
              disabled={isGenerating}
              size="sm"
            >
              <TrendingUp className="h-4 w-4 mr-1" />
              Project KPIs
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {currentKPIs && (
            <AIChartRenderer 
              data={currentKPIs.data} 
              type={currentKPIs.type}
              title="Key Performance Indicators"
            />
          )}
        </CardContent>
      </Card>

      {/* Scenario Builder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-green-600" />
            Scenario Simulation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-1 block">Channel</label>
              <Input
                placeholder="e.g., Google Ads"
                value={channelInput}
                onChange={(e) => setChannelInput(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium mb-1 block">Budget Change (%)</label>
              <Input
                type="number"
                placeholder="e.g., 20"
                value={adSpendInput}
                onChange={(e) => setAdSpendInput(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={runScenarioSimulation}
                disabled={isGenerating || !adSpendInput || !channelInput}
              >
                <PlayCircle className="h-4 w-4 mr-1" />
                Run Simulation
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Simulation Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-600" />
            Simulation Results
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {scenarios.map((scenario) => (
            <div key={scenario.id} className="p-4 border rounded-lg bg-gray-50">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium">{scenario.name}</h4>
                  <p className="text-sm text-gray-600">{scenario.description}</p>
                </div>
                <Badge className={getRiskColor(scenario.results.riskLevel)}>
                  {scenario.results.riskLevel} risk
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {scenario.results.projectedROAS}x
                  </div>
                  <div className="text-xs text-gray-500">Projected ROAS</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    ${scenario.results.estimatedRevenue.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">Est. Revenue</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {scenario.results.confidence}%
                  </div>
                  <div className="text-xs text-gray-500">Confidence</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    +{scenario.parameters.budget_increase}%
                  </div>
                  <div className="text-xs text-gray-500">Budget Change</div>
                </div>
              </div>

              {scenario.chartData && (
                <AIChartRenderer 
                  data={scenario.chartData.data} 
                  type={scenario.chartData.type}
                  title={`${scenario.name} Projection`}
                />
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Business Ops AI Chat Bubble */}
      <ChatBubble 
        assistantType="business-ops"
        enabled={true}
        position="bottom-right"
      />
    </div>
  );
};

export default BusinessOpsAI;
