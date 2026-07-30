import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SoftAurora from "./ui/SoftAurora";
import { useIsMobile } from "@/hooks/use-mobile";
import { api, MEDIA_BASE_URL } from "@/lib/api-client";
import { LOCAL_PORTRAIT_FALLBACKS, portraitAltFallback } from "@/lib/portraits";

interface VideoLoaderProps {
  onComplete: () => void;
}

const VideoLoader: React.FC<VideoLoaderProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSiteDataLoaded, setIsSiteDataLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [showOverlayText, setShowOverlayText] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isMobile = useIsMobile();

  // Listen for the database loading completion event
  useEffect(() => {
    const handleDataLoaded = () => {
      setIsSiteDataLoaded(true);
    };
    window.addEventListener("portfolio-data-loaded", handleDataLoaded);
    if ((window as any).__portfolioDataLoaded) {
      setIsSiteDataLoaded(true);
    }
    
    // Safety timeout: If database takes longer than 7 seconds, force unlock
    const safetyTimeout = setTimeout(() => {
      setIsSiteDataLoaded(true);
    }, 7000);

    return () => {
      window.removeEventListener("portfolio-data-loaded", handleDataLoaded);
      clearTimeout(safetyTimeout);
    };
  }, []);

  // --- CONFIGURATION VARIABLES FOR CINEMATIC TEXTS ---
  const showTextTimeBeforeEnd = 4.0; // Time in seconds before the video ends to show the text
  const topTextY = "28%"; // Vertical position of the top text ("All about")
  const bottomTextY = "65%"; // Vertical position of the bottom text ("get ready for a cinematic experience")

  const videoUrl =
    "https://ydkbdkmwityszetkguyj.supabase.co/storage/v1/object/public/portfolio-media/loader.mp4";

  const handleEnd = React.useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      onComplete();
    }, 1000); // Match exit animation duration
  }, [onComplete]);

  // Preload all theme portraits (both dynamic and fallback) on mount
  useEffect(() => {
    // 1. Preload local fallbacks
    Object.values(LOCAL_PORTRAIT_FALLBACKS).forEach((url) => {
      const img = new Image();
      img.src = url;
    });

    // 2. Preload local reveal fallback
    const imgAlt = new Image();
    imgAlt.src = portraitAltFallback;

    // 3. Preload database-configured portraits from Supabase
    api.getHeroPortraits()
      .then((portraits) => {
        Object.values(portraits).forEach((url) => {
          if (url) {
            const resolvedUrl = url.startsWith("http") ? url : `${MEDIA_BASE_URL}${url}`;
            const img = new Image();
            img.src = resolvedUrl;
          }
        });
      })
      .catch(() => {});
  }, []);

  // Simulated preloader progress for mobile
  useEffect(() => {
    if (isMobile) {
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += Math.random() * 12 + 4;
        if (currentProgress >= 100) {
          currentProgress = 100;
          setLoadProgress(100);
          setIsLoaded(true);
          clearInterval(interval);
          setTimeout(() => {
            handleEnd();
          }, 400);
        } else {
          setLoadProgress(currentProgress);
        }
      }, 150);
      return () => clearInterval(interval);
    }
  }, [isMobile, handleEnd]);

  useEffect(() => {
    if (isMobile) return;
    // If video fails to load or takes too long, we should still show the site
    const timeout = setTimeout(() => {
      if (!isLoaded) {
        handleEnd();
      }
    }, 20000); // Slightly increased timeout

    return () => clearTimeout(timeout);
  }, [isLoaded, handleEnd, isMobile]);

  useEffect(() => {
    if (isMobile) return;
    if (isLoaded && isSiteDataLoaded && videoRef.current) {
      // Attempt to play with sound
      videoRef.current.muted = false;
      const playPromise = videoRef.current.play();

      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("Autoplay with sound failed, falling back to muted:", err);
          if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play().catch((e) => {
              console.error("Video play failed even when muted:", e);
              handleEnd();
            });
          }
        });
      }
    }
  }, [isLoaded, isSiteDataLoaded, handleEnd, isMobile]);

  const onProgress = () => {
    if (videoRef.current && videoRef.current.buffered.length > 0) {
      const bufferedEnd = videoRef.current.buffered.end(videoRef.current.buffered.length - 1);
      const duration = videoRef.current.duration;
      if (duration > 0) {
        setLoadProgress((bufferedEnd / duration) * 100);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      if (duration > 0 && currentTime >= duration - showTextTimeBeforeEnd) {
        setShowOverlayText(true);
      } else {
        setShowOverlayText(false);
      }
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.1,
            filter: "blur(20px)",
            transition: { duration: 1, ease: [0.22, 1, 0.36, 1] },
          }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#000428] bg-gradient-to-b from-[#000428] via-[#000b1a] to-black overflow-hidden"
        >
          {/* SoftAurora as Pre-loader */}
          <div className="absolute inset-0 z-0">
            <SoftAurora
              speed={0.4}
              scale={1.2}
              brightness={0.8}
              color1="#000000"
              color2="#4a00e0"
              noiseFrequency={2}
              noiseAmplitude={1}
              bandHeight={0.4}
              bandSpread={1.2}
              enableMouseInteraction={false}
            />
          </div>

          {(isMobile || !isLoaded || !isSiteDataLoaded) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-48 h-1 bg-white/10 rounded-full overflow-hidden"
              >
                <motion.div
                  className="h-full bg-white"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(loadProgress, 10)}%` }}
                />
              </motion.div>
              <p className="mt-4 text-white/50 font-mono text-xs uppercase tracking-[0.2em]">
                Initializing Experience
              </p>
            </div>
          )}

          {/* Dark Blue Fog Vignette Overlay */}
          <div
            className="absolute inset-0 pointer-events-none z-25"
            style={{
              background:
                "radial-gradient(circle at center, transparent 40%, rgba(0, 4, 40, 0.6) 70%, rgba(0, 4, 40, 0.95) 100%)",
            }}
          />

          {/* Cinematic Overlay Texts */}
          <AnimatePresence>
            {showOverlayText && (
              <div className="absolute inset-0 z-30 pointer-events-none">
                {/* Top Text: "All about" */}
                <div
                  className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 text-center"
                  style={{ top: topTextY }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 15, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -15, filter: "blur(10px)" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="font-display text-2xl md:text-3xl font-light uppercase tracking-[0.4em] text-white/90 whitespace-nowrap"
                    style={{ textShadow: "0 0 20px rgba(255,255,255,0.4)" }}
                  >
                    All about
                  </motion.div>
                </div>

                {/* Bottom Text: "get ready for a cinematic experience" */}
                <div
                  className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl text-center px-4"
                  style={{ top: bottomTextY }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 15, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -15, filter: "blur(10px)" }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
                    className="font-sans text-sm md:text-base font-normal tracking-[0.2em] text-primary/95 uppercase"
                    style={{ textShadow: "0 0 15px rgba(255,255,255,0.1)" }}
                  >
                    get ready for a cinematic experience
                  </motion.div>
                </div>
              </div>
            )}
          </AnimatePresence>

          {!isMobile && (
            <video
              ref={videoRef}
              src={videoUrl}
              playsInline
              onEnded={handleEnd}
              onCanPlayThrough={() => setIsLoaded(true)}
              onProgress={onProgress}
              onTimeUpdate={handleTimeUpdate}
              className={`transition-opacity duration-1500 z-20 
                ${(isLoaded && isSiteDataLoaded) ? "opacity-100" : "opacity-0"} 
                w-full h-full object-contain`}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VideoLoader;
