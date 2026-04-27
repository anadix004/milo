"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { motion } from "framer-motion";
import { Users, Calendar, Activity, TrendingUp, MapPin, Loader2 } from "lucide-react";
import clsx from "clsx";

interface Stats {
  totalUsers: number;
  totalEvents: number;
  pendingApprovals: number;
  totalRSVPs: number;
}

export default function DashboardView() {
  const supabase = createClient();
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      // Fetch User Count
      const { count: userCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      // Fetch Event Counts
      const { data: eventData } = await supabase
        .from("events")
        .select("is_verified");
      
      const totalEvents = eventData?.filter(e => e.is_verified).length || 0;
      const pendingApprovals = eventData?.filter(e => !e.is_verified).length || 0;

      // Fetch RSVP Count
      const { count: rsvpCount } = await supabase
        .from("rsvps")
        .select("*", { count: "exact", head: true });

      setStats({
        totalUsers: userCount || 0,
        totalEvents,
        pendingApprovals,
        totalRSVPs: rsvpCount || 0
      });
    } catch (err) {
      console.error("Error fetching admin stats:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="animate-spin text-purple-500" size={40} />
      </div>
    );
  }

  const statCards = [
    { label: "Total Users", value: stats?.totalUsers, icon: <Users size={20} />, color: "text-blue-400", bg: "bg-blue-500/10" },
    { label: "Live Events", value: stats?.totalEvents, icon: <Calendar size={20} />, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { label: "Pending Approvals", value: stats?.pendingApprovals, icon: <Activity size={20} />, color: "text-amber-400", bg: "bg-amber-500/10" },
    { label: "Total RSVPs", value: stats?.totalRSVPs, icon: <TrendingUp size={20} />, color: "text-purple-400", bg: "bg-purple-500/10" },
  ];

  return (
    <div className="space-y-12">
      <header>
        <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">
          Platform Overview
        </h2>
        <p className="text-white/40 font-mono text-[10px] uppercase tracking-[0.3em] mt-2">
          Real-time intelligence dashboard
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-6 md:p-8 bg-white/[0.03] border border-white/10 rounded-[2rem] hover:bg-white/[0.05] transition-all group"
          >
            <div className={clsx("w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110", stat.bg, stat.color)}>
              {stat.icon}
            </div>
            <div className="space-y-1">
              <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
              <p className="text-3xl font-black text-white tracking-tighter">{stat.value?.toLocaleString()}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Placeholder for Analytics Chart */}
        <div className="p-6 md:p-8 bg-white/[0.03] border border-white/10 rounded-[2.5rem] h-[400px] flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 text-white/20">
            <MapPin size={32} />
          </div>
          <h4 className="text-white/20 font-black uppercase tracking-widest text-xs">City Distribution</h4>
          <p className="text-white/10 font-mono text-[8px] uppercase tracking-widest mt-2">Chart module connecting...</p>
        </div>

        <div className="p-6 md:p-8 bg-white/[0.03] border border-white/10 rounded-[2.5rem] h-[400px] flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 text-white/20">
            <Activity size={32} />
          </div>
          <h4 className="text-white/20 font-black uppercase tracking-widest text-xs">User Engagement</h4>
          <p className="text-white/10 font-mono text-[8px] uppercase tracking-widest mt-2">Activity stream connecting...</p>
        </div>
      </div>
    </div>
  );
}
