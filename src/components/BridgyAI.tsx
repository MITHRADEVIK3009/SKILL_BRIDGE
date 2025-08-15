import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, MessageSquare, X, User, Bot, Send, Languages } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { ragQuery, generateResponse } from '../services/ragService';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const BridgyAI: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi! I\'m Bridgy AI, your personal learning assistant. I can help you navigate SkillBridge, track your progress, or answer questions about coding. What would you like me to help you with today?',
      isUser: false,
      timestamp: new Date()
    }
  ]);

  const [textInput, setTextInput] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { playResponse: speak } = useTextToSpeech({
    voiceId: 'default',
    model: 'eleven_monolingual_v1'
  });
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const processUserQuery = async (query: string): Promise<string> => {
    const lowerQuery = query.toLowerCase();
    
    // Handle specific SkillBridge features
    if (lowerQuery.includes('progress') || lowerQuery.includes('stats')) {
      return 'You can check your progress by going to your Dashboard. There you\'ll see your current level, XP, completed courses, and earned badges. Would you like me to guide you there?';
    }
    
    if (lowerQuery.includes('course') || lowerQuery.includes('learn')) {
      return 'Great! Our Courses section has Python, JavaScript, and more. Each course has interactive lessons and coding challenges. You earn XP and badges as you progress!';
    }
    
    if (lowerQuery.includes('voice') || lowerQuery.includes('assistant')) {
      return 'You\'re already using the voice assistant! I can understand commands in multiple languages. Try asking me about your leaderboard position or daily challenges.';
    }
    
    if (lowerQuery.includes('badge') || lowerQuery.includes('achievement')) {
      return 'We have 15+ achievement badges including "First Steps", "Voice Explorer", "Code Master", and "Streak Keeper". Complete lessons, use voice commands, and maintain learning streaks to earn them!';
    }
    
    if (lowerQuery.includes('leaderboard') || lowerQuery.includes('ranking')) {
      return 'Check the Leaderboard to see your ranking! You earn points through lessons (+10), challenges (+20), daily login (+5), and voice interactions (+1). Compete with other learners!';
    }
    
    if (lowerQuery.includes('help') || lowerQuery.includes('how')) {
      return 'I can help you with: \n• Navigating courses and lessons\n• Tracking progress and badges\n• Understanding the point system\n• Using voice commands\n• Finding specific features\n\nWhat would you like to know?';
    }
    
    // Use RAG for programming and technical questions
    try {
      const searchResults = await ragQuery(query, 3);
      const response = generateResponse(query, searchResults);
      return response;
    } catch (error) {
      console.error('RAG query error:', error);
      return 'I\'m here to help you succeed with SkillBridge! You can ask me about courses, progress tracking, badges, voice commands, or programming concepts. What would you like to learn about?';
    }
  };

  const handleVoiceCommand = async (command: string) => {
    if (!command.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: command,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    const response = await processUserQuery(command);
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: response,
      isUser: false,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, aiMessage]);
    speak(response);
  };

  const { startListening, stopListening, isListening: voiceListening } = useVoiceRecognition({
    onTranscript: handleVoiceCommand,
    language: selectedLanguage
  });

  const toggleListening = () => {
    if (voiceListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const quickActions = [
    { text: 'Show my progress', action: () => handleVoiceCommand('Show my progress') },
    { text: 'Available courses', action: () => handleVoiceCommand('What courses are available') },
    { text: 'How to earn badges', action: () => handleVoiceCommand('How do I earn badges') },
    { text: 'Leaderboard position', action: () => handleVoiceCommand('What is my leaderboard position') }
  ];

  return (
    <>
      {/* Floating AI Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <Button
            onClick={() => setIsOpen(true)}
            className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
            size="sm"
          >
            <Bot className="h-6 w-6 text-white" />
          </Button>
        )}
      </div>

      {/* AI Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[90vw]">
          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                <span className="font-semibold">Bridgy AI</span>
                {voiceListening && (
                  <div className="flex gap-1">
                    <div className="w-1 h-3 bg-green-400 rounded animate-pulse"></div>
                    <div className="w-1 h-4 bg-green-400 rounded animate-pulse delay-75"></div>
                    <div className="w-1 h-2 bg-green-400 rounded animate-pulse delay-150"></div>
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6 p-0 hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Messages */}
            <div className="h-80 overflow-y-auto p-4 space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-2 ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!message.isUser && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                      message.isUser
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {message.text}
                  </div>
                  {message.isUser && (
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="p-3 border-t bg-gray-50">
              <div className="text-xs text-gray-600 mb-2">Quick actions:</div>
              <div className="flex flex-wrap gap-1">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={action.action}
                    className="text-xs h-6 px-2"
                  >
                    {action.text}
                  </Button>
                ))}
              </div>
            </div>

            {/* Text Input */}
            <div className="p-3 border-t">
              <div className="flex gap-2">
                <Input
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Type your question..."
                  className="flex-1 text-sm"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && textInput.trim()) {
                      handleVoiceCommand(textInput);
                      setTextInput('');
                    }
                  }}
                />
                <Button
                  size="sm"
                  onClick={() => {
                    if (textInput.trim()) {
                      handleVoiceCommand(textInput);
                      setTextInput('');
                    }
                  }}
                  disabled={!textInput.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Language & Voice Controls */}
            <div className="p-3 border-t">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Languages className="h-4 w-4 text-gray-600" />
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger className="w-32 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en-US">English</SelectItem>
                      <SelectItem value="es-ES">Spanish</SelectItem>
                      <SelectItem value="fr-FR">French</SelectItem>
                      <SelectItem value="de-DE">German</SelectItem>
                      <SelectItem value="hi-IN">Hindi</SelectItem>
                      <SelectItem value="zh-CN">Chinese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={toggleListening}
                  className={`h-10 w-10 rounded-full transition-all duration-300 ${
                    voiceListening
                      ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                  size="sm"
                >
                  {voiceListening ? (
                    <MicOff className="h-4 w-4 text-white" />
                  ) : (
                    <Mic className="h-4 w-4 text-white" />
                  )}
                </Button>
              </div>
              <div className="text-xs text-gray-500 text-center">
                {voiceListening ? 'Listening... Speak now!' : 'Click mic to speak or type above'}
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};

export default BridgyAI;
