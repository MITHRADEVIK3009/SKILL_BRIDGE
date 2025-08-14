
import React from 'react';
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award } from "lucide-react";
import { User } from "@/types/leaderboard";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface LeaderboardTableProps {
  data: User[];
  userRank: number | null;
  isLoading: boolean;
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  data,
  userRank,
  isLoading
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleViewProfile = (userId: number) => {
    navigate(`/profile/${userId}`);
    toast({
      title: "Profile Viewed",
      description: `Viewing user profile with ID: ${userId}`,
    });
  };
  
  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: 
        return "bg-amber-500 text-white";
      case 2:
        return "bg-gray-400 text-white";
      case 3:
        return "bg-amber-700 text-white";
      default:
        return "bg-accent text-foreground";
    }
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  if (isLoading) {
    return <LeaderboardSkeleton />;
  }

  return (
    <div className="overflow-auto max-h-[500px]">
      <Table>
        <TableHeader className="sticky top-0 bg-background z-10">
          <TableRow>
            <TableHead>Rank</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Points</TableHead>
            <TableHead>Streak</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((user) => (
            <TableRow key={user.id} className={`hover:bg-accent/20 transition-colors ${
              userRank === user.rank ? "bg-accent/30" : ""
            }`}>
              <TableCell>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getRankColor(user.rank)}`}>
                  <span className="font-semibold text-sm">{user.rank}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    {user.avatar ? (
                      <AvatarImage src={user.avatar} alt={user.name} />
                    ) : null}
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    {user.rank <= 3 && (
                      <Badge variant="outline" className="mt-1">
                        <Award className="h-3 w-3 mr-1" />
                        Top {user.rank}
                      </Badge>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="font-semibold">{user.points.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">XP Points</div>
              </TableCell>
              <TableCell>
                <div className="font-semibold">{user.streak} days</div>
                <div className="text-xs text-muted-foreground">Current streak</div>
              </TableCell>
              <TableCell>
                <Button 
                  variant="outline" 
                  onClick={() => handleViewProfile(user.id)}
                  size="sm"
                >
                  View Profile
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

// Loading skeleton for the table
const LeaderboardSkeleton = () => {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 border-b">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[160px]" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default LeaderboardTable;
