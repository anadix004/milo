"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Bell, Shield, Users, Zap, Trash2 } from "lucide-react";
import { useNotifications, NotificationType } from "./NotificationContext";
import clsx from "clsx";

interface NotificationSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const getIcon = (type: NotificationType) => {
  switch (type) {
    case "session": return <Shield className="text-emerald-500" size={16} />;
    case "social": return <Users className="text-purple-500" size={16} />;
    case "radar": return <Zap className="text-cyan-500" size={16} />;
    default: return <Bell className="text-white/40" size={16} />;
  }
};

export default function NotificationSidebar({ isOpen, onClose }: NotificationSidebarProps) {
  const { notifications, clearAll, markAllAsRead } = useNotifications();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
          />

          {/* Sidebar Panel */}
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 70, damping: 15 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-black/40 backdrop-blur-3xl border-l border-white/10 z-[210] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <div>
                <h2 className="font-lexend text-xl font-black text-white uppercase tracking-widest">Notification Hub</h2>
                <p className="font-mono text-[10px] text-white/30 uppercase tracking-[0.4em]">Historical Telemetry</p>
              </div>
              <button onClick={onClose} className="p-3 text-white/20 hover:text-white transition-all bg-white/5 rounded-full">
                <X size={20} />
              </button>
            </div>

            {/* Notifications Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-4">
              {notifications.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-20 space-y-4 text-center px-12">
                   <Bell size={48} strokeWidth={1} />
                   <p className="font-mono text-[10px] uppercase tracking-[0.5em]">No identification telemetry archived</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <motion.div 
                    key={n.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-6 bg-white/[0.03] border border-white/5 rounded-2xl space-y-3 group hover:border-white/20 transition-all"
                  >
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
                             {getIcon(n.type)}
                          </div>
                          <span className="font-lexend text-[10px] text-white/40 uppercase tracking-widest font-black">{n.type} ALERT</span>
                       </div>
                       <span className="font-mono text-[8px] text-white/20">{n.time}</span>
                    </div>
                    <p className="text-sm font-mono text-white/70 leading-relaxed uppercase tracking-tight">{n.message}</p>
                  </motion.div>
                ))
              )}
            </div>

            {/* Actions Hub Footer */}
            {notifications.length > 0 && (
              <div className="p-6 border-t border-white/5 grid grid-cols-2 gap-4">
                 <button 
                   onClick={markAllAsRead}
                   className="py-4 bg-white/5 border border-white/10 rounded-xl font-mono text-[9px] text-white/40 uppercase tracking-widest hover:bg-white/10 transition-all"
                 >
                   MARK ALL READ
                 </button>
                 <button 
                   onClick={clearAll}
                   className="py-4 bg-rose-500/10 border border-rose-500/20 rounded-xl font-mono text-[9px] text-rose-500/60 uppercase tracking-widest hover:bg-rose-500/20 transition-all flex items-center justify-center gap-2"
                 >
                   <Trash2 size={12} />
                   CLEAR ALL
                 </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
