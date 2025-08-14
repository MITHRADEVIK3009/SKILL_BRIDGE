import React, { useState } from 'react';
import { Loader2, Globe } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import VoiceRecorder from './voice/VoiceRecorder';
import AudioPlayer from './voice/AudioPlayer';
import SuggestedQuestions from './voice/SuggestedQuestions';
import RelatedVideos from './voice/RelatedVideos';
import CommandMenu, { commandOptions } from './voice/CommandMenu';
import { useVoiceRecognition, supportedLanguages } from '@/hooks/useVoiceRecognition';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { findAnswer } from '@/utils/answerUtils';
import { useNavigate } from 'react-router-dom';
import { aiAgentService } from '@/services/aiAgentService';

// Sample data for suggested questions and related videos
const initialSuggestedQuestions = [
  "What is a variable in Python?",
  "How do I create a function in JavaScript?",
  "Explain HTML forms",
  "What are CSS flexbox properties?",
  "How do I use React hooks?"
];

const sampleRelatedVideos = [
  {
    title: "Python for Beginners - Full Course",
    channel: "freeCodeCamp",
    duration: "4:26:52",
    url: "https://www.youtube.com/watch?v=_uQrJ0TkZlc",
    description: "Learn Python in this full tutorial course for beginners. This course takes a practical approach to Python programming."
  },
  {
    title: "JavaScript Crash Course",
    channel: "Traversy Media",
    duration: "1:40:29",
    url: "https://www.youtube.com/watch?v=hdI2bqOjy3c",
    description: "This crash course focuses on the fundamental syntax and concepts of JavaScript."
  }
];

const VoiceAssistant: React.FC = () => {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>(initialSuggestedQuestions);
  const [relatedVideos, setRelatedVideos] = useState<Array<any>>(sampleRelatedVideos);
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem("elevenLabsApiKey") || "");
  const [showApiInput, setShowApiInput] = useState(!apiKey);
  const [showCommandMenu, setShowCommandMenu] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en-US');
  const { toast } = useToast();
  const navigate = useNavigate();

  const elevenLabsOptions = {
    apiKey,
    voiceId: "pFZP5JQG7iQjIQuC4Bku",
    model: "eleven_multilingual_v2",
  };

  const { isPlaying, playResponse } = useTextToSpeech(elevenLabsOptions);

  const handleTranscript = (transcript: string) => {
    setQuestion(transcript);
    setShowCommandMenu(false);
    handleGetAnswer(transcript);
  };

  const handleCommand = (command: string) => {
    setShowCommandMenu(false);
    processCommand(command);
  };

  const { isListening, startListening, stopListening, changeLanguage } = useVoiceRecognition({
    language: selectedLanguage,
    onTranscript: handleTranscript,
    onCommand: handleCommand
  });

  const processCommand = async (commandId: string) => {
    setIsLoading(true);
    
    try {
      switch(commandId) {
        case 'DOWNLOAD':
          const materials = await aiAgentService.getStudyMaterials('python');
          setResponse(`Found ${materials.length} study materials for Python. You can download them from the links below.`);
          break;
          
        case 'NOTES':
          const note = await aiAgentService.createNote({
            title: 'New Study Session',
            content: '',
            topic: 'python'
          });
          setResponse("I've created a new note for your study session. You can start taking notes now.");
          break;
          
        case 'TIMER':
          const session = await aiAgentService.startStudySession('python');
          setResponse("I've started tracking your study time. I'll notify you of your progress.");
          break;
          
        case 'PROGRESS':
          const progress = await aiAgentService.getUserProgress('current-user-id');
          setResponse(`Here are your learning statistics: ${JSON.stringify(progress)}`);
          break;
          
        case 'LEADERBOARD':
          navigate('/leaderboard');
          break;
          
        case 'TEST':
          const test = await aiAgentService.createCustomTest('python', 'intermediate');
          setResponse("I've created a custom Python test for you. Would you like to start now?");
          break;
          
        case 'SUGGEST':
          const suggestions = await aiAgentService.getSuggestions('current-user-id');
          setResponse(`Based on your progress, here are my recommendations: ${JSON.stringify(suggestions)}`);
          break;
          
        case 'QUESTION':
          setResponse("What coding question can I help you with today?");
          break;
          
        default:
          setResponse("I didn't recognize that command. Please try again.");
      }
      
      // Play the response if API key is available
      if (apiKey) {
        playResponse(response);
      }
    } catch (error) {
      console.error('Error processing command:', error);
      toast({
        title: "Error",
        description: "There was an error processing your request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to update suggested questions based on user's question
  const updateSuggestedQuestions = (questionText: string) => {
    if (questionText.toLowerCase().includes("python")) {
      setSuggestedQuestions([
        "How do I define a function in Python?",
        "What are Python list comprehensions?",
        "How do I use dictionaries in Python?",
        "Explain Python classes and objects",
        "What are Python decorators?"
      ]);
    } else if (questionText.toLowerCase().includes("javascript")) {
      setSuggestedQuestions([
        "What are JavaScript closures?",
        "How do I use promises in JavaScript?",
        "Explain async/await in JavaScript",
        "What is event bubbling in JavaScript?",
        "How do I manipulate the DOM with JavaScript?"
      ]);
    } else if (questionText.toLowerCase().includes("html") || questionText.toLowerCase().includes("css")) {
      setSuggestedQuestions([
        "How do I create responsive layouts with CSS?",
        "What are CSS Grid and Flexbox?",
        "How do I create forms in HTML?",
        "What are semantic HTML elements?",
        "How do I use CSS animations?"
      ]);
    } else {
      setSuggestedQuestions(initialSuggestedQuestions);
    }
  };

  // Function to update related videos based on user's question
  const updateRelatedVideos = (questionText: string) => {
    if (questionText.toLowerCase().includes("python")) {
      setRelatedVideos([
        {
          title: "Python for Beginners - Full Course",
          channel: "freeCodeCamp",
          duration: "4:26:52",
          url: "https://www.youtube.com/watch?v=_uQrJ0TkZlc",
          description: "Learn Python in this full tutorial course for beginners."
        },
        {
          title: "Python OOP Tutorial",
          channel: "Corey Schafer",
          duration: "1:09:23",
          url: "https://www.youtube.com/watch?v=ZDa-Z5JzLYM",
          description: "In-depth tutorial on object-oriented programming in Python."
        }
      ]);
    } else if (questionText.toLowerCase().includes("javascript")) {
      setRelatedVideos([
        {
          title: "JavaScript Crash Course",
          channel: "Traversy Media",
          duration: "1:40:29",
          url: "https://www.youtube.com/watch?v=hdI2bqOjy3c",
          description: "This crash course focuses on JavaScript fundamentals."
        },
        {
          title: "Async JavaScript - Callbacks, Promises, Async/Await",
          channel: "Dev Ed",
          duration: "37:48",
          url: "https://www.youtube.com/watch?v=_8gHHBlbDDA",
          description: "Learn asynchronous programming in JavaScript."
        }
      ]);
    } else {
      setRelatedVideos(sampleRelatedVideos);
    }
  };

  const handleGetAnswer = async (questionText: string) => {
    if (!questionText.trim()) {
      toast({
        title: "Empty Question",
        description: "Please ask a question first.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    const answer = findAnswer(questionText);
    setResponse(answer);
    
    // Update suggested questions and related videos
    updateSuggestedQuestions(questionText);
    updateRelatedVideos(questionText);
    
    setIsLoading(false);
    
    if (apiKey) {
      playResponse(answer);
    }
  };

  const handleAskSuggestion = (suggestedQuestion: string) => {
    setQuestion(suggestedQuestion);
    setShowCommandMenu(false);
    handleGetAnswer(suggestedQuestion);
  };

  const handleSaveApiKey = () => {
    if (apiKey.trim().length < 32) {
      toast({
        title: "Invalid API Key",
        description: "Please enter a valid ElevenLabs API key",
        variant: "destructive"
      });
      return;
    }
    
    setShowApiInput(false);
    localStorage.setItem("elevenLabsApiKey", apiKey);
    toast({
      title: "API Key Saved",
      description: "Your ElevenLabs API key has been saved",
    });
  };

  const handleSelectCommand = (commandId: string) => {
    const selectedCommand = commandOptions.find(cmd => cmd.id === commandId);
    if (selectedCommand) {
      setQuestion(`I want to ${selectedCommand.label}`);
      processCommand(commandId);
    }
  };

  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value);
    changeLanguage(value);
  };

  const handleReset = () => {
    setShowCommandMenu(true);
    setQuestion("");
    setResponse("");
  };

  return (
    <div className="bg-background rounded-lg p-6 shadow-lg border border-accent">
      <div className="flex justify-end mb-4">
        <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
          <SelectTrigger className="w-[180px]">
            <Globe className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Languages</SelectLabel>
              {supportedLanguages.map(lang => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      
      <VoiceRecorder
        isListening={isListening}
        onStartListening={startListening}
        onStopListening={stopListening}
      />

      {showApiInput && (
        <div className="mb-6 p-4 bg-accent/30 rounded-lg">
          <h4 className="font-medium mb-2">ElevenLabs Text-to-Speech</h4>
          <p className="text-sm text-muted-foreground mb-3">
            Enter your ElevenLabs API key for high-quality voice responses
          </p>
          <div className="flex gap-2">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="flex-1 px-3 py-2 border border-border rounded text-sm"
              placeholder="Enter your ElevenLabs API key"
            />
            <Button onClick={handleSaveApiKey} size="sm">
              Save
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Don't have an API key? <a href="https://elevenlabs.io/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Get one from ElevenLabs</a>
          </p>
        </div>
      )}

      {showCommandMenu && (
        <>
          <div className="text-center mb-4">
            <h3 className="text-lg font-medium">What would you like me to do?</h3>
            <p className="text-sm text-muted-foreground">Select an option or ask any question</p>
          </div>
          <CommandMenu onSelectCommand={handleSelectCommand} />
        </>
      )}

      {!showCommandMenu && !question && (
        <SuggestedQuestions
          questions={suggestedQuestions}
          onQuestionSelect={handleAskSuggestion}
        />
      )}

      {question && (
        <div className="mb-4">
          <h4 className="font-medium mb-2">Your Question:</h4>
          <div className="bg-accent p-3 rounded-lg">
            <p>{question}</p>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center my-6">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      )}

      {response && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium">Answer:</h4>
            <AudioPlayer
              text={response}
              isPlaying={isPlaying}
              onPlayPause={() => playResponse(response)}
            />
          </div>
          <div className="bg-card p-4 rounded-lg">
            <pre className="whitespace-pre-wrap text-sm font-mono">{response}</pre>
          </div>
        </div>
      )}

      {response && (
        <div className="mt-4 text-center">
          <Button variant="outline" onClick={handleReset}>
            Ask Another Question
          </Button>
        </div>
      )}

      <RelatedVideos videos={relatedVideos} />
    </div>
  );
};

export default VoiceAssistant;
