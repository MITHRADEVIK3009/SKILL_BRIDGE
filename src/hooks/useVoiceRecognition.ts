
import { useState, useRef, useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";

export interface VoiceRecognitionOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  onTranscript: (text: string) => void;
  onCommand?: (command: string) => void;
}

// List of supported languages
export const supportedLanguages = [
  { code: 'en-US', name: 'English (US)' },
  { code: 'es-ES', name: 'Spanish' },
  { code: 'fr-FR', name: 'French' },
  { code: 'de-DE', name: 'German' },
  { code: 'zh-CN', name: 'Chinese (Simplified)' },
  { code: 'ja-JP', name: 'Japanese' },
  { code: 'ru-RU', name: 'Russian' },
  { code: 'ar-SA', name: 'Arabic' },
  { code: 'pt-BR', name: 'Portuguese (Brazil)' },
  { code: 'it-IT', name: 'Italian' }
];

// Command keywords for the assistant
const COMMAND_KEYWORDS = {
  DOWNLOAD: ['download', 'get materials', 'get study material', 'study material'],
  NOTES: ['take notes', 'start notes', 'notes', 'note taking'],
  TIMER: ['track time', 'track study time', 'start timer', 'timer'],
  PROGRESS: ['show progress', 'progress', 'analytics', 'statistics', 'stats'],
  LEADERBOARD: ['leaderboard', 'show leaderboard', 'rankings', 'ranks'],
  TEST: ['test', 'create test', 'custom test', 'make a test', 'quiz'],
  SUGGEST: ['suggest', 'recommend', 'what next', 'what to learn', 'next steps'],
  QUESTION: ['question', 'ask', 'explain', 'help with', 'how to']
};

export const useVoiceRecognition = ({
  language = 'en-US',
  continuous = true,
  interimResults = true,
  onTranscript,
  onCommand
}: VoiceRecognitionOptions) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();

  // Function to detect commands in transcript
  const detectCommand = useCallback((transcript: string) => {
    const lowerText = transcript.toLowerCase();
    
    // Check for each command type
    for (const [command, keywords] of Object.entries(COMMAND_KEYWORDS)) {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        onCommand?.(command);
        return;
      }
    }
  }, [onCommand]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognitionAPI) {
        recognitionRef.current = new SpeechRecognitionAPI();
        recognitionRef.current.continuous = continuous;
        recognitionRef.current.interimResults = interimResults;
        recognitionRef.current.lang = language;
        
        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          const lastResult = event.results[event.results.length - 1];
          const transcript = lastResult[0].transcript;
          
          if (lastResult.isFinal) {
            onTranscript(transcript);
            detectCommand(transcript);
          }
        };
        
        recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
          toast({
            title: "Speech Recognition Error",
            description: `Error: ${event.error}. Please try again.`,
            variant: "destructive"
          });
        };
        
        recognitionRef.current.onend = () => {
          if (isListening && recognitionRef.current) {
            recognitionRef.current.start();
          } else {
            setIsListening(false);
          }
        };
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isListening, onTranscript, toast, continuous, interimResults, language, detectCommand]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      toast({
        title: "Speech Recognition Not Available",
        description: "Your browser doesn't support speech recognition. Try using Chrome, Edge, or Safari.",
        variant: "destructive"
      });
      return;
    }
    
    setIsListening(true);
    recognitionRef.current.start();
    
    toast({
      title: "Voice Recognition Active",
      description: "Listening continuously. Click the mic again to stop.",
    });
  }, [toast]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    toast({
      title: "Voice Recognition Stopped",
      description: "Click the mic to start listening again.",
    });
  }, [toast]);

  const changeLanguage = useCallback((newLanguage: string) => {
    if (recognitionRef.current) {
      const wasListening = isListening;
      
      // Stop current recognition
      if (wasListening) {
        recognitionRef.current.stop();
      }
      
      // Update language
      recognitionRef.current.lang = newLanguage;
      
      // Restart if was listening
      if (wasListening) {
        setTimeout(() => {
          recognitionRef.current?.start();
        }, 100);
      }
      
      toast({
        title: "Language Changed",
        description: `Voice recognition language set to ${newLanguage}`,
      });
    }
  }, [isListening, toast]);

  return {
    isListening,
    startListening,
    stopListening,
    changeLanguage,
    supportedLanguages
  };
};
