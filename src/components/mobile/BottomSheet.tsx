"use client";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";
import { ReactNode, useEffect } from "react";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  snapHeight?: string; // e.g. "90vh", "85vh" — default "90vh"
  className?: string;
}

export default function BottomSheet({ isOpen, onClose, children, snapHeight = "90vh", className = "" }: BottomSheetProps) {
  const y = useMotionValue(0);
  
  // Prevent body scroll when sheet is open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[110]"
          />
          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={{ top: 0, bottom: 0.3 }}
            onDragEnd={(_, info) => {
              if (info.velocity.y > 500 || info.offset.y > 150) onClose();
            }}
            style={{ y, maxHeight: snapHeight, paddingBottom: "env(safe-area-inset-bottom)" }}
            className={`fixed bottom-0 inset-x-0 z-[120] bg-black border-t border-white/10 rounded-t-[2rem] overflow-hidden ${className}`}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-4 pb-2 cursor-grab active:cursor-grabbing">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>
            <div className="overflow-y-auto h-full px-6 pb-20 overscroll-contain" style={{ WebkitOverflowScrolling: "touch" }}>
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
