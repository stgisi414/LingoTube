import React, { useState } from 'react';
import YouTube, { YouTubeProps, YouTubePlayer } from 'react-youtube';

interface YouTubePlayerWrapperProps {
  videoId: string;
  startSeconds?: number | null;
  endSeconds?: number | null;
  height?: string;
  width?: string;
  onEnd?: () => void;
}

export const YouTubePlayerWrapper: React.FC<YouTubePlayerWrapperProps> = ({
  videoId,
  startSeconds,
  endSeconds,
  height = '360',
  width = '100%',
  onEnd,
}) => {
  const [error, setError] = useState<string | null>(null);

  const opts: YouTubeProps['opts'] = {
    height: height,
    width: width,
    playerVars: {
      autoplay: 1,
      start: startSeconds ?? undefined,
      end: endSeconds ?? undefined,
      modestbranding: 1,
      rel: 0,
      iv_load_policy: 3,
      controls: 1,
    },
  };

  const onReady: YouTubeProps['onReady'] = (event) => {
    setError(null);
    event.target.playVideo();
  };

  const onError: YouTubeProps['onError'] = (event) => {
    let message = 'An error occurred with the YouTube player.';
     switch (event.data) {
      case 2: message = `The video ID (${videoId}) may be invalid or the video is private.`; break;
      case 5: message = 'There was an issue with the HTML5 player loading this video.'; break;
      case 100: message = `Video not found. It may have been removed or set to private.`; break;
      case 101: case 150: message = `This video cannot be played in an embedded player.`; break;
      default: message = `Youtubeer error code: ${event.data}.`;
    }
    setError(message);
    if(onEnd) onEnd(); // If player errors, treat it as the end of the segment to move on
  };

  const handleEnd = () => {
    if (onEnd) {
      onEnd();
    }
  };

  return (
    <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-lg border border-slate-600 relative">
      {error ? (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-700 p-4">
          <p className="text-red-400 text-center">{error}</p>
        </div>
      ) : (
        <YouTube videoId={videoId} opts={opts} onReady={onReady} onError={onError} onEnd={handleEnd} className="w-full h-full" />
      )}
    </div>
  );
};