
-- Enhanced Database Schema for Native Dialer System

-- Create call sessions table with comprehensive state tracking
CREATE TABLE IF NOT EXISTS call_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  call_sid TEXT UNIQUE NOT NULL,
  company_id UUID NOT NULL,
  user_id UUID NOT NULL,
  lead_id UUID,
  direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  status TEXT NOT NULL DEFAULT 'initiated' CHECK (status IN ('initiated', 'ringing', 'answered', 'completed', 'failed', 'cancelled')),
  from_number TEXT NOT NULL,
  to_number TEXT NOT NULL,
  duration INTEGER DEFAULT 0,
  recording_url TEXT,
  recording_sid TEXT,
  transcription TEXT,
  sentiment_score DECIMAL(3,2),
  quality_score DECIMAL(3,2),
  disposition TEXT,
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  answered_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create SMS conversations table with threading
CREATE TABLE IF NOT EXISTS sms_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL,
  user_id UUID NOT NULL,
  lead_id UUID,
  phone_number TEXT NOT NULL,
  thread_id TEXT, -- For grouping related messages
  direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  message_sid TEXT UNIQUE NOT NULL,
  body TEXT NOT NULL,
  media_urls TEXT[], -- Array of media URLs
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'failed', 'received')),
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create call recordings table with metadata
CREATE TABLE IF NOT EXISTS call_recordings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  call_session_id UUID NOT NULL REFERENCES call_sessions(id) ON DELETE CASCADE,
  recording_sid TEXT UNIQUE NOT NULL,
  recording_url TEXT NOT NULL,
  duration INTEGER,
  file_size INTEGER,
  transcription TEXT,
  transcription_confidence DECIMAL(3,2),
  sentiment_analysis JSONB,
  keywords TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create real-time call events table for live monitoring
CREATE TABLE IF NOT EXISTS call_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  call_session_id UUID NOT NULL REFERENCES call_sessions(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('dial', 'ring', 'answer', 'hangup', 'transfer', 'hold', 'mute', 'recording_start', 'recording_stop')),
  event_data JSONB DEFAULT '{}',
  user_id UUID, -- Who triggered the event
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create call supervision sessions for monitoring
CREATE TABLE IF NOT EXISTS call_supervision (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  call_session_id UUID NOT NULL REFERENCES call_sessions(id) ON DELETE CASCADE,
  supervisor_id UUID NOT NULL,
  supervision_type TEXT NOT NULL CHECK (supervision_type IN ('listen', 'whisper', 'barge')),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  notes TEXT
);

-- Create auto-dialer campaigns table
CREATE TABLE IF NOT EXISTS dialer_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  lead_filters JSONB DEFAULT '{}',
  call_script TEXT,
  max_attempts INTEGER DEFAULT 3,
  retry_delay_minutes INTEGER DEFAULT 60,
  working_hours_start TIME DEFAULT '09:00:00',
  working_hours_end TIME DEFAULT '17:00:00',
  timezone TEXT DEFAULT 'UTC',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create dialer queue table
CREATE TABLE IF NOT EXISTS dialer_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES dialer_campaigns(id) ON DELETE CASCADE,
  lead_id UUID NOT NULL,
  phone_number TEXT NOT NULL,
  priority INTEGER DEFAULT 1,
  attempts INTEGER DEFAULT 0,
  last_attempt_at TIMESTAMP WITH TIME ZONE,
  next_attempt_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'calling', 'completed', 'failed', 'skipped')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_call_sessions_company_user ON call_sessions(company_id, user_id);
CREATE INDEX IF NOT EXISTS idx_call_sessions_status ON call_sessions(status);
CREATE INDEX IF NOT EXISTS idx_call_sessions_created_at ON call_sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_sms_conversations_company_user ON sms_conversations(company_id, user_id);
CREATE INDEX IF NOT EXISTS idx_sms_conversations_phone ON sms_conversations(phone_number);
CREATE INDEX IF NOT EXISTS idx_call_events_session_id ON call_events(call_session_id);
CREATE INDEX IF NOT EXISTS idx_call_events_timestamp ON call_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_dialer_queue_campaign_status ON dialer_queue(campaign_id, status);
CREATE INDEX IF NOT EXISTS idx_dialer_queue_next_attempt ON dialer_queue(next_attempt_at);

-- Add RLS policies
ALTER TABLE call_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_recordings ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_supervision ENABLE ROW LEVEL SECURITY;
ALTER TABLE dialer_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE dialer_queue ENABLE ROW LEVEL SECURITY;

-- RLS policies for call_sessions
CREATE POLICY "Users can access call sessions from their company" ON call_sessions
  FOR ALL USING (company_id = get_current_user_company_id());

-- RLS policies for sms_conversations
CREATE POLICY "Users can access SMS conversations from their company" ON sms_conversations
  FOR ALL USING (company_id = get_current_user_company_id());

-- RLS policies for call_recordings
CREATE POLICY "Users can access call recordings from their company" ON call_recordings
  FOR ALL USING (
    call_session_id IN (
      SELECT id FROM call_sessions WHERE company_id = get_current_user_company_id()
    )
  );

-- RLS policies for call_events
CREATE POLICY "Users can access call events from their company" ON call_events
  FOR ALL USING (
    call_session_id IN (
      SELECT id FROM call_sessions WHERE company_id = get_current_user_company_id()
    )
  );

-- RLS policies for call_supervision
CREATE POLICY "Users can access call supervision from their company" ON call_supervision
  FOR ALL USING (
    call_session_id IN (
      SELECT id FROM call_sessions WHERE company_id = get_current_user_company_id()
    )
  );

-- RLS policies for dialer_campaigns
CREATE POLICY "Users can access dialer campaigns from their company" ON dialer_campaigns
  FOR ALL USING (company_id = get_current_user_company_id());

-- RLS policies for dialer_queue
CREATE POLICY "Users can access dialer queue from their company" ON dialer_queue
  FOR ALL USING (
    campaign_id IN (
      SELECT id FROM dialer_campaigns WHERE company_id = get_current_user_company_id()
    )
  );

-- Enable real-time subscriptions for live monitoring
ALTER PUBLICATION supabase_realtime ADD TABLE call_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE call_events;
ALTER PUBLICATION supabase_realtime ADD TABLE sms_conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE call_supervision;

-- Add triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_call_sessions_updated_at BEFORE UPDATE ON call_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sms_conversations_updated_at BEFORE UPDATE ON sms_conversations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dialer_campaigns_updated_at BEFORE UPDATE ON dialer_campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
