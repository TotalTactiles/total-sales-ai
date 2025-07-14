
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { 
  Filter, 
  Search, 
  Grid, 
  List, 
  User,
  TrendingUp,
  MapPin,
  Users
} from 'lucide-react';
import { toast } from 'sonner';

const SalesRepsFilters: React.FC = () => {
  const [performanceFilter, setPerformanceFilter] = useState('all');
  const [teamFilter, setTeamFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('all');
  const [viewMode, setViewMode] = useState('card');
  const [searchTerm, setSearchTerm] = useState('');

  const salesReps = [
    {
      id: 'rep-001',
      name: 'Sarah Johnson',
      avatar: 'SJ',
      performance: 'High',
      team: 'Enterprise',
      region: 'North',
      revenue: '$45K',
      calls: 89,
      deals: 12,
      conversionRate: '28%'
    },
    {
      id: 'rep-002',
      name: 'Michael Chen',
      avatar: 'MC',
      performance: 'Medium',
      team: 'SMB',
      region: 'South',
      revenue: '$32K',
      calls: 67,
      deals: 8,
      conversionRate: '22%'
    },
    {
      id: 'rep-003',
      name: 'Emma Rodriguez',
      avatar: 'ER',
      performance: 'High',
      team: 'Enterprise',
      region: 'West',
      revenue: '$38K',
      calls: 75,
      deals: 10,
      conversionRate: '25%'
    },
    {
      id: 'rep-004',
      name: 'James Wilson',
      avatar: 'JW',
      performance: 'Low',
      team: 'Mid-Market',
      region: 'East',
      revenue: '$28K',
      calls: 45,
      deals: 6,
      conversionRate: '18%'
    }
  ];

  const filteredReps = salesReps.filter(rep => {
    const matchesPerformance = performanceFilter === 'all' || rep.performance.toLowerCase() === performanceFilter;
    const matchesTeam = teamFilter === 'all' || rep.team === teamFilter;
    const matchesRegion = regionFilter === 'all' || rep.region === regionFilter;
    const matchesSearch = searchTerm === '' || rep.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesPerformance && matchesTeam && matchesRegion && matchesSearch;
  });

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'High': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleRepClick = (rep: any) => {
    toast.success(`Opening ${rep.name} profile`);
  };

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Performance</label>
              <Select value={performanceFilter} onValueChange={setPerformanceFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Performance</SelectItem>
                  <SelectItem value="high">High Performers</SelectItem>
                  <SelectItem value="medium">Medium Performers</SelectItem>
                  <SelectItem value="low">Low Performers</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Team</label>
              <Select value={teamFilter} onValueChange={setTeamFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Teams</SelectItem>
                  <SelectItem value="Enterprise">Enterprise</SelectItem>
                  <SelectItem value="SMB">SMB</SelectItem>
                  <SelectItem value="Mid-Market">Mid-Market</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Region</label>
              <Select value={regionFilter} onValueChange={setRegionFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="North">North</SelectItem>
                  <SelectItem value="South">South</SelectItem>
                  <SelectItem value="East">East</SelectItem>
                  <SelectItem value="West">West</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Search</label>
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Search reps..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
          
          {/* View Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">View:</span>
            <Button
              size="sm"
              variant={viewMode === 'card' ? 'default' : 'outline'}
              onClick={() => setViewMode('card')}
              className="gap-2"
            >
              <Grid className="h-4 w-4" />
              Card
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'list' ? 'default' : 'outline'}
              onClick={() => setViewMode('list')}
              className="gap-2"
            >
              <List className="h-4 w-4" />
              List
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {filteredReps.length} of {salesReps.length} sales reps
        </p>
        <div className="flex items-center gap-2">
          {performanceFilter !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              <TrendingUp className="h-3 w-3" />
              {performanceFilter}
            </Badge>
          )}
          {teamFilter !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              <Users className="h-3 w-3" />
              {teamFilter}
            </Badge>
          )}
          {regionFilter !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              <MapPin className="h-3 w-3" />
              {regionFilter}
            </Badge>
          )}
        </div>
      </div>

      {/* Reps Display */}
      {viewMode === 'card' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReps.map((rep) => (
            <Card 
              key={rep.id} 
              className="hover:shadow-lg transition-all duration-200 cursor-pointer"
              onClick={() => handleRepClick(rep)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {rep.avatar}
                    </div>
                    <div>
                      <h3 className="font-semibold">{rep.name}</h3>
                      <p className="text-sm text-gray-600">{rep.team} Team</p>
                    </div>
                  </div>
                  <Badge className={getPerformanceColor(rep.performance)}>
                    {rep.performance}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Revenue</p>
                    <p className="font-semibold">{rep.revenue}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Deals</p>
                    <p className="font-semibold">{rep.deals}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Calls</p>
                    <p className="font-semibold">{rep.calls}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Conv. Rate</p>
                    <p className="font-semibold">{rep.conversionRate}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {filteredReps.map((rep) => (
                <div 
                  key={rep.id}
                  className="p-4 hover:bg-gray-50 cursor-pointer flex items-center justify-between"
                  onClick={() => handleRepClick(rep)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {rep.avatar}
                    </div>
                    <div>
                      <h3 className="font-semibold">{rep.name}</h3>
                      <p className="text-sm text-gray-600">{rep.team} • {rep.region}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <p className="font-semibold">{rep.revenue}</p>
                      <p className="text-gray-600">Revenue</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold">{rep.deals}</p>
                      <p className="text-gray-600">Deals</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold">{rep.conversionRate}</p>
                      <p className="text-gray-600">Conv. Rate</p>
                    </div>
                    <Badge className={getPerformanceColor(rep.performance)}>
                      {rep.performance}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SalesRepsFilters;
