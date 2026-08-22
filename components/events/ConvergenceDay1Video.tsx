'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Pause } from 'lucide-react';

interface ConvergenceDay1VideoProps {
  src?: string;
  poster?: string;
  className?: string;
}

export function ConvergenceDay1Video({
  src = '/images/convergence/Convergence-1.mp4',
  poster = '/images/Events/Event1.jpg',
  className = '',
}: ConvergenceDay1VideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Autoplay when mounted if user does not prefer reduced motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (videoRef.current && !prefersReducedMotion) {
      videoRef.current.play().catch(() => {
        // Autoplay may be deferred by browser until user gesture; muted allows playback
      });
    }
  }, []);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
      setIsHovered(false);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    // Deliberately prevent any click navigation, lightbox, or modal triggers
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      className={`relative rounded-card-lg overflow-hidden shadow-elevated bg-ink-950 border border-cream-border/30 group cursor-default select-none ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      role="region"
      aria-label="Convergence Day 1 video highlights"
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="w-full h-auto max-h-[520px] object-cover pointer-events-auto block"
        aria-label="Convergence Day 1 Live Highlights Video"
      >
        Your browser does not support the video tag. Highlights from Skill to Leadership Convergence Day 1.
      </video>

      {/* Hover Pause Indicator Overlay */}
      {isHovered && (
        <div className="absolute inset-0 bg-ink-950/40 backdrop-blur-[2px] flex items-center justify-center pointer-events-none transition-opacity duration-200">
          <div className="px-4 py-2 rounded-full bg-ink-900/90 text-white text-xs font-bold flex items-center gap-2 shadow-soft border border-white/20">
            <Pause className="w-3.5 h-3.5 text-gold fill-gold" />
            <span>Paused on hover</span>
          </div>
        </div>
      )}

      {/* Ambient Gradient Bottom Banner */}
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-ink-950/90 via-ink-950/50 to-transparent p-4 sm:p-5 flex items-center justify-between text-white pointer-events-none">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-gold font-display">
            Convergence Day 1
          </span>
          <p className="text-[11px] text-gray-300 font-light">
            Live studio orientation & fellow highlights
          </p>
        </div>
        <span className="text-[10px] text-gray-400 font-mono hidden sm:inline-block">
          Hover to pause
        </span>
      </div>
    </div>
  );
}
