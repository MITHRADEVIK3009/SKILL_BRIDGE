
import { useQuery } from "@tanstack/react-query";
import { fetchLeaderboardData } from "@/services/leaderboardApi";
import { formatDistanceToNow } from "date-fns";

export const useLeaderboard = (timeframe: "weekly" | "monthly" | "allTime") => {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ["leaderboard", timeframe],
    queryFn: () => fetchLeaderboardData(timeframe),
    staleTime: 5 * 60 * 1000, // 5 minutes before considering data stale
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  // Format the last updated and next update times
  const formattedLastUpdate = data?.lastUpdated
    ? formatDistanceToNow(new Date(data.lastUpdated), { addSuffix: true })
    : null;

  const formattedNextUpdate = data?.nextUpdate
    ? formatDistanceToNow(new Date(data.nextUpdate), { addSuffix: false })
    : null;

  return {
    leaderboardData: data?.users || [],
    userRank: data?.userRank || null,
    totalUsers: data?.totalUsers || 0,
    lastUpdated: formattedLastUpdate,
    nextUpdate: formattedNextUpdate,
    isLoading,
    isError,
    error,
    refetch
  };
};
