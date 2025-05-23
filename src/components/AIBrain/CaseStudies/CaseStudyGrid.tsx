
import React from 'react';
import { CaseStudy } from './types';
import CaseStudyCard from './CaseStudyCard';
import { Loader2 } from "lucide-react";

interface CaseStudyGridProps {
  caseStudies: CaseStudy[];
  isLoading: boolean;
  isManager: boolean;
}

const CaseStudyGrid: React.FC<CaseStudyGridProps> = ({ 
  caseStudies,
  isLoading,
  isManager 
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (caseStudies.length === 0) {
    return (
      <div className="col-span-full text-center py-12">
        <p className="text-muted-foreground">No case studies found</p>
        <p className="text-sm">Try adjusting your filters or adding new case studies</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {caseStudies.map((study) => (
        <CaseStudyCard key={study.id} study={study} isManager={isManager} />
      ))}
    </div>
  );
};

export default CaseStudyGrid;
