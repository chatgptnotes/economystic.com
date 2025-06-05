
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Phone, PhoneOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ElevenLabsVoiceChatProps {
  searchResults?: any;
  searchQuery?: string;
}

const ElevenLabsVoiceChat = ({ searchResults, searchQuery }: ElevenLabsVoiceChatProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [moduleError, setModuleError] = useState<string | null>(null);
  const { toast } = useToast();
  const connectionAttempted = useRef(false);
  const conversationRef = useRef<any>(null);

  // Dynamically import the ElevenLabs hook
  useEffect(() => {
    const loadElevenLabs = async () => {
      try {
        const { useConversation } = await import("@11labs/react");
        
        const conversation = useConversation({
          onConnect: () => {
            console.log("Successfully connected to ElevenLabs");
            setIsConnected(true);
            setIsConnecting(false);
            connectionAttempted.current = false;
            
            toast({
              title: "Voice Chat Connected",
              description: "You can now speak with the AI about your search results",
            });
          },
          onDisconnect: () => {
            console.log("Disconnected from ElevenLabs");
            setIsConnected(false);
            setIsConnecting(false);
            setConversationId(null);
            connectionAttempted.current = false;
            
            toast({
              title: "Voice Chat Disconnected",
              description: "Voice conversation has ended",
            });
          },
          onMessage: (message: any) => {
            console.log("Message received:", message);
          },
          onError: (error: any) => {
            console.error("ElevenLabs error:", error);
            setIsConnecting(false);
            setIsConnected(false);
            connectionAttempted.current = false;
            
            toast({
              title: "Voice Chat Error",
              description: `Connection failed: ${error || 'Unknown error'}`,
              variant: "destructive",
            });
          },
          overrides: {
            agent: {
              prompt: {
                prompt: `You are an intelligent database search assistant. You help users understand and discuss their search results. 
                ${searchQuery ? `The user searched for: "${searchQuery}"` : ""}
                ${searchResults ? `Here are the search results: ${JSON.stringify(searchResults, null, 2)}` : ""}
                
                Please help the user understand their data, answer questions about the results, and provide insights. 
                Be conversational, helpful, and focus on the data they found.`,
              },
              firstMessage: searchQuery 
                ? `Hello! I can see you searched for "${searchQuery}". I'm here to help you understand your search results and answer any questions about your data. What would you like to know?`
                : "Hello! I'm your database search assistant. I can help you understand your search results and answer questions about your data. How can I help you today?",
              language: "en",
            },
          },
        });

        conversationRef.current = conversation;
      } catch (error) {
        console.error("Failed to load ElevenLabs module:", error);
        setModuleError("ElevenLabs module failed to load. Please ensure you have the necessary API access.");
      }
    };

    loadElevenLabs();
  }, [searchQuery, searchResults, toast]);

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
    if (!conversationRef.current) {
      toast({
        title: "Module Not Available",
        description: "ElevenLabs voice chat module is not available",
        variant: "destructive",
      });
      return;
    }

    // Prevent multiple simultaneous connection attempts
    if (isConnecting || isConnected || connectionAttempted.current) {
      console.log("Connection already in progress or established");
      return;
    }

    console.log("Starting voice chat connection process...");
    
    const hasPermission = await requestMicrophonePermission();
    if (!hasPermission) {
      console.log("Microphone permission denied");
      return;
    }

    setIsConnecting(true);
    connectionAttempted.current = true;

    try {
      // Use the agent ID directly
      const agentId = "agent_01jx0f5dmge7ntxth97awgnrbg";
      console.log("Starting session with agent ID:", agentId);
      
      const sessionId = await conversationRef.current.startSession({
        agentId: agentId
      });
      
      console.log("Session started successfully with ID:", sessionId);
      setConversationId(sessionId);
      
    } catch (error) {
      console.error("Failed to start conversation:", error);
      setIsConnecting(false);
      connectionAttempted.current = false;
      
      toast({
        title: "Connection Failed",
        description: "Unable to start voice chat. Please try again.",
        variant: "destructive",
      });
    }
  };

  const endConversation = async () => {
    if (!conversationRef.current) return;

    console.log("Ending conversation...");
    try {
      setIsConnecting(false);
      connectionAttempted.current = false;
      
      await conversationRef.current.endSession();
      console.log("Conversation ended successfully");
    } catch (error) {
      console.error("Failed to end conversation:", error);
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (isConnected && conversationRef.current) {
        endConversation();
      }
    };
  }, [isConnected]);

  if (moduleError) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mic className="h-5 w-5" />
            <span>AI Voice Chat</span>
            <Badge variant="destructive">Module Error</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-3 bg-red-50 rounded-lg text-sm">
            <p className="font-medium mb-1">⚠️ Module Error:</p>
            <p className="text-red-800">{moduleError}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Mic className="h-5 w-5" />
          <span>AI Voice Chat</span>
          <Badge variant={isConnected ? "default" : isConnecting ? "secondary" : "outline"}>
            {isConnected ? "Connected" : isConnecting ? "Connecting..." : "Disconnected"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            {conversationRef.current?.isSpeaking && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>AI is speaking...</span>
              </div>
            )}
            {isConnected && !conversationRef.current?.isSpeaking && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Listening... Speak to ask about your search results</span>
              </div>
            )}
            {isConnecting && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                <span>Connecting to voice chat...</span>
              </div>
            )}
            {!isConnected && !isConnecting && (
              <p>Click "Start Voice Chat" to begin talking with AI about your search results</p>
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

          {!isConnected && !isConnecting && (
            <div className="p-3 bg-yellow-50 rounded-lg text-sm">
              <p className="font-medium mb-1">⚠️ Note:</p>
              <p className="text-yellow-800">
                If you continue to experience connection issues, you may need to provide your ElevenLabs API key for authenticated access to the voice agent.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ElevenLabsVoiceChat;
