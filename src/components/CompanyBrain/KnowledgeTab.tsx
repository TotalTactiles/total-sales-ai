
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Plus, 
  FileText, 
  Download, 
  Upload,
  FolderOpen,
  Cloud,
  HardDrive,
  Globe
} from 'lucide-react';
import { toast } from 'sonner';

interface KnowledgeArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  type: 'article' | 'document' | 'snippet';
  source: string;
  lastModified: Date;
  tags: string[];
}

const KnowledgeTab: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Mock knowledge base data
  const [knowledgeBase] = useState<KnowledgeArticle[]>([
    {
      id: '1',
      title: 'Sales Process Documentation',
      content: 'Comprehensive guide to our sales methodology...',
      category: 'Sales',
      type: 'document',
      source: 'Internal',
      lastModified: new Date('2024-01-15'),
      tags: ['sales', 'process', 'methodology']
    },
    {
      id: '2',
      title: 'Product Feature Overview',
      content: 'Detailed breakdown of all product features...',
      category: 'Product',
      type: 'article',
      source: 'Product Team',
      lastModified: new Date('2024-01-10'),
      tags: ['product', 'features', 'overview']
    },
    {
      id: '3',
      title: 'Customer Objection Handling',
      content: 'Common objections and recommended responses...',
      category: 'Training',
      type: 'snippet',
      source: 'Training Materials',
      lastModified: new Date('2024-01-08'),
      tags: ['objections', 'responses', 'training']
    }
  ]);

  const categories = ['all', 'Sales', 'Product', 'Training', 'Marketing', 'Support'];

  const filteredArticles = knowledgeBase.filter(article => {
    const matchesSearch = searchQuery === '' || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleFileUpload = (source: string) => {
    toast.info(`File upload from ${source} - Feature disabled for demo`);
    setIsAddModalOpen(false);
  };

  const AddArticleModal = () => (
    <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Knowledge Article</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">Upload File</TabsTrigger>
            <TabsTrigger value="import">Import</TabsTrigger>
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="h-24 flex flex-col gap-2"
                onClick={() => handleFileUpload('Device')}
              >
                <HardDrive className="h-8 w-8" />
                <span>From Device</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-24 flex flex-col gap-2"
                onClick={() => handleFileUpload('Google Drive')}
              >
                <Cloud className="h-8 w-8" />
                <span>Google Drive</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-24 flex flex-col gap-2"
                onClick={() => handleFileUpload('Dropbox')}
              >
                <Cloud className="h-8 w-8" />
                <span>Dropbox</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-24 flex flex-col gap-2"
                onClick={() => handleFileUpload('OneDrive')}
              >
                <Cloud className="h-8 w-8" />
                <span>OneDrive</span>
              </Button>
            </div>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">Drag and drop files here</p>
              <p className="text-sm text-gray-500 mt-2">
                Supports: PDF, DOC, DOCX, TXT, MD files
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="import" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <Button 
                variant="outline" 
                className="h-16 flex items-center gap-3"
                onClick={() => handleFileUpload('SharePoint')}
              >
                <Globe className="h-6 w-6" />
                <div className="text-left">
                  <div className="font-medium">SharePoint</div>
                  <div className="text-sm text-gray-500">Import from SharePoint libraries</div>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-16 flex items-center gap-3"
                onClick={() => handleFileUpload('Confluence')}
              >
                <FolderOpen className="h-6 w-6" />
                <div className="text-left">
                  <div className="font-medium">Confluence</div>
                  <div className="text-sm text-gray-500">Import from Confluence pages</div>
                </div>
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="manual" className="space-y-4">
            <div className="space-y-4">
              <Input placeholder="Article Title" />
              <textarea 
                className="w-full h-32 p-3 border rounded-md resize-none"
                placeholder="Article content..."
              />
              <div className="flex gap-2">
                <select className="border rounded-md px-3 py-2">
                  <option>Select Category</option>
                  <option>Sales</option>
                  <option>Product</option>
                  <option>Training</option>
                  <option>Marketing</option>
                </select>
                <Input placeholder="Tags (comma separated)" />
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => handleFileUpload('Manual')}>
            Add Article
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      {/* Search and Actions Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search articles, snippets, file names..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border rounded-md px-3 py-2"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>
        
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Article
        </Button>
      </div>

      {/* Knowledge Base Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{knowledgeBase.length}</div>
            <div className="text-sm text-gray-600">Total Articles</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{categories.length - 1}</div>
            <div className="text-sm text-gray-600">Categories</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">156</div>
            <div className="text-sm text-gray-600">AI References</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">24</div>
            <div className="text-sm text-gray-600">Recent Updates</div>
          </CardContent>
        </Card>
      </div>

      {/* Knowledge Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredArticles.map((article) => (
          <Card key={article.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg line-clamp-2">{article.title}</CardTitle>
                <FileText className="h-5 w-5 text-gray-400 flex-shrink-0" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-600 line-clamp-3">{article.content}</p>
              
              <div className="flex items-center justify-between">
                <Badge variant="secondary">{article.category}</Badge>
                <span className="text-xs text-gray-500">
                  {article.lastModified.toLocaleDateString()}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {article.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Source: {article.source}</span>
                <span className="capitalize">{article.type}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
          <p className="text-gray-600 mb-4">
            {searchQuery ? 'Try adjusting your search terms' : 'Start building your knowledge base'}
          </p>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add First Article
          </Button>
        </div>
      )}

      <AddArticleModal />
    </div>
  );
};

export default KnowledgeTab;
