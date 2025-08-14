
import React from 'react';
import { Volume2, Pause } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface AudioPlayerProps {
  text: string;
  isPlaying: boolean;
  onPlayPause: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ text, isPlaying, onPlayPause }) => {
  return (
    <button
      onClick={onPlayPause}
      className="flex items-center space-x-1 text-primary hover:text-primary/80 transition-colors"
      aria-label={isPlaying ? "Stop speech" : "Listen to response"}
    >
      {isPlaying ? (
        <>
          <Pause className="h-4 w-4" />
          <span className="text-sm">Stop</span>
        </>
      ) : (
        <>
          <Volume2 className="h-4 w-4" />
          <span className="text-sm">Listen</span>
        </>
      )}
    </button>
  );
};

export default AudioPlayer;
