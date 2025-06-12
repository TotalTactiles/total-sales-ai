
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, MessageCircle, X } from 'lucide-react';
import { useRelevanceAI } from '@/hooks/useRelevanceAI';

interface EnhancedRelevanceAIBubbleProps {
  context?: any;
  className?: string;
}

const EnhancedRelevanceAIBubble: React.FC<EnhancedRelevanceAIBubbleProps> = ({
  context,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const { executeWorkflow, isLoading } = useRelevanceAI();

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    try {
      await executeWorkflow('sales-agent-v1', {
        message: message.trim(),
        context,
        timestamp: new Date().toISOString()
      });
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full shadow-lg"
          size="lg"
        >
          <Brain className="h-6 w-6" />
        </Button>
      ) : (
        <Card className="w-80 shadow-lg">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                <span className="font-medium">AI Assistant</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-3">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask me anything..."
                className="w-full p-2 border rounded-md resize-none"
                rows={3}
              />
              
              <div className="flex gap-2">
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading || !message.trim()}
                  className="flex-1"
                >
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Send
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedRelevanceAIBubble;
