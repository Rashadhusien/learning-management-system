"use client";

import { useState } from "react";
import "@videojs/react/video/skin.css";
import { createPlayer, videoFeatures } from "@videojs/react";
import { VideoSkin, Video } from "@videojs/react/video";
import ReactPlayer from "react-player";

const Player = createPlayer({ features: videoFeatures });

interface VideoPlayerProps {
  src: string;
}

export const VideoPlayer = ({ src }: VideoPlayerProps) => {
  // const [useFallback, setUseFallback] = useState(false);

  // // Check if video URL is likely to be supported
  // const isLikelySupported = (url: string) => {
  //   const supportedFormats = [".mp4", ".webm", ".ogg", ".m3u8", ".mpd"];
  //   const hasSupportedExtension = supportedFormats.some((ext) =>
  //     url.toLowerCase().includes(ext),
  //   );

  //   // Check for common streaming platforms
  //   const streamingPlatforms = [
  //     "youtube.com",
  //     "vimeo.com",
  //     "cloudinary.com",
  //     "mux.com",
  //   ];
  //   const isStreamingPlatform = streamingPlatforms.some((platform) =>
  //     url.includes(platform),
  //   );

  //   return hasSupportedExtension || isStreamingPlatform;
  // };

  // const handleError = (error: Error | unknown) => {
  //   console.error("VideoJS player error:", error);
  //   setUseFallback(true);
  // };

  // // If URL doesn't look like it's supported or we've had an error, use ReactPlayer
  // if (!isLikelySupported(src) || useFallback) {
  //   return (
  //     <div className="w-full h-full">
  //       <ReactPlayer
  //         src={src}
  //         width="100%"
  //         height="100%"
  //         controls={true}
  //         playing={false}
  //         onError={(error) => {
  //           console.error("ReactPlayer fallback error:", error);
  //         }}
  //       />
  //     </div>
  //   );
  // }

  return (
    <Player.Provider>
      <VideoSkin>
        <Video src={src} playsInline />
      </VideoSkin>
    </Player.Provider>
  );
};
