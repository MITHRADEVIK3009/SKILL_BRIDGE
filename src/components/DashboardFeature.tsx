
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DashboardFeatureProps {
  title: string;
  description: string;
  icon: LucideIcon;
  buttonText: string;
  onClick: () => void;
  className?: string;
}

const DashboardFeature: React.FC<DashboardFeatureProps> = ({
  title,
  description,
  icon: Icon,
  buttonText,
  onClick,
  className = "",
}) => {
  const { toast } = useToast();
  
  const handleClick = () => {
    onClick();
    toast({
      title: `${title}`,
      description: `Opening ${title.toLowerCase()}...`,
      duration: 3000,
    });
  };

  return (
    <Card className={`card-hover ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-full bg-accent">
            <Icon className="h-8 w-8 text-primary" />
          </div>
        </div>
        <CardTitle className="text-center text-lg">{title}</CardTitle>
        <CardDescription className="text-center">{description}</CardDescription>
      </CardHeader>
      <CardContent className="text-center pb-2">
        <p className="text-sm text-muted-foreground"></p>
      </CardContent>
      <CardFooter>
        <Button onClick={handleClick} variant="outline" className="w-full hover:bg-accent hover:text-primary transition-colors">
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DashboardFeature;
