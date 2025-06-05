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

  const conversation = useConversation({
    onConnect: () => {
      console.log("ElevenLabs conversation connected");
      setIsConnected(true);
      setIsConnecting(false);
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
      toast({
        title: "Voice Chat Disconnected",
        description: "Voice conversation has ended",
      });
    },
    onMessage: (message) => {
      console.log("ElevenLabs message:", message);
    },
    onError: (error) => {
      console.error("ElevenLabs error:", error);
      setIsConnecting(false);
      setIsConnected(false);
      connectionAttempted.current = false;
      toast({
        title: "Voice Chat Error",
        description: "Failed to connect to voice chat. Please try again.",
        variant: "destructive",
      });
    },
  });

  const requestMicrophonePermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
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
    if (isConnecting || isConnected || connectionAttempted.current) {
      console.log("Connection already in progress or established");
      return;
    }

    console.log("Starting ElevenLabs voice chat connection...");
    
    const hasPermission = await requestMicrophonePermission();
    if (!hasPermission) {
      console.log("Microphone permission denied");
      return;
    }

    setIsConnecting(true);
    connectionAttempted.current = true;

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
      
      // Build the context prompt for the agent
      let contextPrompt = "";
      if (data.searchContext && data.searchContext.contextPrompt) {
        contextPrompt = data.searchContext.contextPrompt;
      }
      
      // Start the conversation using the signed URL with context
      await conversation.startSession({
        signedUrl: data.signedUrl,
        overrides: {
          agent: {
            prompt: {
              prompt: contextPrompt || `You are an AI assistant helping users analyze their database search results. The user searched for: "${searchQuery}". Help them understand and analyze their data.`
            },
            firstMessage: `Hello! I can help you analyze your search results for "${searchQuery}". What would you like to know about your data?`
          }
        }
      });
      
    } catch (error) {
      console.error("Failed to start conversation:", error);
      setIsConnecting(false);
      connectionAttempted.current = false;
      
      toast({
        title: "Connection Failed",
        description: "Unable to start voice chat. Please check your API key configuration.",
        variant: "destructive",
      });
    }
  };

  const endConversation = async () => {
    console.log("Ending conversation...");
    try {
      // End the ElevenLabs conversation
      await conversation.endSession();
      
      if (conversationId) {
        await supabase.functions.invoke('elevenlabs-end-conversation', {
          body: { conversationId },
        });
      }
      
      setIsConnecting(false);
      setIsConnected(false);
      setConversationId(null);
      connectionAttempted.current = false;
      
    } catch (error) {
      console.error("Failed to end conversation:", error);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Mic className="h-5 w-5" />
          <span>AI Voice Chat</span>
          <Badge variant={isConnected ? "default" : isConnecting ? "secondary" : "outline"}>
            {isConnected ? "Connected" : isConnecting ? "Connecting..." : "Available"}
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
              <Button onClick={startConversation} className="flex items-center space-x-2">
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

const requestMicrophonePermission = async () => {
  try {
    await navigator.mediaDevices.getUserMedia({ audio: true });
    return true;
  } catch (error) {
    console.error("Microphone permission denied:", error);
    return false;
  }
};

const endConversation = async () => {
  console.log("Ending conversation...");
  try {
    // End the ElevenLabs conversation
    await conversation.endSession();
    
    if (conversationId) {
      await supabase.functions.invoke('elevenlabs-end-conversation', {
        body: { conversationId },
      });
    }
    
    setIsConnecting(false);
    setIsConnected(false);
    setConversationId(null);
    connectionAttempted.current = false;
    
  } catch (error) {
    console.error("Failed to end conversation:", error);
  }
};

export default ElevenLabsVoiceChat;
