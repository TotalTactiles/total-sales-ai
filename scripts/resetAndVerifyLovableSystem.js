import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resetAndVerifyLovableSystem = async () => {
  // 1. Supabase: Wipe Debug/Test Users
  await supabase
    .from('profiles')
    .delete()
    .eq('full_name', 'Debug User');

  await supabase
    .from('company_settings')
    .delete()
    .eq('company_id', 'd4341810-1bd6-4c3e-bb1a-0898d7eb7e10');

  // 2. Supabase Auth: Delete all test users
  const { data: users } = await supabase.auth.admin.listUsers();
  for (const user of users) {
    if (
      user.email?.includes('debug') ||
      user.email?.includes('onboarding-test') ||
      user.email?.includes('example.com')
    ) {
      await supabase.auth.admin.deleteUser(user.id);
    }
  }

  // 3. Clear broken sessions (if cached in custom table)
  await supabase.from('sessions').delete().neq('id', '');

  // 4. Schema Sync: Refresh Supabase cache
  try {
    await fetch('/api/reload-schema-cache');
  } catch (err) {
    console.warn('Schema cache refresh failed:', err);
  }

  // 5. Check for leftover onboarding-related test files
  const requiredFiles = [
    'testSignUp.ts',
    'handle_new_user.ts',
    'onboardingFlow.ts',
    'validateCompanySettings.ts',
  ];

  const missingFiles = requiredFiles.filter((file) => {
    const fullPath = path.resolve(__dirname, '../src/logic/onboarding/', file);
    return !fs.existsSync(fullPath);
  });

  if (missingFiles.length) {
    console.warn('Missing onboarding logic files:', missingFiles);
  }

  // 6. Validate `company_settings` has all needed columns
  const expectedColumns = ['company_id', 'customIndustry', 'plan', 'created_at'];
  const { data: schemaInfo } = await supabase.rpc('get_table_columns', {
    table_name: 'company_settings',
  });

  const missingCols = expectedColumns.filter(
    (col) => !schemaInfo.some((s) => s.column_name === col)
  );

  if (missingCols.length) {
    console.error('Missing columns in company_settings:', missingCols);
  }

  // 7. Ensure triggers (like handle_new_user) are set and active
  const { data: triggers } = await supabase.rpc('get_triggers_for_table', {
    table_name: 'profiles',
  });

  const needsUserTrigger =
    triggers?.some((t) => t.trigger_name.includes('handle_new_user')) ?? false;

  if (!needsUserTrigger) {
    console.error('Missing or broken "handle_new_user" trigger on profiles table.');
  }

  console.log('✅ Supabase cleanup and repo readiness check completed');
};

resetAndVerifyLovableSystem();
