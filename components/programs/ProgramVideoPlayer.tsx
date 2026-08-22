'use client';

import React, { useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Sparkles } from 'lucide-react';

interface ProgramVideoPlayerProps {
  videoSrc: string;
  posterImage?: string;
  programName: string;
  className?: string;
}

export function ProgramVideoPlayer({
  videoSrc,
  posterImage,
  programName,
  className = '',
}: ProgramVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div
      className={`relative rounded-card-lg overflow-hidden shadow-elevated bg-ink-950 border border-cream-border/40 group select-none ${className}`}
      onClick={togglePlay}
      role="region"
      aria-label={`${programName} hands-on studio training video`}
    >
      <video
        ref={videoRef}
        src={videoSrc}
        poster={posterImage}
        muted={isMuted}
        playsInline
        loop
        preload="metadata"
        className="w-full h-auto max-h-[540px] object-cover block cursor-pointer"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        aria-label={`${programName} training demonstration`}
      >
        Your browser does not support the video tag.
      </video>

      {/* Floating Center Play/Pause Overlay Button when Paused */}
      {!isPlaying && (
        <div className="absolute inset-0 bg-ink-950/40 backdrop-blur-[1px] flex items-center justify-center pointer-events-none transition-all duration-300">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gold/90 text-ink-900 flex items-center justify-center shadow-gold transition-transform duration-200 group-hover:scale-110">
            <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-ink-900 ml-1 text-ink-900" />
          </div>
        </div>
      )}

      {/* Subtle Bottom Ambient Gradient Overlay Bar with Program Tag & Audio Control */}
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-ink-950/90 via-ink-950/40 to-transparent p-4 sm:p-5 flex items-center justify-between text-white pointer-events-auto">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full liquid-glass-badge text-gold text-xs font-bold uppercase tracking-wider shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Studio Demonstration</span>
          </span>
          <span className="text-xs text-gray-300 font-light hidden sm:inline-block">
            {programName} In-Action
          </span>
        </div>

        <button
          type="button"
          onClick={toggleMute}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors text-xs font-bold flex items-center gap-1.5 shadow-soft border border-white/10"
          aria-label={isMuted ? 'Unmute video' : 'Mute video'}
        >
          {isMuted ? (
            <>
              <VolumeX className="w-4 h-4 text-gray-300" />
              <span className="text-[11px] hidden sm:inline">Unmute</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-gold" />
              <span className="text-[11px] hidden sm:inline">Mute</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
