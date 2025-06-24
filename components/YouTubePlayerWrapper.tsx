
import React, { useState } from 'react';
import YouTube, { YouTubeProps, YouTubePlayer } from 'react-youtube'; // Corrected import

interface YouTubePlayerWrapperProps {
  videoId: string;
  startSeconds?: number | null;
  endSeconds?: number | null;
  height?: string;
  width?: string;
}

export const YouTubePlayerWrapper: React.FC<YouTubePlayerWrapperProps> = ({
  videoId,
  startSeconds,
  endSeconds,
  height = '360', // Default height
  width = '100%',  // Default width
}) => {
  const [player, setPlayer] = useState<YouTubePlayer | null>(null); // Correct type for player
  const [error, setError] = useState<string | null>(null);

  const opts: YouTubeProps['opts'] = {
    height: height,
    width: width,
    playerVars: {
      autoplay: 0, // Autoplay disabled initially
      start: startSeconds ?? undefined,
      end: endSeconds ?? undefined,
      modestbranding: 1,
      rel: 0, // Do not show related videos at the end
      iv_load_policy: 3, // Do not show video annotations
      controls: 1, // Show player controls
    },
  };

  const onReady: YouTubeProps['onReady'] = (event) => {
    setPlayer(event.target);
    setError(null);
    // You could autoplay here if desired: event.target.playVideo();
  };

  const onError: YouTubeProps['onError'] = (event) => {
    console.error('YouTube Player Error:', event.data, videoId);
    let message = 'An error occurred with the YouTube player.';
    switch (event.data) {
      case 2: // Invalid parameter
        message = `The video ID (${videoId}) might be invalid or the video is private.`;
        break;
      case 5: // HTML5 player error
        message = 'There was an issue with the HTML5 player loading this video.';
        break;
      case 100: // Video not found
        message = `Video not found. It might have been removed or set to private. (ID: ${videoId})`;
        break;
      case 101: // Not allowed to play in embedded players
      case 150:
        message = `This video cannot be played in an embedded player. (ID: ${videoId})`;
        break;
      default:
        message = `YouTube player error code: ${event.data}. (ID: ${videoId})`;
    }
    setError(message);
  };

  return (
    <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-lg border border-slate-600 relative">
      {error ? (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-700 p-4">
          <p className="text-red-400 text-center">{error}</p>
          <a
            href={`https://www.youtube.com/watch?v=${videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 text-sm text-purple-400 hover:text-purple-300 underline"
          >
            Try watching on YouTube directly
          </a>
        </div>
      ) : (
        <YouTube videoId={videoId} opts={opts} onReady={onReady} onError={onError} className="w-full h-full" />
      )}
    </div>
  );
};