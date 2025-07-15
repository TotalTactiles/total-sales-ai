
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Upload, Search, BookOpen, FileText, Plus, Filter, X } from 'lucide-react';
import { toast } from 'sonner';
import FileUploadModal from './FileUploadModal';

const KnowledgeTab: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const knowledgeItems = [
    {
      id: 1,
      title: 'Sales Process Best Practices',
      type: 'article',
      content: 'Complete guide to our proven sales methodology including lead qualification, discovery calls, proposal creation, and closing techniques. This comprehensive document covers the entire sales funnel from initial contact to deal closure.',
      tags: ['sales', 'process', 'methodology', 'best-practices'],
      updatedAt: '2024-01-15',
      author: 'Sales Team',
      excerpt: 'Learn the proven 5-step sales methodology that has helped our team achieve 40% higher conversion rates.',
      fileType: 'PDF',
      size: '2.4 MB'
    },
    {
      id: 2,
      title: 'Product Demo Script',
      type: 'script',
      content: 'Standard script for product demonstrations including key talking points, feature highlights, objection handling, and call-to-action phrases. Updated for Q1 2024 product features.',
      tags: ['demo', 'script', 'presentation', 'product'],
      updatedAt: '2024-01-12',
      author: 'Marketing',
      excerpt: 'Complete demo script with timing, feature highlights, and objection responses.',
      fileType: 'DOCX',
      size: '1.8 MB'
    },
    {
      id: 3,
      title: 'Common Objection Responses',
      type: 'faq',
      content: 'How to handle the most common sales objections including pricing concerns, feature comparisons, timing issues, and authority questions. Includes proven response templates and alternative approaches.',
      tags: ['objections', 'responses', 'sales', 'faq'],
      updatedAt: '2024-01-10',
      author: 'Sales Team',
      excerpt: 'Master responses to the top 15 sales objections with proven templates.',
      fileType: 'PDF',
      size: '3.1 MB'
    },
    {
      id: 4,
      title: 'Customer Success Stories',
      type: 'case-study',
      content: 'Collection of detailed customer success stories showing ROI, implementation timeline, and key benefits achieved. Perfect for social proof during sales conversations.',
      tags: ['success-stories', 'case-studies', 'roi', 'testimonials'],
      updatedAt: '2024-01-08',
      author: 'Customer Success',
      excerpt: 'Real customer stories showing 300% ROI and successful implementations.',
      fileType: 'PDF',
      size: '4.2 MB'
    }
  ];

  const allTags = Array.from(new Set(knowledgeItems.flatMap(item => item.tags)));

  const handleFileUpload = (files: File[], metadata: any) => {
    toast.success(`Uploaded ${files.length} file(s) to knowledge base`);
    console.log('Files uploaded:', files, metadata);
    // Here you would integrate with the actual knowledge base ingestion system
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const filteredItems = knowledgeItems.filter(item => {
    const matchesSearch = !searchQuery || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(tag => item.tags.includes(tag));

    return matchesSearch && matchesTags;
  });

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with Search and Add */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search knowledge base by title, content, tags, or file type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-2 h-6 w-6 p-0"
              onClick={() => setSearchQuery('')}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button size="sm" onClick={() => setIsUploadModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Article
          </Button>
        </div>
      </div>

      {/* Tags Filter */}
      {allTags.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700">Filter by tags:</div>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleTag(tag)}
              >
                {tag}
                {selectedTags.includes(tag) && (
                  <X className="h-3 w-3 ml-1" />
                )}
              </Badge>
            ))}
            {selectedTags.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedTags([])}
                className="h-6 text-xs"
              >
                Clear all
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Search Results Summary */}
      {searchQuery && (
        <div className="text-sm text-gray-600">
          Found {filteredItems.length} result{filteredItems.length !== 1 ? 's' : ''} 
          {searchQuery && ` for "${searchQuery}"`}
        </div>
      )}

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
                  {item.type === 'case-study' && <BookOpen className="h-4 w-4 text-orange-600" />}
                  <CardTitle className="text-lg">
                    {highlightText(item.title, searchQuery)}
                  </CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="capitalize">{item.type}</Badge>
                  <Badge variant="secondary" className="text-xs">
                    {item.fileType} • {item.size}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-gray-600 text-sm font-medium">
                  {highlightText(item.excerpt, searchQuery)}
                </p>
                
                <p className="text-gray-500 text-sm line-clamp-2">
                  {highlightText(item.content, searchQuery)}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex gap-1 flex-wrap">
                    {item.tags.map((tag) => (
                      <Badge 
                        key={tag} 
                        variant="secondary" 
                        className={`text-xs cursor-pointer ${
                          selectedTags.includes(tag) ? 'bg-blue-100 text-blue-800' : ''
                        }`}
                        onClick={() => toggleTag(tag)}
                      >
                        {highlightText(tag, searchQuery)}
                      </Badge>
                    ))}
                  </div>
                  <div className="text-xs text-gray-500">
                    Updated {item.updatedAt} by {item.author}
                  </div>
                </div>

                {/* Show search match location */}
                {searchQuery && (
                  <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                    💡 Match found in: {
                      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ? 'title' :
                      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ? 'tags' :
                      'content'
                    }
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery ? 'No articles found' : 'No articles yet'}
          </h3>
          <p className="text-gray-600">
            {searchQuery 
              ? 'Try adjusting your search terms or clearing filters' 
              : 'Add new knowledge articles to get started'
            }
          </p>
          {searchQuery && (
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery('');
                setSelectedTags([]);
              }}
              className="mt-3"
            >
              Clear search
            </Button>
          )}
        </div>
      )}

      {/* File Upload Modal */}
      <FileUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleFileUpload}
      />
    </div>
  );
};

export default KnowledgeTab;
