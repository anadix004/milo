"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { motion } from "framer-motion";
import { Shield, ShieldCheck, Mail, Loader2, Plus, UserX } from "lucide-react";
import clsx from "clsx";
import { useNotifications } from "../NotificationContext";

interface AdminProfile {
  id: string;
  email: string;
  role: string;
  created_at: string;
  username?: string;
}

export default function TeamPanel() {
  const supabase = createClient();
  const { addNotification } = useNotifications();
  const [admins, setAdmins] = useState<AdminProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInviting, setIsInviting] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .in("role", ["admin", "owner"])
      .order("created_at", { ascending: false });
    
    if (data) setAdmins(data);
    setIsLoading(false);
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;

    setIsInviting(true);
    try {
      const res = await fetch("/api/admin/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail, action: "invite" })
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Failed to invite");
      
      addNotification("radar", data.message);
      setInviteEmail("");
      fetchAdmins();
    } catch (err: any) {
      addNotification("system", `Invite Error: ${err.message}`);
    } finally {
      setIsInviting(false);
    }
  };

  const revokeAccess = async (email: string) => {
    if (email === "milo.anadi@gmail.com") {
      addNotification("system", "Cannot revoke access from the core platform owner.");
      return;
    }
    
    if (confirm(`Are you sure you want to revoke Admin access for ${email}?`)) {
      try {
        const res = await fetch("/api/admin/team", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, action: "revoke" })
        });
        
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        
        addNotification("radar", data.message);
        fetchAdmins();
      } catch (err: any) {
        addNotification("system", `Revoke Error: ${err.message}`);
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-black">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">
            Team Access
          </h2>
          <p className="text-white/40 font-mono text-[10px] uppercase tracking-[0.3em] mt-2">
            Manage administrative privileges
          </p>
        </div>
      </div>

      <div className="flex gap-8 h-[calc(100%-80px)]">
        {/* Left Side: Admins List */}
        <div className="flex-1 overflow-auto bg-neutral-950/50 rounded-3xl border border-white/5">
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 p-8 border-b border-white/10 text-[9px] font-mono uppercase tracking-[0.2em] text-white/40">
            <div>Administrator</div>
            <div>Role</div>
            <div>Joined</div>
            <div className="text-right">Actions</div>
          </div>

          {isLoading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="animate-spin text-purple-500" size={32} />
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {admins.map((admin) => (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  key={admin.id} 
                  className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 p-8 items-center hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center text-purple-400 font-black">
                      <Shield size={18} />
                    </div>
                    <div>
                      <p className="text-white font-black uppercase tracking-tight">@{admin.username || admin.email.split('@')[0]}</p>
                      <p className="text-white/40 text-[10px] font-mono truncate max-w-[200px]">{admin.email}</p>
                    </div>
                  </div>
                  
                  <div>
                    <span className={clsx(
                      "px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em]",
                      admin.role === "owner" 
                        ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" 
                        : "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                    )}>
                      {admin.role}
                    </span>
                  </div>
                  
                  <div className="text-white/40 font-mono text-[10px]">
                    {new Date(admin.created_at).toLocaleDateString()}
                  </div>
                  
                  <div className="flex justify-end">
                    {admin.email !== "milo.anadi@gmail.com" ? (
                      <button 
                        onClick={() => revokeAccess(admin.email)}
                        className="p-3 rounded-2xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-black transition-all"
                        title="Revoke Access"
                      >
                        <UserX size={18} />
                      </button>
                    ) : (
                      <div className="p-3 rounded-2xl bg-white/5 text-white/20" title="Core Owner (Cannot be removed)">
                        <ShieldCheck size={18} />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Add New Admin */}
        <div className="w-96 shrink-0 space-y-6">
          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8">
            <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">Grant Access</h3>
            <p className="text-white/40 font-mono text-[10px] uppercase tracking-[0.2em] mb-8 leading-relaxed">
              Invite a new team member or promote an existing user to Administrator.
            </p>
            
            <form onSubmit={handleInvite} className="space-y-6">
              <div className="space-y-3">
                <label className="text-[9px] text-white/40 font-mono uppercase tracking-[0.3em] ml-2">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                  <input 
                    type="email" 
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="agent@miloradar.com" 
                    className="w-full pl-12 pr-4 py-4 bg-black border border-white/10 rounded-2xl text-xs text-white outline-none focus:border-purple-500/50 transition-all font-mono"
                  />
                </div>
              </div>
              
              <button 
                type="submit" 
                disabled={isInviting || !inviteEmail}
                className="w-full py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isInviting ? <Loader2 size={16} className="animate-spin" /> : <><Plus size={16} /> Authorize Admin</>}
              </button>
            </form>
          </div>
          
          <div className="p-6 border border-white/5 rounded-3xl bg-neutral-900/30">
            <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2 flex items-center gap-2">
              <ShieldAlert size={14} /> Security Notice
            </h4>
            <p className="text-[10px] text-white/40 font-mono leading-relaxed">
              Administrators have full access to view, edit, and delete events, as well as moderate content on the platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
