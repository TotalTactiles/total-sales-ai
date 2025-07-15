
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  FileText, 
  ExternalLink,
  Upload,
  Cloud,
  HardDrive,
  Globe
} from 'lucide-react';

interface Article {
  id: string;
  title: string;
  source: string;
  type: 'article' | 'document' | 'webpage';
  dateAdded: Date;
  tags: string[];
}

const KnowledgeTab: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const articles: Article[] = [
    {
      id: '1',
      title: 'Sales Best Practices Guide',
      source: 'Internal Document',
      type: 'document',
      dateAdded: new Date(),
      tags: ['sales', 'training', 'best-practices']
    },
    {
      id: '2', 
      title: 'Industry Market Analysis Q4',
      source: 'Research Report',
      type: 'article',
      dateAdded: new Date(),
      tags: ['market', 'analysis', 'trends']
    },
    {
      id: '3',
      title: 'Competitor Pricing Strategy',
      source: 'Web Article',
      type: 'webpage',
      dateAdded: new Date(),
      tags: ['competition', 'pricing', 'strategy']
    }
  ];

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const importOptions = [
    { name: 'Google Drive', icon: Cloud, description: 'Import from Google Drive' },
    { name: 'Device Upload', icon: HardDrive, description: 'Upload from your device' },
    { name: 'Dropbox', icon: Cloud, description: 'Import from Dropbox' },
    { name: 'Web URL', icon: Globe, description: 'Add article from URL' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Knowledge Base</h2>
          <p className="text-muted-foreground">Manage articles and documents for AI reference</p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Article
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Article</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {importOptions.map((option) => (
                <Button
                  key={option.name}
                  variant="outline"
                  className="w-full justify-start h-auto p-4"
                  onClick={() => {
                    // Handle import option selection
                    setIsAddModalOpen(false);
                  }}
                >
                  <option.icon className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">{option.name}</div>
                    <div className="text-sm text-muted-foreground">{option.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search articles, snippets, file names..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredArticles.map((article) => (
          <Card key={article.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  {article.title}
                </CardTitle>
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm text-muted-foreground">
                  Source: {article.source}
                </div>
                <div className="text-sm text-muted-foreground">
                  Added: {article.dateAdded.toLocaleDateString()}
                </div>
                <div className="flex flex-wrap gap-1">
                  {article.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No articles found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? 'Try a different search term' : 'Start by adding your first article'}
            </p>
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Article
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default KnowledgeTab;
