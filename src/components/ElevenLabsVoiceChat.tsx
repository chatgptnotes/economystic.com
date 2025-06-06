import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, Phone, PhoneOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useConversation } from "@11labs/react";

interface ElevenLabsVoiceChatProps {
  searchResults?: any;
  searchQuery?: string;
}

const ElevenLabsVoiceChat = ({ searchResults, searchQuery }: ElevenLabsVoiceChatProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const { toast } = useToast();
  const connectionAttempted = useRef(false);
  const connectionInProgress = useRef(false);
  const connectionTimeout = useRef<NodeJS.Timeout | null>(null);

  const conversation = useConversation({
    onConnect: () => {
      console.log("ElevenLabs conversation connected successfully");
      setIsConnected(true);
      setIsConnecting(false);
      connectionInProgress.current = false;
      
      // Clear any connection timeout
      if (connectionTimeout.current) {
        clearTimeout(connectionTimeout.current);
        connectionTimeout.current = null;
      }
      
      toast({
        title: "Voice Chat Connected",
        description: "You can now speak with the AI about your search results",
      });
    },
    onDisconnect: () => {
      console.log("ElevenLabs conversation disconnected");
      setIsConnected(false);
      setIsConnecting(false);
      connectionAttempted.current = false;
      connectionInProgress.current = false;
      
      // Clear any connection timeout
      if (connectionTimeout.current) {
        clearTimeout(connectionTimeout.current);
        connectionTimeout.current = null;
      }
      
      toast({
        title: "Voice Chat Disconnected",
        description: "Voice conversation has ended",
      });
    },
    onMessage: (message) => {
      console.log("ElevenLabs message received:", message);
    },
    onError: (error) => {
      console.error("ElevenLabs connection error:", error);
      setIsConnecting(false);
      setIsConnected(false);
      connectionAttempted.current = false;
      connectionInProgress.current = false;
      
      // Clear any connection timeout
      if (connectionTimeout.current) {
        clearTimeout(connectionTimeout.current);
        connectionTimeout.current = null;
      }
      
      toast({
        title: "Voice Chat Error",
        description: `Connection failed: ${error}`,
        variant: "destructive",
      });
    },
  });

  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Stop the stream immediately as we just needed permission
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      console.error("Microphone permission denied:", error);
      toast({
        title: "Microphone Access Required",
        description: "Please allow microphone access to use voice chat",
        variant: "destructive",
      });
      return false;
    }
  };

  const startConversation = async () => {
    // Prevent multiple simultaneous connection attempts
    if (isConnecting || isConnected || connectionAttempted.current || connectionInProgress.current) {
      console.log("Connection already in progress or established");
      return;
    }

    console.log("Starting ElevenLabs voice chat connection...");
    
    const hasPermission = await requestMicrophonePermission();
    if (!hasPermission) {
      console.log("Microphone permission denied");
      return;
    }

    // Set connection flags to prevent duplicate attempts
    setIsConnecting(true);
    connectionAttempted.current = true;
    connectionInProgress.current = true;

    // Set a timeout to handle stuck connections
    connectionTimeout.current = setTimeout(() => {
      console.log("Connection timeout - resetting state");
      setIsConnecting(false);
      connectionAttempted.current = false;
      connectionInProgress.current = false;
      toast({
        title: "Connection Timeout",
        description: "Connection attempt timed out. Please try again.",
        variant: "destructive",
      });
    }, 30000); // 30 second timeout

    try {
      // Create conversation with ElevenLabs via our Edge Function
      const { data, error } = await supabase.functions.invoke('elevenlabs-start-conversation', {
        body: {
          searchResults,
          searchQuery,
        },
      });

      if (error) {
        throw new Error(error.message || 'Failed to start conversation');
      }

      console.log("Received signed URL from edge function:", data.signedUrl);
      console.log("Search context:", data.searchContext);
      setConversationId(data.conversationId);
      
      // Build a more focused context prompt
      let contextPrompt = `You are an AI assistant helping users analyze their database search results. 

IMPORTANT INSTRUCTIONS:
- Focus on the user's search query: "${searchQuery}"
- Help analyze and explain the search results provided
- Answer questions about the data patterns, insights, and recommendations
- Be conversational and helpful
- Do not mention ElevenLabs or voice technology unless specifically asked

SEARCH CONTEXT:`;

      if (searchResults && searchResults.results && searchResults.results.length > 0) {
        contextPrompt += `\n\nThe user searched for: "${searchQuery}"\nResults found: ${searchResults.totalResults} records across ${searchResults.results.length} tables\n\n`;
        
        // Add key findings
        searchResults.results.forEach((result: any) => {
          contextPrompt += `Table: ${result.table} (${result.count} records)\n`;
          if (result.data && result.data.length > 0) {
            contextPrompt += `Sample data: ${JSON.stringify(result.data[0])}\n`;
          }
        });
        
        if (searchResults.summary) {
          contextPrompt += `\nSummary: ${searchResults.summary}`;
        }
      } else {
        contextPrompt += `\n\nNo results were found for: "${searchQuery}"\nHelp the user understand why there might be no results and suggest alternative search approaches.`;
      }
      
      // Start the conversation with improved configuration
      await conversation.startSession({
        signedUrl: data.signedUrl,
        overrides: {
          agent: {
            prompt: {
              prompt: contextPrompt
            },
            firstMessage: searchResults && searchResults.totalResults > 0 
              ? `Hello! I can help you analyze your search results for "${searchQuery}". I found ${searchResults.totalResults} results. What would you like to know about your data?`
              : `Hello! I see you searched for "${searchQuery}" but no results were found. I can help you understand why and suggest better search approaches. What would you like to explore?`,
            language: "en"
          }
        }
      });
      
    } catch (error) {
      console.error("Failed to start conversation:", error);
      setIsConnecting(false);
      connectionAttempted.current = false;
      connectionInProgress.current = false;
      
      // Clear timeout on error
      if (connectionTimeout.current) {
        clearTimeout(connectionTimeout.current);
        connectionTimeout.current = null;
      }
      
      toast({
        title: "Connection Failed",
        description: `Unable to start voice chat: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const endConversation = async () => {
    console.log("Ending conversation...");
    
    // Clear any timeout
    if (connectionTimeout.current) {
      clearTimeout(connectionTimeout.current);
      connectionTimeout.current = null;
    }

    try {
      // End the ElevenLabs conversation
      await conversation.endSession();
      
      if (conversationId) {
        await supabase.functions.invoke('elevenlabs-end-conversation', {
          body: { conversationId },
        });
      }
      
    } catch (error) {
      console.error("Failed to end conversation:", error);
    } finally {
      // Always reset state regardless of errors
      setIsConnecting(false);
      setIsConnected(false);
      setConversationId(null);
      connectionAttempted.current = false;
      connectionInProgress.current = false;
    }
  };

  // Reset connection state when component unmounts
  useEffect(() => {
    return () => {
      if (connectionTimeout.current) {
        clearTimeout(connectionTimeout.current);
      }
      if (isConnected || isConnecting) {
        endConversation();
      }
    };
  }, []);

  const getConnectionStatus = () => {
    if (isConnected) return "Connected";
    if (isConnecting) return "Connecting...";
    return "Available";
  };

  const getConnectionBadgeVariant = () => {
    if (isConnected) return "default";
    if (isConnecting) return "secondary";
    return "outline";
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Mic className="h-5 w-5" />
          <span>AI Voice Chat</span>
          <Badge variant={getConnectionBadgeVariant()}>
            {getConnectionStatus()}
          </Badge>
          {conversation.isSpeaking && (
            <Badge variant="destructive" className="animate-pulse">
              AI Speaking
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            {isConnected && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Voice chat active - Ask about your search results: "{searchQuery}"</span>
              </div>
            )}
            {isConnecting && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                <span>Connecting to AI voice chat...</span>
              </div>
            )}
            {!isConnected && !isConnecting && (
              <p>Click "Start Voice Chat" to begin discussing your search results with AI</p>
            )}
          </div>

          <div className="flex space-x-2">
            {!isConnected && !isConnecting ? (
              <Button 
                onClick={startConversation} 
                className="flex items-center space-x-2"
                disabled={connectionInProgress.current}
              >
                <Phone className="h-4 w-4" />
                <span>Start Voice Chat</span>
              </Button>
            ) : (
              <Button 
                onClick={endConversation} 
                variant="destructive" 
                className="flex items-center space-x-2"
                disabled={isConnecting}
              >
                <PhoneOff className="h-4 w-4" />
                <span>{isConnecting ? "Connecting..." : "End Voice Chat"}</span>
              </Button>
            )}
          </div>

          {conversationId && (
            <div className="text-xs text-gray-500">
              Conversation ID: {conversationId}
            </div>
          )}

          <div className="p-3 bg-blue-50 rounded-lg text-sm">
            <p className="font-medium mb-1">💡 Voice Chat Tips:</p>
            <ul className="text-gray-600 space-y-1">
              <li>• Ask questions about your search results</li>
              <li>• Request data analysis or insights</li>
              <li>• Get explanations of specific records</li>
              <li>• Ask for recommendations based on the data</li>
            </ul>
          </div>

          {searchResults && (
            <div className="p-3 bg-green-50 rounded-lg text-sm">
              <p className="font-medium mb-1">📊 Current Search Context:</p>
              <p className="text-green-800">
                Query: "{searchQuery}" ({searchResults.totalResults} results found)
              </p>
            </div>
          )}

          {conversation.status === "connected" && (
            <div className="p-3 bg-green-50 rounded-lg text-sm">
              <p className="font-medium mb-1">✅ Voice Chat Active:</p>
              <p className="text-green-800">
                {conversation.isSpeaking ? "AI is speaking..." : "Listening for your voice..."}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ElevenLabsVoiceChat;
