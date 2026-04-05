"use client";

import { useState, useEffect } from "react";
import { 
  Terminal, 
  Search, 
  Filter, 
  ArrowRight,
  Database,
  ShieldCheck,
  ShieldAlert,
  Loader2
} from "lucide-react";
import { supabase } from "@/utils/supabase";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

export default function AuditLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    
    // We simulate audit logs by looking at recent across multiple tables
    // In a production environment, this would hit a dedicated 'audit_logs' table.
    const [ { data: profileLogs }, { data: eventLogs } ] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(10),
      supabase.from("events").select("*").order("created_at", { ascending: false }).limit(10)
    ]);

    const combined = [
      ...(profileLogs || []).map(p => ({
        id: `p-${p.id}`,
        time: p.created_at,
        type: "AUTH_INIT",
        user: p.email,
        details: `Personnel authorized as ${p.role.toUpperCase()}`,
        status: "SUCCESS"
      })),
      ...(eventLogs || []).map(e => ({
        id: `e-${e.id}`,
        time: e.created_at,
        type: "RADAR_SYNC",
        user: "System",
        details: `Event "${e.title}" detected at ${e.location}`,
        status: e.is_verified ? "VERIFIED" : "PENDING"
      }))
    ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

    setLogs(combined);
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
      <div className="max-w-4xl mx-auto px-6 py-20 pb-40 space-y-16">
        
        {/* HEADER */}
        <div className="flex items-center justify-between">
           <div className="space-y-4">
              <h2 className="font-lexend text-2xl font-black text-white uppercase tracking-tight flex items-center gap-4">
                 <Terminal className="text-white/40" /> Audit Logs
              </h2>
              <p className="font-mono text-[10px] text-white/40 uppercase tracking-[0.4em]">System activity pulse & authorization history.</p>
           </div>
           <button onClick={fetchLogs} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/5 transition-all">
              <Database size={16} className="text-white/20" />
           </button>
        </div>

        {/* LOG FEED */}
        <div className="bg-white/[0.01] border border-white/5 rounded-[2.5rem] overflow-hidden font-mono text-[11px] leading-relaxed">
          <div className="p-8 border-b border-white/5 flex items-center gap-4 text-white/20 uppercase tracking-widest text-[9px] font-black italic">
             <ShieldCheck size={12} /> Root Authorization Active // Logs Locked
          </div>
          
          <div className="divide-y divide-white/5">
             <AnimatePresence mode="popLayout">
                {logs.map((log) => (
                  <motion.div 
                    key={log.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-8 group hover:bg-white/[0.01] transition-all flex gap-10 items-start"
                  >
                     <div className="w-24 text-white/20 flex-shrink-0">
                        {new Date(log.time).toLocaleTimeString([], { hour12: false })}
                     </div>
                     <div className="w-32 flex-shrink-0">
                        <span className={clsx(
                          "px-3 py-1 rounded-md text-[9px] font-black tracking-widest",
                          log.type === "AUTH_INIT" ? "bg-blue-500/10 text-blue-400" : "bg-purple-500/10 text-purple-400"
                        )}>
                           {log.type}
                        </span>
                     </div>
                     <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                           <span className="text-white/40">{log.user}</span>
                           <ArrowRight size={10} className="text-white/10" />
                           <span className="text-white/80">{log.details}</span>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           <span className={clsx(
                             "text-[8px] font-black tracking-widest uppercase px-2 py-0.5 rounded",
                             log.status === "SUCCESS" || log.status === "VERIFIED" ? "text-emerald-500 bg-emerald-500/10" : "text-amber-500 bg-amber-500/10"
                           )}>
                              {log.status}
                           </span>
                           <span className="text-white/5">ID: {log.id}</span>
                        </div>
                     </div>
                  </motion.div>
                ))}
             </AnimatePresence>
          </div>

          {loading && (
            <div className="py-20 flex justify-center opacity-20">
               <Loader2 className="animate-spin text-white" size={24} />
            </div>
          )}

          {!loading && logs.length === 0 && (
            <div className="py-20 text-center space-y-4 opacity-20 uppercase tracking-[0.5em]">
               System clean. No logs detected.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
