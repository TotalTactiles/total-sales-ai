import { logger } from '../../../src/utils/logger.ts';

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from 'npm:resend@2.0.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailRequest {
  to: string
  subject: string
  body: string
  leadId: string
  leadName: string
  userId: string
}

const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { to, subject, body, leadId, leadName, userId }: EmailRequest = await req.json()

    // Get user's profile for company info
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('company_id, full_name')
      .eq('id', userId)
      .single()

    if (!profile?.company_id) {
      throw new Error('User profile not found')
    }

    // Send email using Resend
    const emailResult = await resend.emails.send({
      from: 'Sales Team <onboarding@resend.dev>', // Replace with your verified domain
      to: [to],
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Message from ${profile.full_name}</h2>
          <div style="white-space: pre-wrap; line-height: 1.6;">
            ${body.replace(/\n/g, '<br>')}
          </div>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">
            This email was sent via your CRM system.
          </p>
        </div>
      `,
    })

    // Log the email activity
    await supabaseClient
      .from('usage_events')
      .insert({
        user_id: userId,
        company_id: profile.company_id,
        feature: 'email_send',
        action: 'sent',
        context: 'lead_communication',
        metadata: {
          leadId,
          leadName,
          to,
          subject,
          emailId: emailResult.data?.id,
          provider: 'resend'
        }
      })

    // Update lead's last contact time
    await supabaseClient
      .from('leads')
      .update({ last_contact: new Date().toISOString() })
      .eq('id', leadId)

    // Create notification for successful email
    await supabaseClient
      .from('notifications')
      .insert({
        user_id: userId,
        company_id: profile.company_id,
        type: 'email_sent',
        title: 'Email sent successfully',
        message: `Email sent to ${leadName} (${to}): ${subject}`,
        metadata: { 
          leadId, 
          leadName, 
          emailId: emailResult.data?.id,
          to,
          subject 
        }
      })

    return new Response(JSON.stringify({
      success: true,
      message: 'Email sent successfully',
      emailId: emailResult.data?.id,
      messageId: emailResult.data?.id
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Error in send-lead-email function:', error)
    
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
