
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Authentication Temporarily Disabled
            </CardTitle>
            <p className="text-gray-600">
              Authentication is currently disabled for testing purposes
            </p>
            <p className="text-sm text-blue-600 mt-2">
              Only @hopehospital.com and @drmhope.com email addresses will be allowed when re-enabled
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="w-full min-h-[200px] flex items-center justify-center">
              <div className="text-center space-y-4">
                <p className="text-gray-500">
                  Sign in and sign up functionality has been temporarily removed.
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 text-sm">
                    Authentication will be restored when configured properly.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <Button
                variant="ghost"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-blue-600 hover:text-blue-700"
                disabled
              >
                {isSignUp 
                  ? "Already have an account? Sign in" 
                  : "Don't have an account? Sign up"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
