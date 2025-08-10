
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, RotateCcw } from "lucide-react";

const CodePlayground: React.FC = () => {
  const [code, setCode] = useState(`# Write your Python code here
def hello_world():
    return "Hello, SkillBridge!"

# Call the function
print(hello_world())`);
  const [output, setOutput] = useState("");

  const handleRunCode = () => {
    // This is a simulated execution - in a real app we would need a backend
    setOutput("Output:\n> Hello, SkillBridge!");
  };

  const handleResetCode = () => {
    setCode(`# Write your Python code here
def hello_world():
    return "Hello, SkillBridge!"

# Call the function
print(hello_world())`);
    setOutput("");
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Code Playground</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="bg-skillbridge-dark-purple rounded-t-md p-2 flex justify-between items-center">
            <span className="text-white text-sm font-mono">Python</span>
            <div className="flex space-x-1">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
          </div>
          <textarea
            className="w-full h-64 p-4 bg-[#1e1e2e] text-white font-mono text-sm rounded-b-md focus:outline-none focus:ring-1 focus:ring-primary"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>
        {output && (
          <div className="mt-4">
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
              <pre className="whitespace-pre-wrap text-sm font-mono">{output}</pre>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={handleResetCode} variant="outline">
          <RotateCcw className="h-4 w-4 mr-2" /> Reset
        </Button>
        <Button onClick={handleRunCode} className="gradient-bg">
          <Play className="h-4 w-4 mr-2" /> Run Code
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CodePlayground;
