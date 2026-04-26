"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, PlusCircle, Globe, ShieldCheck, Lock, Upload, Video, Image as ImageIcon, CheckCircle2, Loader2, ArrowRight, ArrowLeft } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { createClient } from "@/utils/supabase/client";
import { useNotifications } from "./NotificationContext";
import { METRO_CITIES } from "@/constants/cities";
import clsx from "clsx";
import { Trash2, Link as LinkIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/useMediaQuery";
import BottomSheet from "@/components/mobile/BottomSheet";

interface EventSubmissionProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthRedirect: () => void;
}

const SPRING_CONFIG = { stiffness: 300, damping: 30 };

type Step = 1 | 2 | 3 | 4;

export default function EventSubmission({ isOpen, onClose, onAuthRedirect }: EventSubmissionProps) {
  const isMobile = useIsMobile();
  const supabase = createClient();
  const { user, isAuthenticated } = useAuth();
  const { addNotification } = useNotifications();
  
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ 
    title: "", 
    cityId: "", 
    zoneId: "",
    date: "", 
    description: "", 
    price: "Free",
    category: "Music",
    venueAddress: "",
    aadhaarId: ""
  });
  
  const [ticketLinks, setTicketLinks] = useState([{ name: "", url: "" }]);
  const [media, setMedia] = useState<{ photo: File | null; video: File | null }>({ photo: null, video: null });

  useEffect(() => {
    if (!isMobile) {
      if (isOpen) document.body.style.overflow = "hidden";
      else document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen, isMobile]);

  const validateMedia = async (e: React.ChangeEvent<HTMLInputElement>, type: "photo" | "video") => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === "photo") {
       if (file.size > 1024 * 1024) {
          addNotification("system", "Visual Frame Overflow: Photo exceeds 1MB limit.");
          e.target.value = "";
          return;
       }
       setMedia(prev => ({ ...prev, photo: file }));
       addNotification("system", "Visual Frame Synchronized.");
    }

    if (type === "video") {
       if (file.size > 2 * 1024 * 1024) {
          addNotification("system", "Kinetic Sequence Overflow: Video exceeds 2MB limit.");
          e.target.value = "";
          return;
       }

       const video = document.createElement("video");
       video.preload = "metadata";
       video.onloadedmetadata = () => {
         window.URL.revokeObjectURL(video.src);
         if (video.duration > 10.5) {
            addNotification("system", "Error: Video must be 10.5s or less.");
            e.target.value = "";
         } else {
            setMedia(prev => ({ ...prev, video: file }));
            addNotification("system", "Kinetic Sequence Synchronized.");
         }
       };
       video.onerror = () => {
         window.URL.revokeObjectURL(video.src);
         addNotification("system", "Error: Failed to load video metadata.");
         e.target.value = "";
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

      const { error: dbError } = await supabase.from("events").insert({
        title: formData.title,
        description: formData.description,
        location: formData.zoneId ? `${formData.zoneId}, ${formData.cityId}` : formData.cityId,
        cityId: formData.cityId,
        date: formData.date,
        price: formData.price,
        category: formData.category,
        venue_address: formData.venueAddress,
        aadhaar_id: formData.aadhaarId,
        ticket_links: ticketLinks.filter(l => l.url.trim() !== ""),
        image: imageUrl || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
        video_url: videoUrl,
        user_id: user.id,
        is_verified: false 
      });

      if (dbError) throw dbError;

      addNotification("radar", "Event submitted. Awaiting verification.");
      resetAndClose();
    } catch (err: any) {
      addNotification("system", `Identification Sync Failed: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setCurrentStep(1);
    setFormData({ 
      title: "", cityId: "", zoneId: "", date: "", description: "", 
      price: "Free", category: "Music", venueAddress: "", aadhaarId: "" 
    });
    setTicketLinks([{ name: "", url: "" }]);
    setMedia({ photo: null, video: null });
    onClose();
  };

  const renderStep1 = () => (
    <div className="space-y-8">
      <InputGroup label="Event Title" placeholder="What's happening?" value={formData.title} onChange={(v: string) => setFormData({...formData, title: v})} />
      <InputGroup label="Temporal Sync (Date)" placeholder="YYYY-MM-DD" type="date" value={formData.date} onChange={(v: string) => setFormData({...formData, date: v})} />
      <div className="space-y-3">
        <label className="text-[10px] text-white/30 uppercase tracking-[0.4em] ml-2 font-black">Category</label>
        <select 
          value={formData.category} 
          onChange={(e) => setFormData({...formData, category: e.target.value})}
          className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-sm text-white outline-none focus:border-white/30 transition-all font-black tracking-widest appearance-none"
          required
        >
          {["Music", "College", "Workshops", "Nightlife", "Networking"].map(cat => (
            <option key={cat} value={cat} className="bg-black text-white">{cat}</option>
          ))}
        </select>
      </div>
      <div className="space-y-4">
        <label className="text-[10px] text-white/30 uppercase tracking-[0.4em] ml-2 font-black">Event Description</label>
        <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Synchronization details..." className="w-full bg-white/[0.03] border border-white/10 rounded-[2rem] p-6 text-sm text-white placeholder:text-white/10 outline-none focus:border-white/30 h-32 no-scrollbar font-black tracking-widest" required />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <label className="text-[10px] text-white/30 uppercase tracking-[0.4em] ml-2 font-black">Primary Metropolitan</label>
          <select 
            value={formData.cityId} 
            onChange={(e) => setFormData({...formData, cityId: e.target.value, zoneId: ""})}
            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-sm text-white outline-none focus:border-white/30 transition-all font-black tracking-widest appearance-none"
            required
          >
            <option value="" className="bg-black text-white/20">Select City</option>
            {METRO_CITIES.map(city => (
              <option key={city.id} value={city.id} className="bg-black text-white">{city.label}</option>
            ))}
          </select>
        </div>
        <div className="space-y-3">
          <label className="text-[10px] text-white/30 uppercase tracking-[0.4em] ml-2 font-black">Metropolitan Zone</label>
          <select 
            value={formData.zoneId} 
            onChange={(e) => setFormData({...formData, zoneId: e.target.value})}
            disabled={!formData.cityId}
            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-sm text-white outline-none focus:border-white/30 transition-all font-black tracking-widest appearance-none disabled:opacity-20"
            required
          >
            <option value="" className="bg-black text-white/20">Select Zone</option>
            {METRO_CITIES.find(c => c.id === formData.cityId)?.zones.map(zone => (
              <option key={zone.id} value={zone.id} className="bg-black text-white">{zone.label}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="space-y-3">
        <label className="text-[10px] text-white/30 uppercase tracking-[0.4em] ml-2 font-black">Detailed Venue Address</label>
        <textarea 
          value={formData.venueAddress} 
          onChange={(e) => setFormData({...formData, venueAddress: e.target.value})} 
          placeholder="Floor, Building, Street, Landmark..." 
          className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-sm text-white placeholder:text-white/10 outline-none focus:border-white/30 h-24 no-scrollbar font-black tracking-widest" 
          required 
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-8">
      <div className="space-y-3">
        <label className="text-[10px] text-white/30 uppercase tracking-[0.4em] ml-2 font-black">ID Verification (Aadhaar ID)</label>
        <input 
          required 
          placeholder="XXXX XXXX XXXX" 
          value={formData.aadhaarId} 
          onChange={(e) => setFormData({...formData, aadhaarId: e.target.value})} 
          className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-sm text-white outline-none focus:border-white/30 transition-all font-black tracking-widest uppercase font-mono" 
        />
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <label className="text-[10px] text-white/30 uppercase tracking-[0.4em] font-black">Ticket Booking Links</label>
          <button 
            type="button"
            onClick={() => setTicketLinks([...ticketLinks, { name: "", url: "" }])}
            className="text-[9px] text-purple-400 uppercase tracking-widest font-black hover:text-purple-300 transition-colors"
          >
            + Add Link
          </button>
        </div>
        <div className="space-y-3">
          {ticketLinks.map((link, idx) => (
            <div key={idx} className="flex gap-3 group">
              <input placeholder="Name" value={link.name} onChange={(e) => { const n = [...ticketLinks]; n[idx].name = e.target.value; setTicketLinks(n); }} className="flex-1 bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-[10px] text-white outline-none font-black" />
              <input placeholder="URL" value={link.url} onChange={(e) => { const n = [...ticketLinks]; n[idx].url = e.target.value; setTicketLinks(n); }} className="flex-[2] bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-[10px] text-white outline-none font-black" />
              {ticketLinks.length > 1 && (
                <button type="button" onClick={() => setTicketLinks(ticketLinks.filter((_, i) => i !== idx))} className="p-4 text-white/10 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-8 pb-8">
      <p className="text-[10px] font-mono text-white/20 uppercase tracking-[0.4em] font-black text-center">Media Gatekeeper Sync</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MediaInput label="Visual (1MB)" icon={<ImageIcon size={20} />} onSelect={(e: any) => validateMedia(e, "photo")} accept="image/*" active={!!media.photo} />
        <MediaInput label="Kinetic (10s/2MB)" icon={<Video size={20} />} onSelect={(e: any) => validateMedia(e, "video")} accept="video/*" active={!!media.video} />
      </div>
    </div>
  );

  const renderContent = () => (
    <div className={clsx("flex flex-col h-full", !isMobile && "max-h-[90vh]")}>
      {/* Header Hub */}
      <div className={clsx("p-8 border-b border-white/5 flex justify-between items-center", isMobile ? "px-0 pb-6" : "bg-white/[0.02]")}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400"><PlusCircle size={24} /></div>
          <div>
            <h2 className="text-white text-xl font-black uppercase tracking-tight">Submit Event</h2>
            <p className="text-[10px] text-purple-500 uppercase tracking-[0.4em] mt-1 font-black">Event Submission</p>
          </div>
        </div>
        {!isMobile && (
          <button onClick={resetAndClose} className="text-white/20 hover:text-white transition-colors"><X size={32} /></button>
        )}
      </div>

      <div className={clsx("flex-1 overflow-y-auto no-scrollbar", isMobile ? "py-6" : "p-8 md:p-12")}>
        {!isAuthenticated ? (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-8">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center border border-white/10"><Lock size={40} className="text-white/20" /></div>
            <h3 className="text-2xl font-black uppercase tracking-tight text-white">Identification Required</h3>
            <p className="text-white/40 text-sm max-w-xs font-mono">Log in to your account to submit new events.</p>
            <button onClick={() => { onClose(); onAuthRedirect(); }} className="bg-white text-black px-12 py-5 rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-all">Identify Pulse</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="h-full flex flex-col">
            {isMobile ? (
              <div className="flex-1 flex flex-col">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={SPRING_CONFIG}
                    className="flex-1"
                  >
                    {currentStep === 1 && renderStep1()}
                    {currentStep === 2 && renderStep2()}
                    {currentStep === 3 && renderStep3()}
                    {currentStep === 4 && renderStep4()}
                  </motion.div>
                </AnimatePresence>

                {/* Mobile Wizard Nav */}
                <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-8 gap-4 pb-12">
                   {currentStep > 1 ? (
                     <button type="button" onClick={() => setCurrentStep((prev) => (prev - 1) as Step)} className="flex-1 py-5 bg-white/5 border border-white/10 rounded-2xl text-white/40 font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-2">
                        <ArrowLeft size={14} /> Back
                     </button>
                   ) : <div className="flex-1" />}

                   {currentStep < 4 ? (
                     <button type="button" onClick={() => {
                       if (currentStep === 1 && (!formData.title || !formData.date || !formData.description)) {
                         addNotification("system", "Please fill in all required fields before proceeding.");
                         return;
                       }
                       if (currentStep === 2 && (!formData.cityId || !formData.venueAddress)) {
                         addNotification("system", "Please select a city and enter a venue address.");
                         return;
                       }
                       setCurrentStep((prev) => (prev + 1) as Step);
                     }} className="flex-[2] py-5 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2">
                        Next Sequence <ArrowRight size={14} />
                     </button>
                   ) : (
                     <button type="submit" disabled={isSubmitting} className="flex-[2] py-5 bg-emerald-500 text-black rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2">
                        {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <>Authorize <CheckCircle2 size={14} /></>}
                     </button>
                   )}
                </div>
              </div>
            ) : (
              <div className="space-y-12">
                <div className="grid grid-cols-2 gap-8">
                  {renderStep1()}
                  {renderStep2()}
                </div>
                <div className="grid grid-cols-2 gap-8">
                  {renderStep3()}
                  {renderStep4()}
                </div>
                <button disabled={isSubmitting} className="w-full bg-white text-black py-8 rounded-full font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50">
                  {isSubmitting ? <Loader2 className="animate-spin mx-auto" /> : "Submit Event"}
                </button>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <BottomSheet isOpen={isOpen} onClose={onClose} snapHeight="98vh">
        {renderContent()}
      </BottomSheet>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-6 overflow-y-auto">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/90 backdrop-blur-3xl" />
          <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} transition={SPRING_CONFIG} className="relative w-full max-w-5xl bg-neutral-950 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
            {renderContent()}
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
