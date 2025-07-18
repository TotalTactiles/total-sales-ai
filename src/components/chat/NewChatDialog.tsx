
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface NewChatDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: any;
}

interface TeamMember {
  id: string;
  full_name: string;
  role: string;
  email: string;
}

const NewChatDialog: React.FC<NewChatDialogProps> = ({
  isOpen,
  onClose,
  currentUser
}) => {
  const { profile } = useAuth();
  const [chatName, setChatName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadTeamMembers();
    }
  }, [isOpen, profile]);

  const loadTeamMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, role, email')
        .eq('company_id', profile?.company_id)
        .neq('id', currentUser.id);

      if (error) throw error;
      setTeamMembers(data || []);
    } catch (error) {
      console.error('Error loading team members:', error);
      toast.error('Failed to load team members');
    }
  };

  const handleCreateChat = async () => {
    if (selectedMembers.length === 0) {
      toast.error('Please select at least one team member');
      return;
    }

    setLoading(true);
    try {
      const participants = [currentUser.id, ...selectedMembers];
      const chatType = selectedMembers.length === 1 ? 'direct' : 'group';
      
      const { data, error } = await supabase
        .from('chats')
        .insert({
          name: chatType === 'group' ? chatName || undefined : undefined,
          type: chatType,
          participants,
          company_id: profile?.company_id,
          created_by: currentUser.id
        })
        .select()
        .single();

      if (error) throw error;

      // Create chat participants entries
      const participantEntries = participants.map(userId => ({
        chat_id: data.id,
        user_id: userId
      }));

      await supabase
        .from('chat_participants')
        .insert(participantEntries);

      toast.success('Chat created successfully!');
      onClose();
      
      // Reset form
      setChatName('');
      setSelectedMembers([]);
    } catch (error) {
      console.error('Error creating chat:', error);
      toast.error('Failed to create chat');
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = teamMembers.filter(member =>
    member.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleMember = (memberId: string) => {
    setSelectedMembers(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Start New Chat</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Chat Name (for group chats) */}
          {selectedMembers.length > 1 && (
            <div className="space-y-2">
              <Label htmlFor="chatName">Group Name (optional)</Label>
              <Input
                id="chatName"
                value={chatName}
                onChange={(e) => setChatName(e.target.value)}
                placeholder="Enter group name..."
              />
            </div>
          )}

          {/* Search Team Members */}
          <div className="space-y-2">
            <Label>Select Team Members</Label>
            <Input
              placeholder="Search team members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Team Members List */}
          <ScrollArea className="h-48 border rounded-md p-2">
            <div className="space-y-2">
              {filteredMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center space-x-3 p-2 rounded hover:bg-muted cursor-pointer"
                  onClick={() => toggleMember(member.id)}
                >
                  <Checkbox
                    checked={selectedMembers.includes(member.id)}
                    onChange={() => toggleMember(member.id)}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{member.full_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {member.role} • {member.email}
                    </p>
                  </div>
                </div>
              ))}

              {filteredMembers.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  <p className="text-sm">No team members found</p>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateChat}
              disabled={loading || selectedMembers.length === 0}
            >
              {loading ? 'Creating...' : 'Create Chat'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewChatDialog;
