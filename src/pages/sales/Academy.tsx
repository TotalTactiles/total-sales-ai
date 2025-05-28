
import React from 'react';
import { Brain, BookOpen, GraduationCap, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const SalesAcademy = () => {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales Academy</h1>
          <p className="text-muted-foreground mt-2">
            Enhance your sales skills with AI-powered training and company knowledge
          </p>
        </div>
        <Button>
          <GraduationCap className="h-4 w-4 mr-2" />
          Start Learning
        </Button>
      </div>

      {/* Academy Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-primary" />
              <CardTitle>Company Brain</CardTitle>
            </div>
            <CardDescription>
              Access your company's knowledge base and AI insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Explore Knowledge Base
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <CardTitle>Sales Training</CardTitle>
            </div>
            <CardDescription>
              Interactive training modules and best practices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Start Training
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              <CardTitle>AI Insights</CardTitle>
            </div>
            <CardDescription>
              Personalized insights and recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              View Insights
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Learning Activity</h2>
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground text-center py-8">
              No recent activity. Start exploring the academy to see your progress here.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SalesAcademy;
