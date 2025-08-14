
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import BridgyAI from "@/components/BridgyAI";
import { SidebarProvider, Sidebar, SidebarContent, SidebarMenu, SidebarMenuItem, 
  SidebarMenuButton, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarHeader,
  SidebarFooter, SidebarInset } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award, BookOpen, CheckCircle2, Code, FileText, Home, List, MessageCircle, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Sample course data - in a real app, this would come from an API
const courseData = {
  html: {
    title: "HTML & CSS Fundamentals",
    description: "Learn to build and style modern websites with responsive design",
    modules: [
      {
        title: "HTML Basics",
        lessons: [
          { title: "Introduction to HTML", completed: true },
          { title: "HTML Document Structure", completed: true },
          { title: "Text Elements", completed: true },
          { title: "Links and Navigation", completed: false },
          { title: "Images and Media", completed: false }
        ]
      },
      {
        title: "CSS Styling",
        lessons: [
          { title: "Introduction to CSS", completed: false },
          { title: "Selectors and Properties", completed: false },
          { title: "Box Model", completed: false },
          { title: "Layouts and Positioning", completed: false },
          { title: "Responsive Design", completed: false }
        ]
      },
      {
        title: "Advanced HTML",
        lessons: [
          { title: "Forms and Input Elements", completed: false },
          { title: "Tables", completed: false },
          { title: "Semantic HTML", completed: false },
          { title: "Accessibility", completed: false }
        ]
      }
    ]
  },
  python: {
    title: "Python Programming",
    description: "Learn Python for data science, web development, and automation",
    modules: [
      {
        title: "Python Basics",
        lessons: [
          { title: "Introduction to Python", completed: true },
          { title: "Variables and Data Types", completed: true },
          { title: "Control Flow", completed: false },
          { title: "Functions", completed: false },
          { title: "Error Handling", completed: false }
        ]
      },
      {
        title: "Data Structures",
        lessons: [
          { title: "Lists and Tuples", completed: false },
          { title: "Dictionaries", completed: false },
          { title: "Sets", completed: false },
          { title: "Working with Collections", completed: false }
        ]
      },
      {
        title: "Advanced Python",
        lessons: [
          { title: "Object-Oriented Programming", completed: false },
          { title: "Modules and Packages", completed: false },
          { title: "File Operations", completed: false },
          { title: "Working with APIs", completed: false }
        ]
      }
    ]
  },
  javascript: {
    title: "JavaScript Programming",
    description: "Master modern JavaScript for web development and DOM manipulation",
    modules: [
      {
        title: "JavaScript Basics",
        lessons: [
          { title: "Introduction to JavaScript", completed: true },
          { title: "Variables and Data Types", completed: true },
          { title: "Functions and Scope", completed: false },
          { title: "Arrays and Objects", completed: false }
        ]
      },
      {
        title: "DOM Manipulation",
        lessons: [
          { title: "Selecting Elements", completed: false },
          { title: "Modifying Content and Styles", completed: false },
          { title: "Events and Event Handling", completed: false },
          { title: "Creating and Removing Elements", completed: false }
        ]
      },
      {
        title: "Advanced JavaScript",
        lessons: [
          { title: "Asynchronous JavaScript", completed: false },
          { title: "Promises and Async/Await", completed: false },
          { title: "Fetch API and AJAX", completed: false },
          { title: "ES6+ Features", completed: false }
        ]
      }
    ]
  }
};

const Courses: React.FC = () => {
  const { courseId } = useParams<{ courseId?: string }>();
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();
  
  // Default to HTML course if no courseId is provided
  const selectedCourseId = courseId || "html";
  const course = courseData[selectedCourseId as keyof typeof courseData];
  
  if (!course) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold">Course not found</h2>
        <p className="mt-2">The requested course does not exist.</p>
      </div>
    );
  }
  
  // Calculate progress
  const totalLessons = course.modules.reduce(
    (total, module) => total + module.lessons.length, 
    0
  );
  
  const completedLessons = course.modules.reduce(
    (total, module) => total + module.lessons.filter(lesson => lesson.completed).length, 
    0
  );
  
  const progressPercentage = Math.round((completedLessons / totalLessons) * 100);
  
  const handleStartLesson = (moduleTitle: string, lessonTitle: string) => {
    toast({
      title: "Lesson Started",
      description: `You are now viewing ${lessonTitle} from ${moduleTitle}`,
    });
  };
  
  const handleContinueLearning = () => {
    // Find the first incomplete lesson
    let nextLesson = { moduleTitle: "", lessonTitle: "" };
    
    for (const module of course.modules) {
      const incompleteLesson = module.lessons.find(lesson => !lesson.completed);
      if (incompleteLesson) {
        nextLesson = { moduleTitle: module.title, lessonTitle: incompleteLesson.title };
        break;
      }
    }
    
    if (nextLesson.lessonTitle) {
      toast({
        title: "Continuing Learning",
        description: `Loading ${nextLesson.lessonTitle} from ${nextLesson.moduleTitle}`,
      });
    } else {
      toast({
        title: "Course Completed",
        description: "You have completed all lessons in this course!",
      });
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow flex">
        <SidebarProvider>
          <Sidebar className="border-r">
            <SidebarHeader className="py-4 px-6 border-b">
              <h2 className="text-lg font-semibold">Courses</h2>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <a href="/dashboard">
                          <Home className="h-4 w-4 mr-2" />
                          Dashboard
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton className="bg-accent" asChild>
                        <a href="/courses">
                          <BookOpen className="h-4 w-4 mr-2" />
                          All Courses
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
              
              <SidebarGroup className="mt-4">
                <SidebarGroupLabel>Available Courses</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {Object.entries(courseData).map(([id, courseInfo]) => (
                      <SidebarMenuItem key={id}>
                        <SidebarMenuButton className={selectedCourseId === id ? "bg-accent" : ""} asChild>
                          <a href={`/courses/${id}`}>
                            {courseInfo.title}
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          
          <SidebarInset>
            <main className="flex-1 p-6 overflow-auto">
              <div className="max-w-5xl mx-auto">
                <div className="mb-6">
                  <h1 className="text-3xl font-bold">{course.title}</h1>
                  <p className="text-muted-foreground mt-2">{course.description}</p>
                </div>
                
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-muted-foreground">Course Progress</div>
                    <div className="text-sm font-medium">{progressPercentage}%</div>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm">
                      <span className="font-medium">{completedLessons}</span>
                      <span className="text-muted-foreground"> of </span>
                      <span className="font-medium">{totalLessons}</span>
                      <span className="text-muted-foreground"> lessons completed</span>
                    </div>
                    <Button onClick={handleContinueLearning} className="gradient-bg">
                      <Play className="h-4 w-4 mr-2" />
                      Continue Learning
                    </Button>
                  </div>
                </div>
                
                <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
                  <TabsList className="grid grid-cols-4 mb-6">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                    <TabsTrigger value="resources">Resources</TabsTrigger>
                    <TabsTrigger value="discussion">Discussion</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview">
                    <Card>
                      <CardHeader>
                        <CardTitle>Course Overview</CardTitle>
                        <CardDescription>What you'll learn in this course</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h3 className="text-lg font-medium mb-2">Skills You'll Gain</h3>
                            <ul className="space-y-2">
                              {course.modules.map((module, idx) => (
                                <li key={idx} className="flex items-center gap-2">
                                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                                  <span>{module.title}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h3 className="text-lg font-medium mb-2">Course Information</h3>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Total Lessons:</span>
                                <span className="font-medium">{totalLessons}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Total Modules:</span>
                                <span className="font-medium">{course.modules.length}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Estimated Time:</span>
                                <span className="font-medium">{totalLessons * 20} minutes</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="curriculum">
                    <div className="space-y-6">
                      {course.modules.map((module, moduleIdx) => (
                        <Card key={moduleIdx}>
                          <CardHeader>
                            <CardTitle>{module.title}</CardTitle>
                            <CardDescription>{module.lessons.length} lessons</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-3">
                              {module.lessons.map((lesson, lessonIdx) => (
                                <li key={lessonIdx} className="p-3 rounded-md border flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    {lesson.completed ? (
                                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                                    ) : (
                                      <div className="h-5 w-5 border-2 rounded-full" />
                                    )}
                                    <span className={lesson.completed ? "line-through text-muted-foreground" : ""}>
                                      {lesson.title}
                                    </span>
                                  </div>
                                  <Button 
                                    variant={lesson.completed ? "outline" : "default"} 
                                    size="sm"
                                    onClick={() => handleStartLesson(module.title, lesson.title)}
                                  >
                                    {lesson.completed ? "Review" : "Start"}
                                  </Button>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="resources">
                    <Card>
                      <CardHeader>
                        <CardTitle>Learning Resources</CardTitle>
                        <CardDescription>Additional materials to help you master the course</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 border rounded-lg flex items-start">
                            <FileText className="h-8 w-8 mr-3 text-blue-500" />
                            <div>
                              <h4 className="font-medium">Course Handbook</h4>
                              <p className="text-sm text-muted-foreground mb-2">Complete course reference with examples</p>
                              <Button variant="outline" size="sm">Download PDF</Button>
                            </div>
                          </div>
                          <div className="p-4 border rounded-lg flex items-start">
                            <Code className="h-8 w-8 mr-3 text-purple-500" />
                            <div>
                              <h4 className="font-medium">Code Samples</h4>
                              <p className="text-sm text-muted-foreground mb-2">Ready-to-use code examples from lessons</p>
                              <Button variant="outline" size="sm">Access Repository</Button>
                            </div>
                          </div>
                          <div className="p-4 border rounded-lg flex items-start">
                            <List className="h-8 w-8 mr-3 text-green-500" />
                            <div>
                              <h4 className="font-medium">Practice Exercises</h4>
                              <p className="text-sm text-muted-foreground mb-2">Additional exercises to test your knowledge</p>
                              <Button variant="outline" size="sm">View Exercises</Button>
                            </div>
                          </div>
                          <div className="p-4 border rounded-lg flex items-start">
                            <Award className="h-8 w-8 mr-3 text-amber-500" />
                            <div>
                              <h4 className="font-medium">Certificate Requirements</h4>
                              <p className="text-sm text-muted-foreground mb-2">Tasks needed to earn your certificate</p>
                              <Button variant="outline" size="sm">View Requirements</Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="discussion">
                    <Card>
                      <CardHeader>
                        <CardTitle>Course Discussion</CardTitle>
                        <CardDescription>Discuss the course with other students</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="p-4 border rounded-lg">
                            <div className="flex justify-between items-start">
                              <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary/10 grid place-items-center">
                                  <span className="font-semibold text-sm">JD</span>
                                </div>
                                <div>
                                  <h5 className="font-medium">John Doe</h5>
                                  <p className="text-sm text-muted-foreground">2 days ago</p>
                                </div>
                              </div>
                              <Button variant="ghost" size="sm">Reply</Button>
                            </div>
                            <div className="mt-3">
                              <p className="text-sm">How do I complete the final exercise in Module 2? I'm stuck on the array manipulation part.</p>
                            </div>
                          </div>
                          <div className="p-4 border rounded-lg">
                            <div className="flex justify-between items-start">
                              <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary/10 grid place-items-center">
                                  <span className="font-semibold text-sm">AM</span>
                                </div>
                                <div>
                                  <h5 className="font-medium">Alex Mitchell</h5>
                                  <p className="text-sm text-muted-foreground">5 days ago</p>
                                </div>
                              </div>
                              <Button variant="ghost" size="sm">Reply</Button>
                            </div>
                            <div className="mt-3">
                              <p className="text-sm">Great course! I especially liked the practical examples in the third module.</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-6">
                          <h4 className="font-medium mb-2">Join the Conversation</h4>
                          <textarea 
                            placeholder="Write your question or comment..." 
                            className="w-full p-3 border rounded-md min-h-24 mb-2"
                          />
                          <div className="flex justify-end">
                            <Button>
                              <MessageCircle className="h-4 w-4 mr-2" />
                              Post Comment
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
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

export default Courses;
