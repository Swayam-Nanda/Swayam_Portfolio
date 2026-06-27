import { useEffect } from "react";
import Lenis from "lenis";
import { useIsMobile } from "@/hooks/use-mobile";

export function SmoothScroll() {
  const isMobile = useIsMobile();

  useEffect(() => {
    // Disable smooth scroll on mobile devices to prevent touch fight/jittering
    if (isMobile) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    (window as any).lenis = lenis;
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => {
      (window as any).lenis = null;
      lenis.destroy();
    };
  }, [isMobile]);
  return null;
}
