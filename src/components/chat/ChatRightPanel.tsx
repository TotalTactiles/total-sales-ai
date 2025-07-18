
import React, { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  File, 
  Image, 
  ExternalLink, 
  Mic, 
  Pin,
  Download
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { ChatAttachment } from '@/types/chat';

interface ChatRightPanelProps {
  chatId: string;
}

const ChatRightPanel: React.FC<ChatRightPanelProps> = ({ chatId }) => {
  const [activeTab, setActiveTab] = useState<'files' | 'links' | 'notes'>('files');
  const [searchTerm, setSearchTerm] = useState('');
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAttachments = async () => {
      try {
        const { data, error } = await supabase
          .from('chat_attachments')
          .select('*')
          .eq('chat_id', chatId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setAttachments(data || []);
      } catch (error) {
        console.error('Error loading attachments:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAttachments();
  }, [chatId]);

  const filteredAttachments = attachments.filter(attachment =>
    attachment.file_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return Image;
    if (fileType.startsWith('audio/')) return Mic;
    return File;
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-4">
          <Button
            variant={activeTab === 'files' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('files')}
          >
            Files
          </Button>
          <Button
            variant={activeTab === 'links' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('links')}
          >
            Links
          </Button>
          <Button
            variant={activeTab === 'notes' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('notes')}
          >
            Notes
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 p-4">
        {activeTab === 'files' && (
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading files...
              </div>
            ) : filteredAttachments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <File className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No files shared yet</p>
              </div>
            ) : (
              filteredAttachments.map((attachment) => {
                const FileIcon = getFileIcon(attachment.file_type);
                return (
                  <div
                    key={attachment.id}
                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted cursor-pointer"
                  >
                    <div className="flex-shrink-0">
                      <FileIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">
                        {attachment.file_name}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(attachment.file_size)}
                      </p>
                    </div>
                    
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeTab === 'links' && (
          <div className="space-y-3">
            <div className="text-center py-8 text-muted-foreground">
              <ExternalLink className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No links shared yet</p>
            </div>
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="space-y-3">
            <div className="text-center py-8 text-muted-foreground">
              <Pin className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No notes saved yet</p>
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ChatRightPanel;
