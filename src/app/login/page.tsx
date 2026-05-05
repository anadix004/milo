"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import { useAuth } from "@/components/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already authenticated, redirect to home
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Failed to log in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex bg-black">
      
      {/* Left Side: 3D Generic Image Split */}
      <div className="hidden lg:flex w-1/2 relative bg-zinc-900 overflow-hidden items-center justify-center">
        <Image
          src="https://picsum.photos/seed/loginpage/1600/2400"
          alt="Login Abstract"
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
              <h1 className="text-4xl font-black uppercase tracking-tighter text-white">LOGIN</h1>
              <p className="text-white/50 text-sm font-mono tracking-widest uppercase">
                Welcome back to your city's radar
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-4 rounded-xl text-center">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              
              <div className="space-y-4">
                <div>
                  <input
                    type="email"
                    placeholder="Phone Number / Email ID"
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
                
                <div className="flex justify-end">
                  <Link href="/login/forgot-password" className="text-xs text-white/50 hover:text-white transition-colors">
                    Forgot Password?
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-white text-black font-black uppercase tracking-widest text-sm rounded-xl hover:bg-white/90 transition-transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Logging in..." : "LET'S GO"}
              </button>
            </form>

            <div className="text-center mt-8 space-y-6">
              <p className="text-white/50 text-sm">
                Don't have an account?{" "}
                <Link href="/signup" className="text-white font-bold hover:underline">
                  Sign up
                </Link>
              </p>
              
              <div className="flex items-center gap-4 py-4">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-white/30 text-xs font-mono tracking-widest uppercase">Or</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              <button className="w-full py-4 bg-white/5 border border-white/10 text-white font-bold text-sm rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center gap-3">
                <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </main>
  );
}
