
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Shield } from 'lucide-react';
import ConversionMeter from './ConversionMeter';
import { Lead } from '@/types/lead';

interface LeadHeaderProps {
  lead: Lead;
  isSensitive: boolean;
}

const LeadHeader: React.FC<LeadHeaderProps> = ({ lead, isSensitive }) => {
  return (
    <div className="space-y-6">
      {/* Lead Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <span className="text-xl font-bold text-blue-600">
            {lead.name.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
        <h3 className="font-semibold text-lg">{lead.name}</h3>
        <p className="text-slate-600">{lead.company}</p>
        <Badge className={`mt-2 ${
          lead.priority === 'high' ? 'bg-red-100 text-red-800' :
          lead.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {lead.priority.charAt(0).toUpperCase() + lead.priority.slice(1)} Priority
        </Badge>
        {isSensitive && (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 mt-2 ml-2">
            <Shield className="h-3 w-3 mr-1" />
            Sensitive
          </Badge>
        )}
      </div>

      {/* Conversion Meter */}
      <ConversionMeter 
        likelihood={lead.conversionLikelihood}
        reasoning="Based on engagement level, response time, and industry patterns"
      />
    </div>
  );
};

export default LeadHeader;
