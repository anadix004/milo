"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Settings, ArrowLeft } from "lucide-react";
import DigitalPassport from "@/components/profile/DigitalPassport";
import MyRadar from "@/components/profile/MyRadar";
import SettingsModal from "@/components/profile/SettingsModal";
import ProfileEditModal from "@/components/profile/ProfileEditModal";

export default function ProfilePage() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [activeEditField, setActiveEditField] = useState<string | null>(null);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black relative pb-24 md:pb-12 pt-20">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        
        {/* Top Header / Actions */}
        <div className="flex justify-between mb-6">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white/80 transition-all group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-black uppercase text-xs tracking-widest hidden md:inline">Back</span>
          </button>
           <button 
             onClick={() => setIsSettingsOpen(true)}
             className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white/80 transition-all group"
           >
             <Settings size={18} className="group-hover:rotate-90 transition-transform duration-500" />
             <span className="font-black uppercase text-xs tracking-widest hidden md:inline">Settings</span>
           </button>
        </div>

        {/* Profile Content */}
        <DigitalPassport onEditProfile={() => setIsEditOpen(true)} />
        <MyRadar />

      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onEditProfile={(fieldId) => {
          setActiveEditField(fieldId ?? null);
          setIsEditOpen(true);
        }}
      />
      
      <ProfileEditModal
        isOpen={isEditOpen}
        onClose={() => { setIsEditOpen(false); setActiveEditField(null); }}
        activeField={activeEditField}
      />
    </div>
  );
}
