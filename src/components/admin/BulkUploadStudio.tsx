"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/components/AuthContext";
import { motion } from "framer-motion";
import { Upload, X, Loader2, Plus, Image as ImageIcon, Video, Save } from "lucide-react";
import { METRO_CITIES } from "@/constants/cities";
import clsx from "clsx";

interface BulkEvent {
  id: string;
  title: string;
  date: string;
  category: string;
  price: string;
  file: File | null;
  videoFile: File | null;
  previewUrl: string | null;
}

export default function BulkUploadStudio() {
  const supabase = createClient();
  const { user } = useAuth();
  const [selectedCity, setSelectedCity] = useState(METRO_CITIES[0].id);
  const [events, setEvents] = useState<BulkEvent[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishProgress, setPublishProgress] = useState(0);

  const addNewRow = () => {
    setEvents([
      ...events,
      {
        id: Math.random().toString(36).substr(2, 9),
        title: "",
        date: new Date().toISOString().split("T")[0],
        category: "Music",
        price: "Free",
        file: null,
        videoFile: null,
        previewUrl: null
      }
    ]);
  };

  const updateRow = (id: string, field: keyof BulkEvent, value: any) => {
    setEvents(events.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const handleMediaUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>, type: "image" | "video") => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === "image") {
      const url = URL.createObjectURL(file);
      updateRow(id, "file", file);
      updateRow(id, "previewUrl", url);
    } else {
      updateRow(id, "videoFile", file);
    }
  };

  const removeRow = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const handlePublish = async () => {
    if (!user || events.length === 0) return;
    setIsPublishing(true);
    setPublishProgress(0);

    let completed = 0;

    for (const event of events) {
      try {
        let imageUrl = "https://images.unsplash.com/photo-1492684223066-81342ee5ff30";
        let videoUrl = "";

        if (event.file) {
          const ext = event.file.name.split(".").pop();
          const fileName = `bulk_${Date.now()}_img.${ext}`;
          await supabase.storage.from("event-assets").upload(fileName, event.file);
          imageUrl = supabase.storage.from("event-assets").getPublicUrl(fileName).data.publicUrl;
        }

        if (event.videoFile) {
          const ext = event.videoFile.name.split(".").pop();
          const fileName = `bulk_${Date.now()}_vid.${ext}`;
          await supabase.storage.from("event-assets").upload(fileName, event.videoFile);
          videoUrl = supabase.storage.from("event-assets").getPublicUrl(fileName).data.publicUrl;
        }

        await supabase.from("events").insert({
          title: event.title || "Untitled Event",
          description: "Curated event by MILO.",
          cityId: selectedCity,
          location: selectedCity,
          date: event.date,
          price: event.price,
          category: event.category,
          image: imageUrl,
          video_url: videoUrl,
          user_id: user.id,
          is_verified: true, // Bulk uploads are pre-verified
          featured: false
        });

      } catch (err) {
        console.error("Failed to upload bulk event", err);
      }
      
      completed++;
      setPublishProgress((completed / events.length) * 100);
    }

    setEvents([]);
    setIsPublishing(false);
  };

  return (
    <div className="flex flex-col h-full bg-black">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
            Bulk Upload Studio
          </h2>
          <p className="text-[10px] text-white/40 font-mono uppercase tracking-[0.3em] mt-2">
            Stock City Radar Instantly
          </p>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Target City</span>
            <select 
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-white/[0.05] border border-white/10 rounded-full px-4 py-2 text-xs text-white font-black uppercase tracking-widest outline-none focus:border-purple-500"
            >
              {METRO_CITIES.map(c => <option key={c.id} value={c.id} className="bg-black">{c.label}</option>)}
            </select>
          </div>
          
          <button 
            onClick={handlePublish}
            disabled={isPublishing || events.length === 0}
            className="flex items-center gap-2 px-8 py-3 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
          >
            {isPublishing ? (
              <><Loader2 size={14} className="animate-spin" /> Publishing ({Math.round(publishProgress)}%)</>
            ) : (
              <><Save size={14} /> Batch Publish ({events.length})</>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-neutral-950/50 rounded-2xl border border-white/5 p-6">
        <div className="space-y-4 min-w-[900px]">
          {/* Header */}
          <div className="grid grid-cols-[80px_1fr_150px_150px_120px_150px_50px] gap-4 px-4 text-[9px] font-mono uppercase tracking-[0.2em] text-white/40 border-b border-white/5 pb-4">
            <div>Media</div>
            <div>Title</div>
            <div>Category</div>
            <div>Date</div>
            <div>Price</div>
            <div>Upload</div>
            <div className="text-right">Rem</div>
          </div>

          {events.map((event) => (
            <motion.div 
              key={event.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-[80px_1fr_150px_150px_120px_150px_50px] gap-4 items-center bg-white/[0.02] border border-white/5 rounded-xl p-2 pr-4 group"
            >
              {/* Media Preview */}
              <div className="w-16 h-16 rounded-lg bg-black/50 border border-white/10 overflow-hidden relative flex flex-shrink-0 items-center justify-center">
                {event.previewUrl ? (
                  <>
                    <img src={event.previewUrl} className="w-full h-full object-cover" />
                    {event.videoFile && <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><Video size={16} className="text-white" /></div>}
                  </>
                ) : (
                  <ImageIcon size={20} className="text-white/20" />
                )}
              </div>

              {/* Title */}
              <input 
                type="text" 
                placeholder="Event Title..."
                value={event.title}
                onChange={(e) => updateRow(event.id, "title", e.target.value)}
                className="w-full bg-transparent border-none text-sm text-white font-black tracking-wide outline-none placeholder:text-white/20 uppercase"
              />

              {/* Category */}
              <select 
                value={event.category}
                onChange={(e) => updateRow(event.id, "category", e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-3 text-[10px] text-white font-black uppercase tracking-widest outline-none"
              >
                {["Music", "College", "Workshops", "Nightlife", "Networking"].map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              {/* Date */}
              <input 
                type="date" 
                value={event.date}
                onChange={(e) => updateRow(event.id, "date", e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-3 text-[10px] text-white font-black uppercase tracking-widest outline-none [&::-webkit-calendar-picker-indicator]:invert"
              />

              {/* Price */}
              <input 
                type="text" 
                placeholder="Free / 500"
                value={event.price}
                onChange={(e) => updateRow(event.id, "price", e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-3 text-[10px] text-white font-black uppercase tracking-widest outline-none"
              />

              {/* Uploads */}
              <div className="flex gap-2">
                <label className="flex-1 h-10 bg-white/[0.05] hover:bg-white/10 border border-white/10 rounded-lg flex items-center justify-center cursor-pointer transition-colors group/btn">
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleMediaUpload(event.id, e, "image")} />
                  <ImageIcon size={14} className={event.file ? "text-emerald-400" : "text-white/40 group-hover/btn:text-white"} />
                </label>
                <label className="flex-1 h-10 bg-white/[0.05] hover:bg-white/10 border border-white/10 rounded-lg flex items-center justify-center cursor-pointer transition-colors group/btn">
                  <input type="file" accept="video/*" className="hidden" onChange={(e) => handleMediaUpload(event.id, e, "video")} />
                  <Video size={14} className={event.videoFile ? "text-purple-400" : "text-white/40 group-hover/btn:text-white"} />
                </label>
              </div>

              {/* Remove */}
              <div className="flex justify-end">
                <button 
                  onClick={() => removeRow(event.id)}
                  className="p-2 text-white/20 hover:text-rose-500 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </motion.div>
          ))}

          <button 
            onClick={addNewRow}
            className="w-full py-6 border border-dashed border-white/20 hover:border-white/40 hover:bg-white/[0.02] rounded-xl flex flex-col items-center justify-center gap-2 text-white/40 hover:text-white transition-all cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-white/10 flex items-center justify-center transition-colors">
              <Plus size={16} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">Add New Event Row</span>
          </button>
        </div>
      </div>
    </div>
  );
}
