
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    console.log('Starting daily price history update...')

    // Get all open markets
    const { data: markets, error: marketsError } = await supabase
      .from('markets')
      .select('id, yes_price, no_price')
      .eq('status', 'open')

    if (marketsError) {
      console.error('Error fetching markets:', marketsError)
      throw marketsError
    }

    console.log(`Found ${markets?.length || 0} open markets`)

    if (!markets || markets.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No open markets found' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    let updatedCount = 0

    for (const market of markets) {
      // Check if there's already a price history entry for today
      const { data: existingEntry, error: checkError } = await supabase
        .from('price_history')
        .select('id')
        .eq('market_id', market.id)
        .gte('timestamp', today.toISOString())
        .single()

      if (checkError && checkError.code !== 'PGRST116') {
        console.error(`Error checking existing entry for market ${market.id}:`, checkError)
        continue
      }

      // If no entry exists for today, create one
      if (!existingEntry) {
        const { error: insertError } = await supabase
          .from('price_history')
          .insert({
            market_id: market.id,
            yes_price: market.yes_price,
            no_price: market.no_price,
            timestamp: now.toISOString()
          })

        if (insertError) {
          console.error(`Error inserting price history for market ${market.id}:`, insertError)
          continue
        }

        updatedCount++
        console.log(`Added daily price point for market ${market.id}`)
      }
    }

    console.log(`Daily price update completed. Updated ${updatedCount} markets.`)

    return new Response(
      JSON.stringify({ 
        message: 'Daily price update completed',
        marketsFound: markets.length,
        marketsUpdated: updatedCount
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in daily price update:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
