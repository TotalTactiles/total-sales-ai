
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import LeadCard from './LeadCard';
import { Search, Settings, RotateCcw, Star } from 'lucide-react';
import { toast } from 'sonner';
import { Lead } from '@/types/lead';

interface CustomizationSettings {
  showCompany: boolean;
  showEmail: boolean;
  showPhone: boolean;
  showScore: boolean;
  showLikelihood: boolean;
  showTags: boolean;
  showSource: boolean;
  showLastContact: boolean;
  showNextAction: boolean;
}

interface LeadCardGridProps {
  leads: Lead[];
  onLeadSelect: (lead: Lead) => void;
  showCustomization?: boolean;
  onCustomizationChange?: (show: boolean) => void;
}

const DEFAULT_CUSTOMIZATION: CustomizationSettings = {
  showCompany: true,
  showEmail: true,
  showPhone: true,
  showScore: true,
  showLikelihood: true,
  showTags: true,
  showSource: false,
  showLastContact: true,
  showNextAction: true,
};

const LeadCardGrid: React.FC<LeadCardGridProps> = ({ 
  leads, 
  onLeadSelect, 
  showCustomization = false,
  onCustomizationChange 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [customization, setCustomization] = useState<CustomizationSettings>(DEFAULT_CUSTOMIZATION);
  const [isCustomView, setIsCustomView] = useState(false);

  // Load customization from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('leadCardCustomization');
    if (saved) {
      try {
        const parsedCustomization = JSON.parse(saved);
        setCustomization(parsedCustomization);
        setIsCustomView(true);
      } catch (error) {
        console.error('Error loading customization:', error);
      }
    }
  }, []);

  // Show modal when customization prop changes
  useEffect(() => {
    if (showCustomization) {
      setShowCustomizeModal(true);
    }
  }, [showCustomization]);

  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (lead.company && lead.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (lead.email && lead.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCustomizationChange = (field: keyof CustomizationSettings, value: boolean) => {
    setCustomization(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveCustomization = () => {
    localStorage.setItem('leadCardCustomization', JSON.stringify(customization));
    setIsCustomView(true);
    setShowCustomizeModal(false);
    onCustomizationChange?.(false);
    toast.success('View customization saved');
  };

  const handleResetToDefault = () => {
    setCustomization(DEFAULT_CUSTOMIZATION);
    setIsCustomView(false);
    localStorage.removeItem('leadCardCustomization');
    toast.success('Reset to default view');
  };

  const handleCloseModal = () => {
    setShowCustomizeModal(false);
    onCustomizationChange?.(false);
  };

  const getAIRecommendedFields = () => {
    return ['showScore', 'showLikelihood', 'showNextAction'];
  };

  return (
    <div className="space-y-4">
      {/* Search and Customize Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search leads by name, company, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="flex items-center gap-2">
          {isCustomView && (
            <Badge variant="secondary" className="text-xs">
              Custom View
            </Badge>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCustomizeModal(true)}
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Customize
          </Button>
        </div>
      </div>

      {/* Lead Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLeads.map((lead) => (
          <LeadCard
            key={lead.id}
            lead={lead}
            onLeadSelect={onLeadSelect}
            customizeSettings={{
              showScore: customization.showScore,
              showCompany: customization.showCompany,
              showEmail: customization.showEmail,
              showPhone: customization.showPhone,
              showTags: customization.showTags,
              showLastContact: customization.showLastContact,
              showConversionLikelihood: customization.showLikelihood,
              showPriority: true
            }}
          />
        ))}
      </div>

      {filteredLeads.length === 0 && (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No leads found</h3>
              <p className="text-gray-500">
                {searchTerm ? 'Try adjusting your search terms' : 'No leads available'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Customize View Modal */}
      <Dialog open={showCustomizeModal} onOpenChange={handleCloseModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Customize Lead Card View</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Choose which fields to display on lead cards
            </p>
            
            <div className="space-y-3">
              {Object.entries(customization).map(([key, value]) => {
                const field = key as keyof CustomizationSettings;
                const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                const isAIRecommended = getAIRecommendedFields().includes(key);
                
                return (
                  <div key={key} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <label htmlFor={key} className="text-sm font-medium cursor-pointer">
                        {label.replace('show', '').trim()}
                      </label>
                      {isAIRecommended && (
                        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                          <Star className="h-3 w-3 mr-1" />
                          AI Recommended
                        </Badge>
                      )}
                    </div>
                    <Checkbox
                      id={key}
                      checked={value}
                      onCheckedChange={(checked) => 
                        handleCustomizationChange(field, checked as boolean)
                      }
                    />
                  </div>
                );
              })}
            </div>
            
            <div className="flex gap-2 pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetToDefault}
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Reset to Default
              </Button>
              
              <Button
                onClick={handleSaveCustomization}
                className="flex-1"
              >
                Save Preferences
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeadCardGrid;
