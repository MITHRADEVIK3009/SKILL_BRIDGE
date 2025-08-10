
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, CheckSquare, Award, Flame } from "lucide-react";

const QuickStats: React.FC = () => {
  // In a real app, these would come from an API or context
  const stats = [
    { label: "Courses Enrolled", value: 3, icon: BookOpen, color: "bg-blue-500" },
    { label: "Lessons Completed", value: 24, icon: CheckSquare, color: "bg-green-500" },
    { label: "Badges Earned", value: 7, icon: Award, color: "bg-purple-500" },
    { label: "Current Streak", value: "5 Days", icon: Flame, color: "bg-orange-500" }
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center p-4 bg-accent rounded-lg">
              <div className={`p-3 rounded-full ${stat.color} text-white mb-2`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <span className="text-2xl font-bold">{stat.value}</span>
              <span className="text-xs text-muted-foreground text-center mt-1">{stat.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickStats;
