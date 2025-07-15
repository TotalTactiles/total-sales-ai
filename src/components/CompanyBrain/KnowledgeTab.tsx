import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Search,
  Plus,
  FileText,
  Upload,
  Link,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  Clock,
  Globe,
  Cloud,
  HardDrive,
  MessageSquare
} from 'lucide-react';

const KnowledgeTab: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const articles = [
    {
      id: 1,
      title: 'Sales Process Documentation',
      type: 'Document',
      source: 'Google Drive',
      lastUpdated: '2 days ago',
      status: 'active'
    },
    {
      id: 2,
      title: 'Product Training Materials',
      type: 'PDF',
      source: 'Device Upload',
      lastUpdated: '1 week ago',
      status: 'active'
    },
    {
      id: 3,
      title: 'Competitive Analysis Q4',
      type: 'Spreadsheet',
      source: 'Dropbox',
      lastUpdated: '3 days ago',
      status: 'active'
    }
  ];

  const socialPlatforms = [
    {
      name: 'Meta (Facebook)',
      connected: true,
      lastSync: '30 mins ago',
      status: 'syncing'
    },
    {
      name: 'LinkedIn',
      connected: true,
      lastSync: '2 hours ago',
      status: 'success'
    },
    {
      name: 'TikTok',
      connected: false,
      lastSync: 'Never',
      status: 'disconnected'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'syncing': return 'bg-orange-100 text-orange-800';
      case 'disconnected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4" />;
      case 'syncing': return <Clock className="h-4 w-4" />;
      case 'disconnected': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Knowledge Articles Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Knowledge Base
            </CardTitle>
            <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Article
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Knowledge Article</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="h-20 flex flex-col gap-2">
                      <Globe className="h-6 w-6" />
                      <span className="text-sm">Google Drive</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col gap-2">
                      <HardDrive className="h-6 w-6" />
                      <span className="text-sm">Device Upload</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col gap-2">
                      <Cloud className="h-6 w-6" />
                      <span className="text-sm">Dropbox</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col gap-2">
                      <Link className="h-6 w-6" />
                      <span className="text-sm">Web Link</span>
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search articles, snippets, file names..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-3">
            {articles.map((article) => (
              <div key={article.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-gray-500" />
                  <div>
                    <h4 className="font-medium">{article.title}</h4>
                    <p className="text-sm text-gray-500">
                      {article.type} • {article.source} • {article.lastUpdated}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    Active
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Social Media Integration Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Social Media Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {socialPlatforms.map((platform) => (
              <div key={platform.name} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Globe className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">{platform.name}</h4>
                    <p className="text-sm text-gray-500">Last sync: {platform.lastSync}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={getStatusColor(platform.status)}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(platform.status)}
                      <span className="capitalize">{platform.status}</span>
                    </div>
                  </Badge>
                  <Button 
                    variant={platform.connected ? "outline" : "default"} 
                    size="sm"
                  >
                    {platform.connected ? 'Disconnect' : 'Connect'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Integration Benefits</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Syncs every 30 minutes for real-time insights</li>
              <li>• Powers AI Assistant recommendations</li>
              <li>• Enhances lead profiling and campaign tools</li>
              <li>• Appears in Lead tab for comprehensive view</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KnowledgeTab;
