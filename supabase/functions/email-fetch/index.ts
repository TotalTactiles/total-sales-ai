import { logger } from '../../../src/utils/logger.ts';

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Email {
  id: string
  subject: string
  sender: string
  recipient: string
  body: string
  timestamp: string
  isRead: boolean
  labels?: string[]
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

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user } } = await supabaseClient.auth.getUser(token)
    
    if (!user) {
      throw new Error('User not authenticated')
    }

    // Get user's email tokens
    const { data: emailTokens } = await supabaseClient
      .from('email_tokens')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (!emailTokens) {
      throw new Error('No email connection found')
    }

    let emails: Email[] = []

    if (emailTokens.provider === 'gmail') {
      // Fetch emails from Gmail API
      const response = await fetch(
        'https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=50&labelIds=INBOX',
        {
          headers: { 'Authorization': `Bearer ${emailTokens.access_token}` }
        }
      )
      
      const data = await response.json()
      
      if (data.messages) {
        // Fetch details for each message
        const emailPromises = data.messages.slice(0, 10).map(async (message: any) => {
          const detailResponse = await fetch(
            `https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}`,
            {
              headers: { 'Authorization': `Bearer ${emailTokens.access_token}` }
            }
          )
          return detailResponse.json()
        })
        
        const emailDetails = await Promise.all(emailPromises)
        
        emails = emailDetails.map((detail: any) => {
          const headers = detail.payload.headers
          const subject = headers.find((h: any) => h.name === 'Subject')?.value || 'No Subject'
          const from = headers.find((h: any) => h.name === 'From')?.value || 'Unknown Sender'
          const to = headers.find((h: any) => h.name === 'To')?.value || 'Unknown Recipient'
          
          return {
            id: detail.id,
            subject,
            sender: from,
            recipient: to,
            body: detail.snippet,
            timestamp: new Date(parseInt(detail.internalDate)).toISOString(),
            isRead: !detail.labelIds?.includes('UNREAD'),
            labels: detail.labelIds
          }
        })
      }
      
    } else if (emailTokens.provider === 'outlook') {
      // Fetch emails from Microsoft Graph API
      const response = await fetch(
        'https://graph.microsoft.com/v1.0/me/messages?$top=50&$orderby=receivedDateTime desc',
        {
          headers: { 'Authorization': `Bearer ${emailTokens.access_token}` }
        }
      )
      
      const data = await response.json()
      
      if (data.value) {
        emails = data.value.map((message: any) => ({
          id: message.id,
          subject: message.subject || 'No Subject',
          sender: message.from?.emailAddress?.address || 'Unknown Sender',
          recipient: message.toRecipients?.[0]?.emailAddress?.address || 'Unknown Recipient',
          body: message.bodyPreview,
          timestamp: message.receivedDateTime,
          isRead: message.isRead,
          labels: message.categories || []
        }))
      }
    }

    return new Response(
      JSON.stringify({ emails }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Email fetch error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
