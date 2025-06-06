
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, Phone, PhoneOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface GPTVoiceChatProps {
  searchResults?: any;
  searchQuery?: string;
}

export class AudioRecorder {
  private stream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private processor: ScriptProcessorNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;

  constructor(private onAudioData: (audioData: Float32Array) => void) {}

  async start() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 24000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      this.audioContext = new AudioContext({
        sampleRate: 24000,
      });
      
      this.source = this.audioContext.createMediaStreamSource(this.stream);
      this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);
      
      this.processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        this.onAudioData(new Float32Array(inputData));
      };
      
      this.source.connect(this.processor);
      this.processor.connect(this.audioContext.destination);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      throw error;
    }
  }

  stop() {
    if (this.source) {
      this.source.disconnect();
      this.source = null;
    }
    if (this.processor) {
      this.processor.disconnect();
      this.processor = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

export const encodeAudioForAPI = (float32Array: Float32Array): string => {
  const int16Array = new Int16Array(float32Array.length);
  for (let i = 0; i < float32Array.length; i++) {
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }
  
  const uint8Array = new Uint8Array(int16Array.buffer);
  let binary = '';
  const chunkSize = 0x8000;
  
  for (let i = 0; i < uint8Array.length; i += chunkSize) {
    const chunk = uint8Array.subarray(i, Math.min(i + chunkSize, uint8Array.length));
    binary += String.fromCharCode.apply(null, Array.from(chunk));
  }
  
  return btoa(binary);
};

const createWavFromPCM = (pcmData: Uint8Array) => {
  const int16Data = new Int16Array(pcmData.length / 2);
  for (let i = 0; i < pcmData.length; i += 2) {
    int16Data[i / 2] = (pcmData[i + 1] << 8) | pcmData[i];
  }
  
  const wavHeader = new ArrayBuffer(44);
  const view = new DataView(wavHeader);
  
  const writeString = (view: DataView, offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  const sampleRate = 24000;
  const numChannels = 1;
  const bitsPerSample = 16;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const byteRate = sampleRate * blockAlign;

  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + int16Data.byteLength, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(view, 36, 'data');
  view.setUint32(40, int16Data.byteLength, true);

  const wavArray = new Uint8Array(wavHeader.byteLength + int16Data.byteLength);
  wavArray.set(new Uint8Array(wavHeader), 0);
  wavArray.set(new Uint8Array(int16Data.buffer), wavHeader.byteLength);
  
  return wavArray;
};

class AudioQueue {
  private queue: Uint8Array[] = [];
  private isPlaying = false;
  private audioContext: AudioContext;

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
  }

  async addToQueue(audioData: Uint8Array) {
    this.queue.push(audioData);
    if (!this.isPlaying) {
      await this.playNext();
    }
  }

  private async playNext() {
    if (this.queue.length === 0) {
      this.isPlaying = false;
      return;
    }

    this.isPlaying = true;
    const audioData = this.queue.shift()!;

    try {
      const wavData = createWavFromPCM(audioData);
      const audioBuffer = await this.audioContext.decodeAudioData(wavData.buffer);
      
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioContext.destination);
      
      source.onended = () => this.playNext();
      source.start(0);
    } catch (error) {
      console.error('Error playing audio:', error);
      this.playNext();
    }
  }
}

const GPTVoiceChat = ({ searchResults, searchQuery }: GPTVoiceChatProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<Array<{role: string, content: string}>>([]);
  const { toast } = useToast();
  
  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioQueueRef = useRef<AudioQueue | null>(null);
  const recorderRef = useRef<AudioRecorder | null>(null);

  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
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
    if (isConnecting || isConnected) return;

    console.log("Starting GPT voice chat connection...");
    
    const hasPermission = await requestMicrophonePermission();
    if (!hasPermission) return;

    setIsConnecting(true);

    try {
      // Initialize audio context and queue
      audioContextRef.current = new AudioContext({ sampleRate: 24000 });
      audioQueueRef.current = new AudioQueue(audioContextRef.current);

      // Connect to WebSocket
      const wsUrl = `wss://iciuklrvlgmxmqznxniz.functions.supabase.co/gpt-voice-chat`;
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);
        setIsConnecting(false);

        // Send initial session configuration
        const sessionConfig = {
          type: "session.update",
          session: {
            modalities: ["text", "audio"],
            instructions: `You are an AI assistant helping users analyze their database search results. 

SEARCH CONTEXT:
Query: "${searchQuery}"
${searchResults && searchResults.totalResults > 0 
  ? `Results found: ${searchResults.totalResults} records across ${searchResults.results.length} tables`
  : 'No results found'}

Help analyze and explain the search results, answer questions about data patterns, and provide insights.`,
            voice: "alloy",
            input_audio_format: "pcm16",
            output_audio_format: "pcm16",
            input_audio_transcription: {
              model: "whisper-1"
            },
            turn_detection: {
              type: "server_vad",
              threshold: 0.5,
              prefix_padding_ms: 300,
              silence_duration_ms: 1000
            },
            temperature: 0.8,
            max_response_output_tokens: "inf"
          }
        };

        wsRef.current?.send(JSON.stringify(sessionConfig));
        
        toast({
          title: "Voice Chat Connected",
          description: "You can now speak about your search results",
        });
      };

      wsRef.current.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        console.log("Received message:", data);

        if (data.type === 'session.created') {
          console.log("Session created, starting audio recording");
          
          // Start recording audio
          recorderRef.current = new AudioRecorder((audioData) => {
            if (wsRef.current?.readyState === WebSocket.OPEN) {
              const encodedAudio = encodeAudioForAPI(audioData);
              wsRef.current.send(JSON.stringify({
                type: 'input_audio_buffer.append',
                audio: encodedAudio
              }));
            }
          });
          
          await recorderRef.current.start();
        } else if (data.type === 'response.audio.delta') {
          setIsSpeaking(true);
          const binaryString = atob(data.delta);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          await audioQueueRef.current?.addToQueue(bytes);
        } else if (data.type === 'response.audio.done') {
          setIsSpeaking(false);
        } else if (data.type === 'response.audio_transcript.delta') {
          // Handle transcript updates for UI
          setMessages(prev => {
            const last = prev[prev.length - 1];
            if (last && last.role === 'assistant') {
              return [...prev.slice(0, -1), { ...last, content: last.content + data.delta }];
            } else {
              return [...prev, { role: 'assistant', content: data.delta }];
            }
          });
        }
      };

      wsRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
        setIsConnecting(false);
        setIsConnected(false);
        toast({
          title: "Connection Error",
          description: "Failed to connect to voice chat",
          variant: "destructive",
        });
      };

      wsRef.current.onclose = () => {
        console.log("WebSocket disconnected");
        setIsConnected(false);
        setIsConnecting(false);
        setIsSpeaking(false);
        toast({
          title: "Voice Chat Disconnected",
          description: "Voice conversation has ended",
        });
      };

    } catch (error) {
      console.error("Failed to start conversation:", error);
      setIsConnecting(false);
      toast({
        title: "Connection Failed",
        description: `Unable to start voice chat: ${error}`,
        variant: "destructive",
      });
    }
  };

  const endConversation = () => {
    console.log("Ending conversation...");
    
    recorderRef.current?.stop();
    wsRef.current?.close();
    audioContextRef.current?.close();
    
    setIsConnected(false);
    setIsConnecting(false);
    setIsSpeaking(false);
    setMessages([]);
  };

  useEffect(() => {
    return () => {
      endConversation();
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
          <span>GPT Voice Chat</span>
          <Badge variant={getConnectionBadgeVariant()}>
            {getConnectionStatus()}
          </Badge>
          {isSpeaking && (
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
                <span>Connecting to GPT voice chat...</span>
              </div>
            )}
            {!isConnected && !isConnecting && (
              <p>Click "Start Voice Chat" to begin discussing your search results with GPT</p>
            )}
          </div>

          <div className="flex space-x-2">
            {!isConnected && !isConnecting ? (
              <Button 
                onClick={startConversation} 
                className="flex items-center space-x-2"
              >
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
                <span>{isConnecting ? "Connecting..." : "End Voice Chat"}</span>
              </Button>
            )}
          </div>

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

          {isConnected && (
            <div className="p-3 bg-green-50 rounded-lg text-sm">
              <p className="font-medium mb-1">✅ Voice Chat Active:</p>
              <p className="text-green-800">
                {isSpeaking ? "GPT is speaking..." : "Listening for your voice..."}
              </p>
            </div>
          )}

          {messages.length > 0 && (
            <div className="p-3 bg-gray-50 rounded-lg text-sm max-h-40 overflow-y-auto">
              <p className="font-medium mb-2">Conversation:</p>
              {messages.map((msg, index) => (
                <div key={index} className={`mb-1 ${msg.role === 'assistant' ? 'text-blue-600' : 'text-gray-800'}`}>
                  <strong>{msg.role === 'assistant' ? 'GPT:' : 'You:'}</strong> {msg.content}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GPTVoiceChat;
