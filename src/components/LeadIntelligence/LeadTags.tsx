
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface LeadTagsProps {
  tags: string[];
}

const LeadTags: React.FC<LeadTagsProps> = ({ tags }) => {
  if (tags.length === 0) return null;

  return (
    <div>
      <h4 className="font-medium text-sm text-slate-700 mb-2">Tags</h4>
      <div className="flex flex-wrap gap-1">
        {tags.map((tag, index) => (
          <Badge key={index} variant="secondary" className="text-xs">
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default LeadTags;
