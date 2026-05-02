"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, User, AtSign, Sparkles, Save, Loader2, Music, ChevronDown } from "lucide-react";
import clsx from "clsx";
import { useAuth } from "@/components/AuthContext";
import { useNotifications } from "@/components/NotificationContext";
import { useIsMobile } from "@/hooks/useMediaQuery";
import BottomSheet from "@/components/mobile/BottomSheet";

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_BIOS = [
  "Chasing sunsets and techno beats 🌅🎧",
  "Street food explorer on a mission 🍜🔥",
  "Night owl. Festival junkie. Always vibing 🦉🎪",
  "Living for the afterparty 🌃✨",
  "Art, chai, and deep conversations ☕🎨",
  "Weekend warrior. Weekday dreamer 💫",
  "If it's live music, I'm there 🎵🤘",
  "Rooftop hopper. City surfer 🏙️🌊",
  "Finding hidden gems in every city 💎",
  "Making memories, not plans 📸🎉",
];

const CITIES = [
  { value: "del", label: "Delhi - NCR" },
  { value: "blr", label: "Bengaluru" },
  { value: "mum", label: "Mumbai" },
];

export default function ProfileEditModal({ isOpen, onClose }: ProfileEditModalProps) {
  const { user, updateProfile } = useAuth();
  const { addNotification } = useNotifications();
  const isMobile = useIsMobile();
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [city, setCity] = useState("");
  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");
  const [spotify, setSpotify] = useState("");

  // Sync form with user data when modal opens
  useEffect(() => {
    if (isOpen && user) {
      setDisplayName(user.display_name || user.full_name || "");
      setUsername((user.username || "").replace("@", ""));
      setBio(user.bio || "");
      setCity(user.location || (user as any).city || "");
      setInstagram((user as any).instagram || "");
      setTwitter((user as any).twitter || "");
      setSpotify((user as any).spotify || "");
    }
  }, [isOpen, user]);

  // Body scroll locking
  useEffect(() => {
    if (!isMobile) {
      if (isOpen) document.body.style.overflow = "hidden";
      else document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen, isMobile]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updates: Record<string, any> = {
        display_name: displayName.trim(),
        username: username.trim().replace("@", ""),
        bio: bio.trim(),
        city: city,
      };

      // Only include social fields if the DB supports them
      // These will silently fail if columns don't exist yet
      if (instagram.trim()) updates.instagram = instagram.trim();
      if (twitter.trim()) updates.twitter = twitter.trim();
      if (spotify.trim()) updates.spotify = spotify.trim();

      await updateProfile(updates);
      addNotification("session", "Profile updated successfully.");
      onClose();
    } catch (err: any) {
      addNotification("system", `Failed to update profile: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const content = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0">
        <h2 className="text-xl font-black text-white uppercase tracking-tighter">Edit Profile</h2>
        <button onClick={onClose} className="p-2 rounded-full bg-white/5 text-white hover:bg-white/10 transition-colors">
          <X size={20} />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="overflow-y-auto flex-1 p-6 space-y-8 no-scrollbar touch-pan-y">

        {/* Display Name */}
        <section className="space-y-2">
          <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest flex items-center gap-2">
            <User size={12} /> Display Name
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Your name"
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 font-mono text-sm focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all"
          />
        </section>

        {/* Username */}
        <section className="space-y-2">
          <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest flex items-center gap-2">
            <AtSign size={12} /> Username
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 font-mono text-sm">@</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9._]/g, ""))}
              placeholder="username"
              className="w-full pl-8 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 font-mono text-sm focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all"
            />
          </div>
        </section>

        {/* Bio */}
        <section className="space-y-3">
          <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest flex items-center gap-2">
            <Sparkles size={12} /> Vibe / Bio
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value.slice(0, 150))}
            placeholder="Tell people what you're about..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 font-mono text-sm focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all resize-none"
          />
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-mono text-white/20">{bio.length}/150</span>
          </div>

          {/* Preset Bios */}
          <div className="space-y-2">
            <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest">Quick Vibes</p>
            <div className="flex flex-wrap gap-2">
              {PRESET_BIOS.map((preset) => (
                <button
                  key={preset}
                  onClick={() => setBio(preset)}
                  className={clsx(
                    "px-3 py-1.5 rounded-full text-[10px] font-mono transition-all border",
                    bio === preset
                      ? "bg-purple-500/20 border-purple-500/40 text-purple-300"
                      : "bg-white/[0.02] border-white/10 text-white/50 hover:bg-white/5 hover:text-white/80"
                  )}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* City / Location */}
        <section className="space-y-2">
          <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest flex items-center gap-2">
            <MapPin size={12} /> City
          </label>
          <div className="relative">
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all appearance-none cursor-pointer"
            >
              <option value="" className="bg-zinc-900">Select your city</option>
              {CITIES.map((c) => (
                <option key={c.value} value={c.value} className="bg-zinc-900">{c.label}</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
          </div>
        </section>

        {/* Social Links */}
        <section className="space-y-3">
          <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Social Links</p>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </div>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="Instagram username"
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 font-mono text-sm focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/30 transition-all"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="white"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </div>
              <input
                type="text"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                placeholder="X / Twitter handle"
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 font-mono text-sm focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1DB954] flex items-center justify-center shrink-0">
                <Music size={18} className="text-black" />
              </div>
              <input
                type="text"
                value={spotify}
                onChange={(e) => setSpotify(e.target.value)}
                placeholder="Spotify profile link"
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 font-mono text-sm focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/30 transition-all"
              />
            </div>
          </div>
        </section>

      </div>

      {/* Save Button — Fixed at bottom */}
      <div className="p-6 border-t border-white/10 shrink-0">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-white text-black font-black uppercase text-xs tracking-widest hover:bg-white/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <><Loader2 size={16} className="animate-spin" /> Saving...</>
          ) : (
            <><Save size={16} /> Save Changes</>
          )}
        </button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <BottomSheet isOpen={isOpen} onClose={onClose}>
        {content}
      </BottomSheet>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg max-h-[90vh] bg-zinc-950 border border-white/10 rounded-3xl z-[101] overflow-y-auto overscroll-contain flex flex-col"
          >
            {content}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
