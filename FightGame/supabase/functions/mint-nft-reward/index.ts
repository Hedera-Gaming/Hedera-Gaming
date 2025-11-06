import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  Client,
  TokenMintTransaction,
  PrivateKey,
} from "npm:@hashgraph/sdk@^2.76.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { profileId, rewardType, metadata } = await req.json();
    
    console.log(`Minting NFT reward for profile: ${profileId}, type: ${rewardType}`);

    // Initialize Hedera client
    const operatorId = Deno.env.get('HEDERA_OPERATOR_ID');
    const operatorKey = Deno.env.get('HEDERA_OPERATOR_KEY');
    const nftTokenId = Deno.env.get('HEDERA_NFT_TOKEN_ID');

    if (!operatorId || !operatorKey || !nftTokenId) {
      throw new Error('Missing Hedera configuration');
    }

    const client = Client.forTestnet();
    client.setOperator(operatorId, PrivateKey.fromString(operatorKey));

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Create transaction record
    const { data: txRecord, error: txError } = await supabase
      .from('blockchain_transactions')
      .insert({
        profile_id: profileId,
        transaction_type: 'mint',
        status: 'pending',
        token_id: nftTokenId,
        metadata: metadata,
      })
      .select()
      .single();

    if (txError) throw txError;

    console.log(`Transaction record created: ${txRecord.id}`);

    // Mint NFT on Hedera
    const metadataBuffer = new TextEncoder().encode(JSON.stringify(metadata));
    const mintTx = await new TokenMintTransaction()
      .setTokenId(nftTokenId)
      .setMetadata([metadataBuffer])
      .freezeWith(client);

    const signedTx = await mintTx.sign(PrivateKey.fromString(operatorKey));
    const txResponse = await signedTx.execute(client);
    const receipt = await txResponse.getReceipt(client);

    console.log(`NFT minted successfully. Status: ${receipt.status.toString()}`);

    const serialNumber = receipt.serials[0].toNumber();
    const hederaTxId = txResponse.transactionId.toString();

    // Update transaction record
    await supabase
      .from('blockchain_transactions')
      .update({
        status: 'success',
        hedera_tx_id: hederaTxId,
        metadata: { ...metadata, serialNumber },
      })
      .eq('id', txRecord.id);

    // Create NFT reward record
    const { data: nftReward, error: nftError } = await supabase
      .from('nft_rewards')
      .insert({
        profile_id: profileId,
        token_id: nftTokenId,
        serial_number: serialNumber,
        reward_type: rewardType,
        metadata: metadata,
        transaction_id: txRecord.id,
      })
      .select()
      .single();

    if (nftError) throw nftError;

    console.log(`NFT reward record created: ${nftReward.id}`);

    return new Response(
      JSON.stringify({
        success: true,
        transactionId: hederaTxId,
        tokenId: nftTokenId,
        serialNumber,
        explorerUrl: `https://hashscan.io/testnet/transaction/${hederaTxId}`,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error minting NFT:', error);
    
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
