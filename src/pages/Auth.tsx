
import { SignIn, SignUp } from "@clerk/clerk-react";
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
              {isSignUp ? "Create Account" : "Welcome Back"}
            </CardTitle>
            <p className="text-gray-600">
              {isSignUp 
                ? "Sign up to access economystic.ai Analytics" 
                : "Sign in to your account"}
            </p>
            <p className="text-sm text-blue-600 mt-2">
              Only @hopehospital.com and @drmhope.com email addresses are allowed
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="w-full">
              {isSignUp ? (
                <SignUp 
                  fallbackRedirectUrl="/dashboard"
                  appearance={{
                    elements: {
                      formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white",
                      card: "shadow-none border-0 bg-transparent",
                      rootBox: "w-full",
                      formFieldInput: "border border-gray-300 rounded-md px-3 py-2",
                      formFieldLabel: "text-gray-700 font-medium",
                      headerTitle: "hidden",
                      headerSubtitle: "hidden",
                      socialButtonsBlockButton: "border border-gray-300 hover:bg-gray-50",
                      footer: "hidden"
                    },
                    layout: {
                      socialButtonsPlacement: "top"
                    }
                  }}
                />
              ) : (
                <SignIn 
                  fallbackRedirectUrl="/dashboard"
                  appearance={{
                    elements: {
                      formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white",
                      card: "shadow-none border-0 bg-transparent",
                      rootBox: "w-full",
                      formFieldInput: "border border-gray-300 rounded-md px-3 py-2",
                      formFieldLabel: "text-gray-700 font-medium",
                      headerTitle: "hidden",
                      headerSubtitle: "hidden",
                      socialButtonsBlockButton: "border border-gray-300 hover:bg-gray-50",
                      footer: "hidden"
                    },
                    layout: {
                      socialButtonsPlacement: "top"
                    }
                  }}
                />
              )}
            </div>
            
            <div className="mt-6 text-center">
              <Button
                variant="ghost"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-blue-600 hover:text-blue-700"
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
