"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Camera, 
  RotateCcw, 
  CheckCircle2, 
  Loader2, 
  CameraOff,
  ShieldCheck,
  Zap
} from "lucide-react";
import { supabase } from "@/utils/supabase";
import { useAuth } from "./AuthContext";

const SPRING_CONFIG = { stiffness: 70, damping: 15 };

interface IdentityScanProps {
  onComplete: (url: string) => void;
}

export default function IdentityScan({ onComplete }: IdentityScanProps) {
  const { user } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scanProgress, setScanProgress] = useState(0);

  // START CAMERA PULSE
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user", width: { ideal: 1024 }, height: { ideal: 1024 } } 
      });
      setStream(mediaStream);
      if (videoRef.current) videoRef.current.srcObject = mediaStream;
      setError(null);
    } catch (err) {
      setError("Camera synchronization failed. Please check permissions.");
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const context = canvasRef.current.getContext("2d");
    if (!context) return;
    
    // Capture high-fidelity snapshot
    context.drawImage(videoRef.current, 0, 0, 1024, 1024);
    const dataUrl = canvasRef.current.toDataURL("image/jpeg", 0.9);
    setCapturedImage(dataUrl);
    
    // Stop camera to save energy
    stream?.getTracks().forEach(track => track.stop());
    setStream(null);
  };

  const handleRetake = () => {
    setCapturedImage(null);
    startCamera();
  };

  const handleUpload = async () => {
    if (!capturedImage || !user) return;
    setIsSyncing(true);

    try {
      // 1. Convert DataURL to Blob
      const res = await fetch(capturedImage);
      const blob = await res.blob();
      
      const fileName = `${user.id}_avatar_${Date.now()}.jpg`;
      
      // 2. Upload to Public Bucket
      const { data, error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, blob, { contentType: "image/jpeg" });

      if (uploadError) throw uploadError;

      const publicUrl = supabase.storage.from("avatars").getPublicUrl(fileName).data.publicUrl;

      // 3. Update Profile Heartbeat
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", user.id);

      if (profileError) throw profileError;

      onComplete(publicUrl);
    } catch (err: any) {
      setError(`Storage synchronization failed: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-12">
      {/* SCANNER VIEWPORT */}
      <div className="relative w-full aspect-square bg-white/[0.02] border border-white/5 rounded-[3.5rem] overflow-hidden shadow-2xl flex items-center justify-center">
        
        {/* SCANNING EYE ANIMATION */}
        <AnimatePresence>
          {!capturedImage && stream && (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="absolute inset-0 z-10 pointer-events-none"
            >
               {/* LASER LINE */}
               <motion.div 
                 animate={{ top: ["0%", "100%", "0%"] }} 
                 transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                 className="absolute left-0 right-0 h-0.5 bg-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.5)] z-20"
               />
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_50%,rgba(0,0,0,0.4)_100%)]" />
               <div className="absolute inset-0 border-[40px] border-black/40" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* FEED / PREVIEW */}
        <div className="w-full h-full relative">
          <AnimatePresence mode="wait">
            {!capturedImage ? (
              <motion.video 
                key="video"
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full object-cover scale-x-[-1]" 
              />
            ) : (
              <motion.img 
                key="preview"
                src={capturedImage} 
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full h-full object-cover" 
              />
            )}
          </AnimatePresence>

          {error && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center space-y-4">
              <CameraOff className="text-red-500" size={48} />
              <p className="font-mono text-xs text-red-500 uppercase tracking-widest">{error}</p>
              <button 
                 onClick={startCamera}
                 className="px-6 py-2 bg-white/10 rounded-full font-mono text-[10px] uppercase tracking-widest hover:bg-white/20 transition-all font-black"
              >
                 Retry Connection
              </button>
            </div>
          )}
        </div>

        {/* HIDDEN CAPTURE CANVAS */}
        <canvas ref={canvasRef} className="hidden" width={1024} height={1024} />
      </div>

      {/* COMMAND CONTROLS */}
      <div className="space-y-8">
        {!capturedImage ? (
          <div className="space-y-4 text-center">
             <p className="font-mono text-[9px] text-white/40 uppercase tracking-[0.4em] font-black italic flex items-center justify-center gap-2">
                <Zap size={10} className="text-purple-400" /> Identity Pulse Ready // Awaiting Signal
             </p>
             <button 
                onClick={handleCapture}
                disabled={!stream}
                className="w-full group bg-white text-black py-8 rounded-full font-black uppercase tracking-widest text-[11px] hover:scale-[1.02] active:scale-95 transition-all shadow-xl flex items-center justify-center gap-4 disabled:opacity-50"
             >
                <div className="h-4 w-4 rounded-full border-4 border-black group-hover:bg-black transition-colors" />
                Authorize Identity Scan
             </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
             <div className="flex items-center justify-center gap-3 py-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                <ShieldCheck className="text-emerald-400" size={18} />
                <span className="font-mono text-[9px] text-emerald-400 uppercase tracking-widest font-black">Identity Captured // Ready for Pulse</span>
             </div>
             
             <div className="grid grid-cols-2 gap-4">
                <button 
                   onClick={handleRetake}
                   className="py-5 bg-white/5 border border-white/5 text-white/40 hover:text-white hover:bg-white/10 rounded-3xl font-black uppercase tracking-widest text-[9px] transition-all flex items-center justify-center gap-2"
                >
                   <RotateCcw size={16} /> Retake
                </button>
                <button 
                   onClick={handleUpload}
                   disabled={isSyncing}
                   className="py-5 bg-white text-black rounded-3xl font-black uppercase tracking-widest text-[9px] transition-all flex items-center justify-center gap-2 shadow-2xl"
                >
                   {isSyncing ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                   {isSyncing ? "Syncing..." : "Finalize ID"}
                </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
