
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  MessageSquare, 
  Calendar, 
  Users,
  Clock,
  Star,
  TrendingUp,
  Play,
  Eye
} from 'lucide-react';

const AutomationTemplates = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Templates', count: 24 },
    { id: 'lead-nurturing', name: 'Lead Nurturing', count: 8 },
    { id: 'follow-ups', name: 'Follow-ups', count: 6 },
    { id: 'meeting-scheduling', name: 'Meeting Scheduling', count: 4 },
    { id: 'proposal', name: 'Proposal Management', count: 3 },
    { id: 'onboarding', name: 'Client Onboarding', count: 3 }
  ];

  const templates = [
    {
      id: 1,
      name: 'New Lead Welcome Series',
      description: 'Automated email sequence to welcome and nurture new leads',
      category: 'lead-nurturing',
      type: 'Email',
      icon: Mail,
      rating: 4.8,
      usageCount: 1247,
      estimatedTime: '3-5 days',
      difficulty: 'Easy',
      tags: ['email', 'nurturing', 'welcome'],
      isPopular: true
    },
    {
      id: 2,
      name: 'Demo Follow-up Sequence',
      description: 'Follow up with prospects after product demonstrations',
      category: 'follow-ups',
      type: 'Mixed',
      icon: Calendar,
      rating: 4.9,
      usageCount: 892,
      estimatedTime: '1-2 weeks',
      difficulty: 'Medium',
      tags: ['demo', 'follow-up', 'conversion'],
      isPopular: true
    },
    {
      id: 3,
      name: 'Cold Outreach SMS',
      description: 'Initial contact SMS for cold leads with high response rates',
      category: 'lead-nurturing',
      type: 'SMS',
      icon: MessageSquare,
      rating: 4.6,
      usageCount: 634,
      estimatedTime: 'Immediate',
      difficulty: 'Easy',
      tags: ['sms', 'cold-outreach', 'initial-contact']
    },
    {
      id: 4,
      name: 'Meeting Scheduler',
      description: 'Automated meeting scheduling with calendar integration',
      category: 'meeting-scheduling',
      type: 'Calendar',
      icon: Calendar,
      rating: 4.7,
      usageCount: 456,
      estimatedTime: '30 minutes',
      difficulty: 'Medium',
      tags: ['calendar', 'scheduling', 'automation']
    },
    {
      id: 5,
      name: 'Proposal Follow-up',
      description: 'Systematic follow-up after sending proposals',
      category: 'proposal',
      type: 'Email',
      icon: Mail,
      rating: 4.5,
      usageCount: 321,
      estimatedTime: '1 week',
      difficulty: 'Easy',
      tags: ['proposal', 'follow-up', 'closing']
    },
    {
      id: 6,
      name: 'LinkedIn Connection Sequence',
      description: 'Multi-touch sequence for LinkedIn connections',
      category: 'lead-nurturing',
      type: 'Social',
      icon: Users,
      rating: 4.4,
      usageCount: 567,
      estimatedTime: '2-3 days',
      difficulty: 'Medium',
      tags: ['linkedin', 'social', 'networking']
    }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-50';
      case 'Medium': return 'text-orange-600 bg-orange-50';
      case 'Hard': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Advanced Filters
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{category.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {category.count}
                    </Badge>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Templates Grid */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="relative hover:shadow-lg transition-shadow">
                {template.isPopular && (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-orange-100 text-orange-800">
                      <Star className="h-3 w-3 mr-1" />
                      Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="pb-3">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <template.icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg leading-tight">
                        {template.name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {template.description}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium">{template.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span>{template.usageCount} uses</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>{template.estimatedTime}</span>
                    </div>
                    <div>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${getDifficultyColor(template.difficulty)}`}
                      >
                        {template.difficulty}
                      </Badge>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {template.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {template.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{template.tags.length - 3}
                      </Badge>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2 pt-2">
                    <Button size="sm" className="flex-1">
                      <Play className="h-4 w-4 mr-2" />
                      Use Template
                    </Button>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-muted-foreground">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No templates found</h3>
                  <p>Try adjusting your search or filter criteria</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AutomationTemplates;
