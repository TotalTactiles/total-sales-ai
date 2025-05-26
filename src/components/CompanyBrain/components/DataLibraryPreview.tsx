
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database, ExternalLink } from 'lucide-react';

export const DataLibraryPreview: React.FC = () => {
  return (
    <Card className="mt-8 bg-white/90 backdrop-blur-sm shadow-lg rounded-2xl border-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold flex items-center gap-3">
            <Database className="h-7 w-7 text-blue-600" />
            Central Data Library
          </CardTitle>
          <Button variant="outline" className="gap-2">
            <ExternalLink className="h-4 w-4" />
            View Full Library
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {['Social Posts', 'Website Pages', 'Documents', 'Videos'].map((category, index) => (
            <div key={category} className="p-4 border rounded-lg text-center hover:bg-slate-50 transition-colors">
              <div className="text-2xl font-bold text-blue-600 mb-1">{[24, 156, 89, 12][index]}</div>
              <div className="text-sm text-slate-600">{category}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
