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
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

export default function AuditLogs() {
  const supabase = createClient();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("audit_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (!error && data) {
        setLogs(data);
      }
      setLoading(false);
    };

    fetchLogs();
  }, [supabase]);

  return (
    <div className="p-12 space-y-12 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h2 className="font-lexend text-3xl font-black text-white uppercase tracking-tighter italic">AUDIT LOGS</h2>
          <p className="font-mono text-[9px] text-white/20 uppercase tracking-[0.5em] font-black italic">System Infrastructure Telemetry</p>
        </div>
        
        <div className="flex gap-4">
           <div className="px-6 py-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center gap-4 group hover:border-white/10 transition-all">
              <Search size={16} className="text-white/20" />
              <input type="text" placeholder="FILTER LOGS..." className="bg-transparent font-mono text-[10px] text-white outline-none placeholder:text-white/10 w-48" />
           </div>
        </div>
      </div>

      <div className="bg-black border border-white/5 rounded-[2rem] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-[10px]">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01]">
                <th className="px-8 py-6 text-white/20 font-black uppercase tracking-widest">Action</th>
                <th className="px-8 py-6 text-white/20 font-black uppercase tracking-widest">Metadata</th>
                <th className="px-8 py-6 text-white/20 font-black uppercase tracking-widest">Operator</th>
                <th className="px-8 py-6 text-white/20 font-black uppercase tracking-widest">Pulse</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <Loader2 size={24} className="animate-spin text-white/10 mx-auto" />
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center text-white/10 uppercase tracking-widest">
                    No telemetry currently archived
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="group hover:bg-white/[0.01] transition-all">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                         <div className={clsx(
                           "w-2 h-2 rounded-full blur-[1px]",
                           log.severity === "critical" ? "bg-red-500" : "bg-cyan-500"
                         )} />
                         <span className="text-white font-black">{log.action}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-white/40">{JSON.stringify(log.meta)}</td>
                    <td className="px-8 py-6">
                       <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-white/60">
                         {log.operator_id}
                       </span>
                    </td>
                    <td className="px-8 py-6 text-white/20">{new Date(log.created_at).toLocaleTimeString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
