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
      {/* Ultra-Minimalist Solid White Bird Silhouette */}
      <path
        d="M82 45C78 44 72 43.5 68 45C64 46.5 61 49 60 53C58.5 58 59 64 61 69C58 67 55.5 63 54 59C51 51 51.5 42 55 35C58.5 28 65 22 72 19C62 23 52 31 48 42C44 53 46 65 53 75C46 68 42 59 42 49C42 39 46 28 53 19C33 29 20 49 20 72C22 65 26 59 33 55C40 51 48 52 56 55C46 52 36 52 26 55C24 69 26 82 33 89C26 81 22 71 20 61C16 59 10 59 4 61"
        fill="white"
      />
    </motion.svg>
  );
}
