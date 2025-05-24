
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Activity, AlertTriangle, TrendingUp } from 'lucide-react';
import AIInsightCard from './AIInsightCard';
import { useAIBrainInsights } from '@/hooks/useAIBrainInsights';
import { useUnusedFeatures } from '@/hooks/useUnusedFeatures';

const AIBrainMonitor = () => {
  const { insights, isAnalyzing, acceptInsight, dismissInsight } = useAIBrainInsights();
  const { unusedFeatures } = useUnusedFeatures();
  
  const pendingInsights = insights.filter(insight => insight.accepted === null);
  const acceptedInsights = insights.filter(insight => insight.accepted === true);
  const flaggedFeatures = unusedFeatures.filter(feature => feature.flagged);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6 text-blue-600" />
            AI Brain Monitor
          </h2>
          <p className="text-muted-foreground">
            Real-time insights and learning from user behavior
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Insights</p>
                <p className="text-2xl font-bold">{pendingInsights.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Accepted Insights</p>
                <p className="text-2xl font-bold">{acceptedInsights.length}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Flagged Features</p>
                <p className="text-2xl font-bold">{flaggedFeatures.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">AI Health</p>
                <p className="text-2xl font-bold text-green-600">Healthy</p>
              </div>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="insights" className="w-full">
        <TabsList>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="unused">Unused Features</TabsTrigger>
          <TabsTrigger value="patterns">Usage Patterns</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending AI Insights</CardTitle>
            </CardHeader>
            <CardContent>
              {isAnalyzing ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : pendingInsights.length > 0 ? (
                <div className="space-y-4">
                  {pendingInsights.map((insight) => (
                    <AIInsightCard
                      key={insight.id}
                      insight={{
                        id: insight.id,
                        type: insight.type,
                        suggestion_text: insight.suggestion_text || insight.description,
                        triggered_by: insight.triggered_by || 'system',
                        timestamp: insight.timestamp.toISOString(),
                        accepted: insight.accepted || false,
                        context: insight.context || {}
                      }}
                      onAccept={acceptInsight}
                      onDismiss={dismissInsight}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No pending insights. The AI is learning from user behavior.
                </p>
              )}
            </CardContent>
          </Card>

          {acceptedInsights.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Accepted Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {acceptedInsights.slice(0, 5).map((insight) => (
                    <AIInsightCard
                      key={insight.id}
                      insight={{
                        id: insight.id,
                        type: insight.type,
                        suggestion_text: insight.suggestion_text || insight.description,
                        triggered_by: insight.triggered_by || 'system',
                        timestamp: insight.timestamp.toISOString(),
                        accepted: insight.accepted || false,
                        context: insight.context || {}
                      }}
                      onAccept={acceptInsight}
                      onDismiss={dismissInsight}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="unused" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Unused Features Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              {unusedFeatures.length > 0 ? (
                <div className="space-y-3">
                  {unusedFeatures.map((feature) => (
                    <div key={feature.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{feature.feature}</h4>
                        <p className="text-sm text-muted-foreground">
                          Used {feature.usage_count} times
                          {feature.last_seen && (
                            <span> • Last seen: {new Date(feature.last_seen).toLocaleDateString()}</span>
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {feature.flagged && (
                          <Badge variant="destructive">Flagged for Review</Badge>
                        )}
                        {feature.usage_count === 0 && (
                          <Badge variant="secondary">Never Used</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No unused features detected. All features are being utilized.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Usage Patterns</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                Usage pattern analysis coming soon. The AI is collecting behavioral data.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIBrainMonitor;
