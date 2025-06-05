
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
    
    // Connect to OpenAI Realtime API with proper headers
    const openaiUrl = 'wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01'
    
    openaiWs = new WebSocket(openaiUrl, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'OpenAI-Beta': 'realtime=v1'
      }
    })

    openaiWs.onopen = () => {
      console.log('Connected to OpenAI Realtime API')
      
      // Send session configuration immediately after connection
      const sessionConfig = {
        type: "session.update",
        session: {
          modalities: ["text", "audio"],
          instructions: "You are an AI assistant helping users analyze their database search results. Help analyze and explain the search results, answer questions about data patterns, and provide insights.",
          voice: "alloy",
          input_audio_format: "pcm16",
          output_audio_format: "pcm16",
          input_audio_transcription: {
            model: "whisper-1"
          },
          turn_detection: {
            type: "server_vad",
            threshold: 0.5,
            prefix_padding_ms: 300,
            silence_duration_ms: 1000
          },
          temperature: 0.8,
          max_response_output_tokens: "inf"
        }
      }
      
      openaiWs.send(JSON.stringify(sessionConfig))
    }

    openaiWs.onmessage = (event) => {
      console.log('OpenAI message:', event.data)
      // Forward OpenAI messages to client
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(event.data)
      }
    }

    openaiWs.onerror = (error) => {
      console.error('OpenAI WebSocket error:', error)
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
          type: 'error',
          message: 'OpenAI connection error'
        }))
      }
    }

    openaiWs.onclose = (event) => {
      console.log('OpenAI WebSocket closed:', event.code, event.reason)
      if (socket.readyState === WebSocket.OPEN) {
        socket.close()
      }
    }
  }

  socket.onmessage = (event) => {
    console.log('Client message:', event.data)
    // Forward client messages to OpenAI
    if (openaiWs && openaiWs.readyState === WebSocket.OPEN) {
      openaiWs.send(event.data)
    }
  }

  socket.onclose = () => {
    console.log('Client disconnected from GPT voice chat')
    if (openaiWs && openaiWs.readyState === WebSocket.OPEN) {
      openaiWs.close()
    }
  }

  socket.onerror = (error) => {
    console.error('Client WebSocket error:', error)
    if (openaiWs && openaiWs.readyState === WebSocket.OPEN) {
      openaiWs.close()
    }
  }

  return response
})
