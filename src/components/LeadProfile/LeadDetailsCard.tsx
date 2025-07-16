
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, Building, TrendingUp, Clock, Star } from 'lucide-react';
import { Lead } from '@/types/lead';

interface LeadDetailsCardProps {
  lead: Lead;
  onUpdate: (field: string, value: any) => void;
}

const LeadDetailsCard: React.FC<LeadDetailsCardProps> = ({ lead, onUpdate }) => {
  return (
    <div className="space-y-4">
      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-slate-400" />
            <span className="text-sm">{lead.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-slate-400" />
            <span className="text-sm">{lead.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4 text-slate-400" />
            <span className="text-sm">{lead.company}</span>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-xs font-medium">Score</span>
            </div>
            <p className="text-lg font-bold text-green-600">{lead.score}%</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-600" />
              <span className="text-xs font-medium">Last Contact</span>
            </div>
            <p className="text-xs font-semibold">{lead.lastContact || 'Never'}</p>
          </CardContent>
        </Card>
      </div>

      {/* Status & Priority */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Status & Priority</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm">Status:</span>
            <Badge variant="secondary">{lead.status}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Priority:</span>
            <Badge className={`${
              lead.priority === 'high' ? 'bg-red-100 text-red-800' :
              lead.priority === 'medium' ? 'bg-amber-100 text-amber-800' :
              'bg-slate-100 text-slate-800'
            }`}>
              {lead.priority}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Tags */}
      {lead.tags && lead.tags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {lead.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LeadDetailsCard;
