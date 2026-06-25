import { motion, AnimatePresence } from "framer-motion";
import { useMusicContext } from "@/lib/MusicContext";

export function MusicPlayer() {
  const { isPlaying, songIndex, currentSong, nextSong, prevSong } = useMusicContext();

  return (
    <AnimatePresence>
      {isPlaying && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-24 right-8 z-40 pointer-events-none"
        >
          <div className="flex items-center gap-1 border border-white/10 bg-white/5 backdrop-blur-md rounded-[7px] h-[42px] px-2 mix-blend-plus-lighter pointer-events-auto hover:bg-white/10 transition-all duration-400 shadow-elegant">
            <button 
              className="w-9 h-8 rounded-[5px] border border-white/60 bg-white/10 flex items-center justify-center font-mono text-sm font-bold text-white opacity-30 hover:opacity-100 transition-all duration-400 mix-blend-color-dodge"
              onClick={prevSong}
            >
              {"<<"}
            </button>

            <div className="ticker w-32 h-[30px] overflow-hidden bg-transparent whitespace-nowrap opacity-60 mix-blend-color-dodge mx-2">
                <div className="ticker-content inline-block whitespace-nowrap animate-ticker">
                    <span className="inline-block px-4 font-mono text-[10px] font-normal text-white uppercase h-[30px] leading-[30px]">
                        {songIndex + 1}. {currentSong}
                    </span>
                    <span className="inline-block px-4 font-mono text-[10px] font-normal text-white uppercase h-[30px] leading-[30px]">
                        {songIndex + 1}. {currentSong}
                    </span>
                </div>
            </div>

            <button 
              className="w-9 h-8 rounded-[5px] border border-white/60 bg-white/10 flex items-center justify-center font-mono text-sm font-bold text-white opacity-30 hover:opacity-100 transition-all duration-400 mix-blend-color-dodge"
              onClick={nextSong}
            >
              {">>"}
            </button>
          </div>

          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes ticker {
                0% { transform: translate3d(0, 0, 0); }
                100% { transform: translate3d(-50%, 0, 0); }
            }
            .animate-ticker {
                animation: ticker 12s linear infinite;
            }
          `}} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
