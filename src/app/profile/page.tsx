"use client";

import { useState } from "react";
import { Settings } from "lucide-react";
import DigitalPassport from "@/components/profile/DigitalPassport";
import MyRadar from "@/components/profile/MyRadar";
import SettingsModal from "@/components/profile/SettingsModal";

export default function ProfilePage() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black relative pb-24 md:pb-12 pt-20">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        
        {/* Top Header / Actions */}
        <div className="flex justify-end mb-6">
           <button 
             onClick={() => setIsSettingsOpen(true)}
             className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white/80 transition-all group"
           >
             <Settings size={18} className="group-hover:rotate-90 transition-transform duration-500" />
             <span className="font-black uppercase text-xs tracking-widest hidden md:inline">Settings</span>
           </button>
        </div>

        {/* Profile Content */}
        <DigitalPassport />
        <MyRadar />

      </div>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}
