import portraitAltFallback from "@/assets/portrait-alt.png";
import portraitBlueFallback from "@/assets/portrait-blue.png";
import portraitGoldFallback from "@/assets/portrait-gold.png";
import portraitGreenFallback from "@/assets/portrait-green.png";
import portraitRedFallback from "@/assets/portrait-red.png";
import portraitPurpleFallback from "@/assets/portrait-purple.png";
import portraitSilverFallback from "@/assets/portrait-silver.png";

export {
  portraitAltFallback,
  portraitBlueFallback,
  portraitGoldFallback,
  portraitGreenFallback,
  portraitRedFallback,
  portraitPurpleFallback,
  portraitSilverFallback,
};

export const LOCAL_PORTRAIT_FALLBACKS: Record<string, string> = {
  blue: portraitBlueFallback,
  gold: portraitGoldFallback,
  emerald: portraitGreenFallback,
  crimson: portraitRedFallback,
  purple: portraitPurpleFallback,
  white: portraitSilverFallback,
};
