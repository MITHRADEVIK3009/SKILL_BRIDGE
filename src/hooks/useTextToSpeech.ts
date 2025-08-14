
import { useState, useRef, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

interface ElevenLabsOptions {
  apiKey?: string;
  voiceId: string;
  model: string;
}

export const useTextToSpeech = (options: ElevenLabsOptions) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const elevenlabsAudioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      speechSynthesisRef.current = new SpeechSynthesisUtterance();
      speechSynthesisRef.current.rate = 1.0;
      speechSynthesisRef.current.pitch = 1.0;
    }

    elevenlabsAudioRef.current = new Audio();
    elevenlabsAudioRef.current.addEventListener('ended', () => {
      setIsPlaying(false);
    });

    return () => {
      if (window.speechSynthesis?.speaking) {
        window.speechSynthesis.cancel();
      }
      if (elevenlabsAudioRef.current) {
        elevenlabsAudioRef.current.pause();
        elevenlabsAudioRef.current.src = '';
      }
    };
  }, []);

  const textToSpeech = async (text: string, options: ElevenLabsOptions) => {
    if (!options.apiKey) {
      return { success: false, error: "No API key provided" };
    }
    
    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${options.voiceId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': options.apiKey
        },
        body: JSON.stringify({
          text,
          model_id: options.model,
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5
          }
        })
      });
      
      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`);
      }
      
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      return { success: true, audioUrl };
    } catch (error) {
      console.error("ElevenLabs API error:", error);
      return { success: false, error };
    }
  };

  const playResponse = async (text: string) => {
    if (isPlaying) {
      if (window.speechSynthesis?.speaking) {
        window.speechSynthesis.cancel();
      }
      if (elevenlabsAudioRef.current) {
        elevenlabsAudioRef.current.pause();
        elevenlabsAudioRef.current.src = '';
      }
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);

    if (options.apiKey) {
      try {
        const result = await textToSpeech(text, options);
        if (result.success && elevenlabsAudioRef.current) {
          elevenlabsAudioRef.current.src = result.audioUrl;
          await elevenlabsAudioRef.current.play();
          return;
        }
      } catch (error) {
        console.error("ElevenLabs TTS error:", error);
        toast({
          title: "ElevenLabs Error",
          description: "Falling back to browser's text-to-speech",
          variant: "destructive"
        });
      }
    }

    // Fallback to browser's text-to-speech
    if (!window.speechSynthesis || !speechSynthesisRef.current) {
      toast({
        title: "Text-to-Speech Unavailable",
        description: "Your browser doesn't support text-to-speech functionality.",
        variant: "destructive"
      });
      setIsPlaying(false);
      return;
    }

    speechSynthesisRef.current.text = text;
    speechSynthesisRef.current.onstart = () => setIsPlaying(true);
    speechSynthesisRef.current.onend = () => setIsPlaying(false);
    speechSynthesisRef.current.onerror = () => {
      setIsPlaying(false);
      toast({
        title: "Speech Error",
        description: "There was an error with the text-to-speech service.",
        variant: "destructive"
      });
    };

    window.speechSynthesis.speak(speechSynthesisRef.current);
  };

  return {
    isPlaying,
    playResponse
  };
};
