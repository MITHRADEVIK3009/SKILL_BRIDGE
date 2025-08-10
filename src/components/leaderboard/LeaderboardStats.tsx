
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, TrendingUp, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface LeaderboardStatsProps {
  userRank: number | null;
  activeTab: string;
  totalUsers: number;
  isLoading: boolean;
}

const LeaderboardStats: React.FC<LeaderboardStatsProps> = ({
  userRank,
  activeTab,
  totalUsers,
  isLoading
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center">
            <div className="bg-amber-500 text-white p-3 rounded-full">
              <Trophy className="h-6 w-6" />
            </div>
            <h3 className="font-semibold mt-3 text-xl">Top Leaders</h3>
            <p className="text-muted-foreground text-sm">Highest scoring learners</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center">
            <div className="bg-green-500 text-white p-3 rounded-full">
              <TrendingUp className="h-6 w-6" />
            </div>
            <h3 className="font-semibold mt-3 text-xl">Your Rank</h3>
            {isLoading ? (
              <Skeleton className="h-5 w-32 mt-1" />
            ) : (
              <p className="text-muted-foreground text-sm">
                {userRank ? `#${userRank} on the ${activeTab} leaderboard` : "Not ranked yet"}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center">
            <div className="bg-blue-500 text-white p-3 rounded-full">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="font-semibold mt-3 text-xl">Total Learners</h3>
            {isLoading ? (
              <Skeleton className="h-5 w-32 mt-1" />
            ) : (
              <p className="text-muted-foreground text-sm">{totalUsers.toLocaleString()} active this week</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaderboardStats;
