"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, PlusCircle, Globe, ShieldCheck, Lock, Upload, Video, Image as ImageIcon, CheckCircle2, Loader2 } from "lucide-react";
import { useState, useRef } from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "@/utils/supabase";
import { useNotifications } from "./NotificationContext";
import clsx from "clsx";

interface EventSubmissionProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthRedirect: () => void;
}

const SPRING_CONFIG = { stiffness: 70, damping: 15 };

export default function EventSubmission({ isOpen, onClose, onAuthRedirect }: EventSubmissionProps) {
  const { user, isAuthenticated } = useAuth();
  const { addNotification } = useNotifications();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ 
    title: "", 
    cityId: "Delhi NCR", 
    date: "", 
    description: "", 
    price: "Free",
    category: "Culture" 
  });
  
  const [media, setMedia] = useState<{ photo: File | null; video: File | null }>({ photo: null, video: null });

  // --- GATEKEEPER: MEDIA VALIDATION ---
  const validateMedia = async (e: React.ChangeEvent<HTMLInputElement>, type: "photo" | "video") => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === "photo") {
       if (file.size > 1024 * 1024) { // 1MB limit
          addNotification("system", "Visual Frame Overflow: Photo exceeds 1MB limit.");
          e.target.value = "";
          return;
       }
       setMedia(prev => ({ ...prev, photo: file }));
       addNotification("system", "Visual Frame Synchronized.");
    }

    if (type === "video") {
       if (file.size > 2 * 1024 * 1024) { // 2MB limit
          addNotification("system", "Kinetic Sequence Overflow: Video exceeds 2MB limit.");
          e.target.value = "";
          return;
       }

       // Duration Check: The 10.5s Rule
       const video = document.createElement("video");
       video.preload = "metadata";
       video.onloadedmetadata = () => {
         window.URL.revokeObjectURL(video.src);
         if (video.duration > 10.5) {
            addNotification("system", "Temporal Violation: Broadcast must be 10.5s or less.");
            e.target.value = "";
         } else {
            setMedia(prev => ({ ...prev, video: file }));
            addNotification("system", "Kinetic Sequence Synchronized.");
         }
       };
       video.src = URL.createObjectURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user) return;
    setIsSubmitting(true);

    try {
      let imageUrl = "";
      let videoUrl = "";

      // 1. Upload Visuals to identification Bucket
      if (media.photo) {
        const ext = media.photo.name.split(".").pop();
        const fileName = `${Date.now()}_img.${ext}`;
        const { data, error } = await supabase.storage.from("event-assets").upload(fileName, media.photo);
        if (error) throw error;
        imageUrl = supabase.storage.from("event-assets").getPublicUrl(fileName).data.publicUrl;
      }

      if (media.video) {
        const ext = media.video.name.split(".").pop();
        const fileName = `${Date.now()}_vid.${ext}`;
        const { data, error } = await supabase.storage.from("event-assets").upload(fileName, media.video);
        if (error) throw error;
        videoUrl = supabase.storage.from("event-assets").getPublicUrl(fileName).data.publicUrl;
      }

      // 2. synchronize mission to Events Identification Table
      const { error: dbError } = await supabase.from("events").insert({
        title: formData.title,
        description: formData.description,
        location: formData.cityId,
        cityId: formData.cityId.toLowerCase().replace(" ", "-"),
        date: formData.date,
        price: formData.price,
        category: formData.category,
        image: imageUrl || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
        video_url: videoUrl,
        user_id: user.id,
        is_verified: false // Awaiting Admin verification
      });

      if (dbError) throw dbError;

      addNotification("radar", "Mission pulse reaches 100% synchronization. Awaiting Admin verification.");
      onClose();
    } catch (err: any) {
      addNotification("system", `Identification Sync Failed: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-6 overflow-y-auto">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/90 backdrop-blur-3xl" />

          <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} transition={SPRING_CONFIG} className="relative w-full max-w-3xl bg-neutral-950 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            {/* Header Hub */}
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400"><PlusCircle size={24} /></div>
                  <div>
                    <h2 className="text-white text-xl font-black uppercase tracking-tight">Initiate Radar broadcast</h2>
                    <p className="text-[10px] text-purple-500 uppercase tracking-[0.4em] mt-1 font-black">Verified Identity Hub</p>
                  </div>
               </div>
               <button onClick={onClose} className="text-white/20 hover:text-white transition-colors"><X size={32} /></button>
            </div>

            <div className="flex-1 p-8 md:p-12 overflow-y-auto no-scrollbar">
               {!isAuthenticated ? (
                 <div className="py-20 flex flex-col items-center justify-center text-center space-y-8">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center border border-white/10"><Lock size={40} className="text-white/20" /></div>
                    <h3 className="text-2xl font-black uppercase tracking-tight text-white">Identification Required</h3>
                    <p className="text-white/40 text-sm max-w-xs font-mono">Authenticate your Milo identity to broadcast missions to the Live Radar.</p>
                    <button onClick={() => { onClose(); onAuthRedirect(); }} className="bg-white text-black px-12 py-5 rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-all">Identify Pulse</button>
                 </div>
               ) : (
                 <form onSubmit={handleSubmit} className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <InputGroup label="Mission Title" placeholder="What's happening?" value={formData.title} onChange={(v: string) => setFormData({...formData, title: v})} />
                       <InputGroup label="Temporal Sync (Date)" placeholder="YYYY-MM-DD" type="date" value={formData.date} onChange={(v: string) => setFormData({...formData, date: v})} />
                    </div>
                    
                    <div className="space-y-4">
                       <label className="text-[10px] text-white/30 uppercase tracking-[0.4em] ml-2 font-black">Broadcast Narrative</label>
                       <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Synchronization details..." className="w-full bg-white/[0.03] border border-white/10 rounded-[2rem] p-6 text-sm text-white placeholder:text-white/10 outline-none focus:border-white/30 h-32 no-scrollbar" required />
                    </div>

                    <div className="space-y-6">
                       <p className="text-[10px] font-mono text-white/20 uppercase tracking-[0.4em] font-black text-center">Media Gatekeeper Sync</p>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <MediaInput label="Visual (1MB)" icon={<ImageIcon size={20} />} onSelect={(e: any) => validateMedia(e, "photo")} accept="image/*" active={!!media.photo} />
                          <MediaInput label="Kinetic (10s/2MB)" icon={<Video size={20} />} onSelect={(e: any) => validateMedia(e, "video")} accept="video/*" active={!!media.video} />
                       </div>
                    </div>

                    <button disabled={isSubmitting} className="w-full bg-white text-black py-8 rounded-full font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50">
                       {isSubmitting ? <Loader2 className="animate-spin mx-auto" /> : "Authorize Broadcast"}
                    </button>
                 </form>
               )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function InputGroup({ label, placeholder, value, onChange, type = "text" }: { label: string; placeholder: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div className="space-y-3">
      <label className="text-[10px] text-white/30 uppercase tracking-[0.4em] ml-2 font-black">{label}</label>
      <input required type={type} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-sm text-white outline-none focus:border-white/30 transition-all font-black tracking-widest" />
    </div>
  );
}

function MediaInput({ label, icon, onSelect, accept, active }: { label: string; icon: any; onSelect: (e: any) => void; accept: string; active: boolean }) {
  return (
    <label className={clsx("relative flex flex-col items-center justify-center p-10 bg-white/[0.03] border border-dashed rounded-[2rem] cursor-pointer transition-all hover:bg-white/[0.05]", active ? "border-emerald-500/50 bg-emerald-500/5" : "border-white/10 hover:border-white/20")}>
       <input type="file" className="hidden" onChange={onSelect} accept={accept} />
       <div className={clsx("mb-4", active ? "text-emerald-400" : "text-white/20")}>{icon}</div>
       <span className={clsx("text-[9px] font-black uppercase tracking-widest", active ? "text-emerald-400" : "text-white/40")}>{active ? "Synchronized" : label}</span>
    </label>
  );
}
