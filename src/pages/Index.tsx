import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, Brain, Trophy, Users, Star, ArrowRight, Github, Linkedin, MessageSquare } from "lucide-react";
import BridgyAI from "@/components/BridgyAI";

const Index = () => {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const features = [
    {
      icon: <Mic className="h-8 w-8 text-blue-600" />,
      title: "Voice-Powered Learning",
      description: "Interactive voice commands in 10+ languages with ElevenLabs integration",
      badge: "AI-Powered"
    },
    {
      icon: <Trophy className="h-8 w-8 text-yellow-600" />,
      title: "Advanced Gamification", 
      description: "15+ achievement badges, XP system, streaks, and competitive leaderboards",
      badge: "Engaging"
    },
    {
      icon: <Brain className="h-8 w-8 text-purple-600" />,
      title: "Smart Progress Tracking",
      description: "Real-time analytics, personalized recommendations, and learning insights",
      badge: "Intelligent"
    },
    {
      icon: <Users className="h-8 w-8 text-green-600" />,
      title: "Social Learning",
      description: "Compete with peers, share achievements, and learn together",
      badge: "Community"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              SkillBridge
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Get Started
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200">
            🚀 AI-Powered Learning Platform
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
            Transform Your Coding Education
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Master programming with voice-interactive learning, gamification, and AI assistance. 
            Join thousands of learners advancing their skills with SkillBridge.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/signup">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-3">
                Start Learning Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/voice-assistant">
              <Button size="lg" variant="outline" className="text-lg px-8 py-3">
                Try Voice Assistant
                <Mic className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
          <div className="flex items-center justify-center gap-6 mt-8 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span>4.9/5 Rating</span>
            </div>
            <div>10,000+ Students</div>
            <div>15+ Achievement Badges</div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Why Choose SkillBridge?</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the future of coding education with our innovative features designed for modern learners.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                hoveredFeature === index ? 'scale-105 shadow-xl' : ''
              }`}
              onMouseEnter={() => setHoveredFeature(index)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <CardHeader className="text-center">
                <div className="mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <Badge variant="secondary" className="mb-2 w-fit mx-auto">
                  {feature.badge}
                </Badge>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join SkillBridge today and transform the way you learn coding forever.
          </p>
          <Link to="/signup">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              Create Free Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">SkillBridge</span>
              </div>
              <p className="text-gray-400 text-sm">
                AI-powered learning platform for the next generation of developers.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/courses" className="hover:text-white transition-colors">Courses</Link></li>
                <li><Link to="/voice-assistant" className="hover:text-white transition-colors">Voice Assistant</Link></li>
                <li><Link to="/leaderboard" className="hover:text-white transition-colors">Leaderboard</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Account</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/login" className="hover:text-white transition-colors">Sign In</Link></li>
                <li><Link to="/signup" className="hover:text-white transition-colors">Sign Up</Link></li>
                <li><Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">My Account</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a 
                    href="https://www.linkedin.com/in/mithradevi-k-63b4642b5" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors flex items-center gap-2"
                  >
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a 
                    href="https://github.com/MITHRADEVIK3009" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors flex items-center gap-2"
                  >
                    <Github className="h-4 w-4" />
                    GitHub
                  </a>
                </li>
                <li>
                  <a 
                    href="https://medium.com/@mithradevi" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors flex items-center gap-2"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Medium
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 SkillBridge. Built with ❤️ for immersive coding education.</p>
          </div>
        </div>
      </footer>

      {/* Bridgy AI Assistant */}
      <BridgyAI />
    </div>
  );
};

export default Index;
