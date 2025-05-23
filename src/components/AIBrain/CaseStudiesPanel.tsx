
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CaseStudyFilters from './CaseStudies/CaseStudyFilters';
import CaseStudyGrid from './CaseStudies/CaseStudyGrid';
import { useCaseStudies } from './CaseStudies/useCaseStudies';

interface CaseStudyProps {
  isManager: boolean;
}

const CaseStudiesPanel: React.FC<CaseStudyProps> = ({ isManager }) => {
  const [industryFilter, setIndustryFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  
  // Use our custom hook to fetch case studies and industries
  const { caseStudies, isLoading, industries } = useCaseStudies(
    industryFilter, 
    dateFilter, 
    sourceFilter
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Case Study Library</h2>
        {isManager && (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Case Study
          </Button>
        )}
      </div>
      
      {/* Filters */}
      <CaseStudyFilters 
        industryFilter={industryFilter}
        setIndustryFilter={setIndustryFilter}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        sourceFilter={sourceFilter}
        setSourceFilter={setSourceFilter}
        industries={industries}
      />
      
      {/* Case Studies Grid */}
      <CaseStudyGrid 
        caseStudies={caseStudies}
        isLoading={isLoading}
        isManager={isManager}
      />
    </div>
  );
};

export default CaseStudiesPanel;
