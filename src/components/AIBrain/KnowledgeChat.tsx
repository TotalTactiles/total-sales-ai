
import { logger } from '@/utils/logger';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAIBrain, type KnowledgeResult } from '@/hooks/useAIBrain';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "sonner";
import { SendHorizonal, Loader2, Copy } from "lucide-react";

interface ChatMessage {
  type: 'query' | 'response';
  content: string;
  timestamp: Date;
}

const KnowledgeChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [query, setQuery] = useState<string>('');
  const [industry, setIndustry] = useState<string>('');
  const [topK, setTopK] = useState<string>('5');
  const [results, setResults] = useState<KnowledgeResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { queryKnowledge } = useAIBrain();
  const { user } = useAuth();
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim() || !industry.trim()) {
      toast.error("Please enter a query and industry");
      return;
    }
    
    setIsLoading(true);
    
    // Add user query to messages
    setMessages(prev => [...prev, {
      type: 'query',
      content: query,
      timestamp: new Date()
    }]);
    
    try {
      const queryResults = await queryKnowledge({
        industry,
        query,
        topK: parseInt(topK)
      });
      
      if (queryResults && queryResults.length > 0) {
        // Set results for display
        setResults(queryResults);
        
        // Add response message
        setMessages(prev => [...prev, {
          type: 'response',
          content: `Found ${queryResults.length} relevant knowledge chunks:`,
          timestamp: new Date()
        }]);
      } else {
        setMessages(prev => [...prev, {
          type: 'response',
          content: "No matching knowledge found in the brain. Try a different query or adding more content to the knowledge base.",
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      logger.error("Error querying knowledge:", error);
      toast.error("Failed to query knowledge");
    } finally {
      setIsLoading(false);
      setQuery('');
    }
  };
  
  const copyToPrompt = (content: string) => {
    setQuery(content);
    toast.success("Text copied to prompt");
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Knowledge Chat</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">Industry</label>
            <Input 
              value={industry} 
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="e.g., healthcare, technology, finance" 
              required
            />
          </div>
          
          <div className="h-[400px] border rounded-md overflow-y-auto p-4 bg-background/50">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <p>No messages yet</p>
                <p className="text-sm">Ask a question about your knowledge base</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg, index) => (
                  <div 
                    key={index}
                    className={`flex ${msg.type === 'query' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[80%] rounded-lg p-3 ${
                        msg.type === 'query' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <span className="text-xs opacity-70 block mt-1">
                        {msg.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
                
                {/* Display knowledge results */}
                {results.length > 0 && (
                  <div className="space-y-2 mt-4">
                    {results.map((result, idx) => (
                      <div key={idx} className="bg-accent/30 rounded-lg p-3">
                        <div className="flex justify-between items-start mb-1">
                          <div className="text-xs text-muted-foreground">
                            Source: {result.sourceType} ({result.sourceId})
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 p-1"
                            onClick={() => copyToPrompt(result.content)}
                          >
                            <Copy className="h-3 w-3 mr-1" /> Copy
                          </Button>
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{result.content}</p>
                      </div>
                    ))}
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSubmit} className="w-full flex space-x-2">
          <div className="w-20">
            <Select value={topK} onValueChange={setTopK}>
              <SelectTrigger>
                <SelectValue placeholder="Results" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">Top 3</SelectItem>
                <SelectItem value="5">Top 5</SelectItem>
                <SelectItem value="10">Top 10</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Input 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about your knowledge base..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" size="sm" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <SendHorizonal className="h-4 w-4" />
            )}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default KnowledgeChat;
