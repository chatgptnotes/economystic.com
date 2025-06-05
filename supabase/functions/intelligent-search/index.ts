
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.9';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();
    
    if (!query) {
      throw new Error('No search query provided');
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!openAIApiKey || !supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing required environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Database schema context for OpenAI
    const schemaContext = `
    Database Schema:
    
    1. call_records: id, patient_name, phone_number, call_time, call_type, call_direction, call_status, call_duration, notes
    2. ambulance_bookings: id, patient_name, phone_number, pickup_location, destination, ambulance_type, driver_name, booking_time, status
    3. whatsapp_messages: id, patient_name, phone_number, message_content, message_type, sent_time, delivery_status, read_status, response
    4. patient_events: id, patient_name, phone_number, event_type, event_date, doctor_name, department, privacy_consent
    5. telecom_services: id, service_type, provider_name, service_number, company_name, department, assigned_to, contact_person, contact_phone, monthly_cost, is_active
    6. telecom_checks: id, service_id, check_date, check_time, status, checked_by, response_time_seconds, issues_found, action_taken, notes
    7. social_media_platforms: id, name, base_url, icon_name
    8. businesses: id, name, description, website_url, logo_url
    9. social_media_posts: id, business_id, platform_id, title, content, status, scheduled_at, published_at, likes_count, views_count, comments_count, shares_count
    10. content_campaigns: id, name, description, business_id, campaign_type, department, doctor_name, start_date, end_date, is_active
    11. content_calendar: id, business_id, campaign_id, title, content_type, content_template, scheduled_date, status, platforms
    12. prompts: id, title, content, project_id, project_name, category, tags
    13. reports: id, name, type, file_path, analysis_status, processed, context_data
    `;

    // Use OpenAI to understand the query and determine which tables to search
    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a database search assistant. Given a user query, determine which tables to search and what to look for. 
            
            ${schemaContext}
            
            Respond with a JSON object containing:
            {
              "tables": ["table1", "table2"],
              "searchTerms": ["term1", "term2"],
              "intent": "brief description of what user is looking for"
            }
            
            For patient-related queries, always include: call_records, ambulance_bookings, whatsapp_messages, patient_events
            For telecom queries, include: telecom_services, telecom_checks
            For social media queries, include: social_media_posts, businesses, content_campaigns
            For project/content queries, include: prompts, reports, content_calendar
            
            Extract key search terms that would be useful for text matching.`
          },
          {
            role: 'user',
            content: query
          }
        ],
        temperature: 0.1,
      }),
    });

    const aiData = await aiResponse.json();
    const searchStrategy = JSON.parse(aiData.choices[0].message.content);

    console.log('Search strategy:', searchStrategy);

    // Perform searches based on AI suggestions
    const searchResults = [];

    for (const table of searchStrategy.tables) {
      try {
        let queryBuilder = supabase.from(table).select('*');
        
        // Apply text search on relevant columns
        const searchFilters = [];
        
        for (const term of searchStrategy.searchTerms) {
          switch (table) {
            case 'call_records':
              searchFilters.push(
                queryBuilder.or(`patient_name.ilike.%${term}%,phone_number.ilike.%${term}%,notes.ilike.%${term}%,call_type.ilike.%${term}%`)
              );
              break;
            case 'ambulance_bookings':
              searchFilters.push(
                queryBuilder.or(`patient_name.ilike.%${term}%,phone_number.ilike.%${term}%,pickup_location.ilike.%${term}%,destination.ilike.%${term}%,driver_name.ilike.%${term}%`)
              );
              break;
            case 'whatsapp_messages':
              searchFilters.push(
                queryBuilder.or(`patient_name.ilike.%${term}%,phone_number.ilike.%${term}%,message_content.ilike.%${term}%`)
              );
              break;
            case 'patient_events':
              searchFilters.push(
                queryBuilder.or(`patient_name.ilike.%${term}%,phone_number.ilike.%${term}%,event_type.ilike.%${term}%,doctor_name.ilike.%${term}%,department.ilike.%${term}%`)
              );
              break;
            case 'telecom_services':
              searchFilters.push(
                queryBuilder.or(`service_type.ilike.%${term}%,provider_name.ilike.%${term}%,service_number.ilike.%${term}%,company_name.ilike.%${term}%,department.ilike.%${term}%`)
              );
              break;
            case 'prompts':
              searchFilters.push(
                queryBuilder.or(`title.ilike.%${term}%,content.ilike.%${term}%,project_name.ilike.%${term}%,category.ilike.%${term}%`)
              );
              break;
            default:
              // Generic search for other tables
              searchFilters.push(queryBuilder.textSearch('*', term));
          }
        }

        // Use the first search filter (we'll combine multiple terms with OR)
        if (searchFilters.length > 0) {
          const combinedTerms = searchStrategy.searchTerms.join('|');
          
          switch (table) {
            case 'call_records':
              queryBuilder = queryBuilder.or(`patient_name.ilike.%${combinedTerms}%,phone_number.ilike.%${combinedTerms}%,notes.ilike.%${combinedTerms}%,call_type.ilike.%${combinedTerms}%`);
              break;
            case 'ambulance_bookings':
              queryBuilder = queryBuilder.or(`patient_name.ilike.%${combinedTerms}%,phone_number.ilike.%${combinedTerms}%,pickup_location.ilike.%${combinedTerms}%,destination.ilike.%${combinedTerms}%`);
              break;
            case 'whatsapp_messages':
              queryBuilder = queryBuilder.or(`patient_name.ilike.%${combinedTerms}%,phone_number.ilike.%${combinedTerms}%,message_content.ilike.%${combinedTerms}%`);
              break;
            case 'patient_events':
              queryBuilder = queryBuilder.or(`patient_name.ilike.%${combinedTerms}%,phone_number.ilike.%${combinedTerms}%,event_type.ilike.%${combinedTerms}%,doctor_name.ilike.%${combinedTerms}%`);
              break;
            case 'telecom_services':
              queryBuilder = queryBuilder.or(`service_type.ilike.%${combinedTerms}%,provider_name.ilike.%${combinedTerms}%,service_number.ilike.%${combinedTerms}%,company_name.ilike.%${combinedTerms}%`);
              break;
            case 'prompts':
              queryBuilder = queryBuilder.or(`title.ilike.%${combinedTerms}%,content.ilike.%${combinedTerms}%,project_name.ilike.%${combinedTerms}%`);
              break;
          }
        }

        const { data, error } = await queryBuilder.limit(10);
        
        if (error) {
          console.error(`Error searching ${table}:`, error);
          continue;
        }

        if (data && data.length > 0) {
          searchResults.push({
            table,
            data,
            count: data.length
          });
        }
      } catch (error) {
        console.error(`Error searching table ${table}:`, error);
      }
    }

    // Generate AI summary of results
    const summaryResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that summarizes database search results. Provide a concise, human-readable summary of the search results.'
          },
          {
            role: 'user',
            content: `Original query: "${query}"\n\nSearch results:\n${JSON.stringify(searchResults, null, 2)}\n\nProvide a brief summary of what was found.`
          }
        ],
        temperature: 0.3,
      }),
    });

    const summaryData = await summaryResponse.json();
    const summary = summaryData.choices[0].message.content;

    return new Response(
      JSON.stringify({
        query,
        intent: searchStrategy.intent,
        results: searchResults,
        summary,
        totalResults: searchResults.reduce((acc, result) => acc + result.count, 0)
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in intelligent-search function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
