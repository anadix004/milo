"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  UserPlus, 
  Shield, 
  Users, 
  X, 
  Loader2, 
  CheckCircle,
  Clock,
  ExternalLink,
  Search
} from "lucide-react";
import { supabase } from "@/utils/supabase";
import { useAuth } from "@/components/AuthContext";
import { useNotifications } from "@/components/NotificationContext";
import EventSubmission from "@/components/EventSubmission";
import clsx from "clsx";

export default function AccessControl() {
  const { session } = useAuth();
  const { addNotification } = useNotifications();
  
  const [roster, setRoster] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [emailInput, setEmailInput] = useState("");
  const [roleInput, setRoleInput] = useState<"admin" | "team">("team");
  const [isSyncing, setIsSyncing] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const fetchRoster = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .in("role", ["admin", "team", "owner"])
      .order("created_at", { ascending: false });

    if (!error) setRoster(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchRoster();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .ilike("email", `%${searchQuery}%`)
      .limit(5);
    
    if (!error) setSearchResults(data || []);
    setIsSearching(true); // Keeping pulse active for UI
    setTimeout(() => setIsSearching(false), 500);
  };

  const updateRole = async (targetId: string, email: string, newRole: string) => {
    if (!confirm(`Update ${email} to role: ${newRole.toUpperCase()}?`)) return;
    
    setIsSyncing(true);
    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", targetId);

    if (error) {
      addNotification("system", `System Error: Failed to update role for ${email}.`);
    } else {
      addNotification("radar", `Authorization Updated: ${email} is now ${newRole.toUpperCase()}.`);
      fetchRoster();
      setSearchResults([]);
      setSearchQuery("");
    }
    setIsSyncing(false);
  };

  const handleWhitelist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    setIsSyncing(true);
    try {
      const response = await fetch("/api/admin/add-team", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ email: emailInput, role: roleInput })
      });

      const result = await response.json();
      if (result.success) {
        addNotification("session", `Authorization complete: ${emailInput} added as ${roleInput}.`);
        setEmailInput("");
        fetchRoster();
      } else {
        addNotification("system", `Authorization failure: ${result.error}`);
      }
    } catch (err) {
      addNotification("system", "Whitelister synchronization failed.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleRevoke = async (id: string, email: string) => {
    if (!confirm(`Revoke authorized personnel access for ${email}?`)) return;

    const { error } = await supabase
      .from("profiles")
      .update({ role: "user" })
      .eq("id", id);

    if (error) {
      addNotification("system", `Failed to revoke access for ${email}`);
    } else {
      addNotification("radar", `Personnel Access Revoked: ${email}`);
      fetchRoster();
    }
  };

  return (
    <div className="w-full">
      <div className="max-w-4xl mx-auto px-6 py-20 pb-40 space-y-24">
        
        {/* THE WHITELISTER (VIP BOUNCER) */}
        <section className="space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
               <h2 className="font-lexend text-2xl font-black text-white uppercase tracking-tight flex items-center gap-4">
                  <Shield className="text-white/40" /> Role Command Nexus
               </h2>
               <p className="font-mono text-[10px] text-white/40 uppercase tracking-[0.4em]">Search and authorize platform personnel.</p>
            </div>
            
            <button 
              onClick={() => setIsEventModalOpen(true)}
              className="flex items-center gap-3 bg-purple-500 text-white px-8 py-4 rounded-2xl font-lexend font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-purple-500/20"
            >
              <UserPlus size={16} />
              Direct Mission Broadcast
            </button>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-3xl">
              <div className="flex-1 flex items-center gap-4 px-4 py-2 bg-white/[0.03] border border-white/5 rounded-2xl">
                <Search size={16} className="text-white/20" />
                <input 
                  type="text" 
                  placeholder="Identify Personnel by Email..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="flex-1 bg-transparent border-none text-sm text-white placeholder-white/20 outline-none font-mono tracking-widest uppercase font-black"
                />
              </div>
              <button 
                onClick={handleSearch}
                disabled={isSearching}
                className="bg-white text-black px-8 py-4 rounded-2xl font-lexend font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] transition-all"
              >
                {isSearching ? "Searching..." : "Identify User"}
              </button>
            </div>

            {searchResults.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden divide-y divide-white/5"
              >
                {searchResults.map(user => (
                  <div key={user.id} className="p-6 flex items-center justify-between group hover:bg-white/[0.03] transition-colors">
                    <div className="flex flex-col">
                      <span className="font-mono text-xs text-white uppercase font-black tracking-widest">{user.email}</span>
                      <span className="font-mono text-[8px] text-white/20 uppercase tracking-[0.2em] mt-1">Current Role: {user.role}</span>
                    </div>
                    <div className="flex items-center gap-2">
                       {["user", "team", "admin"].map(role => (
                         <button 
                           key={role}
                           onClick={() => updateRole(user.id, user.email, role)}
                           disabled={isSyncing || user.role === role}
                           className={clsx(
                             "px-4 py-2 rounded-xl font-mono text-[9px] font-black uppercase tracking-widest border transition-all",
                             user.role === role ? "border-white/20 text-white/20" : "border-white/5 text-white/40 hover:border-white/20 hover:text-white"
                           )}
                         >
                           {role}
                         </button>
                       ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        </section>

        {/* ACTIVE PERSONNEL ROSTER */}
        <section className="space-y-12">
          <div className="flex items-center justify-between">
             <div className="space-y-2">
                <h3 className="font-lexend text-xl font-black text-white uppercase tracking-tight">Active Personnel</h3>
                <p className="font-mono text-[9px] text-white/20 uppercase tracking-[0.4em]">Currently authorized heartbeat transmitters.</p>
             </div>
             <div className="px-4 py-2 bg-white/[0.02] border border-white/5 rounded-full">
                <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest font-black">{roster.length} Personnel Active</span>
             </div>
          </div>

          <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-3xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-8 py-6 font-mono text-[9px] text-white/20 uppercase tracking-[0.4em] font-black">User Email</th>
                  <th className="px-8 py-6 font-mono text-[9px] text-white/20 uppercase tracking-[0.4em] font-black">Role Badge</th>
                  <th className="px-8 py-6 font-mono text-[9px] text-white/20 uppercase tracking-[0.4em] font-black">Date Added</th>
                  <th className="px-8 py-6 font-mono text-[9px] text-white/20 uppercase tracking-[0.4em] font-black text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {roster.map((person) => (
                  <tr key={person.id} className="group hover:bg-white/[0.03] transition-colors">
                    <td className="px-8 py-6">
                       <span className="font-mono text-xs text-white/60 tracking-wider uppercase font-black">{person.email}</span>
                    </td>
                    <td className="px-8 py-6">
                       <div className={clsx(
                         "inline-flex items-center px-3 py-1 rounded-full font-mono text-[8px] font-black tracking-widest uppercase border",
                         person.role === "owner" ? "text-amber-400 border-amber-400/20 bg-amber-400/5" :
                         person.role === "admin" ? "text-blue-400 border-blue-400/20 bg-blue-400/5" :
                         "text-gray-400 border-gray-400/20 bg-gray-400/5"
                       )}>
                          {person.role}
                       </div>
                    </td>
                    <td className="px-8 py-6 text-white/20 font-mono text-[10px] tracking-widest uppercase">
                       {new Date(person.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-6 text-right">
                       {person.role !== "owner" && (
                         <button 
                           onClick={() => handleRevoke(person.id, person.email)}
                           className="text-white/20 hover:text-red-500 transition-colors p-2 rounded-xl hover:bg-red-500/10 flex items-center gap-2 justify-end ml-auto group/revoke"
                         >
                            <span className="font-lexend text-[8px] font-black uppercase tracking-[0.3em] opacity-0 group-hover/revoke:opacity-100 transition-opacity">Revoke Access</span>
                            <X size={14} />
                         </button>
                       )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {roster.length === 0 && !loading && (
              <div className="py-20 text-center space-y-4 opacity-20 uppercase font-mono text-[10px] tracking-[0.5em]">
                 The vault is empty.
              </div>
            )}

            {loading && (
              <div className="py-20 flex justify-center opacity-20">
                 <Loader2 className="animate-spin text-white" size={24} />
              </div>
            )}
          </div>
        </section>
      </div>
      
      <EventSubmission 
        isOpen={isEventModalOpen} 
        onClose={() => setIsEventModalOpen(false)} 
        onAuthRedirect={() => {}} 
      />
    </div>
  );
}
