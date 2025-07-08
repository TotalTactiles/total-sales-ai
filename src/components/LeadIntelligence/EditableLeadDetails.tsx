
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Check, X, User, Building, Mail, Phone, Calendar, Target } from 'lucide-react';
import { toast } from 'sonner';
import { Lead } from '@/types/lead';

interface EditableLeadDetailsProps {
  lead: Lead;
  onUpdate: (field: string, value: any) => void;
}

const EditableLeadDetails: React.FC<EditableLeadDetailsProps> = ({ lead, onUpdate }) => {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<any>('');
  const [hoveredField, setHoveredField] = useState<string | null>(null);

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

  const EditableField = ({ field, value, icon: Icon, type = 'text' }: any) => (
    <div 
      className="flex items-center justify-between p-2 border rounded-md hover:bg-slate-50 transition-colors group"
      onMouseEnter={() => setHoveredField(field)}
      onMouseLeave={() => setHoveredField(null)}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <Icon className="h-3 w-3 text-slate-500 shrink-0" />
        <div className="min-w-0 flex-1">
          <span className="text-xs font-medium text-slate-600 block">{field.replace(/([A-Z])/g, ' $1').trim()}:</span>
          {editingField === field ? (
            <div className="flex items-center gap-1 mt-1">
              {type === 'select' && field === 'status' ? (
                <Select value={tempValue} onValueChange={setTempValue}>
                  <SelectTrigger className="w-full h-7 text-xs">
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
                  className="w-full text-xs"
                  rows={2}
                />
              ) : (
                <Input
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  className="w-full h-7 text-xs"
                  type={type}
                />
              )}
              <Button size="sm" onClick={saveEdit} className="h-6 w-6 p-0">
                <Check className="h-3 w-3" />
              </Button>
              <Button size="sm" variant="outline" onClick={cancelEdit} className="h-6 w-6 p-0">
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <div className="mt-1">
              {field === 'status' ? (
                <Badge className={`${getStatusColor(value)} text-xs px-1 py-0`}>{value}</Badge>
              ) : field === 'score' ? (
                <span className="text-sm font-semibold text-blue-600">{value}%</span>
              ) : (
                <span className="text-xs text-slate-700 break-words">{value || 'Not set'}</span>
              )}
            </div>
          )}
        </div>
      </div>
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
  );

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <User className="h-4 w-4" />
          Lead Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-xs">
        <EditableField field="name" value={lead.name} icon={User} />
        <EditableField field="company" value={lead.company} icon={Building} />
        <EditableField field="email" value={lead.email} icon={Mail} type="email" />
        <EditableField field="phone" value={lead.phone} icon={Phone} type="tel" />
        <EditableField field="status" value={lead.status} icon={Calendar} type="select" />
        <EditableField field="score" value={lead.score} icon={Target} type="number" />
        <EditableField field="notes" value={lead.notes || ''} icon={Calendar} type="textarea" />
      </CardContent>
    </Card>
  );
};

export default EditableLeadDetails;
