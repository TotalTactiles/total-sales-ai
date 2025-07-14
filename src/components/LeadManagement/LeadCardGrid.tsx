import { logger } from '@/utils/logger';

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { 
  Search, 
  Filter, 
  SortAsc, 
  SortDesc, 
  Settings, 
  Grid3X3,
  List,
  Brain,
  Star,
  RotateCcw,
  Calendar,
  Clock,
  Phone,
  Mail
} from 'lucide-react';
import { Lead } from '@/types/lead';
import LeadCard from './LeadCard';
import { useUsageTracking } from '@/hooks/useUsageTracking';

interface LeadCardGridProps {
  leads: Lead[];
  onLeadClick: (lead: Lead) => void;
  onQuickAction: (action: string, lead: Lead) => void;
}

interface CustomizeSettings {
  showScore: boolean;
  showCompany: boolean;
  showEmail: boolean;
  showPhone: boolean;
  showTags: boolean;
  showLastContact: boolean;
  showConversionLikelihood: boolean;
  showPriority: boolean;
}

const LeadCardGrid: React.FC<LeadCardGridProps> = ({ 
  leads, 
  onLeadClick, 
  onQuickAction 
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('ai_optimized');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [aiSuggestionsEnabled, setAiSuggestionsEnabled] = useState(true);
  
  // Customize View Modal
  const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false);
  const [customizeSettings, setCustomizeSettings] = useState<CustomizeSettings>({
    showScore: true,
    showCompany: true,
    showEmail: true,
    showPhone: true,
    showTags: false,
    showLastContact: true,
    showConversionLikelihood: true,
    showPriority: true
  });
  const [isCustomView, setIsCustomView] = useState(false);

  // Schedule Modal
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedLeadForAction, setSelectedLeadForAction] = useState<Lead | null>(null);
  const [scheduleData, setScheduleData] = useState({
    date: '',
    time: '',
    description: ''
  });

  // Reminder Modal
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [reminderData, setReminderData] = useState({
    title: '',
    triggerType: 'time',
    triggerValue: '',
    description: ''
  });

  const { trackEvent } = useUsageTracking();

  const handleCustomizeSave = () => {
    setIsCustomView(true);
    setIsCustomizeModalOpen(false);
    
    // Log to TSAM for learning priority fields
    trackEvent({
      feature: 'customize_lead_cards',
      action: 'save_preferences',
      context: 'lead_management',
      metadata: { settings: customizeSettings }
    });
  };

  const handleResetToDefault = () => {
    setCustomizeSettings({
      showScore: true,
      showCompany: true,
      showEmail: true,
      showPhone: true,
      showTags: false,
      showLastContact: true,
      showConversionLikelihood: true,
      showPriority: true
    });
    setIsCustomView(false);
  };

  const handleQuickAction = (action: string, lead: Lead) => {
    setSelectedLeadForAction(lead);
    
    switch (action) {
      case 'call':
        // Opens dialer
        console.log('Opening dialer for:', lead);
        break;
      case 'email':
        // Opens Comms > Email preloaded
        console.log('Opening email for:', lead);
        break;
      case 'schedule':
        setIsScheduleModalOpen(true);
        break;
      case 'reminder':
        setIsReminderModalOpen(true);
        break;
    }

    // Log all actions to Timeline, Comms, Tasks, Calendar
    trackEvent({
      feature: `lead_quick_${action}`,
      action: 'click',
      context: 'lead_management',
      metadata: { leadId: lead.id, leadName: lead.name }
    });
  };

  const handleScheduleSubmit = () => {
    if (!selectedLeadForAction) return;

    // Log to Timeline, Tasks, Calendar
    console.log('Schedule created:', { lead: selectedLeadForAction, ...scheduleData });
    
    setIsScheduleModalOpen(false);
    setScheduleData({ date: '', time: '', description: '' });
  };

  const handleReminderSubmit = () => {
    if (!selectedLeadForAction) return;

    // Log to Timeline, Tasks
    console.log('Reminder created:', { lead: selectedLeadForAction, ...reminderData });
    
    setIsReminderModalOpen(false);
    setReminderData({ title: '', triggerType: 'time', triggerValue: '', description: '' });
  };

  const filteredAndSortedLeads = useMemo(() => {
    let filtered = leads.filter(lead => {
      const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           lead.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || lead.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });

    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'ai_optimized':
          const priorityWeight = { high: 1.2, medium: 1.0, low: 0.8 };
          aValue = (a.conversionLikelihood || 50) * (a.score || 50) * (priorityWeight[a.priority] || 1.0);
          bValue = (b.conversionLikelihood || 50) * (b.score || 50) * (priorityWeight[b.priority] || 1.0);
          break;
        case 'score':
          aValue = a.score;
          bValue = b.score;
          break;
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'company':
          aValue = a.company.toLowerCase();
          bValue = b.company.toLowerCase();
          break;
        case 'lastContact':
          aValue = a.lastContact ? 1 : 0;
          bValue = b.lastContact ? 1 : 0;
          break;
        default:
          return 0;
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    });

    return filtered;
  }, [leads, searchTerm, statusFilter, priorityFilter, sortBy, sortDirection]);

  const handleSortChange = (newSortBy: string) => {
    if (sortBy === newSortBy) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortDirection(newSortBy === 'ai_optimized' ? 'desc' : 'desc');
    }
    
    trackEvent({
      feature: 'lead_grid_sort',
      action: 'change',
      context: 'lead_management',
      metadata: { sortBy: newSortBy, direction: sortDirection }
    });
  };

  const handleLeadClick = (lead: Lead) => {
    logger.info('Navigating to lead workspace:', lead.id);
    navigate(`/lead-workspace/${lead.id}`);
    trackEvent({
      feature: 'lead_card_click',
      action: 'navigate_to_workspace',
      context: 'lead_management',
      metadata: { leadId: lead.id, leadScore: lead.score }
    });
  };

  const urgentLeads = leads.filter(lead => 
    lead.priority === 'high' && (!lead.lastContact || lead.score < 60)
  ).length;

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">Lead Pipeline</h2>
          {urgentLeads > 0 && (
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
              {urgentLeads} need attention
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setAiSuggestionsEnabled(!aiSuggestionsEnabled)}
            className={aiSuggestionsEnabled ? 'bg-blue-50 text-blue-700' : ''}
          >
            <Brain className="h-4 w-4 mr-2" />
            AI Insights
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsCustomizeModalOpen(true)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Customize
            {isCustomView && (
              <Badge variant="secondary" className="ml-2 text-xs">
                Custom View
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="qualified">Qualified</SelectItem>
            <SelectItem value="closed_won">Closed Won</SelectItem>
            <SelectItem value="closed_lost">Closed Lost</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={sortBy} onValueChange={handleSortChange}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ai_optimized">🤖 AI Optimized</SelectItem>
            <SelectItem value="score">Score</SelectItem>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="company">Company</SelectItem>
            <SelectItem value="lastContact">Last Contact</SelectItem>
          </SelectContent>
        </Select>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
        >
          {sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
        </Button>
      </div>

      {/* Lead Grid */}
      <div className={`grid gap-4 ${
        viewMode === 'grid' 
          ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
          : 'grid-cols-1 max-w-4xl mx-auto'
      }`}>
        {filteredAndSortedLeads.map((lead) => (
          <LeadCard
            key={lead.id}
            lead={lead}
            onCardClick={handleLeadClick}
            onQuickAction={handleQuickAction}
            customizeSettings={customizeSettings}
            aiSuggestion={aiSuggestionsEnabled ? undefined : undefined} // AI suggestions would come from service
          />
        ))}
      </div>

      {/* Customize View Modal */}
      <Dialog open={isCustomizeModalOpen} onOpenChange={setIsCustomizeModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Customize Lead Cards</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Choose which fields to display on lead cards
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(customizeSettings).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox 
                    id={key}
                    checked={value}
                    onCheckedChange={(checked) => 
                      setCustomizeSettings(prev => ({ ...prev, [key]: checked as boolean }))
                    }
                  />
                  <Label htmlFor={key} className="text-sm">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).replace('show', '')}
                    {key === 'showScore' && aiSuggestionsEnabled && (
                      <Star className="h-3 w-3 inline ml-1 text-yellow-500" title="⭐ AI Recommended" />
                    )}
                  </Label>
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={handleResetToDefault}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset to Default
              </Button>
              <Button onClick={handleCustomizeSave}>
                Save Preferences
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Schedule Modal */}
      <Dialog open={isScheduleModalOpen} onOpenChange={setIsScheduleModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Schedule Event - {selectedLeadForAction?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={scheduleData.date}
                onChange={(e) => setScheduleData(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={scheduleData.time}
                onChange={(e) => setScheduleData(prev => ({ ...prev, time: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Event description..."
                value={scheduleData.description}
                onChange={(e) => setScheduleData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsScheduleModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleScheduleSubmit}>
                Schedule Event
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reminder Modal */}
      <Dialog open={isReminderModalOpen} onOpenChange={setIsReminderModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Reminder - {selectedLeadForAction?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Task Title</Label>
              <Input
                id="title"
                placeholder="Follow up on proposal..."
                value={reminderData.title}
                onChange={(e) => setReminderData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="triggerType">Trigger Type</Label>
              <select
                id="triggerType"
                className="w-full p-2 border rounded-md"
                value={reminderData.triggerType}
                onChange={(e) => setReminderData(prev => ({ ...prev, triggerType: e.target.value }))}
              >
                <option value="time">Time-based</option>
                <option value="funnel">Funnel stage</option>
              </select>
            </div>
            <div>
              <Label htmlFor="triggerValue">
                {reminderData.triggerType === 'time' ? 'Date/Time' : 'Funnel Stage'}
              </Label>
              {reminderData.triggerType === 'time' ? (
                <Input
                  id="triggerValue"
                  type="datetime-local"
                  value={reminderData.triggerValue}
                  onChange={(e) => setReminderData(prev => ({ ...prev, triggerValue: e.target.value }))}
                />
              ) : (
                <select
                  id="triggerValue"
                  className="w-full p-2 border rounded-md"
                  value={reminderData.triggerValue}
                  onChange={(e) => setReminderData(prev => ({ ...prev, triggerValue: e.target.value }))}
                >
                  <option value="">Select stage...</option>
                  <option value="contacted">When contacted</option>
                  <option value="qualified">When qualified</option>
                  <option value="proposal">When proposal sent</option>
                </select>
              )}
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Task description..."
                value={reminderData.description}
                onChange={(e) => setReminderData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsReminderModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleReminderSubmit}>
                Add Reminder
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Results Summary */}
      <div className="text-center text-sm text-slate-500">
        Showing {filteredAndSortedLeads.length} of {leads.length} leads
        {sortBy === 'ai_optimized' && (
          <span className="ml-2 text-blue-600">• Sorted by AI optimization for highest conversion probability</span>
        )}
      </div>
    </div>
  );
};

export default LeadCardGrid;
