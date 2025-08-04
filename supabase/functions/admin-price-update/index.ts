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

    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      console.log('Missing or invalid authorization header')
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401 
        }
      )
    }

    // Verify the user is authenticated
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      console.log('Invalid token or user not found:', authError)
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401 
        }
      )
    }

    // Check if this is a backfill request
    const requestBody = await req.text()
    let backfill = false
    try {
      const body = JSON.parse(requestBody)
      backfill = body.backfill === true
    } catch (e) {
      // Ignore parsing errors, default to regular daily update
    }

    console.log(`Starting ${backfill ? 'backfill' : 'daily'} price history update by user ${user.id}...`)

    // Get all open markets
    const { data: markets, error: marketsError } = await supabase
      .from('markets')
      .select('id, yes_price, no_price, created_at')
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
    let updatedCount = 0
    let totalPointsAdded = 0

    for (const market of markets) {
      if (backfill) {
        // For backfill, get the latest price history entry for this market
        const { data: latestEntry, error: latestError } = await supabase
          .from('price_history')
          .select('timestamp')
          .eq('market_id', market.id)
          .order('timestamp', { ascending: false })
          .limit(1)
          .single()

        if (latestError && latestError.code !== 'PGRST116') {
          console.error(`Error getting latest entry for market ${market.id}:`, latestError)
          continue
        }

        // Determine start date for backfill
        let startDate = new Date(market.created_at)
        if (latestEntry) {
          startDate = new Date(latestEntry.timestamp)
          startDate.setDate(startDate.getDate() + 1)
        }

        // Generate daily entries from start date to yesterday
        const yesterday = new Date(now)
        yesterday.setDate(yesterday.getDate() - 1)
        
        const currentDate = new Date(startDate)
        let marketPointsAdded = 0

        while (currentDate <= yesterday) {
          const entryTime = new Date(currentDate)
          entryTime.setHours(9, 0, 0, 0)

          const { error: insertError } = await supabase
            .from('price_history')
            .insert({
              market_id: market.id,
              yes_price: market.yes_price,
              no_price: market.no_price,
              timestamp: entryTime.toISOString()
            })

          if (insertError) {
            console.error(`Error inserting backfill entry for market ${market.id}:`, insertError)
          } else {
            marketPointsAdded++
            totalPointsAdded++
          }

          currentDate.setDate(currentDate.getDate() + 1)
        }

        if (marketPointsAdded > 0) {
          updatedCount++
          console.log(`Added ${marketPointsAdded} backfill points for market ${market.id}`)
        }
      } else {
        // Regular daily update
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        
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

        if (!existingEntry) {
          const todayAt9AM = new Date(today)
          todayAt9AM.setHours(9, 0, 0, 0)

          const { error: insertError } = await supabase
            .from('price_history')
            .insert({
              market_id: market.id,
              yes_price: market.yes_price,
              no_price: market.no_price,
              timestamp: todayAt9AM.toISOString()
            })

          if (insertError) {
            console.error(`Error inserting price history for market ${market.id}:`, insertError)
            continue
          }

          updatedCount++
          totalPointsAdded++
          console.log(`Added daily price point for market ${market.id}`)
        }
      }
    }

    const message = backfill 
      ? `Backfill completed. Updated ${updatedCount} markets with ${totalPointsAdded} total price points.`
      : `Daily price update completed. Updated ${updatedCount} markets.`

    console.log(message)

    return new Response(
      JSON.stringify({ 
        message,
        marketsFound: markets.length,
        marketsUpdated: updatedCount,
        totalPointsAdded: backfill ? totalPointsAdded : updatedCount
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in admin price update:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})