
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface ContinueLearningProps {
  onResume?: () => void;
}

const ContinueLearning: React.FC<ContinueLearningProps> = ({ onResume }) => {
  // In a real app, this would come from an API or global state
  const lastLesson = {
    courseName: "JavaScript Basics",
    lessonName: "Functions and Scope",
    progress: 65,
    moduleNumber: 3,
    lessonNumber: 4
  };

  const handleResume = () => {
    if (onResume) {
      onResume();
    }
  };

  const handleViewCourse = () => {
    // In a real app, this would navigate to the course page
    window.location.href = `/courses/javascript-basics`;
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold">Continue Learning</h2>
          <span className="text-sm text-muted-foreground">Module {lastLesson.moduleNumber}, Lesson {lastLesson.lessonNumber}</span>
        </div>
        
        <div className="mb-6">
          <h3 className="font-medium text-lg">{lastLesson.courseName}</h3>
          <p className="text-muted-foreground">{lastLesson.lessonName}</p>
          
          <div className="mt-3 mb-2">
            <div className="h-2 w-full bg-muted rounded-full">
              <div 
                className="h-2 rounded-full bg-gradient-to-r from-skillbridge-indigo to-skillbridge-blue" 
                style={{ width: `${lastLesson.progress}%` }}
              ></div>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">{lastLesson.progress}% complete</div>
        </div>
        
        <div className="flex space-x-3">
          <Button className="flex-1 gradient-bg" onClick={handleResume}>
            Resume Learning
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={handleViewCourse}>View Course</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContinueLearning;
