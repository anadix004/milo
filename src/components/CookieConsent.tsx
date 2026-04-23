"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already given consent
    const consent = localStorage.getItem("milo_cookie_consent");
    if (!consent) {
      // Small delay so it doesn't pop up instantly on page load
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("milo_cookie_consent", "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("milo_cookie_consent", "declined");
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className="fixed bottom-4 left-4 right-4 md:bottom-8 md:left-auto md:right-8 md:max-w-sm z-[200] bg-zinc-950 border border-white/10 rounded-2xl p-5 shadow-[0_20px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/5 rounded-full shrink-0">
              <Cookie size={20} className="text-purple-400" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-white font-black uppercase tracking-widest text-xs">We use cookies</h3>
                <button onClick={handleDecline} className="text-white/40 hover:text-white transition-colors">
                  <X size={16} />
                </button>
              </div>
              <p className="text-[10px] text-white/50 font-mono leading-relaxed mb-4">
                We use cookies to ensure you get the best experience on our social radar, analyze traffic, and sync your digital passport securely.
              </p>
              <div className="flex gap-2">
                <button 
                  onClick={handleAccept}
                  className="flex-1 bg-white text-black py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-transform"
                >
                  Accept All
                </button>
                <button 
                  onClick={handleDecline}
                  className="flex-1 bg-white/5 border border-white/10 text-white py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-colors"
                >
                  Decline
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
