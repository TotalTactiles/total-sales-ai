
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  Save, 
  Plus, 
  Trash2, 
  BookOpen,
  MessageSquare,
  Target
} from 'lucide-react';

interface StageEditorProps {
  stage: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedStage: any) => void;
}

const ProcessStageEditor: React.FC<StageEditorProps> = ({ stage, isOpen, onClose, onSave }) => {
  const [editedStage, setEditedStage] = useState(stage);
  const [newCondition, setNewCondition] = useState('');
  const [newTrigger, setNewTrigger] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(editedStage);
    onClose();
  };

  const addCondition = () => {
    if (newCondition.trim()) {
      setEditedStage(prev => ({
        ...prev,
        conditions: [...prev.conditions, newCondition.trim()]
      }));
      setNewCondition('');
    }
  };

  const removeCondition = (index: number) => {
    setEditedStage(prev => ({
      ...prev,
      conditions: prev.conditions.filter((_, i) => i !== index)
    }));
  };

  const addTrigger = () => {
    if (newTrigger.trim()) {
      setEditedStage(prev => ({
        ...prev,
        triggers: [...prev.triggers, newTrigger.trim()]
      }));
      setNewTrigger('');
    }
  };

  const removeTrigger = (index: number) => {
    setEditedStage(prev => ({
      ...prev,
      triggers: prev.triggers.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">Edit Stage: {editedStage.name}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Stage Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Stage Name</label>
                <Input
                  value={editedStage.name}
                  onChange={(e) => setEditedStage(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter stage name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  value={editedStage.description}
                  onChange={(e) => setEditedStage(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe this stage's purpose and activities"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Conditions */}
          <Card>
            <CardHeader>
              <CardTitle>Stage Completion Criteria</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {editedStage.conditions.map((condition: string, index: number) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    {condition}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0"
                      onClick={() => removeCondition(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newCondition}
                  onChange={(e) => setNewCondition(e.target.value)}
                  placeholder="Add new condition"
                  onKeyDown={(e) => e.key === 'Enter' && addCondition()}
                />
                <Button onClick={addCondition}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Triggers */}
          <Card>
            <CardHeader>
              <CardTitle>Stage Entry Triggers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {editedStage.triggers.map((trigger: string, index: number) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {trigger}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0"
                      onClick={() => removeTrigger(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newTrigger}
                  onChange={(e) => setNewTrigger(e.target.value)}
                  placeholder="Add new trigger"
                  onKeyDown={(e) => e.key === 'Enter' && addTrigger()}
                />
                <Button onClick={addTrigger}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Manager Notes & Guidance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Manager Notes & Guidance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={editedStage.managerNotes || ''}
                onChange={(e) => setEditedStage(prev => ({ ...prev, managerNotes: e.target.value }))}
                placeholder="Add coaching notes, best practices, or guidance for this stage"
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Example Replies/Objections */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Example Replies & Objection Handling
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={editedStage.exampleReplies || ''}
                onChange={(e) => setEditedStage(prev => ({ ...prev, exampleReplies: e.target.value }))}
                placeholder="Add example responses, objection handling techniques, or scripts for this stage"
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Internal Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Internal Tips & Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={editedStage.internalTips || ''}
                onChange={(e) => setEditedStage(prev => ({ ...prev, internalTips: e.target.value }))}
                placeholder="Add internal tips, resources, or team-specific guidance"
                rows={3}
              />
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-4 p-6 border-t bg-gray-50">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProcessStageEditor;
