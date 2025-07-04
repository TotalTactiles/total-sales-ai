
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Heart, 
  TrendingUp, 
  AlertTriangle, 
  Gift, 
  RefreshCw, 
  Users,
  DollarSign,
  Phone
} from 'lucide-react';

interface RetentionClient {
  id: string;
  name: string;
  category: 'churn-risk' | 'referral-opportunity' | 'upsell-path' | 'reactivation-candidate';
  score: number;
  revenue: number;
  lastContact: string;
  riskFactors: string[];
  opportunity: string;
}

const RetentionIntelligencePanel: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<string>('30days');

  const retentionClients: RetentionClient[] = [
    {
      id: '1',
      name: 'TechCorp Solutions',
      category: 'churn-risk',
      score: 25,
      revenue: 45000,
      lastContact: '14 days ago',
      riskFactors: ['Support tickets increased', 'Usage decreased 40%', 'Contract expires soon'],
      opportunity: 'Schedule immediate check-in call'
    },
    {
      id: '2',
      name: 'Global Industries',
      category: 'upsell-path',
      score: 85,
      revenue: 28000,
      lastContact: '3 days ago',
      riskFactors: ['High feature usage', 'Growing team size', 'Budget approved'],
      opportunity: 'Propose premium package upgrade'
    },
    {
      id: '3',
      name: 'StartupX Inc',
      category: 'referral-opportunity',
      score: 92,
      revenue: 12000,
      lastContact: '1 week ago',
      riskFactors: ['Highly satisfied', 'Active in community', 'CEO is connector'],
      opportunity: 'Request referral introduction'
    },
    {
      id: '4',
      name: 'MegaCorp Ltd',
      category: 'reactivation-candidate',
      score: 60,
      revenue: 67000,
      lastContact: '45 days ago',
      riskFactors: ['Paused service', 'New leadership', 'Budget reallocation'],
      opportunity: 'Present new use case alignment'
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'churn-risk':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'upsell-path':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'referral-opportunity':
        return <Users className="h-4 w-4 text-blue-600" />;
      case 'reactivation-candidate':
        return <RefreshCw className="h-4 w-4 text-orange-600" />;
      default:
        return <Heart className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'churn-risk':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'upsell-path':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'referral-opportunity':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'reactivation-candidate':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatCategoryName = (category: string) => {
    return category.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const filteredClients = selectedCategory === 'all' 
    ? retentionClients 
    : retentionClients.filter(client => client.category === selectedCategory);

  const categoryStats = {
    'churn-risk': retentionClients.filter(c => c.category === 'churn-risk').length,
    'upsell-path': retentionClients.filter(c => c.category === 'upsell-path').length,
    'referral-opportunity': retentionClients.filter(c => c.category === 'referral-opportunity').length,
    'reactivation-candidate': retentionClients.filter(c => c.category === 'reactivation-candidate').length,
  };

  return (
    <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-purple-700">
            <Heart className="h-5 w-5" />
            Retention Intelligence Panel
          </CardTitle>
          <div className="flex gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-28 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">7 Days</SelectItem>
                <SelectItem value="30days">30 Days</SelectItem>
                <SelectItem value="90days">90 Days</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-36 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="churn-risk">Churn Risk</SelectItem>
                <SelectItem value="upsell-path">Upsell Path</SelectItem>
                <SelectItem value="referral-opportunity">Referral Opp.</SelectItem>
                <SelectItem value="reactivation-candidate">Reactivation</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Category Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          <div className="p-3 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-xs font-semibold text-red-800">Churn Risk</span>
            </div>
            <div className="text-lg font-bold text-red-700">{categoryStats['churn-risk']}</div>
          </div>
          
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-xs font-semibold text-green-800">Upsell Path</span>
            </div>
            <div className="text-lg font-bold text-green-700">{categoryStats['upsell-path']}</div>
          </div>
          
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-semibold text-blue-800">Referral Opp.</span>
            </div>
            <div className="text-lg font-bold text-blue-700">{categoryStats['referral-opportunity']}</div>
          </div>
          
          <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex items-center gap-2 mb-1">
              <RefreshCw className="h-4 w-4 text-orange-600" />
              <span className="text-xs font-semibold text-orange-800">Reactivation</span>
            </div>
            <div className="text-lg font-bold text-orange-700">{categoryStats['reactivation-candidate']}</div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {filteredClients.map((client) => (
            <div
              key={client.id}
              className={`p-4 rounded-lg border-2 ${getCategoryColor(client.category)} hover:shadow-md transition-all duration-200`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {getCategoryIcon(client.category)}
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">{client.name}</h4>
                    <Badge className="text-xs mt-1">
                      {formatCategoryName(client.category)}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${getScoreColor(client.score)}`}>
                    {client.score}%
                  </div>
                  <div className="text-xs text-gray-600">Health Score</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <div className="text-xs text-gray-600">Revenue</div>
                  <div className="font-semibold text-sm">${client.revenue.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">Last Contact</div>
                  <div className="font-semibold text-sm">{client.lastContact}</div>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="text-xs text-gray-600 mb-1">Key Factors:</div>
                <div className="flex flex-wrap gap-1">
                  {client.riskFactors.slice(0, 2).map((factor, index) => (
                    <span key={index} className="text-xs bg-white/60 px-2 py-1 rounded">
                      {factor}
                    </span>
                  ))}
                  {client.riskFactors.length > 2 && (
                    <span className="text-xs text-gray-500">+{client.riskFactors.length - 2} more</span>
                  )}
                </div>
              </div>
              
              <div className="bg-white/60 p-2 rounded-md mb-3">
                <div className="text-xs font-medium text-gray-800 mb-1">Recommended Action:</div>
                <div className="text-xs text-gray-700">{client.opportunity}</div>
              </div>
              
              <div className="flex gap-2">
                <Button size="sm" className="flex-1 h-7 text-xs">
                  <Phone className="h-3 w-3 mr-1" />
                  Contact
                </Button>
                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs">
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RetentionIntelligencePanel;
