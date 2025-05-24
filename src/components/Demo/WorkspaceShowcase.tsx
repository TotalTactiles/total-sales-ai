
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  Phone, 
  Mail, 
  MessageSquare, 
  Calendar,
  TrendingUp,
  Users,
  Target,
  Zap
} from 'lucide-react';

interface WorkspaceShowcaseProps {
  workspace: string;
  onStartDemo?: () => void;
}

const WorkspaceShowcase: React.FC<WorkspaceShowcaseProps> = ({ workspace, onStartDemo }) => {
  const getWorkspaceInfo = (ws: string) => {
    switch (ws.toLowerCase()) {
      case 'leads':
        return {
          title: 'Lead Management Workspace',
          description: 'Centralized hub for managing your entire lead pipeline with AI-powered insights',
          features: [
            { icon: Brain, title: 'AI Lead Scoring', desc: 'Automatic prioritization based on conversion likelihood' },
            { icon: TrendingUp, title: 'Smart Analytics', desc: 'Real-time performance tracking and forecasting' },
            { icon: Target, title: 'Pipeline Management', desc: 'Visual pipeline with drag-and-drop stages' },
            { icon: Zap, title: 'Automated Workflows', desc: 'Set up triggers for follow-ups and nurturing' }
          ],
          benefits: [
            '40% faster lead qualification',
            '60% improvement in conversion rates',
            '25+ hours saved weekly per rep'
          ]
        };
      case 'dialer':
        return {
          title: 'AI-Powered Dialer Workspace',
          description: 'Smart calling system with real-time AI assistance and automatic logging',
          features: [
            { icon: Phone, title: 'Smart Dialing', desc: 'AI-optimized call timing and sequencing' },
            { icon: Brain, title: 'Real-time Coaching', desc: 'Live suggestions during calls' },
            { icon: TrendingUp, title: 'Call Analytics', desc: 'Detailed performance insights and trends' },
            { icon: Users, title: 'Team Coordination', desc: 'Shared queues and collaborative features' }
          ],
          benefits: [
            '3x more connected calls',
            '50% better conversion rates',
            'Eliminate manual call logging'
          ]
        };
      case 'workspace':
        return {
          title: 'Unified Lead Workspace',
          description: 'Complete 360-degree view of each lead with all communication channels',
          features: [
            { icon: Mail, title: 'Email Integration', desc: 'Gmail/Outlook sync with AI-generated responses' },
            { icon: MessageSquare, title: 'SMS Campaigns', desc: 'Automated text messaging with compliance' },
            { icon: Calendar, title: 'Meeting Scheduler', desc: 'Integrated calendar with smart booking' },
            { icon: Brain, title: 'AI Assistant', desc: 'Context-aware suggestions for every interaction' }
          ],
          benefits: [
            'All communications in one place',
            '80% faster response times',
            'Never miss a follow-up again'
          ]
        };
      default:
        return {
          title: 'Sales Workspace',
          description: 'Comprehensive sales management platform',
          features: [],
          benefits: []
        };
    }
  };

  const info = getWorkspaceInfo(workspace);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">{info.title}</h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-6">{info.description}</p>
        <div className="flex justify-center gap-2 mb-8">
          <Badge variant="secondary" className="bg-green-100 text-green-800">Live Demo</Badge>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">Interactive</Badge>
          <Badge variant="secondary" className="bg-purple-100 text-purple-800">AI-Powered</Badge>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {info.features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Icon className="h-6 w-6 text-blue-600" />
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.desc}</CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Benefits */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-center">See Real Results</CardTitle>
          <CardDescription className="text-center">
            Companies using this workspace typically see:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {info.benefits.map((benefit, index) => (
              <div key={index} className="text-center p-4">
                <div className="text-2xl font-bold text-blue-600 mb-2">✓</div>
                <p className="font-medium text-slate-800">{benefit}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <div className="text-center">
        <Button 
          size="lg" 
          onClick={onStartDemo}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3"
        >
          <Brain className="h-5 w-5 mr-2" />
          Start Interactive Demo
        </Button>
        <p className="text-sm text-slate-500 mt-2">
          Explore with realistic mock data • No setup required
        </p>
      </div>
    </div>
  );
};

export default WorkspaceShowcase;
