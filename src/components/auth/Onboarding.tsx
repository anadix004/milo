"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Check, ChevronRight, User, Phone, Calendar, Loader2, LogIn } from "lucide-react";
import clsx from "clsx";
import { useAuth } from "../AuthContext";
import { supabase } from "@/utils/supabase";
import { useNotifications } from "../NotificationContext";

const SPRING_CONFIG = { stiffness: 70, damping: 15 };

type Step = "login" | "username" | "details" | "capture";

export default function Onboarding({ onComplete }: { onComplete: (data: any) => void }) {
  const { session, loginWithGoogle, refreshProfile } = useAuth();
  const { addNotification } = useNotifications();
  const [step, setStep] = useState<Step>("login");
  const [username, setUsername] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    mobile: "",
    gender: "",
    dob: "",
  });

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (session?.user) {
      setStep("username");
    } else {
      setStep("login");
    }
  }, [session]);

  // --- Step 1: Username Check Simulation ---
  useEffect(() => {
    if (username.length > 2) {
      setIsChecking(true);
      setIsAvailable(null);
      const timer = setTimeout(() => {
        setIsChecking(false);
        setIsAvailable(true); // Mock availability
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      setIsChecking(false);
      setIsAvailable(null);
    }
  }, [username]);

  // --- Step 3: Camera Logic ---
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { aspectRatio: 1, facingMode: "user" },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      addNotification("system", `Auth failed: ${err.message}`);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        context.drawImage(videoRef.current, 0, 0, 400, 400);
        const dataUrl = canvasRef.current.toDataURL("image/png");
        setPhoto(dataUrl);
        stopCamera();
      }
    }
  };

  useEffect(() => {
    if (step === "capture" && !photo) {
      startCamera();
    }
    return () => stopCamera();
  }, [step]);

  const handleNext = async () => {
    if (step === "username" && isAvailable) setStep("details");
    else if (step === "details") setStep("capture");
    else if (step === "capture" && photo) {
      setIsSubmitting(true);
      try {
        const { error } = await supabase.from("profiles").upsert({
          id: session?.user.id,
          username,
          full_name: session?.user.user_metadata.full_name || username,
          avatar_url: photo, // We'll handle bucket upload in later tasks if needed
          mobile: formData.mobile,
          gender: formData.gender,
          dob: formData.dob,
          updated_at: new Date().toISOString(),
        });

        if (error) throw error;

        await refreshProfile();
        onComplete({ username, ...formData, photo });
      } catch (err) {
        console.error("Profile update failed:", err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center p-6 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent_70%)] pointer-events-none" />
      
      <div className="w-full max-w-xl relative">
        <AnimatePresence mode="wait">
          {/* STEP 0: LOGIN GATE */}
          {step === "login" && (
            <motion.div
              key="step-login"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.1, y: -20 }}
              transition={SPRING_CONFIG}
              className="flex flex-col items-center text-center space-y-12"
            >
              <div className="space-y-4">
                <h2 className="font-[family-name:var(--font-lexend)] text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
                  Authorization nexus
                </h2>
                <p className="text-white/40 font-[family-name:var(--font-roboto-mono)] text-[10px] uppercase tracking-[0.4em]">
                  Phase 00 // Authorize cinematic identity access
                </p>
              </div>

              <button
                onClick={loginWithGoogle}
                className="group flex items-center gap-4 px-12 py-6 bg-white text-black rounded-full font-black uppercase tracking-widest text-sm transition-all hover:scale-105 active:scale-95 shadow-[0_0_50px_rgba(255,255,255,0.2)]"
              >
                <LogIn size={20} />
                Access with Google
              </button>
            </motion.div>
          )}

          {/* STEP 1: USERNAME */}
          {step === "username" && (
            <motion.div
              key="step-username"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.1, y: -20 }}
              transition={SPRING_CONFIG}
              className="flex flex-col items-center text-center space-y-12"
            >
              <div className="space-y-4">
                <h2 className="font-[family-name:var(--font-lexend)] text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
                  Identity Identification
                </h2>
                <p className="text-white/40 font-[family-name:var(--font-roboto-mono)] text-[10px] uppercase tracking-[0.4em]">
                  Phase 01 // Define your unique handle
                </p>
              </div>

              <div className="w-full relative space-y-6">
                <div className="relative group">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase())}
                    placeholder="ENTER USERNAME"
                    className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-8 px-10 text-xl text-white placeholder:text-white/5 outline-none focus:border-white/30 transition-all text-center tracking-widest font-black uppercase"
                  />
                  {isAvailable && (
                    <motion.div 
                      initial={{ scale: 0 }} 
                      animate={{ scale: 1 }} 
                      className="absolute right-6 top-1/2 -translate-y-1/2 w-8 h-8 bg-white text-black rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                    >
                      <Check size={16} strokeWidth={3} />
                    </motion.div>
                  )}
                </div>

                <div className="h-4 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    {isChecking ? (
                      <motion.div
                        key="checking"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-3 text-[10px] font-[family-name:var(--font-roboto-mono)] text-white/40 uppercase tracking-widest"
                      >
                        <Loader2 size={12} className="animate-spin" />
                        Checking availability...
                      </motion.div>
                    ) : isAvailable ? (
                      <motion.div
                        key="available"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-[10px] font-[family-name:var(--font-roboto-mono)] text-emerald-500/80 uppercase tracking-widest"
                      >
                        Identification verified // Unique link acquired
                      </motion.div>
                    ) : username.length > 0 && username.length < 3 && (
                        <div className="text-[10px] font-[family-name:var(--font-roboto-mono)] text-white/20 uppercase tracking-widest">
                          Requires minimum 3 characters
                        </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <button
                disabled={!isAvailable}
                onClick={handleNext}
                className="group flex items-center gap-4 px-12 py-6 bg-white text-black rounded-full font-black uppercase tracking-widest text-sm disabled:opacity-20 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
              >
                Continue Identification
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}

          {/* STEP 2: DETAILS */}
          {step === "details" && (
            <motion.div
              key="step-details"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.1, y: -20 }}
              transition={SPRING_CONFIG}
              className="flex flex-col items-center text-center space-y-12"
            >
              <div className="space-y-4">
                <h2 className="font-[family-name:var(--font-lexend)] text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
                  Biometric Data
                </h2>
                <p className="text-white/40 font-[family-name:var(--font-roboto-mono)] text-[10px] uppercase tracking-[0.4em]">
                  Phase 02 // Synchronize personal telemetry
                </p>
              </div>

              <div className="w-full grid grid-cols-1 gap-6 max-w-sm mx-auto">
                <div className="relative group">
                  <label className="absolute -top-3 left-6 px-2 bg-black text-[9px] text-white/30 uppercase tracking-[0.3em] z-10 font-[family-name:var(--font-roboto-mono)]">
                    Phone Link
                  </label>
                  <div className="flex items-center bg-white/[0.02] border border-white/10 rounded-2xl p-4 transition-all focus-within:border-white/30">
                    <span className="text-white/30 font-bold px-2 pr-4 border-r border-white/5">+91</span>
                    <input
                      type="tel"
                      maxLength={10}
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, "") })}
                      placeholder="0000000000"
                      className="flex-1 bg-transparent border-none text-white p-2 outline-none font-black tracking-[0.2em]"
                    />
                  </div>
                </div>

                <div className="relative group">
                  <label className="absolute -top-3 left-6 px-2 bg-black text-[9px] text-white/30 uppercase tracking-[0.3em] z-10 font-[family-name:var(--font-roboto-mono)]">
                    Gender Sync
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full bg-white/[0.02] border border-white/10 rounded-2xl p-6 text-white outline-none appearance-none font-black uppercase tracking-widest transition-all focus:border-white/30"
                  >
                    <option value="" disabled className="bg-black">SELECT GENDER</option>
                    <option value="male" className="bg-black">MALE</option>
                    <option value="female" className="bg-black">FEMALE</option>
                    <option value="other" className="bg-black">OTHER</option>
                  </select>
                </div>

                <div className="relative group">
                  <label className="absolute -top-3 left-6 px-2 bg-black text-[9px] text-white/30 uppercase tracking-[0.3em] z-10 font-[family-name:var(--font-roboto-mono)]">
                    Birth Cycle
                  </label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full bg-white/[0.02] border border-white/10 rounded-2xl p-6 text-white outline-none font-black uppercase tracking-widest transition-all focus:border-white/30"
                  />
                </div>
              </div>

              <button
                disabled={!formData.mobile || !formData.gender || !formData.dob}
                onClick={handleNext}
                className="group flex items-center gap-4 px-12 py-6 bg-white text-black rounded-full font-black uppercase tracking-widest text-sm disabled:opacity-20 transition-all hover:scale-105 active:scale-95"
              >
                Proceed to Live Click
                <Camera size={18} className="group-hover:rotate-12 transition-transform" />
              </button>
            </motion.div>
          )}

          {/* STEP 3: CAPTURE */}
          {step === "capture" && (
            <motion.div
              key="step-capture"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={SPRING_CONFIG}
              className="flex flex-col items-center text-center space-y-12"
            >
              <div className="space-y-4">
                <h2 className="font-[family-name:var(--font-lexend)] text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
                  Live Click
                </h2>
                <p className="text-white/40 font-[family-name:var(--font-roboto-mono)] text-[10px] uppercase tracking-[0.4em]">
                  Phase 03 // Authorize visual identification
                </p>
              </div>

              <div className="relative">
                <div className="w-64 h-64 md:w-80 md:h-80 rounded-full border-4 border-white/10 overflow-hidden relative bg-white/[0.02] perspective-1000 shadow-[0_0_50px_rgba(255,255,255,0.1)]">
                  {photo ? (
                    <motion.img 
                      initial={{ opacity: 0, scale: 1.2 }}
                      animate={{ opacity: 1, scale: 1 }}
                      src={photo} 
                      alt="Captured" 
                      className="w-full h-full object-cover grayscale" 
                    />
                  ) : (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover grayscale scale-x-[-1]"
                    />
                  )}
                  <div className="absolute inset-0 border-[1px] border-white/20 rounded-full animate-pulse pointer-events-none" />
                </div>
                
                <canvas ref={canvasRef} width={400} height={400} className="hidden" />
              </div>

              <div className="flex flex-col gap-4 w-full max-w-xs">
                {!photo ? (
                  <button
                    onClick={capturePhoto}
                    className="group bg-white text-black py-6 rounded-full font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
                  >
                    <Camera size={20} />
                    Capture Profile
                  </button>
                ) : (
                  <div className="flex flex-col gap-4">
                    <button
                      onClick={handleNext}
                      disabled={isSubmitting}
                      className="group bg-emerald-500 text-black py-6 rounded-full font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                    >
                      {isSubmitting ? <Loader2 className="animate-spin" /> : "Complete Sync"}
                      {!isSubmitting && <Check size={20} strokeWidth={3} />}
                    </button>
                    <button
                      onClick={() => { setPhoto(null); startCamera(); }}
                      className="text-white/40 uppercase text-[10px] tracking-widest font-black hover:text-white transition-colors"
                    >
                      Retake Identification
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="absolute bottom-12 left-12 hidden md:block">
        <p className="text-[8px] font-[family-name:var(--font-roboto-mono)] text-white/10 uppercase tracking-[0.5em] font-black leading-loose">
          Terminal Status: Identification Pending<br />
          Network Status: Secure<br />
          System: {session?.user ? `Authorized // ${session.user.email}` : "Gatekeeper // Identity Required"}<br />
          Anti-Gravity V2.5
        </p>
      </div>
    </div>
  );
}
