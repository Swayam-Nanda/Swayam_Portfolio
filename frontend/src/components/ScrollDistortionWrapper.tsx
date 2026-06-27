import React, { useRef, useState, useEffect, useMemo } from "react";
import { motion, useScroll, useVelocity, useSpring, useTransform } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speedFactor: number;
  opacity: number;
}

export function ScrollDistortionWrapper({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  
  // Smooth out the velocity for fluid animations
  const smoothVelocity = useSpring(scrollVelocity, {
    stiffness: 60,
    damping: 20,
    mass: 0.5
  });

  // Bend amount: reversed sign so scrolling DOWN curves navbar upward (convex),
  // and scrolling UP curves it downward (concave).
  const bendAmount = useTransform(smoothVelocity, [-3000, 3000], [100, -100]);
  
  // Top border bend path
  const topPathData = useTransform(bendAmount, (v) => {
    return isMobile ? "M 0,0 L 100,0" : `M 0,0 Q 50,${v} 100,0`;
  });

  // Bottom border bend path
  const bottomPathData = useTransform(bendAmount, (v) => {
    return isMobile ? "M 0,100 L 100,100" : `M 0,100 Q 50,${100 + v} 100,100`;
  });

  // Full shape for the glass background
  const fullShapeData = useTransform(bendAmount, (v) => {
    return isMobile ? "M 0,0 L 100,0 L 100,100 L 0,100 Z" : `M 0,0 Q 50,${v} 100,0 L 100,100 Q 50,${100 + v} 0,100 Z`;
  });

  const contentY = useTransform(smoothVelocity, [-3000, 3000], [15, -15]);
  const contentRotateX = useTransform(smoothVelocity, [-3000, 3000], [15, -15]);

  return (
    <div className="relative w-full h-full overflow-visible drop-shadow-2xl">
      {/* The Dynamic Bending Background - Height increased for extreme bend */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-visible">
        <svg 
            viewBox="0 0 100 100" 
            preserveAspectRatio="none" 
            className="w-full h-[250%] -top-[75%] absolute fill-none overflow-visible"
        >
          {/* Main "Liquid" Body with Backdrop Blur */}
          <motion.path 
            d={fullShapeData} 
            className="fill-white/[0.05] backdrop-blur-2xl"
            style={{ 
                stroke: "rgba(255,255,255,0.1)",
                strokeWidth: 1,
                vectorEffect: "non-scaling-stroke" 
            }}
          />
          
          {/* Top Bending Highlight */}
          <motion.path 
            d={topPathData} 
            className="stroke-primary/30"
            style={{ 
                fill: "none", 
                strokeWidth: 2,
                vectorEffect: "non-scaling-stroke",
            }}
          />

          {/* Bottom Bending Highlight */}
          <motion.path 
            d={bottomPathData} 
            className="stroke-primary/50"
            style={{ 
                fill: "none", 
                strokeWidth: 2,
                vectorEffect: "non-scaling-stroke",
                filter: isMobile ? "none" : "drop-shadow(0 0 4px var(--primary))"
            }}
          />
        </svg>
      </div>

      {/* Content Layer - Removed py-4 to allow for a thinner navbar */}
      <motion.div
        style={isMobile ? {} : {
          y: contentY,
          rotateX: contentRotateX,
        }}
        className="w-full h-full relative z-10 flex items-center justify-center"
      >
        {children}
      </motion.div>
    </div>
  );
}

