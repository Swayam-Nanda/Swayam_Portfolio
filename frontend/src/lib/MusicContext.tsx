import React, { createContext, useContext, ReactNode } from "react";
import { useMusic } from "../hooks/useMusic";

type MusicContextType = ReturnType<typeof useMusic>;

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: ReactNode }) {
  const music = useMusic();
  return (
    <MusicContext.Provider value={music}>
      {children}
    </MusicContext.Provider>
  );
}

export function useMusicContext() {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error("useMusicContext must be used within a MusicProvider");
  }
  return context;
}
