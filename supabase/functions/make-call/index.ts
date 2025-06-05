
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { phoneNumber, campaign = 'EMERGENCYSEVA', clientId = '3455' } = await req.json()

    if (!phoneNumber) {
      return new Response(
        JSON.stringify({ error: 'Phone number is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const apiUrl = 'http://117.247.52.42/smart/api/remote_action.php'
    
    const params = new URLSearchParams({
      ACTION: 'DIAL',
      campaign: campaign,
      client_id: clientId,
      phone: phoneNumber.replace(/\s+/g, '').replace(/^\+91/, '') // Clean the phone number
    })

    console.log('Making call with params:', Object.fromEntries(params))

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString()
    })

    const responseText = await response.text()
    console.log('Call API response:', responseText)

    if (!response.ok) {
      throw new Error(`Call API returned ${response.status}: ${responseText}`)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Call initiated successfully',
        response: responseText 
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error making call:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
