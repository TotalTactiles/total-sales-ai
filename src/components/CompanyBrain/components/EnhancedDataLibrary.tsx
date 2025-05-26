
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Database, 
  Search, 
  Filter, 
  RefreshCw,
  ExternalLink,
  FileText,
  Globe,
  Users,
  Upload,
  ChevronDown,
  Calendar
} from 'lucide-react';

interface DataItem {
  id: string;
  source: 'Social' | 'Website' | 'Documents' | 'Video';
  fileName: string;
  tags: string[];
  lastUpdated: Date;
  size: string;
  type: string;
}

export const EnhancedDataLibrary: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('date');

  // Mock data for demonstration
  const mockData: DataItem[] = [
    {
      id: '1',
      source: 'Social',
      fileName: 'Instagram_Posts_Analytics_Nov2024.json',
      tags: ['analytics', 'instagram', 'engagement'],
      lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000),
      size: '2.4 MB',
      type: 'JSON'
    },
    {
      id: '2',
      source: 'Website',
      fileName: 'Homepage_Content_Scraped.html',
      tags: ['homepage', 'content', 'seo'],
      lastUpdated: new Date(Date.now() - 5 * 60 * 60 * 1000),
      size: '856 KB',
      type: 'HTML'
    },
    {
      id: '3',
      source: 'Documents',
      fileName: 'Sales_Playbook_2024.pdf',
      tags: ['sales', 'training', 'playbook'],
      lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      size: '12.3 MB',
      type: 'PDF'
    },
    {
      id: '4',
      source: 'Social',
      fileName: 'LinkedIn_Company_Posts.json',
      tags: ['linkedin', 'b2b', 'company'],
      lastUpdated: new Date(Date.now() - 3 * 60 * 60 * 1000),
      size: '1.8 MB',
      type: 'JSON'
    }
  ];

  const filteredData = mockData.filter(item => {
    const matchesSearch = item.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSource = selectedSource === 'All' || item.source === selectedSource;
    return matchesSearch && matchesSource;
  });

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'Social': return <Users className="h-4 w-4" />;
      case 'Website': return <Globe className="h-4 w-4" />;
      case 'Documents': return <FileText className="h-4 w-4" />;
      case 'Video': return <Upload className="h-4 w-4" />;
      default: return <Database className="h-4 w-4" />;
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'Social': return 'bg-pink-100 text-pink-700 border-pink-200';
      case 'Website': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Documents': return 'bg-green-100 text-green-700 border-green-200';
      case 'Video': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <Card className="bg-white/95 backdrop-blur-sm shadow-lg rounded-2xl border border-slate-200/50 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50/30 border-b border-slate-200/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl shadow-sm">
              <Database className="h-7 w-7 text-blue-600" />
            </div>
            Central Data Library
          </CardTitle>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-2 border-slate-300 hover:bg-slate-50">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button variant="outline" className="gap-2 border-slate-300 hover:bg-slate-50">
              <ExternalLink className="h-4 w-4" />
              View Full Library
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          {[
            { label: 'Social Posts', count: 24, color: 'text-pink-600' },
            { label: 'Website Pages', count: 156, color: 'text-blue-600' },
            { label: 'Documents', count: 89, color: 'text-green-600' },
            { label: 'Videos', count: 12, color: 'text-purple-600' }
          ].map((stat, index) => (
            <div key={stat.label} className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-slate-200/50 text-center shadow-sm">
              <div className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.count}</div>
              <div className="text-sm text-slate-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {/* Search and Filter Controls */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search files, tags, or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-500" />
            <select 
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="All">All Sources</option>
              <option value="Social">Social Media</option>
              <option value="Website">Website</option>
              <option value="Documents">Documents</option>
              <option value="Video">Video</option>
            </select>
          </div>

          <Button variant="outline" size="sm" className="gap-2 border-slate-300">
            <Calendar className="h-4 w-4" />
            Date Range
            <ChevronDown className="h-3 w-3" />
          </Button>
        </div>

        {/* Data Table */}
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
          <div className="bg-slate-50 border-b border-slate-200">
            <div className="grid grid-cols-12 gap-4 p-4 text-sm font-semibold text-slate-700">
              <div className="col-span-1">Source</div>
              <div className="col-span-4">File Name</div>
              <div className="col-span-3">Tags</div>
              <div className="col-span-2">Last Updated</div>
              <div className="col-span-1">Size</div>
              <div className="col-span-1">Actions</div>
            </div>
          </div>
          
          <div className="divide-y divide-slate-100">
            {filteredData.map((item) => (
              <div key={item.id} className="grid grid-cols-12 gap-4 p-4 text-sm hover:bg-slate-50 transition-colors">
                <div className="col-span-1 flex items-center">
                  <Badge className={`gap-1 ${getSourceColor(item.source)}`}>
                    {getSourceIcon(item.source)}
                    {item.source}
                  </Badge>
                </div>
                
                <div className="col-span-4 flex items-center">
                  <div>
                    <div className="font-medium text-slate-800 truncate">{item.fileName}</div>
                    <div className="text-xs text-slate-500">{item.type}</div>
                  </div>
                </div>
                
                <div className="col-span-3 flex items-center">
                  <div className="flex flex-wrap gap-1">
                    {item.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs px-2 py-0.5 bg-slate-100">
                        {tag}
                      </Badge>
                    ))}
                    {item.tags.length > 2 && (
                      <Badge variant="outline" className="text-xs px-2 py-0.5 bg-slate-100">
                        +{item.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="col-span-2 flex items-center text-slate-600">
                  {item.lastUpdated.toLocaleString()}
                </div>
                
                <div className="col-span-1 flex items-center text-slate-600 font-medium">
                  {item.size}
                </div>
                
                <div className="col-span-1 flex items-center">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-blue-50">
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h4 className="font-medium text-slate-600 mb-2">No Data Found</h4>
            <p className="text-sm">Try adjusting your search criteria or connect more data sources.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
