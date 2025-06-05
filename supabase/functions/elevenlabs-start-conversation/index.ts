
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { searchResults, searchQuery } = await req.json()
    const apiKey = Deno.env.get('ELEVENLABS_API_KEY')

    if (!apiKey) {
      throw new Error('ElevenLabs API key not found')
    }

    // Create a conversation with ElevenLabs
    const agentId = 'agent_01jx0f5dmge7ntxth97awgnrbg'
    
    const response = await fetch(`https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${agentId}`, {
      method: 'GET',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('ElevenLabs API error:', error)
      throw new Error('Failed to create conversation with ElevenLabs')
    }

    const data = await response.json()
    
    // Generate a conversation ID for tracking
    const conversationId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    return new Response(
      JSON.stringify({
        conversationId,
        signedUrl: data.signed_url,
        searchContext: {
          query: searchQuery,
          results: searchResults
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Error starting conversation:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})
