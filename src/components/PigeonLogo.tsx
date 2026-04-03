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
      whileHover={{ y: -2 }}
    >
      {/* Pure, High-Fidelity Solid White Silhouette */}
      <path
        d="M88 42C84 41 78 40.5 74 42C70 43.5 67 46 66 50C64.5 55 65 61 67 66C64 64 61.5 60 60 56C57 48 57.5 39 61 32C64.5 25 71 19 78 16C68 20 58 28 54 39C50 50 52 62 59 72C52 65 48 56 48 46C48 36 52 25 59 16C39 26 26 46 26 69C28 62 32 56 39 52C46 48 54 49 62 52C52 49 42 49 32 52C30 66 32 79 39 86C32 78 28 68 26 58C22 56 16 56 10 58L8 56L10 54C13 53 16 53 19 54C22 53 25 51 28 49C35 45 44 42 54 42C64 42 74 45 80 49L88 42Z"
        fill="white"
      />
    </motion.svg>
  );
}
