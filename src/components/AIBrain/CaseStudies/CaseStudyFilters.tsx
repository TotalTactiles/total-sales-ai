
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CaseStudyFiltersProps {
  industryFilter: string;
  setIndustryFilter: (value: string) => void;
  dateFilter: string;
  setDateFilter: (value: string) => void;
  sourceFilter: string;
  setSourceFilter: (value: string) => void;
  industries: string[];
}

const CaseStudyFilters: React.FC<CaseStudyFiltersProps> = ({
  industryFilter,
  setIndustryFilter,
  dateFilter,
  setDateFilter,
  sourceFilter,
  setSourceFilter,
  industries
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Select value={industryFilter} onValueChange={setIndustryFilter}>
        <SelectTrigger>
          <SelectValue placeholder="Filter by industry" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Industries</SelectItem>
          {industries.map((industry) => (
            <SelectItem key={industry} value={industry}>{industry}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select value={dateFilter} onValueChange={setDateFilter}>
        <SelectTrigger>
          <SelectValue placeholder="Filter by date" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Time</SelectItem>
          <SelectItem value="recent">Last 30 Days</SelectItem>
        </SelectContent>
      </Select>
      
      <Select value={sourceFilter} onValueChange={setSourceFilter}>
        <SelectTrigger>
          <SelectValue placeholder="Filter by source" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Sources</SelectItem>
          <SelectItem value="company">Company Specific</SelectItem>
          <SelectItem value="industry">Industry Wide</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default CaseStudyFilters;
