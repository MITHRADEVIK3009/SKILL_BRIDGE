
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, Sidebar, SidebarContent, SidebarMenu, SidebarMenuItem, 
  SidebarMenuButton, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarHeader,
  SidebarFooter, SidebarInset } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Header from "@/components/Header";
import DailyChallenge from "@/components/DailyChallenge";
import VoiceAssistant from "@/components/VoiceAssistant";
import CodePlayground from "@/components/CodePlayground";
import MotivationalQuote from "@/components/MotivationalQuote";
import QuickStats from "@/components/QuickStats";
import ContinueLearning from "@/components/ContinueLearning";
import BridgyAI from "@/components/BridgyAI";
import { 
  Home, BookOpen, Trophy, Mic, Code2, Award, MessageSquare, 
  Settings as SettingsIcon, LogOut, ChevronRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Menu items
const MENU_ITEMS = [
  { title: "Home", icon: Home, active: true },
  { title: "My Courses", icon: BookOpen },
  { title: "Challenges", icon: Trophy },
  { title: "Ask with Voice", icon: Mic },
  { title: "Practice Code", icon: Code2 },
  { title: "Achievements", icon: Award },
  { title: "Community Forum", icon: MessageSquare },
  { title: "Settings", icon: SettingsIcon }
];

// Mock user progress data - in a real app, this would come from an API
const userProgress = {
  lastCourse: "javascript-basics",
  lastLesson: 4,
  nextLesson: 5,
  completedLessons: 24,
  completedChallenges: 12,
  codeSubmissions: 37
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState("Home");
  const [userName, setUserName] = useState("Alex");
  
  // Simulate checking authentication
  useEffect(() => {
    // For demonstration purposes, check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to view the dashboard",
        variant: "destructive"
      });
      navigate("/login");
    }
  }, [navigate, toast]);

  const handleMenuClick = (title: string) => {
    setActiveSection(title);
    
    toast({
      title: `${title} Selected`,
      description: `You are now viewing the ${title} section`,
    });

    // Special handling for Ask with Voice
    if (title === "Ask with Voice") {
      navigate("/voice-assistant");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
    navigate("/login");
  };

  const handleContinueLearning = () => {
    // In a real app, this would fetch the last course and lesson from user progress
    const lastCourse = userProgress.lastCourse;
    const lastLesson = userProgress.lastLesson;
    navigate(`/courses/${lastCourse}/lesson/${lastLesson}`);
    toast({
      title: "Resuming Course",
      description: "Taking you to your last lesson",
    });
  };

  const handleOpenPlayground = () => {
    setActiveSection("Practice Code");
    toast({
      title: "Code Playground Opened",
      description: "You can now practice coding",
    });
  };

  const handleStartLesson = () => {
    // In a real app, this would determine the next lesson dynamically
    const nextCourse = userProgress.lastCourse;
    const nextLesson = userProgress.nextLesson;
    navigate(`/courses/${nextCourse}/lesson/${nextLesson}`);
    toast({
      title: "Starting Next Lesson",
      description: "Loading your next lesson",
    });
  };

  const handleViewStats = () => {
    navigate("/progress");
    toast({
      title: "Progress Dashboard",
      description: "Viewing your learning statistics",
    });
  };

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Morning";
    if (hour < 18) return "Afternoon";
    return "Evening";
  };

  const renderContent = () => {
    switch (activeSection) {
      case "Home":
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-2 space-y-6">
              <div className="bg-card p-6 rounded-lg shadow border border-border">
                <h2 className="text-2xl font-semibold mb-2">Good {getTimeOfDay()}, {userName} 👋</h2>
                <MotivationalQuote />
              </div>
              <QuickStats />
              <ContinueLearning onResume={handleContinueLearning} />
            </div>
            <div className="space-y-6">
              <DailyChallenge />
              <div className="bg-card p-6 rounded-lg shadow border border-border">
                <h3 className="text-lg font-semibold mb-4">Need Help?</h3>
                <Button className="w-full" onClick={() => navigate('/voice-assistant')}>
                  <Mic className="mr-2 h-4 w-4" />
                  Ask Voice Assistant
                </Button>
              </div>
            </div>
          </div>
        );
      case "Practice Code":
        return <CodePlayground />;
      case "Achievements":
        return <Achievements />;
      case "Community Forum":
        return <CommunityForum />;
      case "Settings":
        return <SettingsPage />;
      default:
        return <div>Select a menu item</div>;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow flex">
        <SidebarProvider defaultOpen={true}>
          <Sidebar>
            <SidebarHeader className="flex flex-col items-center py-6">
              <Avatar className="h-16 w-16">
                <AvatarImage src="https://github.com/shadcn.png" alt={userName} />
                <AvatarFallback>{userName.slice(0,2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="mt-2 text-center">
                <p className="font-medium">{userName}</p>
                <p className="text-sm text-muted-foreground">Free Plan</p>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {MENU_ITEMS.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                          isActive={activeSection === item.title}
                          onClick={() => handleMenuClick(item.title)}
                        >
                          <item.icon className="mr-2" />
                          <span>{item.title}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-100"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </SidebarFooter>
          </Sidebar>
          
          <SidebarInset>
            <main className="flex-1 p-6 overflow-auto">
              <div className="max-w-6xl mx-auto">
                {renderContent()}
              </div>
            </main>
          </SidebarInset>
        </SidebarProvider>
      </div>
      {/* Bridgy AI Assistant */}
      <BridgyAI />
    </div>
  );
};

// Placeholder components for each section
const MyCourses = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold">My Courses</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {['HTML & CSS', 'JavaScript Basics', 'Python Fundamentals', 'Java Programming', 'Node.js Backend', 'MySQL Database'].map((course) => (
        <CourseCard key={course} title={course} progress={Math.floor(Math.random() * 100)} />
      ))}
    </div>
  </div>
);

const CourseCard = ({ title, progress }: { title: string, progress: number }) => (
  <div className="bg-card rounded-lg shadow border border-border overflow-hidden hover:shadow-md transition-shadow">
    <div className="h-32 bg-gradient-to-r from-skillbridge-indigo to-skillbridge-blue"></div>
    <div className="p-4">
      <h3 className="font-semibold text-lg">{title}</h3>
      <div className="mt-3 mb-2">
        <div className="h-2 w-full bg-muted rounded-full">
          <div 
            className="h-2 rounded-full bg-gradient-to-r from-skillbridge-indigo to-skillbridge-blue" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      <div className="flex justify-between items-center mt-2">
        <span className="text-sm text-muted-foreground">{progress}% complete</span>
        <Button variant="ghost" size="sm">
          Continue <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  </div>
);

const Challenges = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold">Coding Challenges</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <DailyChallenge />
      <div className="bg-card rounded-lg shadow border border-border p-6">
        <h2 className="text-xl font-semibold mb-4">Weekly Challenge</h2>
        <div className="bg-accent p-4 rounded-md">
          <h3 className="font-medium">Build a To-Do List App</h3>
          <p className="text-sm mt-2">Create a simple to-do list application with add, delete, and mark-as-complete functionality.</p>
          <div className="mt-4">
            <span className="text-sm text-muted-foreground block">Deadline: Sunday, 11:59 PM</span>
            <span className="text-sm font-medium text-amber-600 block mt-1">+200 XP Reward</span>
          </div>
        </div>
        <Button className="mt-4 w-full">Start Challenge</Button>
      </div>
    </div>
  </div>
);

const Achievements = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold">Your Achievements</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-card rounded-lg shadow border border-border p-6">
        <h2 className="text-xl font-semibold mb-4">Your Badges</h2>
        <div className="grid grid-cols-3 gap-4">
          {['HTML Hero', 'Code Streak', 'Problem Solver', 'Early Bird', 'Helper', 'Quiz Master'].map((badge) => (
            <div key={badge} className="flex flex-col items-center">
              <div className="h-16 w-16 rounded-full bg-gradient-to-r from-skillbridge-indigo to-skillbridge-blue flex items-center justify-center text-white text-xl font-bold">
                {badge.charAt(0)}
              </div>
              <span className="text-xs mt-2 text-center">{badge}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-card rounded-lg shadow border border-border p-6">
        <h2 className="text-xl font-semibold mb-4">Certificates</h2>
        <div className="space-y-4">
          {['HTML & CSS Basics', 'JavaScript Fundamentals'].map((cert) => (
            <div key={cert} className="flex items-center justify-between p-3 bg-accent rounded-md">
              <div>
                <h3 className="font-medium">{cert}</h3>
                <span className="text-xs text-muted-foreground">Completed on Apr 10, 2023</span>
              </div>
              <Button variant="outline" size="sm">View</Button>
            </div>
          ))}
          <div className="flex items-center justify-between p-3 bg-muted rounded-md opacity-60">
            <div>
              <h3 className="font-medium">Python Fundamentals</h3>
              <span className="text-xs text-muted-foreground">75% completed - Keep going!</span>
            </div>
            <Button variant="outline" size="sm" disabled>Locked</Button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const CommunityForum = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold">Community Forum</h1>
    <div className="bg-card rounded-lg shadow border border-border p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Recent Discussions</h2>
        <Button>New Post</Button>
      </div>
      <div className="space-y-4">
        {[
          {title: "How to center a div?", author: "CSSNewbie", replies: 24, category: "HTML & CSS"},
          {title: "Understanding async/await in JS", author: "JSLearner", replies: 15, category: "JavaScript"},
          {title: "Python vs Java for beginners?", author: "CodeExplorer", replies: 32, category: "General"}
        ].map((post) => (
          <div key={post.title} className="p-4 border border-border rounded-md hover:bg-accent/50 transition-colors cursor-pointer">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium">{post.title}</h3>
              <span className="text-xs bg-skillbridge-indigo/10 text-skillbridge-indigo px-2 py-1 rounded">{post.category}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Posted by {post.author}</span>
              <span>{post.replies} replies</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 text-center">
        <Button variant="link">View All Discussions</Button>
      </div>
    </div>
  </div>
);

const SettingsPage = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold">Settings</h1>
    <div className="bg-card rounded-lg shadow border border-border p-6">
      <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1">Display Name</label>
          <input type="text" defaultValue="Alex" className="w-full p-2 border border-border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email Address</label>
          <input type="email" defaultValue="alex@example.com" className="w-full p-2 border border-border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Profile Picture</label>
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src="https://github.com/shadcn.png" alt="Alex" />
              <AvatarFallback>AL</AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm">Change</Button>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <Button>Save Changes</Button>
      </div>
    </div>
  </div>
);

export default Dashboard;
