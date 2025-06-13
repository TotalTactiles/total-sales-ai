
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap } from 'lucide-react';

const SalesAcademy: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sales Academy</h1>
          <p className="text-muted-foreground">Training and skill development</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Training Center
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <GraduationCap className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Sales Training Academy</h3>
            <p className="text-muted-foreground">Comprehensive training programs and skill development.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesAcademy;
