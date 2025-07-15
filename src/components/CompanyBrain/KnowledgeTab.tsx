
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Upload, Search, BookOpen, FileText, Plus, Filter } from 'lucide-react';
import { toast } from 'sonner';

const KnowledgeTab: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newArticle, setNewArticle] = useState({ title: '', content: '', tags: '' });

  const knowledgeItems = [
    {
      id: 1,
      title: 'Sales Process Best Practices',
      type: 'article',
      content: 'Complete guide to our proven sales methodology...',
      tags: ['sales', 'process', 'methodology'],
      updatedAt: '2024-01-15',
      author: 'Sales Team'
    },
    {
      id: 2,
      title: 'Product Demo Script',
      type: 'script',
      content: 'Standard script for product demonstrations...',
      tags: ['demo', 'script', 'presentation'],
      updatedAt: '2024-01-12',
      author: 'Marketing'
    },
    {
      id: 3,
      title: 'Common Objection Responses',
      type: 'faq',
      content: 'How to handle the most common sales objections...',
      tags: ['objections', 'responses', 'sales'],
      updatedAt: '2024-01-10',
      author: 'Sales Team'
    }
  ];

  const handleAddArticle = () => {
    if (!newArticle.title || !newArticle.content) {
      toast.error('Please fill in title and content');
      return;
    }
    
    toast.success('Article added to knowledge base');
    setNewArticle({ title: '', content: '', tags: '' });
    setIsAddModalOpen(false);
  };

  const filteredItems = knowledgeItems.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header with Search and Add */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search knowledge base..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Article
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Knowledge Article</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={newArticle.title}
                    onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                    placeholder="Enter article title..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Content</label>
                  <Textarea
                    value={newArticle.content}
                    onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
                    placeholder="Enter article content..."
                    rows={8}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Tags (comma separated)</label>
                  <Input
                    value={newArticle.tags}
                    onChange={(e) => setNewArticle({ ...newArticle, tags: e.target.value })}
                    placeholder="sales, process, methodology..."
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleAddArticle}>Add Article</Button>
                  <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Knowledge Items Grid */}
      <div className="grid gap-4">
        {filteredItems.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {item.type === 'article' && <BookOpen className="h-4 w-4 text-blue-600" />}
                  {item.type === 'script' && <FileText className="h-4 w-4 text-green-600" />}
                  {item.type === 'faq' && <Upload className="h-4 w-4 text-purple-600" />}
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </div>
                <Badge variant="outline" className="capitalize">{item.type}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-3 line-clamp-2">{item.content}</p>
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  {item.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="text-xs text-gray-500">
                  Updated {item.updatedAt} by {item.author}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
          <p className="text-gray-600">Try adjusting your search or add new knowledge articles</p>
        </div>
      )}
    </div>
  );
};

export default KnowledgeTab;
