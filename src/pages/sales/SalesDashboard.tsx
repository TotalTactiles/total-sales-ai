
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Phone, 
  Mail, 
  Calendar,
  TrendingUp,
  Users,
  Target,
  Clock,
  DollarSign,
  Zap,
  Brain,
  Headphones,
  Settings,
  FileText,
  Upload,
  Download
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useMockData } from '@/hooks/useMockData';
import AISummaryCard from '@/components/AI/AISummaryCard';
import AIRecommendations from '@/components/AI/AIRecommendations';
import AICoachingPanel from '@/components/AI/AICoachingPanel';
import VoiceBriefing from '@/components/AI/VoiceBriefing';
import UnifiedAIBubble from '@/components/UnifiedAI/UnifiedAIBubble';
import PerformanceCardsGrid from '@/components/Dashboard/PerformanceCardsGrid';
import OptimizedPipelinePulse from '@/components/Dashboard/OptimizedPipelinePulse';
import RewardsProgress from '@/components/Dashboard/RewardsProgress';
import AIOptimizedSchedule from '@/components/Dashboard/AIOptimizedSchedule';

const SalesRepDashboard: React.FC = () => {
  const { profile } = useAuth();
  const { leads } = useMockData();

  const handleImportCSV = () => {
    // Create file input element
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // Here you would implement CSV parsing and lead import
        console.log('Importing CSV file:', file.name);
        // For now, just show a placeholder message
        alert('CSV import functionality will be implemented here');
      }
    };
    input.click();
  };

  const handleExportCSV = () => {
    // Here you would implement CSV export of leads
    console.log('Exporting leads to CSV');
    // For now, just show a placeholder message
    alert('CSV export functionality will be implemented here');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Section with Performance Cards and Voice Briefing */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Performance Cards Grid - Now in top-left */}
          <div className="lg:col-span-2">
            <PerformanceCardsGrid />
          </div>
          
          {/* Voice Briefing - Right side */}
          <div>
            <VoiceBriefing userName={profile?.full_name || 'Sales Rep'} />
          </div>
        </div>

        {/* CSV Management Section for Sales Reps */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Lead Management Tools
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Import and export your leads using CSV files for personal workflow management
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                onClick={handleImportCSV}
                className="h-20 flex flex-col items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <Upload className="h-6 w-6" />
                <span>Import CSV</span>
              </Button>
              
              <Button 
                onClick={handleExportCSV}
                variant="outline"
                className="h-20 flex flex-col items-center justify-center gap-2 border-green-600 text-green-600 hover:bg-green-50"
              >
                <Download className="h-6 w-6" />
                <span>Export CSV</span>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-4 text-center">
              Note: CRM integrations are managed by your team manager and feed data to all team members
            </p>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Optimized Pipeline Pulse */}
          <div className="lg:col-span-2">
            <OptimizedPipelinePulse leads={leads} />
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* AI Assistant Summary */}
            <AISummaryCard />

            {/* AI-Optimized Schedule */}
            <AIOptimizedSchedule />
          </div>
        </div>

        {/* Rewards Progress Section */}
        <div className="mt-6">
          <RewardsProgress />
        </div>

        {/* AI Recommendations and Coaching - Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AIRecommendations />
          <AICoachingPanel />
        </div>

        {/* AI Assistant Contextual Bubble */}
        <UnifiedAIBubble 
          context={{
            workspace: 'dashboard',
            currentLead: undefined,
            isCallActive: false
          }}
        />
      </div>
    </div>
  );
};

export default SalesRepDashboard;
