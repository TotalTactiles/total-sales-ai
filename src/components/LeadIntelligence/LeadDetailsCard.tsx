
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Edit, 
  Check, 
  X, 
  User, 
  Building, 
  Mail, 
  Phone, 
  Calendar, 
  Target,
  MessageSquare,
  Plus,
  Shield
} from 'lucide-react';
import { toast } from 'sonner';
import { Lead } from '@/types/lead';

interface LeadDetailsCardProps {
  lead: Lead;
  onUpdate: (field: string, value: any) => void;
  isSensitive: boolean;
}

const LeadDetailsCard: React.FC<LeadDetailsCardProps> = ({ lead, onUpdate, isSensitive }) => {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<any>('');
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [showAddField, setShowAddField] = useState(false);
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState('text');

  const startEdit = (field: string, currentValue: any) => {
    setEditingField(field);
    setTempValue(currentValue);
  };

  const saveEdit = () => {
    if (editingField) {
      onUpdate(editingField, tempValue);
      setEditingField(null);
      toast.success(`${editingField} updated successfully`);
    }
  };

  const cancelEdit = () => {
    setEditingField(null);
    setTempValue('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hot': return 'bg-red-100 text-red-800 border-red-200';
      case 'warm': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'cold': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'negotiation': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const EditableField = ({ field, value, icon: Icon, type = 'text', label }: any) => (
    <div 
      className="flex items-center justify-between py-2 group"
      onMouseEnter={() => setHoveredField(field)}
      onMouseLeave={() => setHoveredField(null)}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <Icon className="h-4 w-4 text-slate-500 shrink-0" />
        <div className="min-w-0 flex-1">
          <span className="text-xs font-medium text-slate-600 block">{label}:</span>
          {editingField === field ? (
            <div className="flex items-center gap-1 mt-1">
              {type === 'select' && field === 'status' ? (
                <Select value={tempValue} onValueChange={setTempValue}>
                  <SelectTrigger className="w-full h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hot">Hot</SelectItem>
                    <SelectItem value="warm">Warm</SelectItem>
                    <SelectItem value="cold">Cold</SelectItem>
                    <SelectItem value="negotiation">Negotiation</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              ) : type === 'textarea' ? (
                <Textarea
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  className="w-full text-sm"
                  rows={2}
                />
              ) : (
                <Input
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  className="w-full h-8 text-sm"
                  type={type}
                />
              )}
              <div className="flex gap-1">
                <Button size="sm" onClick={saveEdit} className="h-6 w-6 p-0">
                  <Check className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="outline" onClick={cancelEdit} className="h-6 w-6 p-0">
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-1 flex items-center justify-between">
              {field === 'status' ? (
                <Badge className={`${getStatusColor(value)} text-xs px-2 py-1`}>{value}</Badge>
              ) : field === 'score' ? (
                <span className="text-sm font-semibold text-blue-600">{value}%</span>
              ) : (
                <span className="text-sm text-slate-700 break-words">{value || 'Not set'}</span>
              )}
              {editingField !== field && hoveredField === field && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => startEdit(field, value)}
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Edit className="h-3 w-3" />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Lead Profile Card */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {/* Header Section with Initials and Basic Info */}
          <div className="text-center py-6 px-4 bg-gradient-to-b from-blue-50 to-white">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl font-bold text-white">
                {getInitials(lead.name)}
              </span>
            </div>
            <h3 className="font-semibold text-lg text-slate-900">{lead.name}</h3>
            <p className="text-slate-600 text-sm">{lead.company}</p>
            <div className="flex items-center justify-center gap-2 mt-3">
              <Badge className={`${getPriorityColor(lead.priority)} text-xs px-2 py-1`}>
                {lead.priority.charAt(0).toUpperCase() + lead.priority.slice(1)} Priority
              </Badge>
              {isSensitive && (
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs">
                  <Shield className="h-3 w-3 mr-1" />
                  Sensitive
                </Badge>
              )}
            </div>
          </div>

          {/* Conversion Likelihood */}
          <div className="px-4 py-4 border-b">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-green-600" />
              <h4 className="font-medium text-sm">Conversion Likelihood</h4>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">
                {lead.conversionLikelihood}%
              </div>
              <Progress value={lead.conversionLikelihood} className="h-2 mb-2" />
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                High Confidence
              </Badge>
              <p className="text-xs text-slate-500 mt-2">
                Based on engagement level, response time, and industry patterns
              </p>
            </div>
          </div>

          {/* Editable Fields */}
          <div className="px-4 py-3 space-y-1">
            <EditableField field="name" value={lead.name} icon={User} label="Name" />
            <EditableField field="company" value={lead.company} icon={Building} label="Company" />
            <EditableField field="email" value={lead.email} icon={Mail} type="email" label="Email" />
            <EditableField field="phone" value={lead.phone} icon={Phone} type="tel" label="Phone" />
            <EditableField field="status" value={lead.status} icon={Calendar} type="select" label="Status" />
            <EditableField field="score" value={lead.score} icon={Target} type="number" label="Score" />
            
            <div className="py-2">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-600 mb-1">
                <Calendar className="h-4 w-4" />
                Last Contact: <span className="text-slate-800">{lead.lastContact}</span>
              </div>
            </div>
            
            <EditableField field="notes" value={lead.notes || ''} icon={Calendar} type="textarea" label="Notes" />
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardContent className="p-3">
          <h4 className="font-medium text-sm text-slate-700 mb-3">Quick Actions</h4>
          <div className="grid grid-cols-2 gap-2">
            <Button size="sm" variant="outline" className="w-full h-8 text-xs">
              <Phone className="h-3 w-3 mr-1" />
              Call
            </Button>
            <Button size="sm" variant="outline" className="w-full h-8 text-xs">
              <Mail className="h-3 w-3 mr-1" />
              Email
            </Button>
            <Button size="sm" variant="outline" className="w-full h-8 text-xs">
              <MessageSquare className="h-3 w-3 mr-1" />
              SMS
            </Button>
            <Button size="sm" variant="outline" className="w-full h-8 text-xs">
              <Calendar className="h-3 w-3 mr-1" />
              Schedule
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tags */}
      <Card>
        <CardContent className="p-3">
          <h4 className="font-medium text-sm text-slate-700 mb-3">Tags</h4>
          <div className="flex flex-wrap gap-1">
            {lead.tags && lead.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add Custom Field */}
      <Dialog open={showAddField} onOpenChange={setShowAddField}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="w-full h-8 text-xs">
            <Plus className="h-3 w-3 mr-1" />
            Add Field
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm">Add Custom Field</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium">Field Name</label>
              <Input
                value={newFieldName}
                onChange={(e) => setNewFieldName(e.target.value)}
                placeholder="e.g., Account Type"
                className="h-8 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium">Field Type</label>
              <Select value={newFieldType} onValueChange={setNewFieldType}>
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="dropdown">Dropdown</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                onClick={() => {
                  // Handle adding custom field
                  toast.success(`Custom field "${newFieldName}" added`);
                  setShowAddField(false);
                  setNewFieldName('');
                }}
                className="h-8 text-xs"
              >
                Add
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => setShowAddField(false)}
                className="h-8 text-xs"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeadDetailsCard;
