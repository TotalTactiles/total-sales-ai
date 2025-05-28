
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface QualityManagementTabProps {
  onBulkAction: (action: string) => void;
}

const QualityManagementTab = ({ onBulkAction }: QualityManagementTabProps) => {
  const mockQuality = {
    highQuality: 42,
    mediumQuality: 89,
    lowQuality: 23,
    needsAttention: 15
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Lead Quality Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>High Quality (80+)</span>
              <span className="font-bold text-green-600">{mockQuality.highQuality}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Medium Quality (60-79)</span>
              <span className="font-bold text-blue-600">{mockQuality.mediumQuality}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Low Quality (&lt;60)</span>
              <span className="font-bold text-yellow-600">{mockQuality.lowQuality}</span>
            </div>
            <div className="flex justify-between items-center border-t pt-2">
              <span>Needs Attention</span>
              <span className="font-bold text-red-600">{mockQuality.needsAttention}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quality Improvement Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => onBulkAction('Quality Review')}
            >
              Review low-quality leads
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => onBulkAction('Reassignment')}
            >
              Reassign neglected leads
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => onBulkAction('Training')}
            >
              Schedule team training
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QualityManagementTab;
