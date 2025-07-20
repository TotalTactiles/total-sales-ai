
-- Create messages table for chat functionality
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id UUID NOT NULL REFERENCES public.chats(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id),
  content TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'text',
  reply_to UUID REFERENCES public.messages(id),
  is_edited BOOLEAN DEFAULT false,
  edited_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Users can view messages in chats they participate in
CREATE POLICY "Users can view messages in their chats" 
  ON public.messages 
  FOR SELECT 
  USING (chat_id IN (
    SELECT id FROM public.chats 
    WHERE company_id = get_current_user_company_id() 
    AND auth.uid() = ANY(participants)
  ));

-- Users can create messages in chats they participate in
CREATE POLICY "Users can create messages in their chats" 
  ON public.messages 
  FOR INSERT 
  WITH CHECK (chat_id IN (
    SELECT id FROM public.chats 
    WHERE company_id = get_current_user_company_id() 
    AND auth.uid() = ANY(participants)
  ) AND sender_id = auth.uid());

-- Users can update their own messages
CREATE POLICY "Users can update their own messages" 
  ON public.messages 
  FOR UPDATE 
  USING (sender_id = auth.uid());

-- Add trigger for updated_at
CREATE TRIGGER update_messages_updated_at 
  BEFORE UPDATE ON public.messages 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for performance
CREATE INDEX idx_messages_chat_id ON public.messages(chat_id);
CREATE INDEX idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);
