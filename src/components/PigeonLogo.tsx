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
      whileHover={{ scale: 1.05 }}
    >
      {/* Cinematic Orbit Ring */}
      <circle cx="50" cy="50" r="46" stroke="white" strokeWidth="2.5" opacity="0.9" />

      {/* Subtle Stardust (4-pointed stars) */}
      <g opacity="0.7">
        <motion.path 
          d="M32 30L34 32L32 34L30 32L32 30Z" 
          fill="white" 
          animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.path 
          d="M68 25L70 27L68 29L66 27L68 25Z" 
          fill="white" 
          animate={{ opacity: [0.4, 0.9, 0.4], scale: [0.9, 1.3, 0.9] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        />
        <motion.path 
          d="M35 68L37 70L35 72L33 70L35 68Z" 
          fill="white" 
          animate={{ opacity: [0.2, 0.7, 0.2], scale: [0.7, 1.1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
        />
      </g>

      {/* Master Flying Pigeon Silhouette (High Fidelity Refined) */}
      <path
        d="M72 48.5C68 46 62 44 58 46C54 48 51 51 50 55C48.5 60 49 66 51 71C48 69 45.5 65 44 61C41 53 41.5 44 45 37C48.5 30 55 24 62 21C52 25 42 33 38 44C34 55 36 67 43 77C36 70 32 61 32 51C32 41 36 30 43 21C23 31 10 51 10 74C12 67 16 61 23 57C30 53 38 54 46 57C36 54 26 54 16 57C14 71 16 84 23 91C16 83 12 73 10 63C6 61 0 61 -6 63L-8 61L-6 59C-3 58 0 58 3 59C6 58 9 56 12 54C19 50 28 47 38 47C48 47 58 50 64 54L72 48.5Z"
        fill="white"
        transform="translate(10, 0) scale(0.9)"
      />
    </motion.svg>
  );
}
