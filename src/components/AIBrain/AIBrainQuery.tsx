
import React, { useState } from 'react';
import { useAIBrain } from '@/hooks/useAIBrain';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Search } from "lucide-react";

interface KnowledgeResult {
  content: string;
  sourceType: string;
  sourceId: string;
}

const AIBrainQuery: React.FC = () => {
  const [industry, setIndustry] = useState('');
  const [query, setQuery] = useState('');
  const [topK, setTopK] = useState('5');
  const [results, setResults] = useState<KnowledgeResult[]>([]);
  const { queryKnowledge, isQuerying, error } = useAIBrain();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!industry || !query) {
      return;
    }

    const queryResults = await queryKnowledge({
      industry,
      query,
      topK: parseInt(topK)
    });

    if (queryResults) {
      setResults(queryResults);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>AI Brain - Knowledge Query</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Industry</label>
            <Input 
              value={industry} 
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="e.g., construction, healthcare, technology" 
              required
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Query</label>
            <Input 
              value={query} 
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask a question about this industry..." 
              required
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Results Limit</label>
            <Select value={topK} onValueChange={setTopK}>
              <SelectTrigger>
                <SelectValue placeholder="Number of results" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 results</SelectItem>
                <SelectItem value="5">5 results</SelectItem>
                <SelectItem value="10">10 results</SelectItem>
                <SelectItem value="20">20 results</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}
          
          <Button type="submit" disabled={isQuerying} className="w-full">
            {isQuerying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Query Knowledge
              </>
            )}
          </Button>
        </form>
        
        {results.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Results</h3>
            <div className="space-y-4">
              {results.map((result, index) => (
                <Card key={index} className="p-4">
                  <div className="text-sm text-gray-500 mb-1">
                    Source: {result.sourceType} (ID: {result.sourceId})
                  </div>
                  <div className="whitespace-pre-wrap">{result.content}</div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIBrainQuery;
