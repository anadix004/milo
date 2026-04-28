"use client";

import { motion } from "framer-motion";
import { Edit3, Music, MapPin, Award, Loader2, Camera, Instagram } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/components/AuthContext";
import { useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { useNotifications } from "@/components/NotificationContext";

const CITY_LABELS: Record<string, string> = {
  del: "Delhi - NCR",
  blr: "Bengaluru",
  mum: "Mumbai",
};

interface DigitalPassportProps {
  onEditProfile: () => void;
}

export default function DigitalPassport({ onEditProfile }: DigitalPassportProps) {
  const { user, isLoading, updateProfile, refreshProfile } = useAuth();
  const { addNotification } = useNotifications();
  const supabase = createClient();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);

  if (isLoading) {
    return (
      <div className="w-full h-64 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center animate-pulse">
        <Loader2 size={32} className="text-white/20 animate-spin" />
      </div>
    );
  }

  const profileData = {
    name: user?.display_name || user?.full_name || user?.email?.split('@')[0] || "Anonymous",
    username: user?.username ? `@${user.username}` : `@${user?.email?.split('@')[0] || "user"}`,
    avatar: user?.avatar_url || null,
    bio: user?.bio || null,
    city: (user as any)?.city || user?.location || null,
    rank: user?.role === "admin" ? "Admin" : "Explorer",
    socials: {
      instagram: (user as any)?.instagram || null,
      twitter: (user as any)?.twitter || null,
      spotify: (user as any)?.spotify || null,
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setIsUploadingAvatar(true);
    try {
      const ext = file.name.split('.').pop();
      const fileName = `${user.id}_avatar_${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("avatars").upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(fileName);
      await updateProfile({ avatar_url: publicUrl } as any);
      addNotification("session", "Avatar updated.");
    } catch (err: any) {
      addNotification("system", `Avatar upload failed: ${err.message}`);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setIsUploadingCover(true);
    try {
      const ext = file.name.split('.').pop();
      const fileName = `${user.id}_cover_${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("avatars").upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(fileName);
      await updateProfile({ cover_url: publicUrl } as any);
      addNotification("session", "Cover photo updated.");
    } catch (err: any) {
      addNotification("system", `Cover upload failed: ${err.message}`);
    } finally {
      setIsUploadingCover(false);
    }
  };

  const coverUrl = (user as any)?.cover_url || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&h=400&fit=crop";

  return (
    <div className="relative w-full rounded-[2rem] overflow-hidden bg-white/5 border border-white/10 group">
      {/* Hidden file inputs */}
      <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
      <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />

      {/* Cover Photo / Cinematic Header */}
      <div className="relative h-48 md:h-64 w-full overflow-hidden">
        <Image
          src={coverUrl}
          alt="Cover"
          fill
          className="object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500"
          sizes="(max-width: 768px) 100vw, 1200px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        
        {/* Edit Cover Button */}
        <button
          onClick={() => coverInputRef.current?.click()}
          disabled={isUploadingCover}
          className="absolute top-4 right-4 p-2 bg-black/40 backdrop-blur-md rounded-full text-white/70 hover:text-white transition-colors border border-white/10 hover:bg-white/10"
        >
          {isUploadingCover ? <Loader2 size={16} className="animate-spin" /> : <Edit3 size={16} />}
        </button>
      </div>

      {/* Profile Info Container */}
      <div className="relative px-6 md:px-12 pb-8">
        
        {/* Avatar Stack */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 -mt-16 md:-mt-20 relative z-10 mb-6">
          <div className="flex items-end gap-6">
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-black overflow-hidden bg-black shadow-2xl">
              {profileData.avatar ? (
                <Image src={profileData.avatar} alt={profileData.name} fill className="object-cover" sizes="160px" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center">
                  <span className="text-4xl font-black text-white">{profileData.name[0]?.toUpperCase()}</span>
                </div>
              )}
              <button
                onClick={() => avatarInputRef.current?.click()}
                disabled={isUploadingAvatar}
                className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
              >
                {isUploadingAvatar ? <Loader2 size={24} className="text-white animate-spin" /> : <Camera size={24} className="text-white" />}
              </button>
            </div>
            
            <div className="mb-2 md:mb-6 hidden md:block">
              <h1 className="text-3xl font-black text-white uppercase tracking-tighter">{profileData.name}</h1>
              <p className="text-white/60 font-mono text-sm">{profileData.username}</p>
            </div>
          </div>

          {/* Trust Badges / Stats */}
          <div className="flex items-center gap-4 bg-black/40 backdrop-blur-xl border border-white/10 p-4 rounded-2xl md:mb-6 shrink-0 w-max">
            <div className="flex flex-col items-center px-4 border-r border-white/10">
              <span className="text-xs font-mono text-white/40 uppercase tracking-widest mb-1">Rank</span>
              <span className="font-black text-cyan-400 uppercase tracking-tight flex items-center gap-2"><Award size={14} /> {profileData.rank}</span>
            </div>
            <div className="flex flex-col items-center px-4">
              <span className="text-xs font-mono text-white/40 uppercase tracking-widest mb-1">Events</span>
              <span className="font-black text-white text-lg leading-none">14</span>
            </div>
          </div>
        </div>

        {/* Mobile Name/Username */}
        <div className="md:hidden mb-6">
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter">{profileData.name}</h1>
          <p className="text-white/60 font-mono text-sm">{profileData.username}</p>
        </div>

        {/* Bio & Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="md:col-span-2 space-y-4">
            <div>
              <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] mb-2">Vibe / Bio</p>
              {profileData.bio ? (
                <p className="text-white/80 font-mono text-sm max-w-lg leading-relaxed">{profileData.bio}</p>
              ) : (
                <button
                  onClick={onEditProfile}
                  className="text-white/30 hover:text-white/60 font-mono text-sm italic transition-colors"
                >
                  + Add your bio
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 text-white/60 font-mono text-xs">
              <MapPin size={14} className="text-purple-400" />
              {profileData.city ? (
                CITY_LABELS[profileData.city] || profileData.city
              ) : (
                <button
                  onClick={onEditProfile}
                  className="text-white/30 hover:text-white/60 italic transition-colors"
                >
                  + Set your city
                </button>
              )}
            </div>

            {/* Edit Profile Button */}
            <button
              onClick={onEditProfile}
              className="mt-2 px-6 py-2.5 rounded-full border border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-white/10 text-[10px] font-black uppercase tracking-widest transition-all"
            >
              Edit Profile
            </button>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] mb-2">Connect</p>
            <div className="flex gap-3">
              {profileData.socials.instagram && (
                <a href={`https://instagram.com/${profileData.socials.instagram}`} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 hover:border-pink-500/50 transition-all group">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                </a>
              )}
              {profileData.socials.twitter && (
                <a href={`https://x.com/${profileData.socials.twitter}`} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 hover:border-blue-400/50 transition-all group">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" className="group-hover:scale-110 transition-transform"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
              )}
              {profileData.socials.spotify && (
                <a href={profileData.socials.spotify} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 hover:border-green-400/50 transition-all group">
                  <Music size={20} className="group-hover:scale-110 transition-transform" />
                </a>
              )}
              <button
                onClick={onEditProfile}
                className="w-12 h-12 rounded-full border border-dashed border-white/20 flex items-center justify-center text-white/40 hover:text-white hover:border-white/50 transition-all"
              >
                <Edit3 size={16} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
