import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Check, X, User, Building, Mail, Phone, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { Lead } from '@/types/lead';

interface EditableLeadDetailsProps {
  lead: Lead;
  onUpdate: (field: string, value: any) => void;
}

const EditableLeadDetails: React.FC<EditableLeadDetailsProps> = ({ lead, onUpdate }) => {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<any>('');

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
    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50">
      <div className="flex items-center gap-3">
        <Icon className="h-4 w-4 text-slate-500" />
        <div>
          <span className="text-sm font-medium capitalize">{field.replace(/([A-Z])/g, ' $1').trim()}:</span>
          {editingField === field ? (
            <div className="flex items-center gap-2 mt-1">
              {type === 'select' && field === 'status' ? (
                <Select value={tempValue} onValueChange={setTempValue}>
                  <SelectTrigger className="w-32">
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
                  className="w-64"
                  rows={2}
                />
              ) : (
                <Input
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  className="w-48"
                  type={type}
                />
              )}
              <Button size="sm" onClick={saveEdit}>
                <Check className="h-3 w-3" />
              </Button>
              <Button size="sm" variant="outline" onClick={cancelEdit}>
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <div className="mt-1">
              {field === 'status' ? (
                <Badge className={getStatusColor(value)}>{value}</Badge>
              ) : field === 'score' ? (
                <span className="text-lg font-semibold text-blue-600">{value}%</span>
              ) : (
                <span className="text-slate-700">{value}</span>
              )}
            </div>
          )}
        </div>
      </div>
      {editingField !== field && (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => startEdit(field, value)}
        >
          <Edit className="h-3 w-3" />
        </Button>
      )}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Lead Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <EditableField field="name" value={lead.name} icon={User} />
        <EditableField field="company" value={lead.company} icon={Building} />
        <EditableField field="email" value={lead.email} icon={Mail} type="email" />
        <EditableField field="phone" value={lead.phone} icon={Phone} type="tel" />
        <EditableField field="status" value={lead.status} icon={Calendar} type="select" />
        <EditableField field="score" value={lead.score} icon={Calendar} type="number" />
        <EditableField field="notes" value={lead.notes || 'No notes'} icon={Calendar} type="textarea" />
      </CardContent>
    </Card>
  );
};

export default EditableLeadDetails;