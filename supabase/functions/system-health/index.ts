
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import os from "node:os";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    let dbStatus: 'healthy' | 'down' = 'healthy';
    let dbQueryTime = 0;
    try {
      const dbStart = Date.now();
      await supabaseClient.from('profiles').select('id').limit(1);
      dbQueryTime = Date.now() - dbStart;
    } catch (err) {
      dbStatus = 'down';
    }

    const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const { count: errorCount } = await supabaseClient
      .from('error_logs')
      .select('*', { count: 'exact', head: true })
      .gte('timestamp', since);

    const errorRate = errorCount ? errorCount / 10 : 0; // errors per minute over last 10m

    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const memoryUsage = ((totalMem - freeMem) / totalMem) * 100;

    const loadAvg = os.loadavg()[0];
    const cpuUsage = (loadAvg / os.cpus().length) * 100;

    const resBody = {
      cpuUsage,
      memoryUsage,
      dbStatus,
      dbQueryTime,
      errorRate,
    };

    return new Response(JSON.stringify(resBody), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in system-health function:', error);
    return new Response(JSON.stringify({ error: 'internal_error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
