
import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const DailyChallenge: React.FC = () => {
  const [showSolution, setShowSolution] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleComplete = () => {
    setCompleted(true);
  };

  return (
    <Card className="shadow-md border-t-4 border-t-skillbridge-indigo">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">Daily Challenge</CardTitle>
          <Badge className="bg-yellow-100 text-amber-800">+50 XP</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <h3 className="font-medium">Reverse a String</h3>
          <p className="text-sm">
            Write a function that takes a string as input and returns the string reversed.
          </p>
          <div className="bg-muted p-3 rounded-md text-sm font-mono">
            <p>Input: "hello"</p>
            <p>Output: "olleh"</p>
          </div>
          
          {showSolution && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold mb-2">Solution:</h4>
              <div className="bg-skillbridge-dark-purple text-white p-3 rounded-md text-sm font-mono">
                <pre>{`function reverseString(str) {
  return str.split('').reverse().join('');
}

// Test
console.log(reverseString('hello'));`}</pre>
              </div>
            </div>
          )}
          
          {completed && (
            <div className="flex items-center space-x-2 text-green-600 mt-2">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">Challenge completed!</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={() => setShowSolution(!showSolution)}
          disabled={completed}
        >
          {showSolution ? "Hide Solution" : "Show Solution"}
        </Button>
        <Button 
          className="gradient-bg" 
          onClick={handleComplete}
          disabled={completed}
        >
          <Trophy className="h-4 w-4 mr-2" /> Complete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DailyChallenge;
