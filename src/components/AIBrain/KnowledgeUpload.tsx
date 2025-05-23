
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useAuth } from '@/contexts/AuthContext';
import { useAIBrain } from '@/hooks/useAIBrain';
import { toast } from "sonner";
import { Loader2, Upload, Link, FileType } from "lucide-react";

const KnowledgeUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [industry, setIndustry] = useState<string>('');
  const [sourceType, setSourceType] = useState<string>('document');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [webUrl, setWebUrl] = useState<string>('');
  const [uploadType, setUploadType] = useState<'file' | 'url'>('file');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { ingestKnowledge } = useAIBrain();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (uploadType === 'file' && !file) {
      toast.error("Please select a file to upload");
      return;
    }
    
    if (uploadType === 'url' && !webUrl) {
      toast.error("Please enter a URL");
      return;
    }
    
    if (!industry) {
      toast.error("Please select an industry");
      return;
    }

    setIsProcessing(true);
    setProgress(10);

    try {
      if (uploadType === 'file' && file) {
        // File upload processing
        const reader = new FileReader();
        
        reader.onload = async (e) => {
          const text = e.target?.result as string;
          setProgress(30);
          
          try {
            const result = await ingestKnowledge({
              industry,
              sourceType,
              sourceId: file.name,
              text
            });
            
            setProgress(100);
            
            if (result) {
              toast.success(`Successfully processed ${result.chunks_success} of ${result.chunks_total} chunks`);
            }
          } catch (error) {
            console.error("Error processing file:", error);
            toast.error("Failed to process file");
          } finally {
            setFile(null);
            setIsProcessing(false);
            // Reset progress after a delay to show completion
            setTimeout(() => setProgress(0), 1000);
          }
        };
        
        reader.readAsText(file);
      } else if (uploadType === 'url' && webUrl) {
        // URL content crawling
        toast.info("Starting web content ingestion");
        setProgress(20);
        
        // Call a function to handle URL ingestion
        // This is a placeholder and should be implemented in your actual code
        try {
          // Simulating API call to ingest web content
          setProgress(50);
          
          // Replace with actual API call
          const response = await fetch('/api/ai-brain/crawl', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: webUrl, industry, sourceType })
          });
          
          setProgress(100);
          
          if (response.ok) {
            const result = await response.json();
            toast.success(`Successfully processed ${result.chunks_processed} chunks from URL`);
          } else {
            throw new Error('Failed to process URL');
          }
        } catch (error) {
          console.error("Error processing URL:", error);
          toast.error("Failed to process URL content");
        } finally {
          setWebUrl('');
          setIsProcessing(false);
          // Reset progress after a delay to show completion
          setTimeout(() => setProgress(0), 1000);
        }
      }
    } catch (error) {
      console.error("Error in upload process:", error);
      toast.error("An error occurred during the upload process");
      setIsProcessing(false);
      setProgress(0);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Upload & Ingest</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="flex space-x-2">
              <Button 
                type="button" 
                variant={uploadType === 'file' ? "default" : "outline"}
                size="sm"
                onClick={() => setUploadType('file')}
                className="flex-1"
              >
                <FileType className="h-4 w-4 mr-1" />
                File Upload
              </Button>
              <Button 
                type="button" 
                variant={uploadType === 'url' ? "default" : "outline"} 
                size="sm"
                onClick={() => setUploadType('url')}
                className="flex-1"
              >
                <Link className="h-4 w-4 mr-1" />
                Web URL
              </Button>
            </div>
          </div>
          
          {uploadType === 'file' && (
            <div className="space-y-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.docx,.doc,.txt"
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleUploadClick}
                className="w-full h-24 border-dashed flex flex-col items-center justify-center"
              >
                <Upload className="h-6 w-6 mb-2" />
                <span>Click to upload files</span>
                <span className="text-xs text-muted-foreground mt-1">
                  PDF, DOCX, TXT files supported
                </span>
              </Button>
              {file && (
                <div className="text-sm bg-secondary/30 p-2 rounded">
                  Selected: {file.name}
                </div>
              )}
            </div>
          )}
          
          {uploadType === 'url' && (
            <div className="space-y-2">
              <Input
                placeholder="Enter website URL..."
                value={webUrl}
                onChange={(e) => setWebUrl(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                We'll crawl the content and ingest it automatically
              </p>
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Industry</label>
            <Input 
              value={industry} 
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="e.g., healthcare, technology, finance" 
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Source Type</label>
            <Select value={sourceType} onValueChange={setSourceType}>
              <SelectTrigger>
                <SelectValue placeholder="Select source type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="document">Document</SelectItem>
                <SelectItem value="transcript">Call Transcript</SelectItem>
                <SelectItem value="SOP">Standard Operating Procedure</SelectItem>
                <SelectItem value="case-study">Case Study</SelectItem>
                <SelectItem value="website">Website</SelectItem>
                <SelectItem value="social-media">Social Media</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {isProcessing && progress > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Chunking & Embedding...</p>
              <Progress value={progress} className="h-2" />
            </div>
          )}
          
          <Button type="submit" disabled={isProcessing} className="w-full">
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Start Processing'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default KnowledgeUpload;
