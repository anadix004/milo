"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { motion } from "framer-motion";
import { Trash2, ExternalLink, Loader2, Play, Eye } from "lucide-react";
import clsx from "clsx";

interface Story {
  id: string;
  type: "image" | "video";
  url: string;
  user_name: string;
  event_id: string;
  created_at: string;
}

export default function ModerationStudio() {
  const supabase = createClient();
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("vibe_checks")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (data) setStories(data);
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Permanently delete this story?")) {
      const { error } = await supabase.from("vibe_checks").delete().eq("id", id);
      if (!error) {
        setStories(stories.filter(s => s.id !== id));
      }
    }
  };

  return (
    <div className="flex flex-col h-full space-y-8">
      <header>
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">
          Moderation Studio
        </h2>
        <p className="text-white/40 font-mono text-[10px] uppercase tracking-[0.3em] mt-2">
          Monitor and filter user-generated Vibe Checks
        </p>
      </header>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="animate-spin text-purple-500" size={32} />
        </div>
      ) : stories.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-white/20 font-mono text-xs uppercase tracking-widest italic border border-white/5 rounded-[2rem] bg-white/[0.01]">
          No content to moderate
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {stories.map((story) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              key={story.id}
              className="group relative aspect-[9/16] bg-neutral-900 rounded-3xl overflow-hidden border border-white/10 hover:border-white/30 transition-all"
            >
              {story.type === "video" ? (
                <video src={story.url} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
              ) : (
                <img src={story.url} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />
              
              <div className="absolute top-4 right-4 flex gap-2 translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                <button 
                  onClick={() => handleDelete(story.id)}
                  className="p-3 bg-rose-500 text-white rounded-full hover:bg-rose-600 shadow-xl"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="absolute bottom-4 left-4 right-4 space-y-1">
                <p className="text-white font-black uppercase tracking-tighter text-[10px] truncate">
                   @{story.user_name || "Anonymous"}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-white/40 font-mono text-[8px] uppercase">
                    {new Date(story.created_at).toLocaleDateString()}
                  </p>
                  <div className="text-white/60">
                    {story.type === "video" ? <Play size={10} /> : <Eye size={10} />}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
