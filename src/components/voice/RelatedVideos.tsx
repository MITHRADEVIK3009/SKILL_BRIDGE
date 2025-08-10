
import React from 'react';

interface Video {
  title: string;
  channel: string;
  duration: string;
  url: string;
  description: string;
}

interface RelatedVideosProps {
  videos: Video[];
}

const RelatedVideos: React.FC<RelatedVideosProps> = ({ videos }) => {
  if (videos.length === 0) return null;

  return (
    <div className="mt-6">
      <h4 className="font-medium mb-2">Related Tutorial Videos:</h4>
      <div className="space-y-3">
        {videos.map((video, index) => (
          <div key={index} className="bg-accent/30 p-3 rounded-lg">
            <h5 className="font-medium text-primary">{video.title}</h5>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{video.channel}</span>
              <span>{video.duration}</span>
            </div>
            <p className="text-sm mt-2">{video.description}</p>
            <a 
              href={video.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-2 text-sm text-primary hover:underline inline-flex items-center"
            >
              Watch video
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedVideos;
