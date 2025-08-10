import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LearningPath from "@/components/LearningPath";
import DashboardFeature from "@/components/DashboardFeature";
import VoiceAssistant from "@/components/VoiceAssistant";
import CodePlayground from "@/components/CodePlayground";
import DailyChallenge from "@/components/DailyChallenge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Code2,
  Lightbulb,
  Mic,
  BarChart3,
  Trophy,
  ArrowRight,
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<"splash" | "paths" | "dashboard">("splash");

  const handleGetStarted = () => {
    setCurrentView("paths");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStartLearning = () => {
    setCurrentView("dashboard");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleTryVoiceAssistant = () => {
    // Navigate to a dedicated Voice Assistant page
    navigate("/voice-assistant");
  };

  const renderSplashScreen = () => (
    <>
      <section className="bg-gradient-to-b from-background to-accent py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 gradient-text animate-fade-in">
                Master Coding Skills with Voice Technology
              </h1>
              <p className="text-lg mb-8 text-muted-foreground animate-fade-in" style={{ animationDelay: "0.2s" }}>
                Learn to code through interactive lessons, voice assistance, and daily challenges
                that adapt to your skill level.
              </p>
              <div className="flex flex-wrap gap-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
                <Button size="lg" className="gradient-bg" onClick={handleGetStarted}>
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" onClick={handleTryVoiceAssistant}>
                  <Mic className="mr-2 h-5 w-5" />
                  Try Voice Assistant
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center animate-fade-in" style={{ animationDelay: "0.6s" }}>
              <div className="relative">
                <div className="w-72 h-72 md:w-96 md:h-96 bg-primary/10 rounded-full flex items-center justify-center animate-pulse-glow">
                  <div className="w-60 h-60 md:w-80 md:h-80 bg-primary/20 rounded-full flex items-center justify-center">
                    <div className="w-48 h-48 md:w-64 md:h-64 gradient-bg rounded-full flex items-center justify-center shadow-glow-indigo animate-float">
                      <Code2 className="h-20 w-20 md:h-24 md:w-24 text-white" />
                    </div>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-16 h-16 bg-skillbridge-blue rounded-full shadow-glow-blue animate-float" style={{ animationDelay: "1s" }}></div>
                <div className="absolute bottom-8 left-0 w-12 h-12 bg-skillbridge-purple rounded-full shadow-glow-indigo animate-float" style={{ animationDelay: "1.5s" }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose SkillBridge?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform combines modern learning techniques with innovative technology
              to create an engaging educational experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg shadow-md border border-border">
              <div className="mb-4 text-primary">
                <Mic className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Voice Assistant</h3>
              <p className="text-muted-foreground">
                Ask questions naturally and get instant voice responses to help you learn faster.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-md border border-border">
              <div className="mb-4 text-primary">
                <BookOpen className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Structured Learning</h3>
              <p className="text-muted-foreground">
                Follow a clear path from basics to advanced concepts with bite-sized lessons.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-md border border-border">
              <div className="mb-4 text-primary">
                <Code2 className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Interactive Coding</h3>
              <p className="text-muted-foreground">
                Practice what you learn immediately with our built-in code playground.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-md border border-border">
              <div className="mb-4 text-primary">
                <Lightbulb className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Daily Challenges</h3>
              <p className="text-muted-foreground">
                Sharpen your skills with new problems every day to keep you motivated.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-md border border-border">
              <div className="mb-4 text-primary">
                <BarChart3 className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Progress Tracking</h3>
              <p className="text-muted-foreground">
                Monitor your growth with detailed statistics and achievement badges.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-md border border-border">
              <div className="mb-4 text-primary">
                <Trophy className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Gamified Experience</h3>
              <p className="text-muted-foreground">
                Earn points, climb the leaderboard, and unlock rewards as you learn.
              </p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Button size="lg" className="gradient-bg" onClick={handleGetStarted}>
              Start Your Learning Journey
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 bg-accent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Join Thousands of Successful Developers</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our graduates have landed jobs at top tech companies worldwide.
              Start your coding journey today!
            </p>
          </div>
          
          <div className="flex justify-center">
            <Button size="lg" className="gradient-bg" onClick={handleGetStarted}>
              Get Started for Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </>
  );

  const renderLearningPaths = () => (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Choose Your Learning Path</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Select the programming language or technology you want to master.
            Each path is designed to take you from beginner to advanced.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <LearningPath
            title="HTML & CSS"
            description="Learn to build and style modern websites with responsive design."
            difficulty="Beginner"
            lessons={24}
            icon="html"
            onClick={handleStartLearning}
          />
          
          <LearningPath
            title="Java Programming"
            description="Master object-oriented programming with Java for versatile applications."
            difficulty="Intermediate"
            lessons={36}
            icon="java"
            onClick={handleStartLearning}
          />
          
          <LearningPath
            title="PHP Development"
            description="Build dynamic websites and server-side applications with PHP."
            difficulty="Intermediate"
            lessons={28}
            icon="php"
            onClick={handleStartLearning}
          />
          
          <LearningPath
            title="Python Mastery"
            description="Learn Python for data science, web development, and automation."
            difficulty="Beginner"
            lessons={32}
            icon="python"
            onClick={handleStartLearning}
          />
          
          <LearningPath
            title="Node.js Backend"
            description="Create scalable web applications with JavaScript on the server."
            difficulty="Advanced"
            lessons={30}
            icon="node"
            onClick={handleStartLearning}
          />
          
          <LearningPath
            title="MySQL & Databases"
            description="Design and optimize databases for your applications."
            difficulty="Intermediate"
            lessons={22}
            icon="mysql"
            onClick={handleStartLearning}
          />
        </div>
      </div>
    </section>
  );

  const renderDashboard = () => (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Welcome to Your Learning Dashboard</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Track your progress, take challenges, and continue your learning journey.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <DashboardFeature
                title="Continue Learning"
                description="Resume from where you left off"
                icon={BookOpen}
                buttonText="Resume Course"
                onClick={() => console.log("Resume course")}
              />
              
              <DashboardFeature
                title="Practice Coding"
                description="Write and test code in our playground"
                icon={Code2}
                buttonText="Open Playground"
                onClick={() => console.log("Open playground")}
              />
              
              <DashboardFeature
                title="Next Lesson"
                description="Introduction to Functions"
                icon={Lightbulb}
                buttonText="Start Lesson"
                onClick={() => console.log("Start lesson")}
              />
              
              <DashboardFeature
                title="Your Progress"
                description="View your learning statistics"
                icon={BarChart3}
                buttonText="View Stats"
                onClick={() => console.log("View stats")}
              />
            </div>
            
            <div className="mb-8">
              <CodePlayground />
            </div>
          </div>
          
          <div className="space-y-8">
            <DailyChallenge />
            <VoiceAssistant />
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {currentView === "splash" && renderSplashScreen()}
        {currentView === "paths" && renderLearningPaths()}
        {currentView === "dashboard" && renderDashboard()}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
