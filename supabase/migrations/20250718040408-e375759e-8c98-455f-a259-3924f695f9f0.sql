
-- Create chat tables for internal messaging system

-- Chats table to store chat sessions
CREATE TABLE public.chats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  type TEXT NOT NULL DEFAULT 'direct', -- 'direct' or 'group'
  participants UUID[] NOT NULL,
  company_id UUID NOT NULL,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Messages table to store individual messages
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id UUID NOT NULL REFERENCES public.chats(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  content TEXT,
  message_type TEXT NOT NULL DEFAULT 'text', -- 'text', 'file', 'audio', 'image', 'ai', 'lead_share'
  file_url TEXT,
  file_type TEXT,
  file_name TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  edited_at TIMESTAMP WITH TIME ZONE,
  is_pinned BOOLEAN DEFAULT false
);

-- Chat attachments for easy querying of shared files
CREATE TABLE public.chat_attachments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id UUID NOT NULL REFERENCES public.chats(id) ON DELETE CASCADE,
  message_id UUID NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  uploaded_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Linked leads for messages that reference specific leads
CREATE TABLE public.message_lead_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Chat participants for managing who's in each chat
CREATE TABLE public.chat_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id UUID NOT NULL REFERENCES public.chats(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT DEFAULT 'member', -- 'admin', 'member'
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_read_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_pinned BOOLEAN DEFAULT false
);

-- Enable RLS on all chat tables
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_lead_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_participants ENABLE ROW LEVEL SECURITY;

-- RLS policies for chats
CREATE POLICY "Users can view chats they participate in" 
  ON public.chats 
  FOR SELECT 
  USING (
    company_id = get_current_user_company_id() AND
    auth.uid() = ANY(participants)
  );

CREATE POLICY "Users can create chats in their company" 
  ON public.chats 
  FOR INSERT 
  WITH CHECK (
    company_id = get_current_user_company_id() AND
    auth.uid() = created_by
  );

CREATE POLICY "Users can update chats they participate in" 
  ON public.chats 
  FOR UPDATE 
  USING (
    company_id = get_current_user_company_id() AND
    auth.uid() = ANY(participants)
  );

-- RLS policies for messages
CREATE POLICY "Users can view messages in their chats" 
  ON public.messages 
  FOR SELECT 
  USING (
    chat_id IN (
      SELECT id FROM public.chats 
      WHERE company_id = get_current_user_company_id() 
      AND auth.uid() = ANY(participants)
    )
  );

CREATE POLICY "Users can create messages in their chats" 
  ON public.messages 
  FOR INSERT 
  WITH CHECK (
    sender_id = auth.uid() AND
    chat_id IN (
      SELECT id FROM public.chats 
      WHERE company_id = get_current_user_company_id() 
      AND auth.uid() = ANY(participants)
    )
  );

CREATE POLICY "Users can update their own messages" 
  ON public.messages 
  FOR UPDATE 
  USING (sender_id = auth.uid());

-- RLS policies for chat_attachments
CREATE POLICY "Users can view attachments in their chats" 
  ON public.chat_attachments 
  FOR SELECT 
  USING (
    chat_id IN (
      SELECT id FROM public.chats 
      WHERE company_id = get_current_user_company_id() 
      AND auth.uid() = ANY(participants)
    )
  );

CREATE POLICY "Users can create attachments in their chats" 
  ON public.chat_attachments 
  FOR INSERT 
  WITH CHECK (
    uploaded_by = auth.uid() AND
    chat_id IN (
      SELECT id FROM public.chats 
      WHERE company_id = get_current_user_company_id() 
      AND auth.uid() = ANY(participants)
    )
  );

-- RLS policies for message_lead_links
CREATE POLICY "Users can view lead links in their chats" 
  ON public.message_lead_links 
  FOR SELECT 
  USING (
    message_id IN (
      SELECT m.id FROM public.messages m
      JOIN public.chats c ON m.chat_id = c.id
      WHERE c.company_id = get_current_user_company_id() 
      AND auth.uid() = ANY(c.participants)
    )
  );

CREATE POLICY "Users can create lead links in their messages" 
  ON public.message_lead_links 
  FOR INSERT 
  WITH CHECK (
    message_id IN (
      SELECT m.id FROM public.messages m
      JOIN public.chats c ON m.chat_id = c.id
      WHERE c.company_id = get_current_user_company_id() 
      AND auth.uid() = ANY(c.participants)
    )
  );

-- RLS policies for chat_participants
CREATE POLICY "Users can view participants in their chats" 
  ON public.chat_participants 
  FOR SELECT 
  USING (
    chat_id IN (
      SELECT id FROM public.chats 
      WHERE company_id = get_current_user_company_id() 
      AND auth.uid() = ANY(participants)
    )
  );

CREATE POLICY "Users can manage participants in their chats" 
  ON public.chat_participants 
  FOR ALL
  USING (
    chat_id IN (
      SELECT id FROM public.chats 
      WHERE company_id = get_current_user_company_id() 
      AND auth.uid() = ANY(participants)
    )
  )
  WITH CHECK (
    chat_id IN (
      SELECT id FROM public.chats 
      WHERE company_id = get_current_user_company_id() 
      AND auth.uid() = ANY(participants)
    )
  );

-- Enable realtime for chat tables
ALTER TABLE public.chats REPLICA IDENTITY FULL;
ALTER TABLE public.messages REPLICA IDENTITY FULL;
ALTER TABLE public.chat_participants REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.chats;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_participants;

-- Create indexes for performance
CREATE INDEX idx_chats_company_participants ON public.chats USING GIN (participants);
CREATE INDEX idx_chats_company_id ON public.chats (company_id);
CREATE INDEX idx_messages_chat_id_created ON public.messages (chat_id, created_at DESC);
CREATE INDEX idx_messages_sender_id ON public.messages (sender_id);
CREATE INDEX idx_chat_participants_chat_user ON public.chat_participants (chat_id, user_id);
CREATE INDEX idx_chat_attachments_chat_id ON public.chat_attachments (chat_id);
