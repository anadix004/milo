'use client'

import { useState, useTransition, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { signInWithPassword, signUpWithEmail, signInWithGoogle } from '@/app/actions/auth'
import { useSearchParams } from 'next/navigation'

type Tab = 'login' | 'signup'

export default function AuthForm() {
  const searchParams = useSearchParams()
  const errorParam = searchParams.get('error')

  const [activeTab, setActiveTab] = useState<Tab>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  // Clear error on tab change
  useEffect(() => {
    setError(null)
  }, [activeTab])

  useEffect(() => {
    if (errorParam === 'oauth_failed') {
      setError('Failed to authenticate with Google. Please try again.')
    }
  }, [errorParam])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    const formData = new FormData(e.currentTarget)
    const isSignup = activeTab === 'signup'

    if (isSignup) {
      const ageChecked = formData.get('ageChecked')
      if (!ageChecked) {
        setError('You must be 18 or older to sign up.')
        return
      }
    }

    startTransition(async () => {
      let result
      if (isSignup) {
        result = await signUpWithEmail(formData)
      } else {
        result = await signInWithPassword(formData)
      }

      if (result?.error) {
        setError(result.error)
      }
    })
  }

  const handleGoogleAuth = async () => {
    setIsGoogleLoading(true)
    setError(null)
    const result = await signInWithGoogle()
    if (result.error) {
      setError(result.error)
      setIsGoogleLoading(false)
    } else if (result.data?.url) {
      window.location.href = result.data.url
    }
  }

  return (
    <div className="w-full">
      <div className="flex border-b border-white/10 mb-8">
        <button
          onClick={() => setActiveTab('login')}
          className={`flex-1 pb-4 text-sm font-black uppercase tracking-widest transition-colors ${
            activeTab === 'login' ? 'text-white border-b-2 border-white' : 'text-white/30 hover:text-white/60'
          }`}
        >
          Login
        </button>
        <button
          onClick={() => setActiveTab('signup')}
          className={`flex-1 pb-4 text-sm font-black uppercase tracking-widest transition-colors ${
            activeTab === 'signup' ? 'text-white border-b-2 border-white' : 'text-white/30 hover:text-white/60'
          }`}
        >
          Sign Up
        </button>
      </div>

      <div className="text-center space-y-4 mb-8">
        <h1 className="text-4xl font-black uppercase tracking-tighter text-white">
          {activeTab === 'login' ? 'WELCOME BACK' : 'JOIN MILO'}
        </h1>
        <p className="text-white/50 text-sm font-mono tracking-widest uppercase">
          {activeTab === 'login' ? "Return to your city's radar" : 'Initialize your identity'}
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-4 rounded-xl text-center mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="space-y-4"
          >
            {activeTab === 'signup' && (
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="full_name"
                  placeholder="Full Name"
                  required
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors font-mono text-sm col-span-2"
                />
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  required
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors font-mono text-sm col-span-2"
                />
              </div>
            )}

            <div>
              <input
                type="email"
                name="email"
                placeholder="Email address"
                required
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors font-mono text-sm"
              />
            </div>
            
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
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

            {activeTab === 'signup' && (
              <label className="flex items-start gap-3 cursor-pointer group pt-2">
                <div className="w-5 h-5 mt-0.5 rounded border border-white/20 bg-white/5 flex items-center justify-center group-hover:border-white/40 transition-colors shrink-0">
                  <input type="checkbox" name="ageChecked" className="opacity-0 absolute w-full h-full cursor-pointer" />
                  <div className="w-3 h-3 rounded-sm bg-white scale-0 transition-transform peer-checked:scale-100" />
                  {/* Since peer approach might be complex with custom checkbox in Tailwind without explicit peer class, we can just rely on standard checkbox visually hidden */}
                </div>
                <span className="text-xs text-white/50 group-hover:text-white/80 transition-colors">
                  I confirm that I am 18 years of age or older and agree to the Terms of Service.
                </span>
              </label>
            )}
          </motion.div>
        </AnimatePresence>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-4 bg-white text-black font-black uppercase tracking-widest text-sm rounded-xl hover:bg-white/90 transition-transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-8"
        >
          {isPending && <Loader2 size={16} className="animate-spin" />}
          {activeTab === 'login' ? "LET'S GO" : "CONTINUE"}
        </button>
      </form>

      <div className="text-center mt-8 space-y-6">
        <div className="flex items-center gap-4 py-4">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-white/30 text-xs font-mono tracking-widest uppercase">Or</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <button
          onClick={handleGoogleAuth}
          disabled={isGoogleLoading}
          className="w-full py-4 bg-white/5 border border-white/10 text-white font-bold text-sm rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {isGoogleLoading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          )}
          Continue with Google
        </button>
      </div>
    </div>
  )
}
