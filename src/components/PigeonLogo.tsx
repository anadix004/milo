"use client";

import { motion } from "framer-motion";

interface PigeonLogoProps {
  className?: string;
  size?: number;
  animate?: boolean;
}

export default function PigeonLogo({ className, size = 24, animate = true }: PigeonLogoProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      animate={animate ? {
        y: [0, -3, 0],
      } : {}}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <defs>
        <filter id="white-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* High-Precision Trailing Sparks (White glints) */}
      <g opacity="0.4">
        <motion.path
          d="M12 28C14 29 15 31 12 32C10 31 9 29 12 28Z"
          fill="white"
          animate={{ opacity: [0.2, 0.6, 0.2], scale: [0.8, 1.1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.path
          d="M20 38C22 40 24 42 20 44C18 42 16 40 20 38Z"
          fill="white"
          animate={{ opacity: [0.4, 0.8, 0.4], scale: [0.9, 1.2, 0.9] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
        />
        <motion.path
          d="M15 52C16 53 17 54 15 55C14 54 13 53 15 52Z"
          fill="white"
          animate={{ opacity: [0.1, 0.4, 0.1], scale: [0.7, 1.0, 0.7] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.8 }}
        />
      </g>

      {/* Master Cinematic Silhouette (Solid White / High Fidelity) */}
      <motion.path
        d="M94 48.5C89 47 83 46 79 47.5C75 49 72 52 71 56C69.5 61 70 67 72 72C69 70 66.5 66 65 62C62 54 62.5 45 66 38C69.5 31 76 25 83 22C73 26 63 34 59 45C55 56 57 68 64 78C57 71 53 62 53 52C53 42 57 31 64 22C44 32 31 52 33 75C35 68 39 62 46 58C53 54 61 55 69 58C59 55 49 55 39 58C37 72 39 85 46 92C39 84 35 74 33 64C29 62 23 62 17 64"
        fill="white"
        filter="url(#white-glow)"
        style={{ filter: "drop-shadow(0 0 5px rgba(255, 255, 255, 0.3))" }}
      />
      
      {/* Precision Tip Detail */}
      <path
        d="M95 48L89 44C92 46 94 47 95 48Z"
        fill="white"
      />
    </motion.svg>
  );
}
