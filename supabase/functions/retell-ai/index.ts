import { logger } from '../_shared/logger.ts';

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RetellCallRequest {
  phoneNumber: string
  leadId: string
  leadName: string
  leadContext?: any
  userId: string
}

interface RetellWebhookEvent {
  event: string
  call_id: string
  call_status?: string
  transcript?: string
  call_analysis?: any
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

    const retellApiKey = Deno.env.get('RETELL_API_KEY')
    if (!retellApiKey) {
      throw new Error('Retell AI API key not configured')
    }

    const url = new URL(req.url)
    
    // Handle webhook events from Retell AI
    if (url.pathname.includes('/webhook')) {
      const webhookData: RetellWebhookEvent = await req.json()
      
      logger.info('Retell webhook received:', webhookData.event, webhookData.call_id)
      
      // Log call events to database
      await supabaseClient
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

      // Handle specific events
      switch (webhookData.event) {
        case 'call_started':
          logger.info(`Call started: ${webhookData.call_id}`)
          break
        case 'call_ended':
          logger.info(`Call ended: ${webhookData.call_id}`)
          // Process call transcript and analysis here
          break
        case 'call_analyzed':
          logger.info(`Call analyzed: ${webhookData.call_id}`)
          break
      }

      return new Response(JSON.stringify({ received: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Handle call initiation
    const { phoneNumber, leadId, leadName, leadContext, userId }: RetellCallRequest = await req.json()

    // Create Retell AI agent configuration
    const agentConfig = {
      agent_name: "Sales AI Assistant",
      voice_id: "11labs-Adrian",
      voice_temperature: 0.7,
      voice_speed: 1.0,
      response_engine: {
        type: "retell-llm",
        llm_id: "gpt-4o"
      },
      language: "en-US",
      interruption_sensitivity: 0.7,
      ambient_sound: "office",
      agent_prompt: `You are a professional sales AI assistant for a CRM platform. You are calling ${leadName}.

LEAD CONTEXT:
${JSON.stringify(leadContext, null, 2)}

YOUR ROLE:
- You're reaching out to qualify this lead and assess their interest
- Be professional, friendly, and conversational
- Listen for buying signals and pain points
- Ask open-ended questions to understand their business needs
- If they object, handle professionally and try to reschedule

CONVERSATION FLOW:
1. Introduction: "Hi ${leadName}, this is Sarah from [Company]. I'm calling because you showed interest in our CRM solution..."
2. Qualification: Ask about their current process, pain points, team size
3. Value proposition: Explain how we help similar businesses
4. Next steps: Schedule demo or send information

IMPORTANT:
- Keep responses conversational and under 30 seconds
- Let them speak and respond naturally
- Handle interruptions gracefully
- If they're not interested, ask for 30 seconds to explain value
- Always aim to schedule a follow-up or demo

Remember: This is a real person, not a demo. Be authentic and helpful.`
    }

    // Create Retell AI agent
    const agentResponse = await fetch('https://api.retellai.com/create-agent', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${retellApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(agentConfig)
    })

    if (!agentResponse.ok) {
      throw new Error(`Failed to create Retell agent: ${agentResponse.statusText}`)
    }

    const agent = await agentResponse.json()

    // Initiate call through Retell AI
    const callResponse = await fetch('https://api.retellai.com/create-phone-call', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${retellApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from_number: Deno.env.get('TWILIO_PHONE_NUMBER'),
        to_number: phoneNumber,
        agent_id: agent.agent_id,
        metadata: {
          leadId,
          leadName,
          userId
        }
      })
    })

    if (!callResponse.ok) {
      throw new Error(`Failed to initiate Retell call: ${callResponse.statusText}`)
    }

    const callData = await callResponse.json()

    // Log call initiation
    await supabaseClient
      .from('usage_events')
      .insert({
        user_id: userId,
        company_id: (await supabaseClient.from('profiles').select('company_id').eq('id', userId).single()).data?.company_id,
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

    return new Response(JSON.stringify({
      success: true,
      callId: callData.call_id,
      agentId: agent.agent_id,
      status: 'initiated',
      message: `AI call initiated to ${leadName}`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    logger.error('Error in retell-ai function:', error)
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
