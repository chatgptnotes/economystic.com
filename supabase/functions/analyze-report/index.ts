
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ReportAnalysisRequest {
  reportId: string;
  filePath: string;
  reportType: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { reportId, filePath, reportType }: ReportAnalysisRequest = await req.json();

    console.log(`Starting analysis for report ${reportId} of type ${reportType}`);

    // Update report status to processing
    await supabaseClient
      .from('reports')
      .update({ analysis_status: 'processing' })
      .eq('id', reportId);

    // Download the file from storage
    const { data: fileData, error: downloadError } = await supabaseClient.storage
      .from('reports')
      .download(filePath);

    if (downloadError) {
      throw new Error(`Failed to download file: ${downloadError.message}`);
    }

    // Convert file to text
    const fileText = await fileData.text();
    console.log('File content length:', fileText.length);

    // Analyze with OpenAI
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are an AI assistant that analyzes healthcare reports. Extract structured data from the provided ${reportType} report and return it as JSON. Focus on extracting relevant patient data, timestamps, and key metrics.`
          },
          {
            role: 'user',
            content: `Please analyze this ${reportType} report and extract structured data. Return the result as JSON with appropriate fields for the data type:\n\n${fileText}`
          }
        ],
        temperature: 0.1,
      }),
    });

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${openaiResponse.statusText}`);
    }

    const openaiResult = await openaiResponse.json();
    const analysisResult = openaiResult.choices[0]?.message?.content;

    console.log('AI Analysis completed');

    // Parse the AI response and extract data
    let parsedData;
    try {
      parsedData = JSON.parse(analysisResult);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', analysisResult);
      throw new Error('AI response is not valid JSON');
    }

    // Store the analyzed data based on report type
    if (reportType === 'whatsapp_double_tick') {
      await processWhatsAppData(supabaseClient, reportId, parsedData);
    } else if (reportType === 'centro_call_center') {
      await processCallCenterData(supabaseClient, reportId, parsedData);
    } else if (reportType === 'raftaar_ambulance') {
      await processAmbulanceData(supabaseClient, reportId, parsedData);
    }

    // Update report status to completed
    await supabaseClient
      .from('reports')
      .update({ 
        analysis_status: 'completed',
        processed: true 
      })
      .eq('id', reportId);

    console.log(`Analysis completed for report ${reportId}`);

    return new Response(
      JSON.stringify({ success: true, message: 'Report analyzed successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-report function:', error);

    // Update report status to failed if we have reportId
    const body = await req.clone().json().catch(() => ({}));
    if (body.reportId) {
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );
      
      await supabaseClient
        .from('reports')
        .update({ analysis_status: 'failed' })
        .eq('id', body.reportId);
    }

    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function processWhatsAppData(supabaseClient: any, reportId: string, data: any) {
  const messages = Array.isArray(data) ? data : data.messages || [];
  
  for (const message of messages) {
    await supabaseClient
      .from('whatsapp_messages')
      .insert({
        report_id: reportId,
        patient_name: message.patient_name || message.name,
        phone_number: message.phone_number || message.phone,
        message_content: message.content || message.message,
        message_type: message.type || 'text',
        sent_time: message.sent_time || message.timestamp,
        delivery_status: message.delivery_status || 'sent',
        read_status: message.read_status || 'unread'
      });
  }
}

async function processCallCenterData(supabaseClient: any, reportId: string, data: any) {
  const calls = Array.isArray(data) ? data : data.calls || [];
  
  for (const call of calls) {
    await supabaseClient
      .from('call_records')
      .insert({
        report_id: reportId,
        patient_name: call.patient_name || call.name,
        phone_number: call.phone_number || call.phone,
        call_type: call.call_type || call.type,
        call_duration: call.duration || 0,
        call_status: call.status || 'completed',
        call_time: call.call_time || call.timestamp,
        notes: call.notes || call.description
      });
  }
}

async function processAmbulanceData(supabaseClient: any, reportId: string, data: any) {
  const bookings = Array.isArray(data) ? data : data.bookings || [];
  
  for (const booking of bookings) {
    await supabaseClient
      .from('ambulance_bookings')
      .insert({
        report_id: reportId,
        patient_name: booking.patient_name || booking.name,
        phone_number: booking.phone_number || booking.phone,
        pickup_location: booking.pickup_location || booking.pickup,
        destination: booking.destination || booking.drop,
        booking_time: booking.booking_time || booking.timestamp,
        ambulance_type: booking.ambulance_type || booking.type,
        status: booking.status || 'completed',
        driver_name: booking.driver_name || booking.driver
      });
  }
}
