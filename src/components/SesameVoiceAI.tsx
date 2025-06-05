
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, MicOff, MessageCircle, Volume2, VolumeX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SesameVoiceAIProps {
  onTranscription?: (text: string) => void;
  onResponse?: (response: string) => void;
}

const SesameVoiceAI = ({ onTranscription, onResponse }: SesameVoiceAIProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [conversation, setConversation] = useState<Array<{type: 'user' | 'ai', text: string}>>([]);
  const [sesameApiKey, setSesameApiKey] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Load API key from localStorage if available
    const savedApiKey = localStorage.getItem('sesame_api_key');
    if (savedApiKey) {
      setSesameApiKey(savedApiKey);
    }
  }, []);

  const saveApiKey = (key: string) => {
    setSesameApiKey(key);
    localStorage.setItem('sesame_api_key', key);
    toast({
      title: "API Key Saved",
      description: "Sesame Voice AI API key has been saved locally",
    });
  };

  const startListening = async () => {
    if (!sesameApiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your Sesame Voice AI API key first",
        variant: "destructive",
      });
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 44100,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      });

      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processVoiceChat(audioBlob);
        
        // Clean up the stream
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsListening(true);

      toast({
        title: "Listening",
        description: "Speak your message now...",
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Recording Error",
        description: "Could not start recording. Please check microphone permissions.",
        variant: "destructive",
      });
    }
  };

  const stopListening = () => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop();
      setIsListening(false);
      setIsProcessing(true);
    }
  };

  const processVoiceChat = async (audioBlob: Blob) => {
    try {
      console.log('Processing voice chat with Sesame AI...');

      // Convert blob to base64
      const arrayBuffer = await audioBlob.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      let binaryString = '';
      
      for (let i = 0; i < uint8Array.length; i++) {
        binaryString += String.fromCharCode(uint8Array[i]);
      }
      
      const base64Audio = btoa(binaryString);

      // Call Sesame Voice AI API
      const response = await fetch('https://mrc.fm/sesame/api/voice-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sesameApiKey}`,
        },
        body: JSON.stringify({
          audio: base64Audio,
          format: 'webm',
          conversation_history: conversation,
        }),
      });

      if (!response.ok) {
        throw new Error(`Sesame API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.transcription) {
        // Add user message to conversation
        const newConversation = [...conversation, { type: 'user' as const, text: data.transcription }];
        
        if (data.response) {
          // Add AI response to conversation
          newConversation.push({ type: 'ai' as const, text: data.response });
          
          // Speak the response if audio is provided
          if (data.audio) {
            await playAudioResponse(data.audio);
          }
          
          onResponse?.(data.response);
        }
        
        setConversation(newConversation);
        onTranscription?.(data.transcription);

        toast({
          title: "Voice Chat Complete",
          description: `You: "${data.transcription}"`,
        });
      } else {
        throw new Error('No transcription received from Sesame AI');
      }
    } catch (error) {
      console.error('Error processing voice chat:', error);
      toast({
        title: "Voice Chat Error",
        description: error instanceof Error ? error.message : "Failed to process voice chat",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const playAudioResponse = async (audioBase64: string) => {
    try {
      setIsSpeaking(true);
      
      // Convert base64 to audio blob
      const binaryString = atob(audioBase64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      const audioBlob = new Blob([bytes], { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };
      
      await audio.play();
    } catch (error) {
      console.error('Error playing audio response:', error);
      setIsSpeaking(false);
    }
  };

  const clearConversation = () => {
    setConversation([]);
    toast({
      title: "Conversation Cleared",
      description: "Voice chat history has been reset",
    });
  };

  if (!sesameApiKey) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5" />
            <span>Sesame Voice AI Setup</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Enter your Sesame Voice AI API key to enable voice chat functionality.
          </p>
          <div className="flex space-x-2">
            <input
              type="password"
              placeholder="Enter your Sesame API key..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const target = e.target as HTMLInputElement;
                  if (target.value.trim()) {
                    saveApiKey(target.value.trim());
                  }
                }
              }}
            />
            <Button
              onClick={(e) => {
                const input = (e.target as HTMLElement).parentElement?.querySelector('input') as HTMLInputElement;
                if (input?.value.trim()) {
                  saveApiKey(input.value.trim());
                }
              }}
            >
              Save API Key
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            Get your API key from{" "}
            <a href="https://mrc.fm/sesame" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              mrc.fm/sesame
            </a>
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5" />
              <span>Sesame Voice AI Chat</span>
            </div>
            <div className="flex items-center space-x-2">
              {conversation.length > 0 && (
                <Button variant="outline" size="sm" onClick={clearConversation}>
                  Clear Chat
                </Button>
              )}
              {isSpeaking ? <Volume2 className="h-4 w-4 text-green-600" /> : <VolumeX className="h-4 w-4 text-gray-400" />}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center space-x-4">
            {!isListening ? (
              <Button
                onClick={startListening}
                disabled={isProcessing || isSpeaking}
                size="lg"
                className="flex items-center space-x-2"
              >
                <Mic className="h-5 w-5" />
                <span>Start Voice Chat</span>
              </Button>
            ) : (
              <Button
                onClick={stopListening}
                variant="destructive"
                size="lg"
                className="flex items-center space-x-2 animate-pulse"
              >
                <MicOff className="h-5 w-5" />
                <span>Stop Recording</span>
              </Button>
            )}
          </div>

          {isProcessing && (
            <div className="text-center">
              <div className="inline-flex items-center space-x-2 text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm">Processing with Sesame AI...</span>
              </div>
            </div>
          )}

          {conversation.length > 0 && (
            <div className="max-h-64 overflow-y-auto space-y-2 p-3 bg-gray-50 rounded-lg">
              {conversation.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-800 border'
                    }`}
                  >
                    <div className={`text-xs mb-1 ${message.type === 'user' ? 'text-blue-200' : 'text-gray-500'}`}>
                      {message.type === 'user' ? 'You' : 'Sesame AI'}
                    </div>
                    {message.text}
                  </div>
                </div>
              ))}
            </div>
          )}

          <p className="text-xs text-gray-500 text-center">
            💡 Click "Start Voice Chat" to have a conversation with Sesame AI
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SesameVoiceAI;
