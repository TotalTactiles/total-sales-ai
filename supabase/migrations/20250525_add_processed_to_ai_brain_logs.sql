-- Add processed column to ai_brain_logs to track ingestion queue state
ALTER TABLE IF EXISTS public.ai_brain_logs
ADD COLUMN IF NOT EXISTS processed boolean DEFAULT false;

-- Index for faster lookups of unprocessed events
CREATE INDEX IF NOT EXISTS ai_brain_logs_processed_idx ON public.ai_brain_logs(processed);
