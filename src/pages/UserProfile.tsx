
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Award, Trophy, Calendar, BookOpen, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import BridgyAI from "@/components/BridgyAI";

// Sample data for different users
const userProfiles = {
  "1": {
    id: 1,
    name: "Sarah Johnson",
    points: 38950,
    streak: 18,
    rank: 1,
    avatar: "https://github.com/shadcn.png",
    completedCourses: [
      "HTML & CSS Basics",
      "JavaScript Fundamentals",
      "Responsive Web Design"
    ],
    joinDate: "2023-01-15",
    totalChallenges: 147,
    badges: [
      { name: "First Step", date: "2023-01-16" },
      { name: "Code Streak", date: "2023-02-03" },
      { name: "Problem Solver", date: "2023-03-12" }
    ]
  },
  "2": {
    id: 2,
    name: "Michael Chen",
    points: 35780,
    streak: 12,
    rank: 2,
    avatar: "",
    completedCourses: [
      "Python Basics",
      "Data Structures",
      "Algorithm Design"
    ],
    joinDate: "2023-02-10",
    totalChallenges: 128,
    badges: [
      { name: "Fast Learner", date: "2023-02-15" },
      { name: "Python Expert", date: "2023-03-20" },
      { name: "Algorithm Master", date: "2023-04-05" }
    ]
  },
  "3": {
    id: 3,
    name: "Emily Rodriguez",
    points: 32450,
    streak: 15,
    rank: 3,
    avatar: "",
    completedCourses: [
      "JavaScript Advanced",
      "React Fundamentals",
      "Building APIs"
    ],
    joinDate: "2023-01-20",
    totalChallenges: 135,
    badges: [
      { name: "Frontend Specialist", date: "2023-02-01" },
      { name: "React Pro", date: "2023-03-15" },
      { name: "Challenge Champion", date: "2023-04-10" }
    ]
  },
  "4": {
    id: 4,
    name: "David Kim",
    points: 31200,
    streak: 10,
    rank: 4,
    avatar: "",
    completedCourses: [
      "Java Fundamentals",
      "Object-Oriented Programming",
      "Mobile Development"
    ],
    joinDate: "2023-02-05",
    totalChallenges: 118,
    badges: [
      { name: "Mobile Developer", date: "2023-03-01" },
      { name: "Java Expert", date: "2023-04-10" },
      { name: "Consistent Learner", date: "2023-05-15" }
    ]
  }
};

interface UserData {
  id: number;
  name: string;
  points: number;
  streak: number;
  rank: number;
  avatar: string;
  completedCourses: string[];
  joinDate: string;
  totalChallenges: number;
  badges: { name: string; date: string }[];
}

const UserProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate API fetch with a small delay
    setLoading(true);
    setTimeout(() => {
      // Get user data based on userId from our mock database
      const id = userId || "1";
      const user = userProfiles[id as keyof typeof userProfiles];
      
      if (user) {
        setUserData(user);
        toast({
          title: "Profile Loaded",
          description: `Viewing ${user.name}'s profile`,
        });
      } else {
        toast({
          title: "User Not Found",
          description: "This user profile doesn't exist",
          variant: "destructive"
        });
      }
      
      setLoading(false);
    }, 800);
  }, [userId, toast]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow p-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold">User Not Found</h2>
              <p className="text-muted-foreground mt-2">The user profile you're looking for doesn't exist.</p>
              <Button onClick={handleBack} variant="outline" className="mt-4">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Leaderboard
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-4">
            <Button 
              onClick={handleBack} 
              variant="ghost" 
              className="mb-4 flex items-center text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Leaderboard
            </Button>
          </div>
          
          <div className="mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  <div className="flex flex-col items-center">
                    <Avatar className="h-32 w-32">
                      {userData.avatar ? (
                        <AvatarImage src={userData.avatar} alt={userData.name} />
                      ) : null}
                      <AvatarFallback className="text-2xl bg-gradient-to-r from-primary to-primary/70 text-white">
                        {getInitials(userData.name)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="mt-4 flex flex-col items-center">
                      <Badge variant="outline" className="mb-2">
                        <Trophy className="h-3 w-3 mr-1" />
                        Rank #{userData.rank}
                      </Badge>
                      <div className="flex items-center gap-1 text-amber-500">
                        <Award className="h-4 w-4" />
                        <span>{userData.points.toLocaleString()} XP</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 text-center md:text-left">
                    <h1 className="text-3xl font-bold">{userData.name}</h1>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                      <div className="bg-accent/30 p-4 rounded-lg">
                        <div className="font-semibold">{userData.streak} days</div>
                        <div className="text-sm text-muted-foreground">Current streak</div>
                      </div>
                      
                      <div className="bg-accent/30 p-4 rounded-lg">
                        <div className="font-semibold">{userData.totalChallenges}</div>
                        <div className="text-sm text-muted-foreground">Challenges completed</div>
                      </div>
                      
                      <div className="bg-accent/30 p-4 rounded-lg">
                        <div className="font-semibold">{new Date(userData.joinDate).toLocaleDateString()}</div>
                        <div className="text-sm text-muted-foreground">Member since</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Completed Courses
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userData.completedCourses.length > 0 ? (
                  <div className="space-y-3">
                    {userData.completedCourses.map((course, index) => (
                      <div key={index} className="bg-accent/30 p-3 rounded-md">
                        <div className="font-medium">{course}</div>
                        <div className="text-xs text-muted-foreground mt-1">Completed</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No completed courses yet
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="mr-2 h-5 w-5" />
                  Badges
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userData.badges.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {userData.badges.map((badge, index) => (
                      <div key={index} className="border border-border rounded-md p-3 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary to-primary/70 flex items-center justify-center text-white font-bold">
                          {badge.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium">{badge.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(badge.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No badges earned yet
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
      <BridgyAI />
    </div>
  );
};

export default UserProfile;
