
-- Delete all data related to the user peonmyshoe@gmail.com
-- First, get the user ID for reference
DO $$
DECLARE
    target_user_id UUID;
BEGIN
    -- Get the user ID from auth.users (this is read-only, just for reference)
    SELECT id INTO target_user_id 
    FROM auth.users 
    WHERE email = 'peonmyshoe@gmail.com';
    
    -- If user exists, delete all related data
    IF target_user_id IS NOT NULL THEN
        -- Delete from company_settings
        DELETE FROM public.company_settings WHERE company_id = target_user_id;
        
        -- Delete from profiles
        DELETE FROM public.profiles WHERE id = target_user_id;
        
        -- Delete from other related tables
        DELETE FROM public.user_stats WHERE user_id = target_user_id;
        DELETE FROM public.ai_agent_personas WHERE user_id = target_user_id;
        DELETE FROM public.leads WHERE company_id = target_user_id;
        DELETE FROM public.call_logs WHERE user_id = target_user_id;
        DELETE FROM public.notifications WHERE user_id = target_user_id;
        DELETE FROM public.usage_analytics WHERE user_id = target_user_id;
        DELETE FROM public.usage_events WHERE user_id = target_user_id;
        DELETE FROM public.email_tokens WHERE user_id = target_user_id;
        DELETE FROM public.oauth_connections WHERE user_id = target_user_id;
        DELETE FROM public.crm_integrations WHERE user_id = target_user_id;
        DELETE FROM public.import_sessions WHERE user_id = target_user_id;
        DELETE FROM public.confidence_cache WHERE user_id = target_user_id;
        DELETE FROM public.user_notifications WHERE user_id = target_user_id;
        DELETE FROM public.referral_links WHERE company_id = target_user_id;
        DELETE FROM public.referral_usage WHERE new_company_id = target_user_id OR referring_company_id = target_user_id;
        DELETE FROM public.relevance_usage WHERE company_id = target_user_id;
        DELETE FROM public.manager_feedback WHERE company_id = target_user_id;
        DELETE FROM public.session_summary WHERE user_id = target_user_id;
        DELETE FROM public.ai_brain_insights WHERE user_id = target_user_id;
        DELETE FROM public.ai_brain_logs WHERE company_id = target_user_id;
        DELETE FROM public.stats_history WHERE user_id = target_user_id;
        DELETE FROM public.error_logs WHERE user_id = target_user_id;
        DELETE FROM public.ghost_intent_events WHERE user_id = target_user_id;
        DELETE FROM public.unused_features WHERE company_id = target_user_id;
        DELETE FROM public.feature_requests WHERE company_id = target_user_id;
        
        RAISE NOTICE 'Deleted all data for user: %', target_user_id;
    ELSE
        RAISE NOTICE 'User with email peonmyshoe@gmail.com not found';
    END IF;
END $$;

-- Note: The auth.users entry itself cannot be deleted via SQL as it's managed by Supabase Auth
-- The user will need to be deleted from the Supabase Auth dashboard or will be cleaned up when they re-signup
