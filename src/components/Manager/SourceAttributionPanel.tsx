
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Target,
  AlertTriangle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

interface SourceStats {
  source: string;
  totalLeads: number;
  qualifiedLeads: number;
  closedDeals: number;
  totalSpend: number;
  conversionRate: number;
  avgCloseValue: number;
  qualityScore: number;
  trend: 'up' | 'down' | 'stable';
}

const SourceAttributionPanel: React.FC = () => {
  const { profile } = useAuth();
  const [sourceStats, setSourceStats] = useState<SourceStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    if (profile?.company_id) {
      loadSourceStats();
    }
  }, [profile?.company_id]);

  const loadSourceStats = async () => {
    if (!profile?.company_id) return;

    try {
      setIsLoading(true);

      // Get source stats from database
      const { data: stats } = await supabase
        .from('lead_source_stats')
        .select('*')
        .eq('company_id', profile.company_id)
        .order('total_leads', { ascending: false });

      if (stats) {
        const processedStats: SourceStats[] = stats.map(stat => ({
          source: stat.source,
          totalLeads: stat.total_leads || 0,
          qualifiedLeads: stat.qualified_leads || 0,
          closedDeals: stat.closed_deals || 0,
          totalSpend: stat.total_spend || 0,
          conversionRate: stat.conversion_rate || 0,
          avgCloseValue: stat.avg_close_value || 0,
          qualityScore: calculateQualityScore(stat),
          trend: determineTrend(stat)
        }));

        setSourceStats(processedStats);
      }

      setLastUpdate(new Date());
    } catch (error) {
      logger.error('Failed to load source stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateQualityScore = (stat: any): number => {
    let score = 0;
    
    // Conversion rate (40% weight)
    score += (stat.conversion_rate || 0) * 40;
    
    // Lead volume (30% weight)
    const normalizedVolume = Math.min((stat.total_leads || 0) / 100, 1);
    score += normalizedVolume * 30;
    
    // ROI (30% weight)
    if (stat.total_spend > 0) {
      const roi = ((stat.closed_deals * stat.avg_close_value) - stat.total_spend) / stat.total_spend;
      score += Math.max(0, Math.min(roi, 1)) * 30;
    } else {
      score += 15; // Default for organic sources
    }

    return Math.round(score);
  };

  const determineTrend = (stat: any): 'up' | 'down' | 'stable' => {
    // This would typically compare with previous period data
    // For now, using conversion rate as indicator
    const conversionRate = stat.conversion_rate || 0;
    if (conversionRate > 0.3) return 'up';
    if (conversionRate < 0.1) return 'down';
    return 'stable';
  };

  const getQualityBadge = (score: number) => {
    if (score >= 80) return { variant: 'default' as const, label: 'Excellent', color: 'text-green-600' };
    if (score >= 60) return { variant: 'secondary' as const, label: 'Good', color: 'text-blue-600' };
    if (score >= 40) return { variant: 'secondary' as const, label: 'Fair', color: 'text-yellow-600' };
    return { variant: 'destructive' as const, label: 'Poor', color: 'text-red-600' };
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <div className="h-4 w-4" />;
    }
  };

  const calculateROI = (stat: SourceStats): number => {
    if (stat.totalSpend === 0) return 0;
    const revenue = stat.closedDeals * stat.avgCloseValue;
    return ((revenue - stat.totalSpend) / stat.totalSpend) * 100;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Source Attribution & Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Source Attribution & Performance</h2>
          <p className="text-gray-600">Track lead quality and ROI across all sources</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </div>
          <Button onClick={loadSourceStats} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-sm text-gray-600">Total Sources</div>
                <div className="text-2xl font-bold">{sourceStats.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-sm text-gray-600">Best Conversion</div>
                <div className="text-2xl font-bold">
                  {sourceStats.length > 0 
                    ? `${Math.round(Math.max(...sourceStats.map(s => s.conversionRate * 100)))}%`
                    : '0%'
                  }
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-sm text-gray-600">Total Spend</div>
                <div className="text-2xl font-bold">
                  ${sourceStats.reduce((sum, s) => sum + s.totalSpend, 0).toLocaleString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-sm text-gray-600">High Quality Sources</div>
                <div className="text-2xl font-bold">
                  {sourceStats.filter(s => s.qualityScore >= 80).length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Source Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sourceStats.map((stat) => {
          const qualityBadge = getQualityBadge(stat.qualityScore);
          const roi = calculateROI(stat);

          return (
            <Card key={stat.source}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="capitalize">{stat.source.replace('_', ' ')}</span>
                    {getTrendIcon(stat.trend)}
                  </div>
                  <Badge variant={qualityBadge.variant}>
                    {qualityBadge.label}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Quality Score */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Quality Score</span>
                    <span className="font-medium">{stat.qualityScore}/100</span>
                  </div>
                  <Progress value={stat.qualityScore} className="h-2" />
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">Total Leads</div>
                    <div className="font-semibold">{stat.totalLeads}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Qualified</div>
                    <div className="font-semibold">{stat.qualifiedLeads}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Closed Deals</div>
                    <div className="font-semibold">{stat.closedDeals}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Conversion Rate</div>
                    <div className="font-semibold">{(stat.conversionRate * 100).toFixed(1)}%</div>
                  </div>
                </div>

                {/* Financial Metrics */}
                {stat.totalSpend > 0 && (
                  <div className="pt-2 border-t">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600">Total Spend</div>
                        <div className="font-semibold">${stat.totalSpend.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">ROI</div>
                        <div className={`font-semibold ${roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {roi >= 0 ? '+' : ''}{roi.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Alert for poor performance */}
                {stat.qualityScore < 40 && (
                  <div className="flex items-center gap-2 p-2 bg-red-50 rounded-lg border border-red-200">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <div className="text-sm text-red-800">
                      Low performance source - consider optimization or pause
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {sourceStats.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Source Data Available</h3>
            <p className="text-gray-500">Source attribution data will appear here once leads start coming in.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SourceAttributionPanel;
