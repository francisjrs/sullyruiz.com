"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Volume2, VolumeX, Play } from "lucide-react";

interface VideoPlayerProps {
  videoSrc?: string;
  posterSrc: string;
  fallbackSrc?: string;
  muteLabel: string;
  unmuteLabel: string;
  playLabel: string;
  onPlayClick?: () => void;
  className?: string;
}

export function VideoPlayer({
  videoSrc,
  posterSrc,
  fallbackSrc,
  muteLabel,
  unmuteLabel,
  playLabel,
  onPlayClick,
  className = "",
}: VideoPlayerProps) {
  const [isMuted, setIsMuted] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

  const handleError = useCallback(() => {
    setHasError(true);
  }, []);

  const handleLoadedData = useCallback(() => {
    setIsLoaded(true);
  }, []);

  // Placeholder mode - no video source provided
  if (!videoSrc || hasError) {
    return (
      <div
        className={`relative aspect-video bg-black overflow-hidden ${className}`}
      >
        {/* Poster/Fallback Image */}
        <Image
          src={hasError && fallbackSrc ? fallbackSrc : posterSrc}
          alt=""
          fill
          className="object-cover"
          priority
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/30" />

        {/* Play button overlay */}
        <button
          onClick={onPlayClick}
          aria-label={playLabel}
          className="absolute inset-0 flex items-center justify-center cursor-pointer group"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#BEB09E] group-hover:bg-white transition-colors duration-300"
          >
            <Play className="w-8 h-8 md:w-10 md:h-10 text-black ml-1" />
          </motion.div>
        </button>
      </div>
    );
  }

  // Video mode
  return (
    <div
      className={`relative aspect-video bg-black overflow-hidden ${className}`}
    >
      {/* Poster image shown until video loads */}
      {!isLoaded && (
        <Image
          src={posterSrc}
          alt=""
          fill
          className="object-cover"
          priority
        />
      )}

      {/* HTML5 Video */}
      <video
        ref={videoRef}
        src={videoSrc}
        poster={posterSrc}
        autoPlay
        muted
        loop
        playsInline
        onError={handleError}
        onLoadedData={handleLoadedData}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Mute/Unmute button */}
      <button
        onClick={toggleMute}
        aria-label={isMuted ? muteLabel : unmuteLabel}
        className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-black/70 backdrop-blur-sm rounded-full text-white text-sm font-sans uppercase tracking-wider cursor-pointer hover:bg-black/90 transition-colors duration-200"
      >
        {isMuted ? (
          <>
            <VolumeX className="w-4 h-4" />
            <span className="hidden sm:inline">{muteLabel}</span>
          </>
        ) : (
          <>
            <Volume2 className="w-4 h-4" />
            <span className="hidden sm:inline">{unmuteLabel}</span>
          </>
        )}
      </button>
    </div>
  );
}
