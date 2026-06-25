import { useState } from "react";
import { AudioLine } from "./AudioLine";
import { useMusicContext } from "@/lib/MusicContext";

export function AchievementsNav() {
  const [isHovered, setIsHovered] = useState(false);
  const { isPlaying, togglePlay } = useMusicContext();

  return (
    <div className="flex items-center h-9">
      <a
        href="/achievements/index.html"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center h-full px-2 cursor-pointer group"
      >
        <span className="font-display text-[10px] md:text-[11px] xl:text-[12px] font-bold uppercase tracking-[0.2em] text-foreground transition-all duration-300 group-hover:text-primary group-hover:opacity-100 whitespace-nowrap">
          Achievements
        </span>
      </a>

      <button
        className="w-[50px] md:w-[60px] h-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={(e) => {
          e.preventDefault();
          togglePlay();
        }}
        title={isPlaying ? "Pause Music" : "Play Music"}
      >
        <div className="w-full h-[24px] flex items-center justify-center">
          {/* Dark pill gives the wave a contrasting surface; glow filter makes it pop */}
          <div
            className="w-full h-full rounded-full relative overflow-hidden"
            style={{
              background: "rgba(0,0,0,0.35)",
              boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)",
              filter: isPlaying
                ? "drop-shadow(0 0 4px var(--primary)) drop-shadow(0 0 1px var(--primary))"
                : "none",
              transition: "filter 0.4s ease",
            }}
          >
            <AudioLine hover={isHovered ? 1 : 0} amplitude={isPlaying ? 1 : 0} alpha={1} />
          </div>
        </div>
      </button>
    </div>
  );
}
