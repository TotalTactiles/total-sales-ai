
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Filter, 
  Settings, 
  User, 
  Building, 
  Mail, 
  Phone, 
  Calendar,
  Target,
  TrendingUp,
  DollarSign,
  X
} from 'lucide-react';
import { Lead } from '@/types/lead';
import { cn } from '@/lib/utils';

interface EnhancedLeadManagementProps {
  leads: Lead[];
  onLeadSelect: (lead: Lead) => void;
  isDemo?: boolean;
}

interface LeadCardField {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  getValue: (lead: Lead) => string | number;
  isDefault: boolean;
}

const EnhancedLeadManagement: React.FC<EnhancedLeadManagementProps> = ({
  leads,
  onLeadSelect,
  isDemo = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCustomization, setShowCustomization] = useState(false);

  const availableFields: LeadCardField[] = [
    {
      id: 'name',
      label: 'Lead Name',
      icon: User,
      getValue: (lead) => lead.name,
      isDefault: true
    },
    {
      id: 'company',
      label: 'Company',
      icon: Building,
      getValue: (lead) => lead.company || 'N/A',
      isDefault: true
    },
    {
      id: 'email',
      label: 'Email',
      icon: Mail,
      getValue: (lead) => lead.email || 'N/A',
      isDefault: true
    },
    {
      id: 'phone',
      label: 'Phone',
      icon: Phone,
      getValue: (lead) => lead.phone || 'N/A',
      isDefault: false
    },
    {
      id: 'score',
      label: 'Lead Score',
      icon: Target,
      getValue: (lead) => `${lead.score}%`,
      isDefault: true
    },
    {
      id: 'value',
      label: 'Deal Value',
      icon: DollarSign,
      getValue: (lead) => lead.value ? `$${lead.value.toLocaleString()}` : 'N/A',
      isDefault: false
    },
    {
      id: 'lastContact',
      label: 'Last Contact',
      icon: Calendar,
      getValue: (lead) => lead.lastContact || 'Never',
      isDefault: true
    },
    {
      id: 'conversionLikelihood',
      label: 'Conversion %',
      icon: TrendingUp,
      getValue: (lead) => `${lead.conversionLikelihood}%`,
      isDefault: false
    }
  ];

  // Load saved field preferences
  const [selectedFields, setSelectedFields] = useState<string[]>(() => {
    const saved = localStorage.getItem('salesOS-lead-card-fields');
    if (saved) {
      return JSON.parse(saved);
    }
    return availableFields.filter(field => field.isDefault).map(field => field.id);
  });

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem('salesOS-lead-card-fields', JSON.stringify(selectedFields));
  }, [selectedFields]);

  const toggleField = (fieldId: string) => {
    setSelectedFields(prev => 
      prev.includes(fieldId) 
        ? prev.filter(id => id !== fieldId)
        : [...prev, fieldId]
    );
  };

  const displayedFields = availableFields.filter(field => selectedFields.includes(field.id));

  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'qualified': return 'bg-green-100 text-green-800';
      case 'proposal': return 'bg-purple-100 text-purple-800';
      case 'negotiation': return 'bg-orange-100 text-orange-800';
      case 'closed_won': return 'bg-emerald-100 text-emerald-800';
      case 'closed_lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lead Management</h1>
          <p className="text-gray-600 mt-1">
            Manage and track your sales leads {isDemo && '(Demo Mode)'}
          </p>
        </div>
        
        {/* Customization Button */}
        <Button
          variant="outline"
          onClick={() => setShowCustomization(!showCustomization)}
          className="flex items-center gap-2"
        >
          <Settings className="h-4 w-4" />
          Customize Cards
        </Button>
      </div>

      {/* Customization Panel */}
      {showCustomization && (
        <Card className="border border-blue-200 bg-blue-50/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Customize Lead Card Fields</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCustomization(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {availableFields.map(field => (
                <Button
                  key={field.id}
                  variant={selectedFields.includes(field.id) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleField(field.id)}
                  className="justify-start text-xs"
                >
                  <field.icon className="h-3 w-3 mr-1" />
                  {field.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Lead Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLeads.map(lead => (
          <Card 
            key={lead.id} 
            className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            onClick={() => onLeadSelect(lead)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="font-semibold text-lg">{lead.name}</h3>
                  <div className="flex items-center gap-2">
                    <Badge className={cn("text-xs", getStatusColor(lead.status))}>
                      {lead.status?.replace('_', ' ').toUpperCase()}
                    </Badge>
                    <Badge className={cn("text-xs", getPriorityColor(lead.priority))}>
                      {lead.priority?.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{lead.score}%</div>
                  <div className="text-xs text-gray-500">Score</div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              {/* Display selected fields */}
              <div className="grid grid-cols-1 gap-2">
                {displayedFields.slice(1).map(field => { // Skip name as it's in header
                  const IconComponent = field.icon;
                  return (
                    <div key={field.id} className="flex items-center gap-2 text-sm">
                      <IconComponent className="h-4 w-4 text-gray-400 shrink-0" />
                      <span className="text-gray-600 min-w-0 truncate">
                        {field.getValue(lead)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Tags */}
              {lead.tags && lead.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-2 border-t">
                  {lead.tags.slice(0, 3).map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {lead.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{lead.tags.length - 3} more
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredLeads.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500">No leads found matching your search.</div>
        </div>
      )}
    </div>
  );
};

export default EnhancedLeadManagement;
