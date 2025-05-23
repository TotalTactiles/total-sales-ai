
import React, { useState } from 'react';
import { useAIBrain } from '@/hooks/useAIBrain';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const AIBrainIngest: React.FC = () => {
  const [industry, setIndustry] = useState('');
  const [sourceType, setSourceType] = useState('transcript');
  const [sourceId, setSourceId] = useState('');
  const [text, setText] = useState('');
  const { ingestKnowledge, isIngesting, error } = useAIBrain();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!industry || !sourceType || !sourceId || !text) {
      return;
    }

    await ingestKnowledge({
      industry,
      sourceType,
      sourceId,
      text
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>AI Brain - Knowledge Ingestion</CardTitle>
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
            <label className="text-sm font-medium">Source Type</label>
            <Select value={sourceType} onValueChange={setSourceType}>
              <SelectTrigger>
                <SelectValue placeholder="Select source type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="transcript">Call Transcript</SelectItem>
                <SelectItem value="SOP">Standard Operating Procedure</SelectItem>
                <SelectItem value="confidence">Confidence Record</SelectItem>
                <SelectItem value="training">Training Material</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium">Source ID</label>
            <Input 
              value={sourceId} 
              onChange={(e) => setSourceId(e.target.value)}
              placeholder="UUID of the source document" 
              required
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Content</label>
            <Textarea 
              value={text} 
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste text to ingest into the AI Brain..." 
              required
              className="min-h-[200px]"
            />
          </div>
          
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}
          
          <Button type="submit" disabled={isIngesting} className="w-full">
            {isIngesting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Ingest Knowledge'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AIBrainIngest;
