
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
  contextData?: Record<string, string>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  let requestBody: ReportAnalysisRequest;
  let supabaseClient: any;

  try {
    supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Parse request body once and store it
    requestBody = await req.json();
    const { reportId, filePath, reportType, contextData } = requestBody;

    console.log(`Starting analysis for report ${reportId} of type ${reportType}`);

    // Update report status to processing
    await supabaseClient
      .from('reports')
      .update({ analysis_status: 'processing' })
      .eq('id', reportId);

    // Download the file from storage with timeout
    const downloadPromise = supabaseClient.storage
      .from('reports')
      .download(filePath);

    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('File download timeout')), 30000)
    );

    const { data: fileData, error: downloadError } = await Promise.race([
      downloadPromise,
      timeoutPromise
    ]);

    if (downloadError) {
      throw new Error(`Failed to download file: ${downloadError.message}`);
    }

    // Convert file to text
    const fileText = await fileData.text();
    console.log('File content length:', fileText.length);

    // Check if file is too large
    if (fileText.length > 100000) {
      throw new Error('File too large for processing');
    }

    // Check if OpenAI API key is available
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Analyze with OpenAI with timeout
    const openaiPromise = fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an AI assistant that analyzes healthcare reports. Extract structured data from the provided ${reportType} report and return it as JSON. Focus on extracting relevant patient data, timestamps, and key metrics. Always return valid JSON format. If you cannot parse the data, return {"error": "Unable to parse file", "message": "File format not supported or corrupted"}.`
          },
          {
            role: 'user',
            content: `Please analyze this ${reportType} report and extract structured data. Context: ${JSON.stringify(contextData || {})}. Return the result as JSON with appropriate fields for the data type:\n\n${fileText.substring(0, 4000)}`
          }
        ],
        temperature: 0.1,
        max_tokens: 2000,
      }),
    });

    const aiTimeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('OpenAI API timeout')), 60000)
    );

    const openaiResponse = await Promise.race([openaiPromise, aiTimeoutPromise]);

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error('OpenAI API error:', openaiResponse.status, errorText);
      throw new Error(`OpenAI API error: ${openaiResponse.status}`);
    }

    const openaiResult = await openaiResponse.json();
    const analysisResult = openaiResult.choices[0]?.message?.content;

    if (!analysisResult) {
      throw new Error('No analysis result from OpenAI');
    }

    console.log('AI Analysis completed');

    // Parse the AI response and extract data
    let parsedData;
    try {
      parsedData = JSON.parse(analysisResult);
      
      // Check if AI returned an error
      if (parsedData.error) {
        throw new Error(parsedData.message || 'AI analysis failed');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', analysisResult);
      throw new Error('Invalid AI response format');
    }

    // Store the analyzed data based on report type
    try {
      if (reportType === 'whatsapp_double_tick') {
        await processWhatsAppData(supabaseClient, reportId, parsedData);
      } else if (reportType === 'centro_call_center') {
        await processCallCenterData(supabaseClient, reportId, parsedData);
      } else if (reportType === 'raftaar_ambulance') {
        await processAmbulanceData(supabaseClient, reportId, parsedData);
      }
    } catch (dataProcessError) {
      console.error('Error processing data:', dataProcessError);
      // Don't fail the entire process if data insertion fails
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

    // Update report status to failed with error message
    if (requestBody?.reportId && supabaseClient) {
      try {
        await supabaseClient
          .from('reports')
          .update({ 
            analysis_status: 'failed',
            processed: false
          })
          .eq('id', requestBody.reportId);
      } catch (updateError) {
        console.error('Failed to update report status:', updateError);
      }
    }

    return new Response(
      JSON.stringify({ 
        error: error.message,
        reportId: requestBody?.reportId 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function processWhatsAppData(supabaseClient: any, reportId: string, data: any) {
  const messages = Array.isArray(data) ? data : data.messages || data.extracted_data || [];
  
  for (const message of messages) {
    try {
      await supabaseClient
        .from('whatsapp_messages')
        .insert({
          report_id: reportId,
          patient_name: message.patient_name || message.name || 'Unknown',
          phone_number: message.phone_number || message.phone || '',
          message_content: message.content || message.message || '',
          message_type: message.type || 'text',
          sent_time: message.sent_time || message.timestamp || new Date().toISOString(),
          delivery_status: message.delivery_status || 'sent',
          read_status: message.read_status || 'unread'
        });
    } catch (insertError) {
      console.error('Error inserting WhatsApp message:', insertError);
    }
  }
}

async function processCallCenterData(supabaseClient: any, reportId: string, data: any) {
  const calls = Array.isArray(data) ? data : data.calls || data.extracted_data || [];
  
  for (const call of calls) {
    try {
      await supabaseClient
        .from('call_records')
        .insert({
          report_id: reportId,
          patient_name: call.patient_name || call.name || 'Unknown',
          phone_number: call.phone_number || call.phone || '',
          call_type: call.call_type || call.type || 'unknown',
          call_duration: call.duration || 0,
          call_status: call.status || 'completed',
          call_time: call.call_time || call.timestamp || new Date().toISOString(),
          notes: call.notes || call.description || ''
        });
    } catch (insertError) {
      console.error('Error inserting call record:', insertError);
    }
  }
}

async function processAmbulanceData(supabaseClient: any, reportId: string, data: any) {
  const bookings = Array.isArray(data) ? data : data.bookings || data.extracted_data || [];
  
  for (const booking of bookings) {
    try {
      await supabaseClient
        .from('ambulance_bookings')
        .insert({
          report_id: reportId,
          patient_name: booking.patient_name || booking.name || 'Unknown',
          phone_number: booking.phone_number || booking.phone || '',
          pickup_location: booking.pickup_location || booking.pickup || '',
          destination: booking.destination || booking.drop || '',
          booking_time: booking.booking_time || booking.timestamp || new Date().toISOString(),
          ambulance_type: booking.ambulance_type || booking.type || 'standard',
          status: booking.status || 'completed',
          driver_name: booking.driver_name || booking.driver || ''
        });
    } catch (insertError) {
      console.error('Error inserting ambulance booking:', insertError);
    }
  }
}
