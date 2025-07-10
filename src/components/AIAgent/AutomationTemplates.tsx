
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search,
  Star,
  Clock,
  Zap,
  Mail,
  Phone,
  Database,
  Sparkles,
  Play,
  Settings,
  Download
} from 'lucide-react';

interface AutomationTemplatesProps {
  hasNewTemplates?: boolean;
}

const AutomationTemplates: React.FC<AutomationTemplatesProps> = ({ hasNewTemplates }) => {
  const [selectedCategory, setSelectedCategory] = useState('All Templates');
  const [searchTerm, setSearchTerm] = useState('');
  const [newTemplates, setNewTemplates] = useState<any[]>([]);

  const categories = [
    { name: 'All Templates', count: 24, icon: <Star className="h-4 w-4" /> },
    { name: 'NEW Templates 🆕', count: newTemplates.length, icon: <Sparkles className="h-4 w-4" />, isNew: true },
    { name: 'Lead Nurturing', count: 8, icon: <Zap className="h-4 w-4" /> },
    { name: 'Follow-ups', count: 6, icon: <Mail className="h-4 w-4" /> },
    { name: 'Meeting Scheduling', count: 4, icon: <Clock className="h-4 w-4" /> },
    { name: 'Proposal Management', count: 3, icon: <Database className="h-4 w-4" /> },
    { name: 'Client Onboarding', count: 3, icon: <Phone className="h-4 w-4" /> }
  ];

  const defaultTemplates = [
    {
      id: 'new-lead-welcome',
      name: 'New Lead Welcome Series',
      description: 'Automated email sequence to welcome and nurture new leads',
      rating: 4.8,
      uses: 1247,
      duration: '3-5 days',
      difficulty: 'Easy',
      tags: ['email', 'nurturing', 'welcome'],
      category: 'Lead Nurturing'
    },
    {
      id: 'demo-followup',
      name: 'Demo Follow-up Sequence',
      description: 'Follow up with prospects after product demonstrations',
      rating: 4.9,
      uses: 892,
      duration: '1-2 weeks',
      difficulty: 'Medium',
      tags: ['demo', 'follow-up', 'conversion'],
      category: 'Follow-ups'
    },
    {
      id: 'cold-outreach-sms',
      name: 'Cold Outreach SMS',
      description: 'Initial contact SMS for cold leads with high response rates',
      rating: 4.6,
      uses: 634,
      duration: 'Immediate',
      difficulty: 'Easy',
      tags: ['sms', 'cold-outreach', 'initial-contact'],
      category: 'Lead Nurturing'
    },
    {
      id: 'meeting-scheduler',
      name: 'Meeting Scheduler',
      description: 'Automated meeting scheduling with calendar integration',
      rating: 4.7,
      uses: 456,
      duration: '30 minutes',
      difficulty: 'Medium',
      tags: ['calendar', 'scheduling', 'automation'],
      category: 'Meeting Scheduling'
    }
  ];

  const [templates, setTemplates] = useState(defaultTemplates);

  useEffect(() => {
    // Load new templates from Manager OS
    const storedTemplates = localStorage.getItem('newAutomationTemplates');
    if (storedTemplates) {
      const templateData = JSON.parse(storedTemplates);
      setNewTemplates(templateData.templates || []);
    }
  }, [hasNewTemplates]);

  const filteredTemplates = templates.filter(template => {
    if (selectedCategory === 'All Templates') return true;
    if (selectedCategory === 'NEW Templates 🆕') {
      return newTemplates.some(nt => nt.id === template.id);
    }
    return template.category === selectedCategory;
  });

  const handleUseTemplate = (templateId: string) => {
    console.log('Using template:', templateId);
    // Implement template deployment logic
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Automation Templates</h2>
          <p className="text-gray-600 mt-1">Pre-built workflows to accelerate your sales process</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button variant="outline" size="sm">
            Advanced Filters
          </Button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Categories Sidebar */}
        <div className="w-64 space-y-2">
          <h3 className="font-medium text-gray-900 mb-3">Categories</h3>
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => setSelectedCategory(category.name)}
              className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                selectedCategory === category.name
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'hover:bg-gray-50'
              } ${category.isNew ? 'animate-pulse' : ''}`}
            >
              <div className="flex items-center gap-2">
                {category.icon}
                <span className="text-sm font-medium">{category.name}</span>
                {category.isNew && hasNewTemplates && (
                  <Sparkles className="h-3 w-3 text-yellow-500" />
                )}
              </div>
              <Badge variant="outline" className="text-xs">
                {category.count}
              </Badge>
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="flex-1">
          {selectedCategory === 'NEW Templates 🆕' && newTemplates.length > 0 && (
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-yellow-500" />
                <h3 className="font-medium text-gray-900">New Templates from Manager</h3>
              </div>
              <p className="text-sm text-gray-600">
                Your manager has sent {newTemplates.length} new automation templates for you to use.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Show new templates first if viewing NEW category */}
            {selectedCategory === 'NEW Templates 🆕' && newTemplates.map((template) => (
              <Card key={template.id} className="border-2 border-yellow-300 bg-yellow-50">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {template.icon}
                      <div>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                      </div>
                    </div>
                    <Badge className="bg-yellow-500 text-white">NEW</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>New</span>
                    </div>
                    <span>{template.steps} steps</span>
                    <span>{template.category}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1"
                      onClick={() => handleUseTemplate(template.id)}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Use Template
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Regular templates */}
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>{template.rating}</span>
                    </div>
                    <span>{template.uses} uses</span>
                    <span>{template.duration}</span>
                    <Badge variant="outline" className="text-xs">
                      {template.difficulty}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {template.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1"
                      onClick={() => handleUseTemplate(template.id)}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Use Template
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutomationTemplates;
