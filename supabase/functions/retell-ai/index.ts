import { logger } from '../../../src/utils/logger.ts';

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Allowed origins can be configured via env, comma separated
const allowedOrigins = (Deno.env.get('CORS_ALLOWED_ORIGINS') ?? '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean)

interface RetellCallRequest {
  phoneNumber: string
  leadId?: string
  leadName: string
  leadContext?: any
  agentConfig?: any
}

interface RetellWebhookEvent {
  event: string
  call_id: string
  call_status?: string
  transcript?: string
  call_analysis?: any
}

serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin':
      allowedOrigins.length === 0
        ? '*'
        : allowedOrigins.includes(req.headers.get('origin') ?? '')
        ? req.headers.get('origin') ?? ''
        : allowedOrigins[0] ?? '',
    'Access-Control-Allow-Headers':
      'authorization, x-client-info, apikey, content-type',
  }
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const retellApiKey = Deno.env.get('RETELL_API_KEY')
    if (!retellApiKey) {
      throw new Error('Retell AI API key not configured')
    }

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user } } = await supabaseClient.auth.getUser(token)
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const url = new URL(req.url)

    // Handle webhook events from Retell AI
    if (url.pathname.includes('/webhook')) {
      const webhookData: RetellWebhookEvent = await req.json()

      console.log('Retell webhook received:', webhookData.event, webhookData.call_id)

      const { error: logErr } = await supabaseClient
        .from('ai_brain_logs')
        .insert({
          company_id: 'retell-calls',
          type: 'interaction',
          event_summary: `Retell AI call ${webhookData.event}`,
          payload: {
            feature: 'retell_ai',
            action: webhookData.event,
            context: 'phone_call',
            callId: webhookData.call_id,
            callStatus: webhookData.call_status,
            transcript: webhookData.transcript,
            analysis: webhookData.call_analysis,
            timestamp: new Date().toISOString()
          }
        })
      if (logErr) {
        logger.error('Failed to log Retell webhook event', logErr)
      }

      // Handle specific events
      switch (webhookData.event) {
        case 'call_started':
          console.log(`Call started: ${webhookData.call_id}`)
          break
        case 'call_ended':
          console.log(`Call ended: ${webhookData.call_id}`)
          // Process call transcript and analysis here
          break
        case 'call_analyzed':
          console.log(`Call analyzed: ${webhookData.call_id}`)
          break
      }

      return new Response(JSON.stringify({ received: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const body = await req.json()
    const { action } = body

    if (!action) {
      return new Response(JSON.stringify({ error: 'Missing action' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (action === 'health_check') {
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (action === 'create_agent') {
      const { config } = body
      if (!config) {
        return new Response(JSON.stringify({ error: 'Missing config' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      const agentResp = await fetch('https://api.retellai.com/create-agent', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${retellApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(config)
      })

      if (!agentResp.ok) {
        throw new Error(`Failed to create Retell agent: ${agentResp.statusText}`)
      }

      const agent = await agentResp.json()
      return new Response(JSON.stringify({ agent_id: agent.agent_id }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (action === 'initiate_call') {
      const { phoneNumber, leadName, leadContext, agentConfig = {}, leadId } = body as RetellCallRequest

      const agentResp = await fetch('https://api.retellai.com/create-agent', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${retellApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(agentConfig)
      })

      if (!agentResp.ok) {
        throw new Error(`Failed to create Retell agent: ${agentResp.statusText}`)
      }

      const agent = await agentResp.json()

      const callResp = await fetch('https://api.retellai.com/create-phone-call', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${retellApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from_number: Deno.env.get('TWILIO_PHONE_NUMBER'),
          to_number: phoneNumber,
          agent_id: agent.agent_id,
          metadata: { leadId, leadName, userId: user.id }
        })
      })

      if (!callResp.ok) {
        throw new Error(`Failed to initiate Retell call: ${callResp.statusText}`)
      }

      const callData = await callResp.json()

      const { data: profile } = await supabaseClient
        .from('profiles')
        .select('company_id')
        .eq('id', user.id)
        .single()

      const { error: usageErr } = await supabaseClient
        .from('usage_events')
        .insert({
          user_id: user.id,
          company_id: profile?.company_id,
          feature: 'retell_ai_call',
          action: 'initiated',
          context: `lead_${leadId}`,
          metadata: {
            leadName,
            phoneNumber,
            callId: callData.call_id,
            agentId: agent.agent_id,
            provider: 'retell_ai'
          }
        })
      if (usageErr) {
        logger.error('Failed to log usage event', usageErr)
      }

      return new Response(JSON.stringify({
        success: true,
        callId: callData.call_id,
        agentId: agent.agent_id,
        status: 'initiated',
        message: `AI call initiated to ${leadName}`
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (action === 'get_analysis') {
      const { callId } = body
      if (!callId) {
        return new Response(JSON.stringify({ error: 'Missing callId' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      const analysisResp = await fetch(`https://api.retellai.com/call-analysis/${callId}`, {
        headers: { 'Authorization': `Bearer ${retellApiKey}` }
      })

      if (!analysisResp.ok) {
        throw new Error(`Failed to get call analysis: ${analysisResp.statusText}`)
      }

      const analysis = await analysisResp.json()
      return new Response(JSON.stringify(analysis), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error in retell-ai function:', error)
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
