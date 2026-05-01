"use client";

import { useRouter } from "next/navigation";
import { Mail, ArrowLeft } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";

export default function VerifyEmailPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen w-full flex bg-black">
      <div className="w-full flex flex-col relative overflow-y-auto">
        
        {/* Back Button */}
        <div className="absolute top-8 left-8">
          <button 
            onClick={() => router.push("/login")}
            className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 hover:bg-white/5 text-white/50 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-center items-center px-8 sm:px-16 py-20 max-w-xl mx-auto w-full">
          <div className="w-full space-y-8 text-center">
            
            {/* Header */}
            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-white/20 animate-ping rounded-full" />
                <Mail size={40} className="text-white relative z-10" />
              </div>
            </div>

            <h1 className="text-4xl font-black uppercase tracking-tighter text-white">CHECK YOUR EMAIL</h1>
            <p className="text-white/50 text-sm font-mono tracking-widest uppercase leading-relaxed max-w-sm mx-auto">
              We've sent a verification link to your email address. Please verify to access your city's radar.
            </p>

            <button
              onClick={() => router.push("/login")}
              className="w-full py-4 mt-8 bg-white text-black font-black uppercase tracking-widest text-sm rounded-xl hover:bg-white/90 transition-transform active:scale-[0.98]"
            >
              Back to Login
            </button>
            
          </div>
        </div>
      </div>
    </main>
  );
}
