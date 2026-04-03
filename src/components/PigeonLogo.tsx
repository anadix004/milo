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
        y: [0, -2, 0],
        rotate: [0, 2, -2, 0]
      } : {}}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <defs>
        <linearGradient id="pigeon-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FB923C" /> {/* Orange */}
          <stop offset="50%" stopColor="#EC4899" /> {/* Pink/Magenta */}
          <stop offset="100%" stopColor="#8B5CF6" /> {/* Purple */}
        </linearGradient>
      </defs>

      {/* Trailing Sparks */}
      <motion.path
        d="M15 35L18 38L15 41L12 38L15 35Z"
        fill="url(#pigeon-gradient)"
        opacity="0.6"
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <motion.path
        d="M22 45L26 49L22 53L18 49L22 45Z"
        fill="url(#pigeon-gradient)"
        opacity="0.8"
        animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
      />
      <motion.path
        d="M18 58L20 60L18 62L16 60L18 58Z"
        fill="url(#pigeon-gradient)"
        opacity="0.4"
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
      />

      {/* Main Bird Silhouette (Simplified approximation of the provided image) */}
      <path
        d="M85 35C75 35 65 38 60 45C55 42 45 30 35 25C40 35 45 45 52 50C48 55 40 60 30 65C40 65 50 62 58 55C62 60 68 75 75 85C72 75 70 65 72 58C78 55 85 52 92 50C88 48 85 42 85 35Z"
        fill="url(#pigeon-gradient)"
        stroke="white"
        strokeWidth="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Head Detail Curve */}
      <path
        d="M78 37C80 39 82 42 83 45"
        stroke="white"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.3"
      />
    </motion.svg>
  );
}
