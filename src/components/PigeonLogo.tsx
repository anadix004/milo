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
      whileHover={{ scale: 1.1 }}
    >
      {/* Cinematic Orbit Ring */}
      <circle cx="50" cy="50" r="46" stroke="white" strokeWidth="2" opacity="0.3" />

      {/* Iconic Pigeon Silhouette (Understandable & Professional) */}
      <motion.path
        d="M68 38C66 36 62 35 59 36C56 37 54 39 53 43C52.5 47 53 52 55 57C52 55 49.5 52 48 49C45 42 45.5 35 48 29C50.5 23 56 18 63 15C53 18 45 25 41 34C37 45 38 56 45 66C38 59 34 51 34 42C34 33 38 24 45 16C25 26 12 46 12 70C15 63 18 57 25 53C32 49 40 49 48 52C38 49 28 49 18 52C16 66 18 78 25 85C18 77 14 68 12 58C8 56 3 56 -3 58L-5 56L-3 54C0 53 3 53 6 54C9 52 12 50 15 48C22 44 31 41 41 41C51 41 61 44 68 49L72 44C74 42 77 41 80 41C83 41 85 43 85 46C85 49 84 51 82 52L68 38Z"
        fill="white"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      />
      
      {/* Subtle Tail Fan Detail */}
      <path d="M22 80L18 84M26 82L24 86" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.2" />
    </motion.svg>
  );
}
