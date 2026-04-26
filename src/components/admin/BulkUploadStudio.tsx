"use client";

import { useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/components/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  X,
  Loader2,
  Plus,
  Image as ImageIcon,
  Video,
  Save,
  Globe,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  SkipForward,
  Download,
  Zap,
  RefreshCw,
} from "lucide-react";
import { METRO_CITIES } from "@/constants/cities";
import {
  type RowResult,
  type SSEEvent,
  COMMON_URL_COLUMNS,
} from "@/utils/scrapeSync";
import clsx from "clsx";

// ── Manual mode types ─────────────────────────────────────────────────────────
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

// ── Scrape summary type ───────────────────────────────────────────────────────
interface ScrapeJobSummary {
  success: number;
  failed: number;
  skipped: number;
  total: number;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function BulkUploadStudio() {
  const supabase = createClient();
  const { user } = useAuth();

  const [activeMode, setActiveMode] = useState<"manual" | "scrape">("manual");
  const [selectedCity, setSelectedCity] = useState(METRO_CITIES[0].id);

  // ── Manual mode state ─────────────────────────────────────────────────────
  const [events, setEvents] = useState<BulkEvent[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishProgress, setPublishProgress] = useState(0);

  // ── Scrape & Sync state ───────────────────────────────────────────────────
  const [scrapeFile, setScrapeFile] = useState<File | null>(null);
  const [urlColumn, setUrlColumn] = useState("Source URL");
  const [scrapePhase, setScrapePhase] = useState<"idle" | "running" | "done">(
    "idle"
  );
  const [scrapeTotal, setScrapeTotal] = useState(0);
  const [scrapeProcessed, setScrapeProcessed] = useState(0);
  const [scrapeResults, setScrapeResults] = useState<RowResult[]>([]);
  const [scrapeSummary, setScrapeSummary] = useState<ScrapeJobSummary | null>(
    null
  );
  const [scrapeError, setScrapeError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Manual mode handlers ──────────────────────────────────────────────────
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
        previewUrl: null,
      },
    ]);
  };

  const updateRow = (id: string, field: keyof BulkEvent, value: unknown) => {
    setEvents(events.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  };

  const handleMediaUpload = (
    id: string,
    e: React.ChangeEvent<HTMLInputElement>,
    type: "image" | "video"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (type === "image") {
      updateRow(id, "file", file);
      updateRow(id, "previewUrl", URL.createObjectURL(file));
    } else {
      updateRow(id, "videoFile", file);
    }
  };

  const removeRow = (id: string) => {
    setEvents(events.filter((e) => e.id !== id));
  };

  const handlePublish = async () => {
    if (!user || events.length === 0) return;
    setIsPublishing(true);
    setPublishProgress(0);
    let completed = 0;
    for (const event of events) {
      try {
        let imageUrl =
          "https://images.unsplash.com/photo-1492684223066-81342ee5ff30";
        let videoUrl = "";
        if (event.file) {
          const ext = event.file.name.split(".").pop();
          const fileName = `bulk_${Date.now()}_img.${ext}`;
          await supabase.storage
            .from("event-assets")
            .upload(fileName, event.file);
          imageUrl = supabase.storage
            .from("event-assets")
            .getPublicUrl(fileName).data.publicUrl;
        }
        if (event.videoFile) {
          const ext = event.videoFile.name.split(".").pop();
          const fileName = `bulk_${Date.now()}_vid.${ext}`;
          await supabase.storage
            .from("event-assets")
            .upload(fileName, event.videoFile);
          videoUrl = supabase.storage
            .from("event-assets")
            .getPublicUrl(fileName).data.publicUrl;
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
          is_verified: true,
          featured: false,
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

  // ── Scrape & Sync handlers ────────────────────────────────────────────────
  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && (dropped.name.endsWith(".xlsx") || dropped.name.endsWith(".csv"))) {
      setScrapeFile(dropped);
    }
  };

  const resetScrape = () => {
    setScrapeFile(null);
    setScrapePhase("idle");
    setScrapeTotal(0);
    setScrapeProcessed(0);
    setScrapeResults([]);
    setScrapeSummary(null);
    setScrapeError(null);
  };

  const launchScrape = async () => {
    if (!scrapeFile || !user) return;
    setScrapePhase("running");
    setScrapeResults([]);
    setScrapeProcessed(0);
    setScrapeTotal(0);
    setScrapeSummary(null);
    setScrapeError(null);

    const formData = new FormData();
    formData.append("file", scrapeFile);
    formData.append("cityId", selectedCity);
    formData.append("userId", user.id);
    formData.append("urlColumn", urlColumn);

    try {
      const response = await fetch("/api/admin/scrape-sync", {
        method: "POST",
        body: formData,
      });

      if (!response.body) {
        setScrapeError("No response stream from server.");
        setScrapePhase("done");
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        // SSE messages are separated by double newlines
        const parts = buf.split("\n\n");
        buf = parts.pop() ?? "";
        for (const part of parts) {
          for (const line of part.split("\n")) {
            if (!line.startsWith("data: ")) continue;
            try {
              const event: SSEEvent = JSON.parse(line.slice(6));
              handleSSEEvent(event);
            } catch {
              // skip malformed
            }
          }
        }
      }
    } catch (err: unknown) {
      setScrapeError(err instanceof Error ? err.message : "Network error");
      setScrapePhase("done");
    }
  };

  const handleSSEEvent = (event: SSEEvent) => {
    switch (event.type) {
      case "progress":
        if (event.total) setScrapeTotal(event.total);
        setScrapeProcessed((p) => p + 1);
        break;
      case "row_result":
        setScrapeResults((prev) => [
          ...prev,
          {
            rowIndex: event.rowIndex ?? 0,
            sourceUrl: event.sourceUrl ?? event.url ?? "",
            status: event.status as RowResult["status"],
            title: event.title,
            image: event.image,
            error: event.error,
            eventId: event.eventId,
          },
        ]);
        break;
      case "complete":
        if (event.summary) setScrapeSummary(event.summary);
        setScrapePhase("done");
        break;
      case "error":
        setScrapeError(event.message ?? "Unknown error");
        setScrapePhase("done");
        break;
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full bg-black">
      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
            Bulk Upload Studio
          </h2>
          <p className="text-[10px] text-white/40 font-mono uppercase tracking-[0.3em] mt-2">
            Stock City Radar Instantly
          </p>
        </div>

        {/* City selector always visible */}
        <div className="flex items-center gap-3">
          <span className="text-[9px] font-black uppercase tracking-widest text-white/40">
            Target City
          </span>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="bg-white/[0.05] border border-white/10 rounded-full px-4 py-2 text-xs text-white font-black uppercase tracking-widest outline-none focus:border-purple-500"
          >
            {METRO_CITIES.map((c) => (
              <option key={c.id} value={c.id} className="bg-black">
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Mode Tabs ── */}
      <div className="flex gap-2 mb-6">
        {(["manual", "scrape"] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setActiveMode(mode)}
            className={clsx(
              "flex items-center gap-2 px-5 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest transition-all duration-300",
              activeMode === mode
                ? "bg-gradient-to-r from-purple-500 to-cyan-500 text-black"
                : "bg-white/[0.05] text-white/40 hover:bg-white/10 hover:text-white border border-white/10"
            )}
          >
            {mode === "manual" ? (
              <><ImageIcon size={12} /> Manual Entry</>
            ) : (
              <><Globe size={12} /> Scrape &amp; Sync</>
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* ════════════════════════════════════════════════════
            MANUAL MODE (unchanged)
        ════════════════════════════════════════════════════ */}
        {activeMode === "manual" && (
          <motion.div
            key="manual"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex flex-col flex-1"
          >
            <div className="flex justify-end mb-4">
              <button
                onClick={handlePublish}
                disabled={isPublishing || events.length === 0}
                className="flex items-center gap-2 px-8 py-3 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
              >
                {isPublishing ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> Publishing (
                    {Math.round(publishProgress)}%)
                  </>
                ) : (
                  <>
                    <Save size={14} /> Batch Publish ({events.length})
                  </>
                )}
              </button>
            </div>

            <div className="flex-1 overflow-auto bg-neutral-950/50 rounded-2xl border border-white/5 p-6">
              <div className="space-y-4 min-w-[900px]">
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
                    <div className="w-16 h-16 rounded-lg bg-black/50 border border-white/10 overflow-hidden relative flex flex-shrink-0 items-center justify-center">
                      {event.previewUrl ? (
                        <>
                          <img
                            src={event.previewUrl}
                            className="w-full h-full object-cover"
                            alt=""
                          />
                          {event.videoFile && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <Video size={16} className="text-white" />
                            </div>
                          )}
                        </>
                      ) : (
                        <ImageIcon size={20} className="text-white/20" />
                      )}
                    </div>

                    <input
                      type="text"
                      placeholder="Event Title..."
                      value={event.title}
                      onChange={(e) => updateRow(event.id, "title", e.target.value)}
                      className="w-full bg-transparent border-none text-sm text-white font-black tracking-wide outline-none placeholder:text-white/20 uppercase"
                    />

                    <select
                      value={event.category}
                      onChange={(e) => updateRow(event.id, "category", e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-3 text-[10px] text-white font-black uppercase tracking-widest outline-none"
                    >
                      {["Music", "College", "Workshops", "Nightlife", "Networking"].map(
                        (cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        )
                      )}
                    </select>

                    <input
                      type="date"
                      value={event.date}
                      onChange={(e) => updateRow(event.id, "date", e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-3 text-[10px] text-white font-black uppercase tracking-widest outline-none [&::-webkit-calendar-picker-indicator]:invert"
                    />

                    <input
                      type="text"
                      placeholder="Free / 500"
                      value={event.price}
                      onChange={(e) => updateRow(event.id, "price", e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-3 text-[10px] text-white font-black uppercase tracking-widest outline-none"
                    />

                    <div className="flex gap-2">
                      <label className="flex-1 h-10 bg-white/[0.05] hover:bg-white/10 border border-white/10 rounded-lg flex items-center justify-center cursor-pointer transition-colors group/btn">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleMediaUpload(event.id, e, "image")}
                        />
                        <ImageIcon
                          size={14}
                          className={
                            event.file
                              ? "text-emerald-400"
                              : "text-white/40 group-hover/btn:text-white"
                          }
                        />
                      </label>
                      <label className="flex-1 h-10 bg-white/[0.05] hover:bg-white/10 border border-white/10 rounded-lg flex items-center justify-center cursor-pointer transition-colors group/btn">
                        <input
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={(e) => handleMediaUpload(event.id, e, "video")}
                        />
                        <Video
                          size={14}
                          className={
                            event.videoFile
                              ? "text-purple-400"
                              : "text-white/40 group-hover/btn:text-white"
                          }
                        />
                      </label>
                    </div>

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
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Add New Event Row
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ════════════════════════════════════════════════════
            SCRAPE & SYNC MODE
        ════════════════════════════════════════════════════ */}
        {activeMode === "scrape" && (
          <motion.div
            key="scrape"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex flex-col flex-1 gap-6"
          >
            {/* ── IDLE: Configuration ── */}
            {scrapePhase === "idle" && (
              <div className="flex flex-col gap-6">
                {/* Info banner */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20">
                  <Zap size={18} className="text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-white font-black text-xs uppercase tracking-widest mb-1">
                      Automated Scraping Engine
                    </p>
                    <p className="text-white/50 text-[11px] leading-relaxed">
                      Upload a spreadsheet with event URLs (BookMyShow, District.in, hackathon sites, etc.).
                      The engine will extract metadata &amp; images, re-host assets, and insert verified events
                      into the database automatically.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {/* File drop zone */}
                  <div className="flex flex-col gap-3">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/40">
                      Upload Spreadsheet (.xlsx / .csv)
                    </label>
                    <div
                      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={handleFileDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={clsx(
                        "relative h-40 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-300",
                        isDragging
                          ? "border-purple-400 bg-purple-500/10 scale-[1.01]"
                          : scrapeFile
                          ? "border-emerald-500/50 bg-emerald-500/5"
                          : "border-white/10 bg-white/[0.02] hover:border-white/30 hover:bg-white/[0.04]"
                      )}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".xlsx,.csv"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) setScrapeFile(f);
                        }}
                      />
                      {scrapeFile ? (
                        <>
                          <FileSpreadsheet size={28} className="text-emerald-400" />
                          <div className="text-center">
                            <p className="text-emerald-400 font-black text-xs uppercase tracking-widest">
                              {scrapeFile.name}
                            </p>
                            <p className="text-white/40 text-[10px] font-mono mt-1">
                              {(scrapeFile.size / 1024).toFixed(1)} KB — ready to process
                            </p>
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); setScrapeFile(null); }}
                            className="absolute top-3 right-3 p-1.5 rounded-full bg-white/5 hover:bg-rose-500/20 text-white/30 hover:text-rose-400 transition-colors"
                          >
                            <X size={12} />
                          </button>
                        </>
                      ) : (
                        <>
                          <Upload size={28} className="text-white/20" />
                          <div className="text-center">
                            <p className="text-white/60 font-black text-xs uppercase tracking-widest">
                              Drop file here
                            </p>
                            <p className="text-white/25 text-[10px] font-mono mt-1">
                              .xlsx or .csv accepted
                            </p>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Template download */}
                    <a
                      href="/scrape-sync-template.csv"
                      download
                      className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-cyan-400 transition-colors"
                    >
                      <Download size={11} />
                      Download CSV Template
                    </a>
                  </div>

                  {/* Column mapping */}
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-3">
                      <label className="text-[9px] font-black uppercase tracking-widest text-white/40">
                        Source URL Column Name
                      </label>
                      <input
                        type="text"
                        value={urlColumn}
                        onChange={(e) => setUrlColumn(e.target.value)}
                        placeholder="Source URL"
                        className="bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-black outline-none focus:border-purple-500 transition-colors"
                      />
                      <div className="flex flex-wrap gap-2">
                        {COMMON_URL_COLUMNS.slice(0, 5).map((col) => (
                          <button
                            key={col}
                            onClick={() => setUrlColumn(col)}
                            className={clsx(
                              "px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all",
                              urlColumn === col
                                ? "bg-purple-500/30 text-purple-300 border border-purple-500/50"
                                : "bg-white/5 text-white/30 border border-white/10 hover:text-white hover:border-white/30"
                            )}
                          >
                            {col}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Launch button */}
                    <button
                      onClick={launchScrape}
                      disabled={!scrapeFile}
                      className={clsx(
                        "mt-auto flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all duration-300",
                        scrapeFile
                          ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/20"
                          : "bg-white/5 text-white/20 cursor-not-allowed"
                      )}
                    >
                      <Zap size={14} />
                      Launch Scrape &amp; Sync
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── RUNNING: Live Progress ── */}
            {scrapePhase === "running" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col gap-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-black text-lg uppercase tracking-widest">
                      Scraping in progress…
                    </p>
                    <p className="text-white/40 text-[10px] font-mono mt-1">
                      {scrapeProcessed} / {scrapeTotal || "?"} URLs processed
                    </p>
                  </div>
                  <Loader2 size={24} className="text-purple-400 animate-spin" />
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
                    animate={{
                      width:
                        scrapeTotal > 0
                          ? `${(scrapeProcessed / scrapeTotal) * 100}%`
                          : "5%",
                    }}
                    transition={{ ease: "easeOut", duration: 0.4 }}
                  />
                </div>

                {/* Live results as they stream in */}
                <div className="flex-1 overflow-auto bg-neutral-950/50 rounded-2xl border border-white/5 p-4 space-y-2 max-h-[360px]">
                  <AnimatePresence>
                    {scrapeResults.map((r) => (
                      <ResultRow key={r.rowIndex} result={r} />
                    ))}
                  </AnimatePresence>
                  {scrapeResults.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 gap-3">
                      <Loader2 size={20} className="text-purple-400 animate-spin" />
                      <p className="text-white/30 text-[10px] font-mono uppercase tracking-widest">
                        Awaiting first result…
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ── DONE: Report ── */}
            {scrapePhase === "done" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col gap-6"
              >
                {/* Summary stats */}
                {scrapeSummary && (
                  <div className="grid grid-cols-4 gap-4">
                    {[
                      { label: "Total", value: scrapeSummary.total, color: "text-white" },
                      { label: "Synced", value: scrapeSummary.success, color: "text-emerald-400" },
                      { label: "Failed", value: scrapeSummary.failed, color: "text-rose-400" },
                      { label: "Skipped", value: scrapeSummary.skipped, color: "text-amber-400" },
                    ].map(({ label, value, color }) => (
                      <div
                        key={label}
                        className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 flex flex-col gap-1"
                      >
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/40">
                          {label}
                        </span>
                        <span className={clsx("text-3xl font-black", color)}>
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {scrapeError && (
                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                    <AlertCircle size={16} className="text-rose-400 flex-shrink-0 mt-0.5" />
                    <p className="text-rose-300 text-xs font-mono">{scrapeError}</p>
                  </div>
                )}

                {/* Results table */}
                <div className="flex-1 overflow-auto bg-neutral-950/50 rounded-2xl border border-white/5 p-4 space-y-2 max-h-[400px]">
                  {scrapeResults.map((r) => (
                    <ResultRow key={r.rowIndex} result={r} />
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={resetScrape}
                    className="flex items-center gap-2 px-6 py-3 bg-white/[0.05] hover:bg-white/10 border border-white/10 rounded-full font-black text-[10px] uppercase tracking-widest text-white/60 hover:text-white transition-all"
                  >
                    <RefreshCw size={12} />
                    New Sync Job
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Result Row sub-component ──────────────────────────────────────────────────
function ResultRow({ result }: { result: RowResult }) {
  const isSuccess = result.status === "success";
  const isFailed = result.status === "failed";
  const isSkipped = result.status === "skipped";

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-4 bg-white/[0.02] border border-white/5 rounded-xl p-3 group"
    >
      {/* Thumbnail */}
      <div className="w-12 h-12 rounded-lg bg-black/50 border border-white/10 overflow-hidden flex-shrink-0 flex items-center justify-center">
        {result.image ? (
          <img
            src={result.image}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          <ImageIcon size={16} className="text-white/20" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-black text-white tracking-wide truncate uppercase">
          {result.title || "—"}
        </p>
        <p className="text-[10px] text-white/30 font-mono truncate mt-0.5">
          {result.sourceUrl}
        </p>
        {result.error && (
          <p className="text-[10px] text-rose-400 font-mono mt-0.5 truncate">
            ↳ {result.error}
          </p>
        )}
      </div>

      {/* Status badge */}
      <div
        className={clsx(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex-shrink-0",
          isSuccess && "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
          isFailed && "bg-rose-500/15 text-rose-400 border border-rose-500/30",
          isSkipped && "bg-amber-500/15 text-amber-400 border border-amber-500/30"
        )}
      >
        {isSuccess && <CheckCircle2 size={10} />}
        {isFailed && <AlertCircle size={10} />}
        {isSkipped && <SkipForward size={10} />}
        {isSuccess ? "Synced" : isFailed ? "Failed" : "Duplicate"}
      </div>
    </motion.div>
  );
}
