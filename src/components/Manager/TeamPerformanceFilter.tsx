
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Filter, Users, TrendingUp, TrendingDown, AlertTriangle, Award, Activity, Tag } from 'lucide-react';

interface TeamPerformanceFilterProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const TeamPerformanceFilter: React.FC<TeamPerformanceFilterProps> = ({
  value,
  onChange,
  className = ''
}) => {
  const filterOptions = [
    { value: 'all', label: 'All Team Members', icon: Users },
    { value: 'top-converters', label: 'Top Converters', icon: TrendingUp },
    { value: 'top-output', label: 'Top Output', icon: Activity },
    { value: 'lowest-performers', label: 'Lowest Performers', icon: TrendingDown },
    { value: 'flagged-reps', label: 'Flagged Reps', icon: AlertTriangle },
    { value: 'most-improved', label: 'Most Improved', icon: Award },
    { value: 'low-activity', label: 'Low Activity (7d)', icon: TrendingDown },
    { value: 'custom-tags', label: 'Custom Tags', icon: Tag }
  ];

  const getFilterIcon = (filterValue: string) => {
    const option = filterOptions.find(opt => opt.value === filterValue);
    const IconComponent = option?.icon || Filter;
    return <IconComponent className="h-4 w-4" />;
  };

  const getFilterColor = (filterValue: string) => {
    switch (filterValue) {
      case 'flagged-reps': return 'bg-red-100 text-red-700 border-red-200';
      case 'top-converters': return 'bg-green-100 text-green-700 border-green-200';
      case 'most-improved': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'low-activity': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className={`flex items-center gap-4 mb-4 ${className}`}>
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">Filter Team:</span>
      </div>
      
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-48 h-9">
          <SelectValue placeholder="Select filter" />
        </SelectTrigger>
        <SelectContent>
          {filterOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center gap-2">
                  <IconComponent className="h-4 w-4" />
                  <span>{option.label}</span>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>

      {value !== 'all' && (
        <Badge className={`${getFilterColor(value)} text-xs`}>
          <div className="flex items-center gap-1">
            {getFilterIcon(value)}
            <span>{filterOptions.find(opt => opt.value === value)?.label}</span>
          </div>
        </Badge>
      )}
    </div>
  );
};

export default TeamPerformanceFilter;
