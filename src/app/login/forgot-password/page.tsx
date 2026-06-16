"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import { createClient } from "@/utils/supabase/client";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login/update-password`,
      });
      
      if (error) throw error;
      setMessage("Password reset instructions sent to your email.");
    } catch (err: any) {
      setError(err.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex bg-black">
      <div className="w-full flex flex-col relative overflow-y-auto">
        
        {/* Back Button */}
        <div className="absolute top-8 left-8">
          <button 
            onClick={() => router.back()}
            className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 hover:bg-white/5 text-white/50 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-center items-center px-8 sm:px-16 py-20 max-w-xl mx-auto w-full">
          <div className="w-full space-y-8">
            
            {/* Header */}
            <div className="text-center space-y-4">
              <div className="flex justify-center mb-6">
                <BrandLogo size="md" />
              </div>
              <h1 className="text-4xl font-black uppercase tracking-tighter text-white">RESET PASSWORD</h1>
              <p className="text-white/50 text-sm font-mono tracking-widest uppercase max-w-sm mx-auto">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-4 rounded-xl text-center">
                {error}
              </div>
            )}
            
            {/* Success Message */}
            {message && (
              <div className="bg-green-500/10 border border-green-500/20 text-green-500 text-sm p-4 rounded-xl text-center">
                {message}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleReset} className="space-y-6">
              <div>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors font-mono text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-white text-black font-black uppercase tracking-widest text-sm rounded-xl hover:bg-white/90 transition-transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : "SEND RESET LINK"}
              </button>
            </form>
            
          </div>
        </div>
      </div>
    </main>
  );
}
