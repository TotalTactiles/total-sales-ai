import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Search, RefreshCw } from 'lucide-react';

const KnowledgeTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card className="rounded-lg shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Knowledge Upload
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Add documents or URLs to build your company knowledge base.
          </p>
          <Button size="sm">Upload Content</Button>
        </CardContent>
      </Card>

      <Card className="rounded-lg shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Knowledge Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Quickly search through all indexed material and refresh when needed.
          </p>
          <Button variant="outline" size="sm">
            Reindex
            <RefreshCw className="h-4 w-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default KnowledgeTab;
