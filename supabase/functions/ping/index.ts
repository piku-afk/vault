import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js';

const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') as string,
  Deno.env.get('SUPABASE_ANON_KEY') as string
);

Deno.serve(async () => {
  const timestamp = new Date().toISOString();

  try {
    const { data, error } = await supabaseClient.rpc('health_check');

    if (error) {
      console.error('Function error:', error);
      throw new Error(error.message);
    }

    return new Response(JSON.stringify({ database: data, timestamp }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message, timestamp }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
