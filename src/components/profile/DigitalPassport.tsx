"use client";

import { motion } from "framer-motion";
import { Edit3, Instagram, Twitter, Music, MapPin, Award, Loader2 } from "lucide-react";
import { useAuth } from "@/components/AuthContext";

interface UserProfile {
  name: string;
  username: string;
  avatar: string;
  bio: string;
  location: string;
  rank: string;
  socials: {
    instagram?: string;
    twitter?: string;
    spotify?: string;
  };
}

// Temporary mock data
const MOCK_USER: UserProfile = {
  name: "Alex Rivera",
  username: "@arivera_vibes",
  avatar: "https://i.pravatar.cc/300?img=12",
  bio: "Chasing sunsets and techno beats. 🌅 🎧",
  location: "New York City",
  rank: "Night Owl",
  socials: {
    instagram: "#",
    spotify: "#",
  }
};

export default function DigitalPassport() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="w-full h-64 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center animate-pulse">
        <Loader2 size={32} className="text-white/20 animate-spin" />
      </div>
    );
  }

  const profileData = {
    name: user?.full_name || user?.email?.split('@')[0] || MOCK_USER.name,
    username: user?.username ? `@${user.username}` : MOCK_USER.username,
    avatar: user?.avatar_url || "https://i.pravatar.cc/300?img=12",
    bio: MOCK_USER.bio, // Future: pull from user.bio if added to AuthUser
    location: MOCK_USER.location,
    rank: user?.role === "admin" ? "Admin" : MOCK_USER.rank,
    socials: MOCK_USER.socials
  };

  return (
    <div className="relative w-full rounded-[2rem] overflow-hidden bg-white/5 border border-white/10 group">
      {/* Cover Photo / Cinematic Header */}
      <div className="relative h-48 md:h-64 w-full overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&h=400&fit=crop" 
          alt="Cover" 
          className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        
        {/* Edit Cover Button */}
        <button className="absolute top-4 right-4 p-2 bg-black/40 backdrop-blur-md rounded-full text-white/70 hover:text-white transition-colors border border-white/10 hover:bg-white/10">
          <Edit3 size={16} />
        </button>
      </div>

      {/* Profile Info Container */}
      <div className="relative px-6 md:px-12 pb-8">
        
        {/* Avatar Stack */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 -mt-16 md:-mt-20 relative z-10 mb-6">
          <div className="flex items-end gap-6">
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-black overflow-hidden bg-black shadow-2xl">
              <img src={profileData.avatar} alt={profileData.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                 <Edit3 size={24} className="text-white" />
              </div>
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
              <p className="text-white/80 font-mono text-sm max-w-lg leading-relaxed">{profileData.bio}</p>
            </div>
            <div className="flex items-center gap-2 text-white/60 font-mono text-xs">
              <MapPin size={14} className="text-purple-400" />
              {profileData.location}
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] mb-2">Connect</p>
            <div className="flex gap-3">
              {profileData.socials.instagram && (
                <button className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 hover:border-pink-500/50 transition-all group">
                  <Instagram size={20} className="group-hover:scale-110 transition-transform" />
                </button>
              )}
              {profileData.socials.twitter && (
                <button className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 hover:border-blue-400/50 transition-all group">
                  <Twitter size={20} className="group-hover:scale-110 transition-transform" />
                </button>
              )}
              {profileData.socials.spotify && (
                <button className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 hover:border-green-400/50 transition-all group">
                  <Music size={20} className="group-hover:scale-110 transition-transform" />
                </button>
              )}
              <button className="w-12 h-12 rounded-full border border-dashed border-white/20 flex items-center justify-center text-white/40 hover:text-white hover:border-white/50 transition-all">
                <Edit3 size={16} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
