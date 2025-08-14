
import { User } from "@/types/leaderboard";

// Types for our API responses
export interface LeaderboardResponse {
  users: User[];
  lastUpdated: string;
  nextUpdate: string;
  totalUsers: number;
  userRank?: number | null;
}

// Simulate API call to fetch leaderboard data
export const fetchLeaderboardData = async (
  timeframe: "weekly" | "monthly" | "allTime"
): Promise<LeaderboardResponse> => {
  // In a real app, this would be an actual API call
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Simulate API response based on the sample data
  // This would be replaced with a real API call in a production app
  const data = mockLeaderboardData[timeframe];
  
  // Get current date/time and calculate next update time (24h from now)
  const now = new Date();
  const nextUpdate = new Date(now);
  nextUpdate.setHours(now.getHours() + 24);
  
  return {
    users: data,
    lastUpdated: now.toISOString(),
    nextUpdate: nextUpdate.toISOString(),
    totalUsers: timeframe === "weekly" ? 1254 : timeframe === "monthly" ? 3872 : 15420,
    userRank: mockUserRanks[timeframe],
  };
};

// Mock data (same as before, but we'll pretend it's coming from an API)
const mockLeaderboardData = {
  weekly: [
    { id: 1, name: "Sarah Johnson", points: 2850, streak: 7, rank: 1, avatar: "https://github.com/shadcn.png" },
    { id: 2, name: "Michael Chen", points: 2740, streak: 5, rank: 2, avatar: "" },
    { id: 3, name: "Emily Rodriguez", points: 2520, streak: 6, rank: 3, avatar: "" },
    { id: 4, name: "David Kim", points: 2350, streak: 4, rank: 4, avatar: "" },
    { id: 5, name: "Jessica Lee", points: 2180, streak: 7, rank: 5, avatar: "" },
    { id: 6, name: "James Wilson", points: 2050, streak: 3, rank: 6, avatar: "" },
    { id: 7, name: "Alex Thompson", points: 1920, streak: 5, rank: 7, avatar: "" },
    { id: 8, name: "Lisa Garcia", points: 1870, streak: 4, rank: 8, avatar: "" },
    { id: 9, name: "Kevin Patel", points: 1760, streak: 6, rank: 9, avatar: "" },
    { id: 10, name: "Sophia Martinez", points: 1650, streak: 3, rank: 10, avatar: "" }
  ],
  monthly: [
    { id: 3, name: "Emily Rodriguez", points: 10850, streak: 22, rank: 1, avatar: "" },
    { id: 1, name: "Sarah Johnson", points: 9740, streak: 18, rank: 2, avatar: "https://github.com/shadcn.png" },
    { id: 5, name: "Jessica Lee", points: 8950, streak: 28, rank: 3, avatar: "" },
    { id: 2, name: "Michael Chen", points: 8620, streak: 15, rank: 4, avatar: "" },
    { id: 7, name: "Alex Thompson", points: 7890, streak: 24, rank: 5, avatar: "" },
    { id: 4, name: "David Kim", points: 7450, streak: 19, rank: 6, avatar: "" },
    { id: 9, name: "Kevin Patel", points: 7120, streak: 25, rank: 7, avatar: "" },
    { id: 6, name: "James Wilson", points: 6950, streak: 14, rank: 8, avatar: "" },
    { id: 10, name: "Sophia Martinez", points: 6340, streak: 17, rank: 9, avatar: "" },
    { id: 8, name: "Lisa Garcia", points: 5980, streak: 20, rank: 10, avatar: "" }
  ],
  allTime: [
    { id: 3, name: "Emily Rodriguez", points: 45850, streak: 22, rank: 1, avatar: "" },
    { id: 5, name: "Jessica Lee", points: 42740, streak: 28, rank: 2, avatar: "" },
    { id: 1, name: "Sarah Johnson", points: 38950, streak: 18, rank: 3, avatar: "https://github.com/shadcn.png" },
    { id: 7, name: "Alex Thompson", points: 36820, streak: 24, rank: 4, avatar: "" },
    { id: 9, name: "Kevin Patel", points: 32450, streak: 25, rank: 5, avatar: "" },
    { id: 2, name: "Michael Chen", points: 31980, streak: 15, rank: 6, avatar: "" },
    { id: 4, name: "David Kim", points: 29720, streak: 19, rank: 7, avatar: "" },
    { id: 6, name: "James Wilson", points: 28150, streak: 14, rank: 8, avatar: "" },
    { id: 10, name: "Sophia Martinez", points: 26340, streak: 17, rank: 9, avatar: "" },
    { id: 8, name: "Lisa Garcia", points: 24980, streak: 20, rank: 10, avatar: "" }
  ]
};

// Mock user ranks based on timeframe
const mockUserRanks = {
  weekly: 2,
  monthly: 2,
  allTime: 3
};
