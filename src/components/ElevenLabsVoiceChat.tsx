
import { useConversation } from "@11labs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Phone, PhoneOff } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface ElevenLabsVoiceChatProps {
  searchResults?: any;
  searchQuery?: string;
}

const ElevenLabsVoiceChat = ({ searchResults, searchQuery }: ElevenLabsVoiceChatProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const { toast } = useToast();

  const conversation = useConversation({
    onConnect: () => {
      console.log("Connected to ElevenLabs");
      setIsConnected(true);
      toast({
        title: "Voice Chat Connected",
        description: "You can now speak with the AI about your search results",
      });
    },
    onDisconnect: () => {
      console.log("Disconnected from ElevenLabs");
      setIsConnected(false);
      setConversationId(null);
      toast({
        title: "Voice Chat Disconnected",
        description: "Voice conversation has ended",
      });
    },
    onMessage: (message) => {
      console.log("Message received:", message);
    },
    onError: (error) => {
      console.error("ElevenLabs error:", error);
      toast({
        title: "Voice Chat Error",
        description: "There was an issue with the voice chat connection",
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

  const requestMicrophonePermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      return true;
    } catch (error) {
      toast({
        title: "Microphone Access Required",
        description: "Please allow microphone access to use voice chat",
        variant: "destructive",
      });
      return false;
    }
  };

  const generateSignedUrl = async () => {
    try {
      const response = await fetch("https://api.elevenlabs.io/v1/convai/conversation/get_signed_url", {
        method: "GET",
        headers: {
          "xi-api-key": "sk_0a51fff5c88050733dcabe8dd4c62360fd55cc8041a4534d",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get signed URL: ${response.status}`);
      }

      const data = await response.json();
      return data.signed_url;
    } catch (error) {
      console.error("Failed to generate signed URL:", error);
      throw error;
    }
  };

  const startConversation = async () => {
    const hasPermission = await requestMicrophonePermission();
    if (!hasPermission) return;

    try {
      const signedUrl = await generateSignedUrl();
      const id = await conversation.startSession({ url: signedUrl });
      setConversationId(id);
    } catch (error) {
      console.error("Failed to start conversation:", error);
      toast({
        title: "Connection Failed",
        description: "Unable to start voice chat. Please check your connection and try again.",
        variant: "destructive",
      });
    }
  };

  const endConversation = async () => {
    try {
      await conversation.endSession();
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
          <Badge variant={isConnected ? "default" : "secondary"}>
            {isConnected ? "Connected" : "Disconnected"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            {conversation.isSpeaking && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>AI is speaking...</span>
              </div>
            )}
            {isConnected && !conversation.isSpeaking && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Listening... Speak to ask about your search results</span>
              </div>
            )}
            {!isConnected && (
              <p>Click "Start Voice Chat" to begin talking with AI about your search results</p>
            )}
          </div>

          <div className="flex space-x-2">
            {!isConnected ? (
              <Button onClick={startConversation} className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>Start Voice Chat</span>
              </Button>
            ) : (
              <Button 
                onClick={endConversation} 
                variant="destructive" 
                className="flex items-center space-x-2"
              >
                <PhoneOff className="h-4 w-4" />
                <span>End Voice Chat</span>
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
        </div>
      </CardContent>
    </Card>
  );
};

export default ElevenLabsVoiceChat;
