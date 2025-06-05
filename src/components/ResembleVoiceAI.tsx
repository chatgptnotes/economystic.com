
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Volume2, VolumeX, Download, Mic, Square } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Voice {
  id: string;
  name: string;
  description?: string;
}

const ResembleVoiceAI = () => {
  const [text, setText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState("");
  const [voices, setVoices] = useState<Voice[]>([]);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [resembleApiKey, setResembleApiKey] = useState("NyuMQjBLpRHw1x1A8lVvvQtt");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchVoices();
  }, []);

  const fetchVoices = async () => {
    try {
      const response = await fetch('https://app.resemble.ai/api/v2/voices', {
        headers: {
          'Authorization': `Token token="${resembleApiKey}"`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch voices');
      }

      const data = await response.json();
      setVoices(data.items || []);
      
      if (data.items && data.items.length > 0) {
        setSelectedVoice(data.items[0].uuid);
      }
    } catch (error) {
      console.error('Error fetching voices:', error);
      toast({
        title: "Voice Loading Error",
        description: "Could not load available voices. Using default settings.",
        variant: "destructive",
      });
      
      // Set default voices if API fails
      setVoices([
        { id: "default", name: "Default Voice", description: "Standard voice" }
      ]);
      setSelectedVoice("default");
    }
  };

  const generateSpeech = async () => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text to synthesize",
        variant: "destructive",
      });
      return;
    }

    if (!selectedVoice) {
      toast({
        title: "Error",
        description: "Please select a voice",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch(`https://app.resemble.ai/api/v2/projects/${selectedVoice}/clips`, {
        method: 'POST',
        headers: {
          'Authorization': `Token token="${resembleApiKey}"`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          body: text,
          voice_uuid: selectedVoice,
          is_public: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.item && data.item.audio_src) {
        setAudioUrl(data.item.audio_src);
        toast({
          title: "Speech Generated",
          description: "Your text has been converted to speech successfully!",
        });
      } else {
        throw new Error('No audio URL in response');
      }
    } catch (error) {
      console.error('Error generating speech:', error);
      toast({
        title: "Generation Error",
        description: "Failed to generate speech. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const playAudio = () => {
    if (!audioUrl) return;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    
    audio.onplay = () => setIsSpeaking(true);
    audio.onended = () => setIsSpeaking(false);
    audio.onerror = () => {
      setIsSpeaking(false);
      toast({
        title: "Playback Error",
        description: "Could not play the audio file",
        variant: "destructive",
      });
    };

    audio.play().catch(error => {
      console.error('Error playing audio:', error);
      setIsSpeaking(false);
    });
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsSpeaking(false);
    }
  };

  const downloadAudio = () => {
    if (!audioUrl) return;

    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = 'resemble-speech.wav';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Mic className="h-5 w-5" />
          <span>Resemble.ai Voice Synthesis</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Voice</label>
          <Select value={selectedVoice} onValueChange={setSelectedVoice}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a voice..." />
            </SelectTrigger>
            <SelectContent>
              {voices.map((voice) => (
                <SelectItem key={voice.id} value={voice.id}>
                  {voice.name}
                  {voice.description && (
                    <span className="text-gray-500 ml-2">- {voice.description}</span>
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Text to Synthesize</label>
          <Textarea
            placeholder="Enter the text you want to convert to speech..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            className="resize-none"
          />
        </div>

        <div className="flex space-x-2">
          <Button 
            onClick={generateSpeech} 
            disabled={isGenerating || !text.trim()}
            className="flex-1"
          >
            {isGenerating ? "Generating..." : "Generate Speech"}
          </Button>
          
          {audioUrl && (
            <>
              {!isSpeaking ? (
                <Button variant="outline" size="icon" onClick={playAudio}>
                  <Volume2 className="h-4 w-4" />
                </Button>
              ) : (
                <Button variant="outline" size="icon" onClick={stopAudio}>
                  <Square className="h-4 w-4" />
                </Button>
              )}
              
              <Button variant="outline" size="icon" onClick={downloadAudio}>
                <Download className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>

        {isGenerating && (
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm">Generating speech with Resemble.ai...</span>
            </div>
          </div>
        )}

        <p className="text-xs text-gray-500 text-center">
          🎤 High-quality voice synthesis powered by Resemble.ai
        </p>
      </CardContent>
    </Card>
  );
};

export default ResembleVoiceAI;
