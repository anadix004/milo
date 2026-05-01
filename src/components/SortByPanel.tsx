"use client";

import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

interface SortByPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const SORT_OPTIONS = [
  "BY POPULARITY",
  "PRICE LOW TO HIGH",
  "PRICE HIGH TO LOW"
];

export default function SortByPanel({ isOpen, onClose }: SortByPanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full right-0 md:right-16 mt-2 w-64 bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-[120]"
          >
            <div className="p-3 border-b border-white/10 bg-white/5">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-white/50 text-center">
                Sort By
              </h3>
            </div>
            <div className="flex flex-col py-2">
              {SORT_OPTIONS.map((option, idx) => (
                <button
                  key={option}
                  onClick={onClose}
                  className={clsx(
                    "w-full px-4 py-4 flex items-center justify-between text-sm font-bold transition-colors text-white/60 hover:text-white hover:bg-white/5",
                    idx !== SORT_OPTIONS.length - 1 && "border-b border-white/5"
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
