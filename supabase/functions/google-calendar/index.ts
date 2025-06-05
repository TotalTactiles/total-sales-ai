import { logger } from '../../../src/utils/logger.ts';

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CalendarRequest {
  action: 'list' | 'create'
  event?: {
    summary: string
    description: string
    start: string
    end: string
    attendees: string[]
  }
  leadId?: string
  leadName?: string
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

    const { action, event, leadId, leadName }: CalendarRequest = await req.json()

    // For now, we'll use a placeholder Google Calendar integration
    // In production, you'd need to implement Google Calendar OAuth similar to Gmail
    const googleToken = Deno.env.get('GOOGLE_CALENDAR_TOKEN') // This would come from OAuth

    if (action === 'list') {
      // List upcoming events
      const now = new Date().toISOString()
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${now}&maxResults=10&singleEvents=true&orderBy=startTime`,
        {
          headers: { 'Authorization': `Bearer ${googleToken}` }
        }
      )

      const events = await response.json()
      
      return new Response(JSON.stringify({
        success: true,
        events: events.items || []
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'create' && event) {
      // Create calendar event
      const response = await fetch(
        'https://www.googleapis.com/calendar/v3/calendars/primary/events',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${googleToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            summary: event.summary,
            description: event.description,
            start: { dateTime: event.start },
            end: { dateTime: event.end },
            attendees: event.attendees.map(email => ({ email }))
          })
        }
      )

      const calendarEvent = await response.json()

      // Log meeting creation
      await supabaseClient
        .from('usage_events')
        .insert({
          user_id: user.id,
          company_id: (await supabaseClient.from('profiles').select('company_id').eq('id', user.id).single()).data?.company_id,
          feature: 'meeting_schedule',
          action: 'created',
          context: `lead_${leadId}`,
          metadata: {
            leadName,
            eventId: calendarEvent.id,
            summary: event.summary,
            provider: 'google_calendar'
          }
        })

      return new Response(JSON.stringify({
        success: true,
        eventId: calendarEvent.id,
        message: `Meeting scheduled with ${leadName}`
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    throw new Error('Invalid action')

  } catch (error) {
    console.error('Error in google-calendar function:', error)
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
