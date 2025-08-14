
import React from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface UpdateInfoProps {
  lastUpdated: string | null;
  nextUpdate: string | null;
  isLoading: boolean;
  refetch: () => void;
}

const UpdateInfo: React.FC<UpdateInfoProps> = ({
  lastUpdated,
  nextUpdate,
  isLoading,
  refetch
}) => {
  return (
    <div className="mt-6 text-center space-y-2">
      <p className="text-muted-foreground text-sm">
        {isLoading
          ? "Loading leaderboard data..."
          : lastUpdated && nextUpdate
            ? `Leaderboards last updated ${lastUpdated}. Next update in ${nextUpdate}.`
            : "Leaderboards are updated every 24 hours. Keep learning to improve your rank!"
        }
      </p>
      
      <Button 
        variant="outline" 
        size="sm"
        onClick={refetch}
        disabled={isLoading}
        className="mx-auto"
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Refresh Data
      </Button>
    </div>
  );
};

export default UpdateInfo;
