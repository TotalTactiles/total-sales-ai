
-- Create lead_communications table
CREATE TABLE IF NOT EXISTS public.lead_communications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL,
  user_id UUID NOT NULL,
  company_id UUID NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('note', 'sms', 'email', 'call')),
  content TEXT NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'failed')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.lead_communications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view communications for their company leads"
  ON public.lead_communications FOR SELECT
  USING (
    company_id = get_current_user_company_id()
  );

CREATE POLICY "Users can create communications for their company leads"
  ON public.lead_communications FOR INSERT
  WITH CHECK (
    company_id = get_current_user_company_id() AND
    user_id = auth.uid()
  );

CREATE POLICY "Users can update their own communications"
  ON public.lead_communications FOR UPDATE
  USING (
    company_id = get_current_user_company_id() AND
    user_id = auth.uid()
  );

-- Create indexes for performance
CREATE INDEX idx_lead_communications_lead_id ON public.lead_communications(lead_id);
CREATE INDEX idx_lead_communications_user_id ON public.lead_communications(user_id);
CREATE INDEX idx_lead_communications_company_id ON public.lead_communications(company_id);
CREATE INDEX idx_lead_communications_type ON public.lead_communications(type);
CREATE INDEX idx_lead_communications_created_at ON public.lead_communications(created_at);

-- Add trigger for updated_at
CREATE TRIGGER update_lead_communications_updated_at
  BEFORE UPDATE ON public.lead_communications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
