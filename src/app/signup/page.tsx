"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import { useAuth } from "@/components/AuthContext";
import { createClient } from "@/utils/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const supabase = useMemo(() => createClient(), []);
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ageChecked, setAgeChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (isAuthenticated) {
    router.push("/");
    return null;
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ageChecked) {
      setError("You must be 18 or older to sign up.");
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          }
        }
      });
      
      if (signUpError) throw signUpError;
      
      router.push("/verify-email");
    } catch (err: any) {
      setError(err.message || "Failed to sign up");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex bg-black">
      
      {/* Left Side: 3D Generic Image Split */}
      <div className="hidden lg:flex w-1/2 relative bg-zinc-900 overflow-hidden items-center justify-center">
        <Image
          src="https://picsum.photos/seed/signuppage/1600/2400"
          alt="Signup Abstract"
          fill
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black" />
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Subtle Logo Overlay */}
        <div className="absolute opacity-10 pointer-events-none transform scale-150">
          <BrandLogo size="lg" />
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full lg:w-1/2 flex flex-col relative overflow-y-auto">
        
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
              <h1 className="text-4xl font-black uppercase tracking-tighter text-white">SIGN UP</h1>
              <p className="text-white/50 text-sm font-mono tracking-widest uppercase">
                Join the underground network
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-4 rounded-xl text-center">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSignup} className="space-y-6">
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors font-mono text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors font-mono text-sm"
                  />
                </div>

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
                
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors font-mono text-sm pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                
                <label className="flex items-start gap-3 cursor-pointer group pt-2">
                  <div className="w-5 h-5 mt-0.5 rounded border border-white/20 bg-white/5 flex items-center justify-center group-hover:border-white/40 transition-colors shrink-0">
                    {ageChecked && <div className="w-3 h-3 rounded-sm bg-white" />}
                  </div>
                  <input 
                    type="checkbox" 
                    className="hidden" 
                    checked={ageChecked} 
                    onChange={(e) => setAgeChecked(e.target.checked)} 
                  />
                  <span className="text-xs text-white/50 group-hover:text-white/80 transition-colors">
                    I confirm that I am 18 years of age or older and agree to the Terms of Service.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-white text-black font-black uppercase tracking-widest text-sm rounded-xl hover:bg-white/90 transition-transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating..." : "CONTINUE"}
              </button>
            </form>

            <div className="text-center mt-8 space-y-6">
              <p className="text-white/50 text-sm">
                Already have an account?{" "}
                <Link href="/login" className="text-white font-bold hover:underline">
                  Log in
                </Link>
              </p>
            </div>
            
          </div>
        </div>
      </div>
    </main>
  );
}
