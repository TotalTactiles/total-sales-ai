
-- Function to execute vector similarity search
CREATE OR REPLACE FUNCTION public.execute_vector_search(
  query_embedding vector(1536),
  company_filter uuid,
  industry_filter text,
  match_limit int
)
RETURNS TABLE (
  content text,
  source_type text,
  source_id uuid
) 
LANGUAGE plpgsql
AS $$
BEGIN
  IF company_filter IS NOT NULL THEN
    -- Company-specific search
    RETURN QUERY
    SELECT 
      ik.content, 
      ik.source_type, 
      ik.source_id
    FROM 
      industry_knowledge ik
    WHERE 
      ik.company_id = company_filter AND 
      ik.industry = industry_filter
    ORDER BY 
      ik.embedding <-> query_embedding
    LIMIT match_limit;
  ELSE
    -- Industry-wide search
    RETURN QUERY
    SELECT 
      ik.content, 
      ik.source_type, 
      ik.source_id
    FROM 
      industry_knowledge ik
    WHERE 
      ik.company_id IS NULL AND 
      ik.industry = industry_filter
    ORDER BY 
      ik.embedding <-> query_embedding
    LIMIT match_limit;
  END IF;
END;
$$;
