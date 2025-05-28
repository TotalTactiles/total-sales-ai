
import React from 'react';
import { Bot, MessageSquare, Zap, Target, TrendingUp, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const SalesAI = () => {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Assistant</h1>
          <p className="text-muted-foreground mt-2">
            Your intelligent sales companion powered by advanced AI
          </p>
        </div>
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
          AI Active
        </Badge>
      </div>

      {/* AI Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <CardTitle>Smart Conversations</CardTitle>
            </div>
            <CardDescription>
              AI-powered conversation insights and suggestions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Start Conversation
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-primary" />
              <CardTitle>Lead Scoring</CardTitle>
            </div>
            <CardDescription>
              Automatic lead prioritization and scoring
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              View Scores
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <CardTitle>Performance Insights</CardTitle>
            </div>
            <CardDescription>
              AI-driven performance analysis and recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Get Insights
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-primary" />
              <CardTitle>Auto-Responses</CardTitle>
            </div>
            <CardDescription>
              Intelligent email and message automation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Configure
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-primary" />
              <CardTitle>Lead Recommendations</CardTitle>
            </div>
            <CardDescription>
              AI suggests next best actions for each lead
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              View Recommendations
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5 text-primary" />
              <CardTitle>AI Coach</CardTitle>
            </div>
            <CardDescription>
              Personal AI coach for sales skill improvement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Start Coaching
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* AI Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle>Recent AI Activity</CardTitle>
          <CardDescription>
            Your AI assistant's recent actions and recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <div>
                <p className="text-sm font-medium">Lead Score Updated</p>
                <p className="text-xs text-muted-foreground">AI updated score for TechCorp Inc. to 92/100</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <div>
                <p className="text-sm font-medium">Conversation Insight</p>
                <p className="text-xs text-muted-foreground">AI detected buying signals in last call with Global Solutions</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
              <div>
                <p className="text-sm font-medium">Action Recommended</p>
                <p className="text-xs text-muted-foreground">AI suggests following up with StartupXYZ within 2 hours</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesAI;
