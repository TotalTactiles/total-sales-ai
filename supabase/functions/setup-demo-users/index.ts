
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface DemoUser {
  email: string;
  password: string;
  role: 'developer' | 'manager' | 'sales_rep';
  full_name: string;
}

const demoUsers: DemoUser[] = [
  {
    email: 'dev@os.local',
    password: 'dev1234',
    role: 'developer',
    full_name: 'Developer User'
  },
  {
    email: 'manager@os.local',
    password: 'manager123',
    role: 'manager',
    full_name: 'Manager User'
  },
  {
    email: 'rep@os.local',
    password: 'rep123',
    role: 'sales_rep',
    full_name: 'Sales Rep User'
  },
  // Legacy users for backward compatibility
  {
    email: 'krishdev@tsam.com',
    password: 'badabing2024',
    role: 'developer',
    full_name: 'Krishna Developer'
  },
  {
    email: 'manager@salesos.com',
    password: 'manager123',
    role: 'manager',
    full_name: 'Sales Manager'
  },
  {
    email: 'rep@salesos.com',
    password: 'sales123',
    role: 'sales_rep',
    full_name: 'Sales Representative'
  }
];

// Simple logger for edge functions
const logger = {
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${message}`, data ? JSON.stringify(data) : '');
  },
  error: (message: string, data?: any) => {
    console.error(`[ERROR] ${message}`, data ? JSON.stringify(data) : '');
  },
  warn: (message: string, data?: any) => {
    console.warn(`[WARN] ${message}`, data ? JSON.stringify(data) : '');
  }
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    logger.info('Setting up system demo users...')
    
    const results = []
    
    for (const user of demoUsers) {
      logger.info(`Processing user: ${user.email}`)
      
      // Check if user already exists
      try {
        const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
        const existingUser = existingUsers.users.find(u => u.email === user.email)
        
        if (existingUser) {
          logger.info(`User already exists: ${user.email}`)
          results.push({
            email: user.email,
            success: true,
            action: 'already_exists',
            userId: existingUser.id
          })
          continue
        }
      } catch (error) {
        logger.error(`Error checking existing user ${user.email}:`, error)
      }

      // Create the user
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: {
          role: user.role,
          full_name: user.full_name
        }
      })

      if (authError) {
        logger.error(`Error creating user ${user.email}:`, authError)
        results.push({
          email: user.email,
          success: false,
          error: authError.message
        })
        continue
      }

      logger.info(`User created successfully: ${user.email}`)

      // Create profile in profiles table
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .upsert({
          id: authData.user.id,
          full_name: user.full_name,
          role: user.role,
          company_id: authData.user.id,
          email_connected: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          last_login: new Date().toISOString()
        })

      if (profileError) {
        logger.error(`Error creating profile for ${user.email}:`, profileError)
        results.push({
          email: user.email,
          success: false,
          error: `Profile creation failed: ${profileError.message}`
        })
      } else {
        logger.info(`Profile created successfully for: ${user.email}`)
        results.push({
          email: user.email,
          success: true,
          action: 'created',
          userId: authData.user.id
        })
      }
    }

    const successCount = results.filter(r => r.success).length
    const totalCount = results.length

    return new Response(
      JSON.stringify({ 
        message: `Demo users setup completed: ${successCount}/${totalCount} successful`,
        results,
        summary: {
          total: totalCount,
          successful: successCount,
          failed: totalCount - successCount
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    logger.error('Error in setup-demo-users function:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to setup demo users',
        details: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
