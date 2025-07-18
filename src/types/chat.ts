
export interface Chat {
  id: string;
  name?: string;
  type: 'direct' | 'group';
  participants: string[];
  company_id: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  last_message_at?: string;
}

export interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  content?: string;
  message_type: 'text' | 'file' | 'audio' | 'image' | 'ai' | 'lead_share';
  file_url?: string;
  file_type?: string;
  file_name?: string;
  metadata?: any;
  created_at: string;
  edited_at?: string;
  is_pinned: boolean;
}

export interface ChatAttachment {
  id: string;
  chat_id: string;
  message_id: string;
  file_url: string;
  file_type: string;
  file_name: string;
  file_size?: number;
  uploaded_by: string;
  created_at: string;
}

export interface MessageLeadLink {
  id: string;
  message_id: string;
  lead_id: string;
  created_at: string;
}

export interface ChatParticipant {
  id: string;
  chat_id: string;
  user_id: string;
  role: 'admin' | 'member';
  joined_at: string;
  last_read_at?: string;
  is_pinned: boolean;
}
