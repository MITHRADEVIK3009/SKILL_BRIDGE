
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Code2, FileCode, Database, Terminal, Globe, Server } from "lucide-react";

interface LearningPathProps {
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  lessons: number;
  icon: "html" | "java" | "php" | "python" | "node" | "mysql";
  onClick: () => void;
}

const LearningPath: React.FC<LearningPathProps> = ({
  title,
  description,
  difficulty,
  lessons,
  icon,
  onClick,
}) => {
  const getIcon = () => {
    switch (icon) {
      case "html":
        return <Globe className="h-12 w-12 text-skillbridge-indigo" />;
      case "java":
        return <FileCode className="h-12 w-12 text-skillbridge-blue" />;
      case "php":
        return <Code2 className="h-12 w-12 text-purple-500" />;
      case "python":
        return <Terminal className="h-12 w-12 text-green-500" />;
      case "node":
        return <Server className="h-12 w-12 text-orange-500" />;
      case "mysql":
        return <Database className="h-12 w-12 text-sky-500" />;
      default:
        return <Code2 className="h-12 w-12 text-skillbridge-indigo" />;
    }
  };

  const getDifficultyColor = () => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800";
      case "Intermediate":
        return "bg-blue-100 text-blue-800";
      case "Advanced":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="card-hover w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>{getIcon()}</div>
          <Badge className={getDifficultyColor()}>{difficulty}</Badge>
        </div>
        <CardTitle className="text-xl mt-4">{title}</CardTitle>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">
          <span>{lessons} lessons</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onClick} className="w-full gradient-bg">
          Start Learning
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LearningPath;
