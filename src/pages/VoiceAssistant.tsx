
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BridgyAI from "@/components/BridgyAI";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, BookOpen, Clock, Trophy, BarChart3, TestTube, HelpCircle, Lightbulb, Bot } from 'lucide-react';

const VoiceAssistant = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Request microphone permission when page loads
    const requestMicPermission = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        toast({
          title: "Microphone Access Granted",
          description: "You can now use the voice assistant.",
        });
      } catch (error) {
        console.error("Microphone permission denied:", error);
        toast({
          title: "Microphone Access Denied",
          description: "Voice assistant requires microphone permission to work properly.",
          variant: "destructive"
        });
      }
    };
    
    requestMicPermission();
    
    // Add page view analytics
    console.log("Voice Assistant page viewed");
  }, [toast]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">SkillBridge Assistant</h1>
          <p className="text-muted-foreground mb-8 max-w-3xl">
            Your smart buddy to guide, organize, and supercharge your coding journey! Ask questions or use voice commands to access various features.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="p-8 text-center">
                <Bot className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-4">Meet Bridgy AI</h2>
                <p className="text-muted-foreground mb-6">
                  Your personal learning assistant is now available as a floating widget! 
                  Look for the blue bot icon in the bottom-right corner of your screen.
                </p>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Bridgy AI can help you with:
                  </p>
                  <ul className="text-left max-w-md mx-auto space-y-2">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                      Track your learning progress
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                      Navigate courses and lessons
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                      Explain coding concepts
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                      Check leaderboard rankings
                    </li>
                  </ul>
                  <Button className="mt-4" onClick={() => {
                    // This will be handled by the floating Bridgy AI component
                    toast({
                      title: "Look for Bridgy AI!",
                      description: "Check the bottom-right corner for the blue bot icon.",
                    });
                  }}>
                    <Bot className="h-4 w-4 mr-2" />
                    Find Bridgy AI
                  </Button>
                </div>
              </Card>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Voice Commands</CardTitle>
                  <CardDescription>Try saying these phrases to activate features</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <BookOpen className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <div>
                        <span className="font-medium">"Download study materials"</span>
                        <p className="text-xs text-muted-foreground">Get resources on any topic</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Clock className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <div>
                        <span className="font-medium">"Track my study time"</span>
                        <p className="text-xs text-muted-foreground">Start a session timer</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <BarChart3 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <div>
                        <span className="font-medium">"Show my progress"</span>
                        <p className="text-xs text-muted-foreground">View learning analytics</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Trophy className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <div>
                        <span className="font-medium">"Show leaderboard"</span>
                        <p className="text-xs text-muted-foreground">Check your ranking</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <TestTube className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <div>
                        <span className="font-medium">"Create a custom test"</span>
                        <p className="text-xs text-muted-foreground">Generate personalized quizzes</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <HelpCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <div>
                        <span className="font-medium">"I have a question..."</span>
                        <p className="text-xs text-muted-foreground">Ask about any coding topic</p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Tips for Best Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                      Speak clearly and at a moderate pace
                    </li>
                    <li className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                      Use command keywords near the beginning of your sentence
                    </li>
                    <li className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                      Reduce background noise for better recognition
                    </li>
                    <li className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                      Try a different browser if you experience issues
                    </li>
                    <li className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                      For complex questions, be specific about what you need
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      {/* Bridgy AI Assistant */}
      <BridgyAI />
    </div>
  );
};

export default VoiceAssistant;
