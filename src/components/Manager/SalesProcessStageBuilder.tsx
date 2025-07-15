
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Download, 
  RefreshCw, 
  Save,
  ArrowRight
} from 'lucide-react';
import ProcessStageEditor from './ProcessStageEditor';
import { toast } from 'sonner';

interface Stage {
  id: string;
  name: string;
  description: string;
  conditions: string[];
  triggers: string[];
  managerNotes?: string;
  exampleReplies?: string;
  internalTips?: string;
  order: number;
}

const SalesProcessStageBuilder: React.FC = () => {
  const [stages, setStages] = useState<Stage[]>([
    {
      id: '1',
      name: 'Lead Generation',
      description: 'Initial contact and lead capture',
      conditions: ['Contact information verified', 'Basic qualification completed'],
      triggers: ['Form submission', 'Phone inquiry', 'Referral'],
      order: 1
    },
    {
      id: '2',
      name: 'Qualification',
      description: 'Assess lead quality and fit',
      conditions: ['Budget confirmed', 'Decision maker identified', 'Timeline established'],
      triggers: ['Initial contact made', 'Interest expressed'],
      order: 2
    },
    {
      id: '3',
      name: 'Proposal',
      description: 'Present solution and pricing',
      conditions: ['Proposal sent', 'Follow-up scheduled'],
      triggers: ['Qualification completed', 'Request for proposal'],
      order: 3
    },
    {
      id: '4',
      name: 'Negotiation',
      description: 'Handle objections and finalize terms',
      conditions: ['Terms agreed', 'Contract prepared'],
      triggers: ['Proposal reviewed', 'Objections raised'],
      order: 4
    },
    {
      id: '5',
      name: 'Closed Won',
      description: 'Deal successfully completed',
      conditions: ['Contract signed', 'Payment processed'],
      triggers: ['Agreement reached', 'Final approval'],
      order: 5
    }
  ]);

  const [selectedStage, setSelectedStage] = useState<Stage | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const handleAddStage = () => {
    const newStage: Stage = {
      id: Date.now().toString(),
      name: 'New Stage',
      description: 'Enter stage description',
      conditions: [],
      triggers: [],
      order: stages.length + 1
    };
    setStages([...stages, newStage]);
    setSelectedStage(newStage);
    setIsEditorOpen(true);
  };

  const handleEditStage = (stage: Stage) => {
    setSelectedStage(stage);
    setIsEditorOpen(true);
  };

  const handleDeleteStage = (stageId: string) => {
    setStages(stages.filter(stage => stage.id !== stageId));
    toast.success('Stage deleted successfully');
  };

  const handleSaveStage = (updatedStage: Stage) => {
    setStages(stages.map(stage => 
      stage.id === updatedStage.id ? updatedStage : stage
    ));
    toast.success('Stage updated successfully');
  };

  const handleExport = () => {
    toast.success('Exporting sales process stages as PDF');
  };

  const handleResetToDefault = () => {
    toast.success('Sales process reset to default stages');
  };

  const handleSaveChanges = () => {
    toast.success('All changes saved and synced to Sales Rep Lead View');
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Sales Process Stages</h3>
          <p className="text-sm text-gray-600">Configure your sales pipeline stages and criteria</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={handleResetToDefault}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset to Default
          </Button>
          <Button onClick={handleSaveChanges}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Stages Pipeline */}
      <div className="space-y-4">
        {stages.map((stage, index) => (
          <div key={stage.id} className="relative">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-semibold">
                      {stage.order}
                    </div>
                    <div>
                      <CardTitle className="text-base">{stage.name}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{stage.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEditStage(stage)}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteStage(stage.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-xs font-medium text-gray-700 mb-2">Completion Criteria</h5>
                    <div className="flex flex-wrap gap-1">
                      {stage.conditions.map((condition, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {condition}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h5 className="text-xs font-medium text-gray-700 mb-2">Entry Triggers</h5>
                    <div className="flex flex-wrap gap-1">
                      {stage.triggers.map((trigger, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {trigger}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Arrow between stages */}
            {index < stages.length - 1 && (
              <div className="flex justify-center my-2">
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Stage Button */}
      <Card className="border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors">
        <CardContent className="p-6">
          <Button 
            variant="ghost" 
            className="w-full h-16 text-gray-600 hover:text-gray-800"
            onClick={handleAddStage}
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Stage
          </Button>
        </CardContent>
      </Card>

      {/* Stage Editor Modal */}
      {selectedStage && (
        <ProcessStageEditor
          stage={selectedStage}
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          onSave={handleSaveStage}
        />
      )}
    </div>
  );
};

export default SalesProcessStageBuilder;
