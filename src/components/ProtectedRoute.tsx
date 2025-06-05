import { useUser, useAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { getToken } = useAuth();

  useEffect(() => {
    console.log('ProtectedRoute: Auth state', { isLoaded, isSignedIn, userId: user?.id });
    
    // Set up Supabase session when Clerk user is available
    const setupSupabaseSession = async () => {
      if (isSignedIn && user) {
        try {
          console.log('ProtectedRoute: Setting up Supabase session for user:', user.id);
          
          // Create a Supabase session using the Clerk user token
          const token = await getToken();
          console.log('ProtectedRoute: Got Clerk token:', !!token);
          
          if (token) {
            const { data, error } = await supabase.auth.setSession({
              access_token: token,
              refresh_token: token
            });
            console.log('ProtectedRoute: Supabase session setup result:', { data, error });
          }
        } catch (error) {
          console.error('ProtectedRoute: Error setting up Supabase session:', error);
        }
      }
    };

    if (isLoaded && isSignedIn) {
      setupSupabaseSession();
    }
  }, [isLoaded, isSignedIn, user, getToken]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    console.log('ProtectedRoute: User not signed in, redirecting to auth');
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
