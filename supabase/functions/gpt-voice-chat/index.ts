
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
  
  if (!OPENAI_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'OpenAI API key not configured' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }

  if (req.headers.get('upgrade') !== 'websocket') {
    return new Response('Expected websocket', { status: 400 })
  }

  const { socket, response } = Deno.upgradeWebSocket(req)
  
  let openaiWs: WebSocket | null = null

  socket.onopen = () => {
    console.log('Client connected to GPT voice chat')
    
    // Connect to OpenAI Realtime API
    const openaiUrl = 'wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01'
    openaiWs = new WebSocket(openaiUrl, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'OpenAI-Beta': 'realtime=v1'
      }
    })

    openaiWs.onopen = () => {
      console.log('Connected to OpenAI Realtime API')
    }

    openaiWs.onmessage = (event) => {
      // Forward OpenAI messages to client
      socket.send(event.data)
    }

    openaiWs.onerror = (error) => {
      console.error('OpenAI WebSocket error:', error)
      socket.send(JSON.stringify({
        type: 'error',
        message: 'OpenAI connection error'
      }))
    }

    openaiWs.onclose = () => {
      console.log('OpenAI WebSocket closed')
      socket.close()
    }
  }

  socket.onmessage = (event) => {
    // Forward client messages to OpenAI
    if (openaiWs && openaiWs.readyState === WebSocket.OPEN) {
      openaiWs.send(event.data)
    }
  }

  socket.onclose = () => {
    console.log('Client disconnected from GPT voice chat')
    if (openaiWs) {
      openaiWs.close()
    }
  }

  socket.onerror = (error) => {
    console.error('Client WebSocket error:', error)
    if (openaiWs) {
      openaiWs.close()
    }
  }

  return response
})
