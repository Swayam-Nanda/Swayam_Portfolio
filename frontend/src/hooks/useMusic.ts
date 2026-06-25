import { useState, useEffect, useRef, useCallback } from "react";

const SONGS = [
  { title: "ACIDO III (Super Slowed)", src: "/music/ACIDO III (Super Slowed).mp3" },
  { title: "As Tequileiras do Funk - Bass Da Da Da (Sentadão)", src: "/music/As Tequileiras do Funk - Bass Da Da Da (Sentadão).mp3" },
  { title: "BIA - WE ON GO", src: "/music/BIA - WE ON GO.mp3" },
  { title: "Dracula (JENNIE Remix)", src: "/music/Dracula (JENNIE Remix).mp3" },
  { title: "Majboor", src: "/music/Majboor.mp3" },
  { title: "Sua amiga eu vou pegar", src: "/music/Sua amiga eu vou pegar.mp3" },
  { title: "Trinidad Cardona - Love Me Back", src: "/music/Trinidad Cardona - Love Me Back.mp3" },
  { title: "X-COOL!", src: "/music/X-COOL!.mp3" },
];

export function useMusic() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [songIndex, setSongIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // Track if this is the very first play (for random seek on first press)
  const isFirstPlay = useRef(true);

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = 0.15; // Matching Active Theory's 0.15 volume

    const handleEnded = () => {
      setSongIndex((prev) => (prev + 1) % SONGS.length);
    };

    audioRef.current.addEventListener("ended", handleEnded);
    return () => {
      audioRef.current?.removeEventListener("ended", handleEnded);
      audioRef.current?.pause();
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = SONGS[songIndex].src;
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      }
    }
  }, [songIndex, isPlaying]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        audioRef.current?.pause();
      } else if (isPlaying) {
        audioRef.current?.play().catch(console.error);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isPlaying]);

  const togglePlay = useCallback(() => {
    if (!isPlaying) {
      if (isFirstPlay.current) {
        isFirstPlay.current = false;

        // Pick a completely random song from the full playlist
        const randomIdx = Math.floor(Math.random() * SONGS.length);
        setSongIndex(randomIdx);

        // Seek to a random position between 20%–70% of the track duration
        const audio = audioRef.current;
        if (audio) {
          audio.src = SONGS[randomIdx].src;
          const seekOnLoad = () => {
            const seekFraction = 0.2 + Math.random() * 0.5; // 20–70%
            audio.currentTime = audio.duration * seekFraction;
            audio.play().catch(console.error);
            audio.removeEventListener("loadedmetadata", seekOnLoad);
          };
          audio.addEventListener("loadedmetadata", seekOnLoad);
          audio.load();
        }

        setIsPlaying(true);
        return;
      }
      // Subsequent plays: just resume/continue
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
      audioRef.current?.pause();
    }
  }, [isPlaying]);

  const nextSong = useCallback(() => {
    setSongIndex((prev) => (prev + 1) % SONGS.length);
  }, []);

  const prevSong = useCallback(() => {
    setSongIndex((prev) => (prev - 1 + SONGS.length) % SONGS.length);
  }, []);

  return {
    isPlaying,
    songIndex,
    currentSong: SONGS[songIndex].title,
    togglePlay,
    nextSong,
    prevSong,
    songs: SONGS,
  };
}
