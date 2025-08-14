
import React, { useState } from "react";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

// Components
import LeaderboardStats from "@/components/leaderboard/LeaderboardStats";
import LeaderboardTable from "@/components/leaderboard/LeaderboardTable";
import UpdateInfo from "@/components/leaderboard/UpdateInfo";

// Hooks
import { useLeaderboard } from "@/hooks/useLeaderboard";

const Leaderboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"weekly" | "monthly" | "allTime">("weekly");
  
  const {
    leaderboardData,
    userRank,
    totalUsers,
    lastUpdated,
    nextUpdate,
    isLoading,
    isError,
    refetch
  } = useLeaderboard(activeTab);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow p-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Leaderboard</h1>
            <p className="text-muted-foreground mt-2">Compare your progress with other learners and climb the ranks</p>
          </div>
          
          <LeaderboardStats 
            userRank={userRank} 
            activeTab={activeTab} 
            totalUsers={totalUsers}
            isLoading={isLoading}
          />
          
          <Card>
            <CardHeader>
              <CardTitle>Leaderboards</CardTitle>
              <CardDescription>See who's leading in different time periods</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "weekly" | "monthly" | "allTime")} className="mb-6">
                <TabsList className="grid grid-cols-3 mb-6">
                  <TabsTrigger value="weekly">Weekly</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  <TabsTrigger value="allTime">All Time</TabsTrigger>
                </TabsList>
                
                <TabsContent value={activeTab}>
                  {isError ? (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>
                        Failed to load leaderboard data. Please try again later.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <LeaderboardTable
                      data={leaderboardData}
                      userRank={userRank}
                      isLoading={isLoading}
                    />
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <UpdateInfo 
            lastUpdated={lastUpdated} 
            nextUpdate={nextUpdate} 
            isLoading={isLoading}
            refetch={refetch}
          />
        </div>
      </main>
    </div>
  );
};

export default Leaderboard;
