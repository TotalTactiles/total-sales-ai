import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

async function main() {
  const { data, error } = await supabase.auth.admin.createUser({
    email: 'krishdev@tsam.com',
    password: 'badabing2024',
    email_confirm: true,
    user_metadata: { full_name: 'Krish Dev', role: 'developer' }
  });

  if (error || !data.user) {
    console.error('Error creating user:', error);
    return;
  }

  const userId = data.user.id;

  const { error: profileError } = await supabase.from('profiles').upsert({
    id: userId,
    full_name: 'Krish Dev',
    role: 'developer',
    company_id: userId
  });

  if (profileError) {
    console.error('Error creating profile:', profileError);
    return;
  }

  console.log('Developer user created with id:', userId);
}

main();
