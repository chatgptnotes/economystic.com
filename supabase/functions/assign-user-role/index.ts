
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AssignRoleRequest {
  email: string;
  role: 'admin' | 'moderator' | 'user';
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { email, role }: AssignRoleRequest = await req.json();

    console.log('Received request:', { email, role });

    if (!email || !role) {
      return new Response(
        JSON.stringify({ error: 'Email and role are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get user by email from auth.users using the admin API
    const { data: authUsers, error: authError } = await supabaseClient.auth.admin.listUsers();
    
    console.log('Auth users result:', { 
      userCount: authUsers?.users?.length || 0, 
      error: authError 
    });

    if (authError) {
      console.error('Error fetching auth users:', authError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch users: ' + authError.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    let user = authUsers.users.find(u => u.email?.toLowerCase() === email.toLowerCase());
    
    console.log('User lookup result:', { 
      found: !!user, 
      userId: user?.id,
      searchEmail: email.toLowerCase(),
      allEmails: authUsers.users.map(u => u.email) 
    });
    
    // If user doesn't exist, create them
    if (!user) {
      console.log('User not found, creating new user account for:', email);
      
      // Generate a temporary password (user will need to reset it)
      const tempPassword = Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12);
      
      const { data: newUserData, error: createError } = await supabaseClient.auth.admin.createUser({
        email: email,
        password: tempPassword,
        email_confirm: true, // Auto-confirm email since admin is creating it
      });

      console.log('User creation result:', { 
        success: !!newUserData.user, 
        userId: newUserData.user?.id,
        error: createError 
      });

      if (createError) {
        console.error('Error creating user:', createError);
        return new Response(
          JSON.stringify({ error: 'Failed to create user: ' + createError.message }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      user = newUserData.user;
    }

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Failed to get or create user' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check if role already exists
    const { data: existingRole, error: existingRoleError } = await supabaseClient
      .from('user_roles')
      .select('*')
      .eq('user_id', user.id)
      .eq('role', role)
      .maybeSingle();

    console.log('Existing role check:', { existingRole, error: existingRoleError });

    if (existingRoleError) {
      console.error('Error checking existing role:', existingRoleError);
      return new Response(
        JSON.stringify({ error: 'Failed to check existing role: ' + existingRoleError.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (existingRole) {
      return new Response(
        JSON.stringify({ error: 'User already has this role' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Insert the new role
    const { data, error } = await supabaseClient
      .from('user_roles')
      .insert({
        user_id: user.id,
        role: role
      })
      .select()
      .single();

    console.log('Role assignment result:', { data, error });

    if (error) {
      console.error('Error inserting role:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to assign role: ' + error.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: {
          ...data,
          user_email: email
        },
        message: user ? 'Role assigned successfully' : 'User created and role assigned successfully'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in assign-user-role function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
