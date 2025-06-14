
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

    requestBody = await req.json();
    const { reportId, filePath, reportType, contextData } = requestBody;

    console.log(`Starting analysis for report ${reportId} of type ${reportType}`);

    await updateReportStatus(supabaseClient, reportId, 'processing');

    const fileText = await downloadAndValidateFile(supabaseClient, filePath);
    console.log('File downloaded, content preview:', fileText.substring(0, 500));
    
    const analysisResult = await analyzeWithAI(fileText, reportType, contextData);
    console.log('AI analysis result:', JSON.stringify(analysisResult, null, 2));
    
    await processAnalysisResult(supabaseClient, reportId, reportType, analysisResult);
    await updateReportStatus(supabaseClient, reportId, 'completed', true);

    console.log(`Analysis completed successfully for report ${reportId}`);

    return new Response(
      JSON.stringify({ success: true, message: 'Report analyzed successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-report function:', error);
    console.error('Error stack:', error.stack);
    await handleAnalysisError(supabaseClient, requestBody?.reportId, error);

    return new Response(
      JSON.stringify({ 
        error: error.message,
        reportId: requestBody?.reportId,
        details: error.stack
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function updateReportStatus(supabaseClient: any, reportId: string, status: string, processed?: boolean) {
  try {
    const updateData: any = { analysis_status: status };
    if (processed !== undefined) {
      updateData.processed = processed;
    }

    const { error } = await supabaseClient
      .from('reports')
      .update(updateData)
      .eq('id', reportId);

    if (error) {
      console.error('Error updating report status:', error);
      throw error;
    }

    console.log(`Report ${reportId} status updated to: ${status}`);
  } catch (error) {
    console.error('Failed to update report status:', error);
    throw error;
  }
}

async function downloadAndValidateFile(supabaseClient: any, filePath: string): Promise<string> {
  try {
    console.log('Downloading file:', filePath);
    
    const downloadPromise = supabaseClient.storage
      .from('reports')
      .download(filePath);

    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('File download timeout after 30 seconds')), 30000)
    );

    const { data: fileData, error: downloadError } = await Promise.race([
      downloadPromise,
      timeoutPromise
    ]);

    if (downloadError) {
      console.error('Download error:', downloadError);
      throw new Error(`Failed to download file: ${downloadError.message}`);
    }

    if (!fileData) {
      throw new Error('No file data received');
    }

    const fileText = await fileData.text();
    console.log('File content length:', fileText.length);

    if (fileText.length === 0) {
      throw new Error('File is empty');
    }

    if (fileText.length > 100000) {
      throw new Error('File too large for processing (max 100KB)');
    }

    return fileText;
  } catch (error) {
    console.error('Error in downloadAndValidateFile:', error);
    throw error;
  }
}

async function analyzeWithAI(fileText: string, reportType: string, contextData?: Record<string, string>): Promise<any> {
  const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openaiApiKey) {
    throw new Error('OpenAI API key not configured');
  }

  let systemPrompt = '';
  if (reportType === 'raftaar_ambulance') {
    systemPrompt = `You are an AI assistant that analyzes ambulance booking reports. Extract structured data from the provided CSV or spreadsheet and return it as JSON.

For ambulance booking data, extract these fields for each booking record:
- patient_name (string)
- phone_number (string, clean format without extra characters)
- pickup_location (string)
- destination (string)
- booking_time (string, ISO timestamp format like "2024-01-15T10:30:00Z")
- ambulance_type (string)
- status (string: completed, pending, cancelled, etc.)
- driver_name (string)

IMPORTANT: Return the data as a JSON array of objects with these exact field names. If the file contains headers, ignore them. Always return valid JSON format.

Example format:
[
  {
    "patient_name": "John Doe",
    "phone_number": "+1234567890",
    "pickup_location": "Hospital A",
    "destination": "Home",
    "booking_time": "2024-01-15T10:30:00Z",
    "ambulance_type": "Basic",
    "status": "completed",
    "driver_name": "Driver Name"
  }
]`;
  } else if (reportType === 'centro_call_center') {
    systemPrompt = `You are an AI assistant that analyzes call center reports. Extract structured data from the provided CSV or spreadsheet and return it as JSON. 

For call center data, extract these fields for each call record:
- patient_name (string)
- phone_number (string, clean format without extra characters)
- call_type (string)
- call_duration (integer, duration in seconds or minutes)
- call_status (string: completed, ongoing, missed, etc.)
- call_time (string, ISO timestamp format like "2024-01-15T10:30:00Z")
- call_direction (string: inbound, outbound)
- notes (string)

Return the data as a JSON array of objects with these exact field names. Always return valid JSON format.`;
  } else if (reportType === 'whatsapp_double_tick') {
    systemPrompt = `You are an AI assistant that analyzes WhatsApp message reports. Extract structured data from the provided CSV or spreadsheet and return it as JSON.

For WhatsApp message data, extract these fields for each message record:
- patient_name (string)
- phone_number (string, clean format without extra characters)
- message_content (string)
- message_type (string: text, image, document, etc.)
- sent_time (string, ISO timestamp format like "2024-01-15T10:30:00Z")
- delivery_status (string: sent, delivered, read, etc.)
- read_status (string: read, unread)
- response (string)

Return the data as a JSON array of objects with these exact field names. Always return valid JSON format.`;
  } else {
    systemPrompt = `You are an AI assistant that analyzes healthcare reports. Extract structured data from the provided ${reportType} report and return it as JSON. Focus on extracting relevant patient data, timestamps, and key metrics. Always return valid JSON format as an array of objects.`;
  }

  try {
    console.log('Calling OpenAI API...');
    
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
            content: systemPrompt
          },
          {
            role: 'user',
            content: `Please analyze this ${reportType} report and extract structured data. Context: ${JSON.stringify(contextData || {})}. Return the result as JSON:\n\n${fileText}`
          }
        ],
        temperature: 0.1,
        max_tokens: 3000,
      }),
    });

    const aiTimeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('OpenAI API timeout after 60 seconds')), 60000)
    );

    const openaiResponse = await Promise.race([openaiPromise, aiTimeoutPromise]);

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error('OpenAI API error:', openaiResponse.status, errorText);
      throw new Error(`OpenAI API error: ${openaiResponse.status} - ${errorText}`);
    }

    const openaiResult = await openaiResponse.json();
    const analysisResult = openaiResult.choices[0]?.message?.content;

    if (!analysisResult) {
      throw new Error('No analysis result from OpenAI');
    }

    console.log('Raw AI response:', analysisResult);
    return parseAIResponse(analysisResult);
  } catch (error) {
    console.error('Error in analyzeWithAI:', error);
    throw error;
  }
}

function parseAIResponse(analysisResult: string): any {
  try {
    // Clean the response to extract JSON
    let cleanedResult = analysisResult.trim();
    
    // Remove markdown code blocks if present
    if (cleanedResult.startsWith('```json')) {
      cleanedResult = cleanedResult.substring(7);
    }
    if (cleanedResult.startsWith('```')) {
      cleanedResult = cleanedResult.substring(3);
    }
    if (cleanedResult.endsWith('```')) {
      cleanedResult = cleanedResult.substring(0, cleanedResult.length - 3);
    }
    
    cleanedResult = cleanedResult.trim();
    
    const parsedData = JSON.parse(cleanedResult);
    
    if (parsedData.error) {
      throw new Error(parsedData.message || 'AI analysis failed');
    }

    return parsedData;
  } catch (parseError) {
    console.error('Failed to parse AI response as JSON:', analysisResult);
    console.error('Parse error:', parseError);
    throw new Error(`Invalid AI response format: ${parseError.message}`);
  }
}

async function processAnalysisResult(supabaseClient: any, reportId: string, reportType: string, parsedData: any) {
  try {
    console.log('Processing analysis result for type:', reportType);
    console.log('Parsed data:', JSON.stringify(parsedData, null, 2));
    
    if (!Array.isArray(parsedData)) {
      console.log('Parsed data is not an array, checking for nested data...');
      // Handle cases where AI returns nested structure
      if (parsedData.patients) {
        parsedData = parsedData.patients;
      } else if (parsedData.calls) {
        parsedData = parsedData.calls;
      } else if (parsedData.bookings) {
        parsedData = parsedData.bookings;
      } else if (parsedData.messages) {
        parsedData = parsedData.messages;
      } else if (parsedData.extracted_data) {
        parsedData = parsedData.extracted_data;
      } else {
        throw new Error('Invalid data structure: expected an array or object with known data properties');
      }
    }

    if (!Array.isArray(parsedData)) {
      throw new Error('Invalid data structure: data must be an array');
    }

    console.log(`Processing ${parsedData.length} records for ${reportType}`);
    
    if (reportType === 'whatsapp_double_tick') {
      await processWhatsAppData(supabaseClient, reportId, parsedData);
    } else if (reportType === 'centro_call_center') {
      await processCallCenterData(supabaseClient, reportId, parsedData);
    } else if (reportType === 'raftaar_ambulance') {
      await processAmbulanceData(supabaseClient, reportId, parsedData);
    } else if (reportType === 'just_dial_leads') {
      await processJustDialData(supabaseClient, reportId, parsedData);
    }
    
    console.log(`Successfully processed ${parsedData.length} records for ${reportType}`);
  } catch (dataProcessError) {
    console.error('Error processing data:', dataProcessError);
    throw dataProcessError;
  }
}

async function handleAnalysisError(supabaseClient: any, reportId: string | undefined, error: Error) {
  if (reportId && supabaseClient) {
    try {
      await updateReportStatus(supabaseClient, reportId, 'failed', false);
      console.log(`Marked report ${reportId} as failed due to error: ${error.message}`);
    } catch (updateError) {
      console.error('Failed to update report status to failed:', updateError);
    }
  }
}

async function processWhatsAppData(supabaseClient: any, reportId: string, data: any[]) {
  console.log('Processing WhatsApp messages:', data.length);
  
  for (const message of data) {
    try {
      const { error } = await supabaseClient
        .from('whatsapp_messages')
        .insert({
          report_id: reportId,
          patient_name: message.patient_name || message.name || 'Unknown',
          phone_number: message.phone_number || message.phone || '',
          message_content: message.message_content || message.content || message.message || '',
          message_type: message.message_type || message.type || 'text',
          sent_time: message.sent_time || message.timestamp || new Date().toISOString(),
          delivery_status: message.delivery_status || 'sent',
          read_status: message.read_status || 'unread',
          response: message.response || ''
        });
      
      if (error) {
        console.error('Error inserting WhatsApp message:', error);
        throw error;
      }
    } catch (insertError) {
      console.error('Error inserting WhatsApp message:', insertError);
      throw insertError;
    }
  }
}

async function processCallCenterData(supabaseClient: any, reportId: string, data: any[]) {
  console.log('Processing call center data:', data.length, 'calls');
  
  if (data.length === 0) {
    console.log('No call data found in parsed result');
    return;
  }
  
  for (const call of data) {
    try {
      console.log('Inserting call record:', call);
      
      const { error } = await supabaseClient
        .from('call_records')
        .insert({
          report_id: reportId,
          patient_name: call.patient_name || call.name || 'Unknown',
          phone_number: call.phone_number || call.phone || '',
          call_type: call.call_type || call.type || 'unknown',
          call_duration: parseInt(call.call_duration || call.duration || '0'),
          call_status: call.call_status || call.status || 'completed',
          call_time: call.call_time || call.timestamp || new Date().toISOString(),
          call_direction: call.call_direction || call.direction || 'inbound',
          notes: call.notes || call.description || ''
        });
      
      if (error) {
        console.error('Error inserting call record:', error);
        throw error;
      } else {
        console.log('Successfully inserted call record for:', call.patient_name);
      }
    } catch (insertError) {
      console.error('Error inserting call record:', insertError);
      throw insertError;
    }
  }
}

async function processAmbulanceData(supabaseClient: any, reportId: string, data: any[]) {
  console.log('Processing ambulance bookings:', data.length);
  
  if (data.length === 0) {
    console.log('No ambulance booking data found in parsed result');
    return;
  }
  
  for (const booking of data) {
    try {
      console.log('Inserting ambulance booking:', booking);
      
      // Ensure we have a valid booking_time
      let bookingTime = booking.booking_time || booking.timestamp || booking.date;
      if (!bookingTime) {
        bookingTime = new Date().toISOString();
      }
      
      const { error } = await supabaseClient
        .from('ambulance_bookings')
        .insert({
          report_id: reportId,
          patient_name: booking.patient_name || booking.name || 'Unknown',
          phone_number: booking.phone_number || booking.phone || '',
          pickup_location: booking.pickup_location || booking.pickup || booking.from || '',
          destination: booking.destination || booking.drop || booking.to || '',
          booking_time: bookingTime,
          ambulance_type: booking.ambulance_type || booking.type || 'standard',
          status: booking.status || 'completed',
          driver_name: booking.driver_name || booking.driver || ''
        });
      
      if (error) {
        console.error('Error inserting ambulance booking:', error);
        throw error;
      } else {
        console.log('Successfully inserted ambulance booking for:', booking.patient_name);
      }
    } catch (insertError) {
      console.error('Error inserting ambulance booking:', insertError);
      throw insertError;
    }
  }
}

async function processJustDialData(supabaseClient: any, reportId: string, data: any[]) {
  console.log('Processing Just Dial leads data:', data.length);
  // Implementation for Just Dial leads processing would go here
  // For now, just log that we received the data
}
