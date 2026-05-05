"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar } from "lucide-react";
import clsx from "clsx";
import { useLocation } from "./LocationContext";

interface FiltersPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES = [
  "Workshop", "Comedy Shows", "Music Shows", "Kids", "Performance",
  "Meetups", "Conferences", "Exhibitions", "Screening"
];

const MORE_FILTERS = [
  "OUTDOOR EVENTS", "FAST FILLING", "KIDS ALLOWED", "MUST ATTEND",
  "KIDS ACTIVITIES", "UNMISSABLE EVENTS", "ONLINE STREAMING", "NEW YEAR PARTIES"
];

export default function FiltersPanel({ isOpen, onClose }: FiltersPanelProps) {
  const { selectedCity } = useLocation();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200]"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-zinc-950 border-l border-white/10 z-[201] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0">
              <h2 className="text-xl font-black text-white uppercase tracking-tighter">Filters</h2>
              <button onClick={onClose} className="p-2 rounded-full bg-white/5 text-white hover:bg-white/10 transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
              
              {/* DATE */}
              <section>
                <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-4">DATE-</p>
                <div className="flex flex-wrap gap-2">
                  {["TODAY", "TOMORROW", "THIS WEEKEND"].map(d => (
                    <button key={d} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-white hover:bg-white/10 transition-colors">
                      {d}
                    </button>
                  ))}
                  <button className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-white hover:bg-white/10 transition-colors flex items-center gap-2">
                    <Calendar size={14} /> DATE RANGE
                  </button>
                </div>
              </section>

              {/* PRICE */}
              <section>
                <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-4">PRICE-</p>
                <div className="flex flex-wrap gap-2">
                  {["FREE", "0-500", "501-2000", "ABOVE 2000"].map(p => (
                    <button key={p} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-white hover:bg-white/10 transition-colors">
                      {p}
                    </button>
                  ))}
                </div>
              </section>

              {/* CATEGORY */}
              <section>
                <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-4">CATEGORY-</p>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(c => (
                    <button key={c} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-white hover:bg-white/10 transition-colors">
                      {c}
                    </button>
                  ))}
                </div>
              </section>

              {/* MORE FILTERS */}
              <section>
                <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-4">MORE FILTERS</p>
                <div className="grid grid-cols-1 gap-3">
                  {MORE_FILTERS.map(f => (
                    <label key={f} className="flex items-center gap-3 cursor-pointer group">
                      <div className="w-5 h-5 rounded border border-white/20 bg-white/5 flex items-center justify-center group-hover:border-white/40 transition-colors">
                        <div className="w-3 h-3 rounded-sm opacity-0 transition-opacity bg-white" />
                      </div>
                      <span className="text-sm font-bold text-white/80 group-hover:text-white transition-colors">{f}</span>
                    </label>
                  ))}
                </div>
              </section>

            </div>

            {/* Footer Buttons */}
            <div className="p-6 border-t border-white/10 shrink-0 grid grid-cols-2 gap-4">
              <button onClick={onClose} className="px-6 py-4 rounded-xl border border-white/20 text-white font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-colors">
                Clear All
              </button>
              <button className="px-6 py-4 rounded-xl bg-white text-black font-black uppercase tracking-widest text-xs transition-colors hover:bg-white/90">
                Apply
              </button>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
