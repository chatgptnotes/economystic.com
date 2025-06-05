
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, Phone, PhoneOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
      // Create conversation with ElevenLabs
      const response = await fetch('/api/elevenlabs/start-conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          searchResults,
          searchQuery,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to start conversation');
      }

      const data = await response.json();
      
      setIsConnected(true);
      setIsConnecting(false);
      setConversationId(data.conversationId);
      
      toast({
        title: "Voice Chat Connected",
        description: "You can now speak with the AI about your search results",
      });
      
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
    console.log("Ending conversation...");
    try {
      if (conversationId) {
        await fetch('/api/elevenlabs/end-conversation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ conversationId }),
        });
      }
      
      setIsConnecting(false);
      setIsConnected(false);
      setConversationId(null);
      connectionAttempted.current = false;
      
      toast({
        title: "Voice Chat Disconnected",
        description: "Voice conversation has ended",
      });
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
            {isConnected ? "Connected" : isConnecting ? "Connecting..." : "Ready"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            {isConnected && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Connected - Speak to ask about your search results</span>
              </div>
            )}
            {isConnecting && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                <span>Connecting to ElevenLabs voice chat...</span>
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

          <div className="p-3 bg-green-50 rounded-lg text-sm">
            <p className="font-medium mb-1">✅ ElevenLabs Integration:</p>
            <p className="text-green-800">
              Voice chat is now configured and ready to use with your search results.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ElevenLabsVoiceChat;
