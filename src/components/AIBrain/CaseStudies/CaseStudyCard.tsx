
import React from 'react';
import { CaseStudy } from './types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Tag, Clock } from "lucide-react";

interface CaseStudyCardProps {
  study: CaseStudy;
  isManager: boolean;
}

const CaseStudyCard: React.FC<CaseStudyCardProps> = ({ study, isManager }) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">
            {/* Use source_id as title if no specific title exists */}
            {study.title || study.source_id}
          </CardTitle>
          <Badge variant={study.company_id ? "default" : "outline"}>
            {study.company_id ? "Company" : "Industry"}
          </Badge>
        </div>
        <CardDescription className="flex items-center text-xs">
          <Clock className="h-3 w-3 mr-1" />
          {new Date(study.created_at).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <Badge variant="outline" className="mb-2">
              {study.industry}
            </Badge>
            <p className="text-sm line-clamp-3">{study.content}</p>
          </div>
          
          {/* Additional outcome information if available */}
          {study.outcome && (
            <div className="pt-2 border-t">
              <p className="text-xs font-medium">Outcome</p>
              <p className="text-sm">{study.outcome}</p>
            </div>
          )}
          
          <div className="flex justify-between pt-2">
            <Button variant="ghost" size="sm">
              <ExternalLink className="mr-1 h-3 w-3" />
              View Details
            </Button>
            
            {isManager && (
              <Button variant="ghost" size="sm">
                <Tag className="mr-1 h-3 w-3" />
                Edit Tags
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CaseStudyCard;
