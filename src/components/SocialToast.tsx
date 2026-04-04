"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Bell, X } from "lucide-react";

interface SocialAlert {
  id: string;
  friendName: string;
}

const SPRING_CONFIG = { stiffness: 70, damping: 15 };

export default function SocialToast() {
  const [alerts, setAlerts] = useState<SocialAlert[]>([]);

  const removeAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const triggerFriendAlert = useCallback((name: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setAlerts((prev) => [...prev, { id, friendName: name }]);
    
    // Auto-dismiss after 5s
    setTimeout(() => removeAlert(id), 5000);
  }, [removeAlert]);

  useEffect(() => {
    // Expose to window for testing as requested
    (window as any).triggerFriendAlert = triggerFriendAlert;
    
    return () => {
      delete (window as any).triggerFriendAlert;
    };
  }, [triggerFriendAlert]);

  return (
    <div className="fixed top-8 right-8 z-[1000] flex flex-col gap-4 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {alerts.map((alert) => (
          <motion.div
            key={alert.id}
            initial={{ x: 400, opacity: 0, filter: "blur(10px)" }}
            animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
            exit={{ x: 400, opacity: 0, filter: "blur(10px)" }}
            transition={SPRING_CONFIG}
            className="pointer-events-auto group relative w-full bg-white/[0.03] border border-white/10 backdrop-blur-3xl rounded-[2rem] p-6 flex items-center gap-5 shadow-2xl overflow-hidden"
          >
            {/* Animated accent line */}
            <motion.div 
               initial={{ scaleX: 0 }}
               animate={{ scaleX: 1 }}
               transition={{ duration: 5, ease: "linear" }}
               className="absolute bottom-0 left-0 right-0 h-1 bg-purple-500 origin-left opacity-30"
            />

            <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center border border-white/10 shrink-0">
               <Users className="text-purple-400" size={24} />
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                 <Bell size={10} className="text-white/20 animate-pulse" />
                 <span className="text-[10px] font-lexend font-black uppercase text-white/40 tracking-[0.3em]">Social Alert</span>
              </div>
              <p className="text-sm font-lexend text-white font-black tracking-tight uppercase">
                {alert.friendName} <span className="text-white/40 italic">is hitting this event!</span>
              </p>
            </div>

            <button 
              onClick={() => removeAlert(alert.id)}
              className="p-2 text-white/20 hover:text-white transition-all opacity-0 group-hover:opacity-100"
            >
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
