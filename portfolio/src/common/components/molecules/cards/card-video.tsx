"use client";

import { cn } from "@/common/utils/ui";
import { useState, useRef, useEffect } from "react";

export interface VideoCardProject {
  id: string | number;
  title: string;
  category: string;
  year: string;
  thumbnail?: string;
  video?: string;
}

interface VideoCardProps {
  project: VideoCardProject;
  isHovered: boolean;
  isSelected?: boolean;
  onHoverChange: (hovered: boolean) => void;
  onClick?: () => void;
}

export function VideoCard({
  project,
  isHovered,
  isSelected = false,
  onHoverChange,
  onClick,
}: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    if (isHovered && videoRef.current && project.video) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    } else if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isHovered, project.video]);

  const isActive = isHovered || isSelected;

  return (
    <button
      type="button"
      aria-pressed={isSelected}
      className={cn(
        "group relative h-80 min-w-56 cursor-pointer overflow-hidden rounded-3xl text-left transition-all duration-700 ease-out focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none sm:h-96 sm:min-w-[16rem]",
        isActive
          ? "flex-2 shadow-2xl ring-2 ring-primary/60"
          : "flex-1 opacity-80 hover:opacity-100",
      )}
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
      onClick={onClick}
    >
      {/* Thumbnail Image */}
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-700",
          isActive && project.video ? "opacity-0" : "opacity-100",
        )}
      >
        <img
          src={
            project.thumbnail ||
            "/stories/modern-architecture-black-and-white.jpg"
          }
          alt={project.title}
          className={cn(
            "h-full w-full object-cover transition-all duration-700",
            !isActive && "brightness-75 grayscale",
          )}
        />
      </div>

      {/* Video */}
      {project.video && (
        <div
          className={cn(
            "absolute inset-0 transition-opacity duration-700",
            isActive ? "opacity-100" : "opacity-0",
          )}
        >
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            loop
            muted
            playsInline
            preload="auto"
            onLoadedData={() => setIsVideoLoaded(true)}
          >
            <source src={project.video} type="video/mp4" />
          </video>
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

      <div
        className={cn(
          "absolute right-0 bottom-0 left-0 p-4 transition-all duration-500 sm:p-6",
          isActive ? "translate-y-0 opacity-100" : "translate-y-2 opacity-90",
        )}
      >
        <div className="relative space-y-1 rounded-xl border border-white/10 bg-black/40 p-4 shadow-xl backdrop-blur-xl">
          <h3 className="line-clamp-1 font-mono text-xs font-semibold tracking-widest text-white uppercase sm:text-sm">
            {project.title}
          </h3>
          <p className="font-mono text-[10px] tracking-wider text-white/80 uppercase sm:text-xs">
            {project.category}
          </p>
          <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-2 font-mono text-[10px] text-white/60">
            <span>{project.year}</span>
            {isSelected && (
              <span className="rounded-full bg-primary/30 px-2 py-0.5 font-sans text-[9px] text-primary-foreground">
                Active
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
