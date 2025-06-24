
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
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

const defaultUsers: DemoUser[] = [
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
  }
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    console.log('Setting up demo users...');

    const results = [];
    
    for (const user of defaultUsers) {
      console.log(`Creating user: ${user.email} with role: ${user.role}`);
      
      // First check if user already exists
      const { data: existingUsers } = await supabaseClient.auth.admin.listUsers();
      const existingUser = existingUsers?.users?.find(u => u.email === user.email);
      
      if (existingUser) {
        console.log(`User ${user.email} already exists, updating profile...`);
        
        // Update the profile with correct role and metadata
        const { error: profileError } = await supabaseClient
          .from('profiles')
          .upsert({
            id: existingUser.id,
            full_name: user.full_name,
            role: user.role,
            company_id: existingUser.id,
            email_connected: false,
            updated_at: new Date().toISOString(),
            last_login: new Date().toISOString()
          }, { onConflict: 'id' });

        if (profileError) {
          console.error('Profile update error:', profileError);
          results.push({
            email: user.email,
            status: 'profile_update_failed',
            error: profileError.message
          });
        } else {
          results.push({
            email: user.email,
            status: 'updated',
            role: user.role
          });
        }
        continue;
      }

      // Create new user
      const { data: authData, error: authError } = await supabaseClient.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: {
          full_name: user.full_name,
          role: user.role
        }
      });

      if (authError) {
        console.error(`Failed to create user ${user.email}:`, authError);
        results.push({
          email: user.email,
          status: 'auth_failed',
          error: authError.message
        });
        continue;
      }

      console.log(`Successfully created auth user: ${user.email}`);

      // Create profile (the trigger should handle this, but let's ensure it exists)
      if (authData.user) {
        const { error: profileError } = await supabaseClient
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
          }, { onConflict: 'id' });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          results.push({
            email: user.email,
            status: 'profile_failed',
            error: profileError.message
          });
        } else {
          console.log(`Successfully created profile for: ${user.email}`);
          results.push({
            email: user.email,
            status: 'created',
            role: user.role,
            userId: authData.user.id
          });
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Demo users setup completed',
        results
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Setup demo users error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
