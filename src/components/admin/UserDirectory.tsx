"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { motion } from "framer-motion";
import { Users, Shield, ShieldAlert, ShieldCheck, Search, Loader2 } from "lucide-react";
import clsx from "clsx";

interface Profile {
  id: string;
  email: string;
  role: string;
  created_at: string;
  username?: string;
}

export default function UserDirectory() {
  const supabase = createClient();
  const [users, setUsers] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (data) setUsers(data);
    setIsLoading(false);
  };

  const toggleRole = async (id: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    if (confirm(`Change this user's role to ${newRole.toUpperCase()}?`)) {
      const { error } = await supabase
        .from("profiles")
        .update({ role: newRole })
        .eq("id", id);
      
      if (!error) {
        setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-black">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">
            User Directory
          </h2>
          <p className="text-white/40 font-mono text-[10px] uppercase tracking-[0.3em] mt-2">
            Manage roles and permissions
          </p>
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
          <input 
            type="text" 
            placeholder="FIND USER..." 
            className="pl-10 pr-6 py-3 bg-white/[0.05] border border-white/10 rounded-full text-[10px] text-white outline-none focus:border-white/30 font-black tracking-widest uppercase w-full md:w-64"
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-neutral-950/50 rounded-3xl border border-white/5">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr] gap-4 p-8 border-b border-white/10 text-[9px] font-mono uppercase tracking-[0.2em] text-white/40">
            <div>Profile</div>
            <div>Email Address</div>
            <div>Role</div>
            <div>Joined</div>
            <div className="text-right">Access</div>
          </div>

          {isLoading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="animate-spin text-purple-500" size={32} />
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {users.map((user) => (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  key={user.id} 
                  className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr] gap-4 p-8 items-center hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-white font-black">
                      {(user.username || user.email || "?")[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white font-black uppercase tracking-tight">@{user.username || "anon"}</p>
                      <p className="text-white/20 text-[8px] font-mono uppercase truncate max-w-[150px]">{user.id}</p>
                    </div>
                  </div>
                  <div className="text-white/60 font-mono text-xs">
                    {user.email}
                  </div>
                  <div>
                    <span className={clsx(
                      "px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em]",
                      user.role === "admin" 
                        ? "bg-purple-500/20 text-purple-400 border border-purple-500/30" 
                        : "bg-white/5 text-white/40 border border-white/10"
                    )}>
                      {user.role}
                    </span>
                  </div>
                  <div className="text-white/40 font-mono text-[10px]">
                    {new Date(user.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex justify-end">
                    <button 
                      onClick={() => toggleRole(user.id, user.role)}
                      className={clsx(
                        "p-3 rounded-2xl transition-all",
                        user.role === "admin" 
                          ? "bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-black" 
                          : "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-black"
                      )}
                    >
                      {user.role === "admin" ? <ShieldAlert size={18} /> : <ShieldCheck size={18} />}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
