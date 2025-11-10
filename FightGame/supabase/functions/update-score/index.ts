import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { profileId, score, kills, duration } = await req.json();
    
    console.log(`Updating score for profile: ${profileId}, score: ${score}`);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get profile wallet address
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('wallet_address')
      .eq('id', profileId)
      .single();

    if (profileError) throw profileError;

    // Create game session
    const { data: session, error: sessionError } = await supabase
      .from('game_sessions')
      .insert({
        profile_id: profileId,
        wallet_address: profile.wallet_address,
        score,
        kills,
        duration_seconds: duration,
      })
      .select()
      .single();

    if (sessionError) throw sessionError;

    // Create blockchain transaction record
    const { data: txRecord, error: txError } = await supabase
      .from('blockchain_transactions')
      .insert({
        profile_id: profileId,
        transaction_type: 'update_score',
        status: 'success',
        metadata: {
          score,
          kills,
          duration,
          sessionId: session.id,
        },
      })
      .select()
      .single();

    if (txError) throw txError;

    console.log(`Score updated successfully. Session: ${session.id}, Transaction: ${txRecord.id}`);

    return new Response(
      JSON.stringify({
        success: true,
        sessionId: session.id,
        transactionId: txRecord.id,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error updating score:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
