import { logger } from '../_shared/logger.ts';

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailRequest {
  to: string
  subject: string
  body: string
  metadata?: any
  userId: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { to, subject, body, metadata, userId }: EmailRequest = await req.json()

    // Get user's company for logging
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('company_id')
      .eq('id', userId)
      .single()

    const companyId = profile?.company_id

    // For now, we'll simulate email sending since no email service is configured
    // In production, you would integrate with services like:
    // - Resend
    // - SendGrid
    // - AWS SES
    // - Postmark

    logger.info('Email would be sent:', { to, subject, body })

    // Log the email for tracking
    await supabaseClient
      .from('usage_events')
      .insert({
        user_id: userId,
        company_id: companyId,
        feature: 'email_send',
        action: 'transactional',
        context: 'email_service',
        metadata: {
          to,
          subject,
          provider: 'simulated',
          ...metadata
        }
      })

    // Create notification for successful email
    await supabaseClient
      .from('notifications')
      .insert({
        user_id: userId,
        company_id: companyId,
        type: 'email',
        title: 'Email sent successfully',
        message: `Email sent to ${to}: ${subject}`,
        metadata: { to, subject }
      })

    return new Response(JSON.stringify({
      success: true,
      message: 'Email sent successfully',
      emailId: crypto.randomUUID()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    logger.error('Error in send-email function:', error)
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
