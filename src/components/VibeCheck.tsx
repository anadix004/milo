"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Video, Image as ImageIcon, X } from "lucide-react";
import clsx from "clsx";

interface VibeCheckProps {
  eventId: string;
}

interface Story {
  id: string;
  type: "image" | "video";
  url: string;
  userAvatar: string;
  userName: string;
}

// Temporary mocked initial stories for demonstration
const INITIAL_STORIES: Story[] = [
  {
    id: "s1",
    type: "image",
    url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=800&fit=crop",
    userAvatar: "https://i.pravatar.cc/100?img=1",
    userName: "Alex",
  },
  {
    id: "s2",
    type: "video",
    url: "https://assets.mixkit.co/videos/preview/mixkit-crowd-dancing-at-a-party-with-flashing-lights-4293-large.mp4",
    userAvatar: "https://i.pravatar.cc/100?img=5",
    userName: "Jamie",
  }
];

export default function VibeCheck({ eventId }: VibeCheckProps) {
  const [stories, setStories] = useState<Story[]>(INITIAL_STORIES);
  const [activeStory, setActiveStory] = useState<Story | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "video") => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newUrl = URL.createObjectURL(file);
    const newStory: Story = {
      id: Math.random().toString(),
      type,
      url: newUrl,
      userAvatar: "https://i.pravatar.cc/100?img=12", // Mock user avatar
      userName: "You",
    };

    // Add to the front of the line
    setStories([newStory, ...stories]);
  };

  return (
    <div className="w-full mt-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-black text-white text-lg uppercase tracking-widest flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Live Vibe Check
        </h3>
        <p className="text-[9px] text-white/40 font-mono uppercase tracking-[0.2em]">Real-time Updates</p>
      </div>

      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 pt-2 px-1 items-center">
        {/* Upload Button */}
        <div className="flex flex-col items-center gap-2 shrink-0">
          <div className="relative w-16 h-16 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center hover:border-white/50 hover:bg-white/5 transition-all group overflow-hidden">
            <Plus size={20} className="text-white/40 group-hover:text-white transition-colors" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 backdrop-blur-sm transition-opacity">
              <label className="cursor-pointer hover:scale-110 transition-transform">
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e, "image")} />
                <ImageIcon size={14} className="text-cyan-400" />
              </label>
              <label className="cursor-pointer hover:scale-110 transition-transform">
                <input type="file" accept="video/*" className="hidden" onChange={(e) => handleUpload(e, "video")} />
                <Video size={14} className="text-purple-400" />
              </label>
            </div>
          </div>
          <span className="text-[8px] font-mono uppercase text-white/60 tracking-widest">Add Yours</span>
        </div>

        {/* Stories List */}
        {stories.map((story) => (
          <div key={story.id} className="flex flex-col items-center gap-2 shrink-0 cursor-pointer group" onClick={() => setActiveStory(story)}>
            <div className="relative w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-purple-500 to-cyan-500 group-hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-full border-2 border-black overflow-hidden relative">
                <img src={story.userAvatar} alt={story.userName} className="w-full h-full object-cover" />
                {story.type === "video" && (
                   <div className="absolute bottom-0 right-0 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center border border-black">
                     <Video size={8} className="text-white" />
                   </div>
                )}
              </div>
            </div>
            <span className="text-[8px] font-mono uppercase text-white/80 tracking-widest">{story.userName}</span>
          </div>
        ))}
      </div>

      {/* Fullscreen Story Viewer */}
      <AnimatePresence>
        {activeStory && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center"
          >
            <button 
              onClick={() => setActiveStory(null)}
              className="absolute top-6 right-6 p-4 bg-white/10 hover:bg-white/20 rounded-full text-white z-10 transition-colors"
            >
              <X size={24} />
            </button>

            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm aspect-[9/16] rounded-2xl overflow-hidden bg-black shadow-2xl shadow-purple-500/20"
            >
              <div className="absolute top-4 left-4 z-10 flex items-center gap-3">
                <img src={activeStory.userAvatar} className="w-10 h-10 rounded-full border border-white/20" />
                <span className="font-black text-white text-sm tracking-widest uppercase drop-shadow-md">{activeStory.userName}</span>
              </div>
              
              {activeStory.type === "video" ? (
                <video src={activeStory.url} autoPlay loop playsInline className="w-full h-full object-cover" />
              ) : (
                <img src={activeStory.url} className="w-full h-full object-cover" />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
