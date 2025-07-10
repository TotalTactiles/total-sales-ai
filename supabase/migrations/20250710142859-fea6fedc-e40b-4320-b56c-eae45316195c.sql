
-- Phase 3: Enhanced Security & Data Architecture - Production Ready Schema
-- Database Schema Improvement for AI Sales Rep System

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- PHASE 1: FOUNDATION HELPER FUNCTIONS
-- =============================================

-- Get current user's company ID with error handling
CREATE OR REPLACE FUNCTION get_current_user_company_id()
RETURNS UUID
LANGUAGE plpgsql
STABLE SECURITY DEFINER
AS $$
DECLARE
    company_uuid UUID;
BEGIN
    -- Try to get from profiles table first
    SELECT company_id INTO company_uuid
    FROM public.profiles 
    WHERE id = auth.uid()
    LIMIT 1;
    
    -- If not found, try from JWT token
    IF company_uuid IS NULL THEN
        company_uuid := COALESCE(
            (current_setting('request.jwt.claims', true)::json->>'company_id')::uuid,
            auth.uid() -- Fallback to user ID for single-user companies
        );
    END IF;
    
    RETURN company_uuid;
EXCEPTION
    WHEN OTHERS THEN
        -- Return user ID as fallback for error cases
        RETURN auth.uid();
END;
$$;

-- Get current user's role with error handling
CREATE OR REPLACE FUNCTION get_current_user_role()
RETURNS TEXT
LANGUAGE plpgsql
STABLE SECURITY DEFINER
AS $$
DECLARE
    user_role TEXT;
BEGIN
    -- Try to get from profiles table first
    SELECT role::text INTO user_role
    FROM public.profiles 
    WHERE id = auth.uid()
    LIMIT 1;
    
    -- If not found, try from JWT token
    IF user_role IS NULL THEN
        user_role := COALESCE(
            current_setting('request.jwt.claims', true)::json->>'role',
            'sales_rep'
        );
    END IF;
    
    RETURN COALESCE(user_role, 'sales_rep');
EXCEPTION
    WHEN OTHERS THEN
        RETURN 'sales_rep'; -- Safe default
END;
$$;

-- Get current user ID with validation
CREATE OR REPLACE FUNCTION get_current_user_id()
RETURNS UUID
LANGUAGE plpgsql
STABLE SECURITY DEFINER
AS $$
BEGIN
    RETURN COALESCE(auth.uid(), '00000000-0000-0000-0000-000000000000'::uuid);
EXCEPTION
    WHEN OTHERS THEN
        RETURN '00000000-0000-0000-0000-000000000000'::uuid;
END;
$$;

-- Validate user permissions for AI operations
CREATE OR REPLACE FUNCTION validate_ai_permission(
    p_company_id UUID,
    p_rep_id UUID DEFAULT NULL,
    p_action TEXT DEFAULT 'read'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE SECURITY DEFINER
AS $$
DECLARE
    current_company_id UUID;
    current_role TEXT;
    current_user_id UUID;
BEGIN
    current_company_id := get_current_user_company_id();
    current_role := get_current_user_role();
    current_user_id := get_current_user_id();
    
    -- System admin has all permissions
    IF current_role = 'admin' THEN
        RETURN TRUE;
    END IF;
    
    -- Company isolation check
    IF p_company_id != current_company_id THEN
        RETURN FALSE;
    END IF;
    
    -- Manager can access team data
    IF current_role = 'manager' THEN
        RETURN TRUE;
    END IF;
    
    -- Sales rep can only access own data
    IF current_role = 'sales_rep' AND (p_rep_id IS NULL OR p_rep_id = current_user_id) THEN
        RETURN TRUE;
    END IF;
    
    RETURN FALSE;
END;
$$;

-- =============================================
-- PHASE 2: ENHANCED TABLE STRUCTURE
-- =============================================

-- System health monitoring
CREATE TABLE IF NOT EXISTS system_health_monitor (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_name VARCHAR(100) NOT NULL,
    metric_value NUMERIC NOT NULL,
    status VARCHAR(20) DEFAULT 'normal',
    alert_threshold NUMERIC,
    error_details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced lead AI interactions with better tracking
CREATE TABLE IF NOT EXISTS lead_ai_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL,
    rep_id UUID NOT NULL,
    company_id UUID NOT NULL,
    module_id VARCHAR(100) NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    data_before JSONB,
    data_after JSONB,
    success BOOLEAN DEFAULT true,
    error_code VARCHAR(50),
    error_message TEXT,
    stack_trace TEXT,
    duration_ms INTEGER,
    ip_address INET,
    user_agent TEXT,
    session_id VARCHAR(255),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    retention_days INTEGER DEFAULT 90
);

-- Comprehensive AI audit logs
CREATE TABLE IF NOT EXISTS ai_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL,
    rep_id UUID,
    module_id VARCHAR(100) NOT NULL,
    action VARCHAR(100) NOT NULL,
    request_data JSONB,
    response_data JSONB,
    duration_ms INTEGER,
    success BOOLEAN DEFAULT true,
    error_code VARCHAR(50),
    error_message TEXT,
    stack_trace TEXT,
    ip_address INET,
    user_agent TEXT,
    session_id VARCHAR(255),
    correlation_id UUID,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    retention_days INTEGER DEFAULT 365
);

-- AI module status with health metrics
CREATE TABLE IF NOT EXISTS ai_module_status (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id VARCHAR(100) NOT NULL UNIQUE,
    status VARCHAR(20) DEFAULT 'offline',
    health_score INTEGER DEFAULT 100,
    last_heartbeat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    error_count INTEGER DEFAULT 0,
    success_count INTEGER DEFAULT 0,
    avg_response_time_ms INTEGER DEFAULT 0,
    memory_usage_mb INTEGER DEFAULT 0,
    cpu_usage_percent NUMERIC(5,2) DEFAULT 0.00,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced security events with severity levels
CREATE TABLE IF NOT EXISTS security_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) DEFAULT 'medium',
    company_id UUID,
    rep_id UUID,
    description TEXT NOT NULL,
    metadata JSONB,
    resolved BOOLEAN DEFAULT false,
    resolved_by UUID,
    resolved_at TIMESTAMP WITH TIME ZONE,
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    retention_days INTEGER DEFAULT 1095 -- 3 years for security events
);

-- Encrypted AI memory store with TTL
CREATE TABLE IF NOT EXISTS ai_memory_store (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL,
    rep_id UUID NOT NULL,
    module_id VARCHAR(100) NOT NULL,
    memory_type VARCHAR(50) NOT NULL,
    memory_key VARCHAR(255) NOT NULL,
    encrypted_data TEXT NOT NULL,
    encryption_key_id VARCHAR(100),
    size_bytes INTEGER DEFAULT 0,
    access_count INTEGER DEFAULT 0,
    last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(company_id, rep_id, module_id, memory_type, memory_key)
);

-- Performance metrics with aggregation support
CREATE TABLE IF NOT EXISTS ai_performance_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id VARCHAR(100) NOT NULL,
    metric_name VARCHAR(100) NOT NULL,
    metric_value NUMERIC NOT NULL,
    metric_unit VARCHAR(20),
    aggregation_type VARCHAR(20) DEFAULT 'instant',
    company_id UUID,
    rep_id UUID,
    tags JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    retention_days INTEGER DEFAULT 30
);

-- Rate limiting tracking
CREATE TABLE IF NOT EXISTS rate_limit_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL,
    rep_id UUID,
    endpoint VARCHAR(255) NOT NULL,
    requests_count INTEGER DEFAULT 1,
    window_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    window_end TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '1 minute',
    blocked_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(company_id, rep_id, endpoint, window_start)
);

-- =============================================
-- PHASE 3: PERFORMANCE OPTIMIZATION INDEXES
-- =============================================

-- Lead AI interactions indexes
CREATE INDEX IF NOT EXISTS idx_lead_ai_interactions_lead_id ON lead_ai_interactions(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_ai_interactions_rep_company ON lead_ai_interactions(rep_id, company_id);
CREATE INDEX IF NOT EXISTS idx_lead_ai_interactions_timestamp ON lead_ai_interactions(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_lead_ai_interactions_module_action ON lead_ai_interactions(module_id, action_type);
CREATE INDEX IF NOT EXISTS idx_lead_ai_interactions_session ON lead_ai_interactions(session_id);

-- AI audit logs indexes
CREATE INDEX IF NOT EXISTS idx_ai_audit_logs_company_rep ON ai_audit_logs(company_id, rep_id);
CREATE INDEX IF NOT EXISTS idx_ai_audit_logs_timestamp ON ai_audit_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_ai_audit_logs_module ON ai_audit_logs(module_id);
CREATE INDEX IF NOT EXISTS idx_ai_audit_logs_success ON ai_audit_logs(success, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_ai_audit_logs_correlation ON ai_audit_logs(correlation_id);

-- Security events indexes
CREATE INDEX IF NOT EXISTS idx_security_events_company_timestamp ON security_events(company_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_security_events_severity ON security_events(severity, resolved);
CREATE INDEX IF NOT EXISTS idx_security_events_type ON security_events(event_type);

-- AI memory store indexes
CREATE INDEX IF NOT EXISTS idx_ai_memory_store_lookup ON ai_memory_store(company_id, rep_id, module_id, memory_type);
CREATE INDEX IF NOT EXISTS idx_ai_memory_store_expires ON ai_memory_store(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_ai_memory_store_access ON ai_memory_store(last_accessed_at);

-- Performance metrics indexes
CREATE INDEX IF NOT EXISTS idx_ai_performance_metrics_module_timestamp ON ai_performance_metrics(module_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_ai_performance_metrics_company ON ai_performance_metrics(company_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_ai_performance_metrics_metric ON ai_performance_metrics(metric_name, timestamp DESC);

-- Rate limiting indexes
CREATE INDEX IF NOT EXISTS idx_rate_limit_tracking_company_endpoint ON rate_limit_tracking(company_id, endpoint, window_start);
CREATE INDEX IF NOT EXISTS idx_rate_limit_tracking_cleanup ON rate_limit_tracking(window_end) WHERE window_end < NOW();

-- =============================================
-- PHASE 4: ENHANCED SECURITY POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE system_health_monitor ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_ai_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_module_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_memory_store ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limit_tracking ENABLE ROW LEVEL SECURITY;

-- System health monitor policies
CREATE POLICY "Admin only access to system health" ON system_health_monitor
    FOR ALL USING (get_current_user_role() = 'admin');

-- Lead AI interactions policies
CREATE POLICY "Company isolation for lead_ai_interactions" ON lead_ai_interactions
    FOR ALL USING (validate_ai_permission(company_id, rep_id));

-- AI audit logs policies
CREATE POLICY "Company isolation for ai_audit_logs" ON ai_audit_logs
    FOR ALL USING (validate_ai_permission(company_id, rep_id));

-- AI module status policies
CREATE POLICY "Admin and manager access to module status" ON ai_module_status
    FOR SELECT USING (get_current_user_role() IN ('admin', 'manager'));

CREATE POLICY "System can update module status" ON ai_module_status
    FOR INSERT WITH CHECK (true);

CREATE POLICY "System can modify module status" ON ai_module_status
    FOR UPDATE USING (true);

-- Security events policies
CREATE POLICY "Company isolation for security_events" ON security_events
    FOR ALL USING (
        validate_ai_permission(company_id, rep_id) OR 
        get_current_user_role() = 'admin'
    );

-- AI memory store policies
CREATE POLICY "Rep isolation for ai_memory_store" ON ai_memory_store
    FOR ALL USING (validate_ai_permission(company_id, rep_id));

-- Performance metrics policies
CREATE POLICY "Company isolation for ai_performance_metrics" ON ai_performance_metrics
    FOR ALL USING (
        validate_ai_permission(company_id, rep_id) OR 
        get_current_user_role() = 'admin'
    );

-- Rate limiting policies
CREATE POLICY "Company isolation for rate_limit_tracking" ON rate_limit_tracking
    FOR ALL USING (validate_ai_permission(company_id, rep_id));

-- =============================================
-- PHASE 5: MONITORING & CLEANUP PROCEDURES
-- =============================================

-- Cleanup expired memory function
CREATE OR REPLACE FUNCTION cleanup_expired_ai_memory()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM ai_memory_store 
    WHERE expires_at IS NOT NULL 
    AND expires_at < NOW();
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    -- Log cleanup activity
    INSERT INTO system_health_monitor (metric_name, metric_value, status)
    VALUES ('ai_memory_cleanup', deleted_count, 'normal');
    
    RETURN deleted_count;
END;
$$;

-- Cleanup old audit logs based on retention
CREATE OR REPLACE FUNCTION cleanup_old_audit_logs()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    deleted_count INTEGER := 0;
    temp_count INTEGER;
BEGIN
    -- Cleanup lead AI interactions
    DELETE FROM lead_ai_interactions 
    WHERE timestamp < NOW() - INTERVAL '1 day' * retention_days;
    GET DIAGNOSTICS temp_count = ROW_COUNT;
    deleted_count := deleted_count + temp_count;
    
    -- Cleanup AI audit logs
    DELETE FROM ai_audit_logs 
    WHERE timestamp < NOW() - INTERVAL '1 day' * retention_days;
    GET DIAGNOSTICS temp_count = ROW_COUNT;
    deleted_count := deleted_count + temp_count;
    
    -- Cleanup performance metrics
    DELETE FROM ai_performance_metrics 
    WHERE timestamp < NOW() - INTERVAL '1 day' * retention_days;
    GET DIAGNOSTICS temp_count = ROW_COUNT;
    deleted_count := deleted_count + temp_count;
    
    -- Log cleanup activity
    INSERT INTO system_health_monitor (metric_name, metric_value, status)
    VALUES ('audit_logs_cleanup', deleted_count, 'normal');
    
    RETURN deleted_count;
END;
$$;

-- Health check function for AI modules
CREATE OR REPLACE FUNCTION check_ai_modules_health()
RETURNS TABLE(module_id VARCHAR, status VARCHAR, health_score INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ams.module_id,
        CASE 
            WHEN ams.last_heartbeat < NOW() - INTERVAL '5 minutes' THEN 'offline'
            WHEN ams.error_count > ams.success_count THEN 'degraded'
            WHEN ams.avg_response_time_ms > 1000 THEN 'slow'
            ELSE ams.status
        END as computed_status,
        CASE 
            WHEN ams.last_heartbeat < NOW() - INTERVAL '5 minutes' THEN 0
            ELSE GREATEST(0, 100 - (ams.error_count * 10) - LEAST(50, ams.avg_response_time_ms / 20))
        END as computed_health_score
    FROM ai_module_status ams;
END;
$$;

-- Trigger for automatic cleanup
CREATE OR REPLACE FUNCTION trigger_cleanup_on_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    -- Randomly trigger cleanup (1% chance)
    IF random() < 0.01 THEN
        PERFORM cleanup_expired_ai_memory();
        PERFORM cleanup_old_audit_logs();
    END IF;
    
    RETURN NEW;
END;
$$;

-- Create cleanup triggers
DROP TRIGGER IF EXISTS trigger_ai_audit_cleanup ON ai_audit_logs;
CREATE TRIGGER trigger_ai_audit_cleanup
    AFTER INSERT ON ai_audit_logs
    FOR EACH ROW
    EXECUTE FUNCTION trigger_cleanup_on_insert();

-- =============================================
-- INITIAL DATA AND SYSTEM SETUP
-- =============================================

-- Insert default AI module status records
INSERT INTO ai_module_status (module_id, status) VALUES
    ('tsam_orchestrator', 'offline'),
    ('lead_profile_ai', 'offline'),
    ('lead_management_ai', 'offline'),
    ('dialer_ai', 'offline'),
    ('analytics_ai', 'offline'),
    ('academy_ai', 'offline')
ON CONFLICT (module_id) DO NOTHING;

-- Insert initial system health metrics
INSERT INTO system_health_monitor (metric_name, metric_value, status) VALUES
    ('database_connections', 0, 'normal'),
    ('query_performance', 0, 'normal'),
    ('storage_usage', 0, 'normal')
ON CONFLICT DO NOTHING;

-- Grant necessary permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;
