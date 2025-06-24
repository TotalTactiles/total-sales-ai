
-- Enable RLS on company_settings table if not already enabled
ALTER TABLE public.company_settings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to insert their own company settings
CREATE POLICY "Users can create their own company settings" 
  ON public.company_settings 
  FOR INSERT 
  WITH CHECK (company_id = auth.uid());

-- Create policy to allow users to view their own company settings
CREATE POLICY "Users can view their own company settings" 
  ON public.company_settings 
  FOR SELECT 
  USING (company_id = auth.uid());

-- Create policy to allow users to update their own company settings
CREATE POLICY "Users can update their own company settings" 
  ON public.company_settings 
  FOR UPDATE 
  USING (company_id = auth.uid());

-- Create policy to allow users to delete their own company settings
CREATE POLICY "Users can delete their own company settings" 
  ON public.company_settings 
  FOR DELETE 
  USING (company_id = auth.uid());
