'use client'

import { useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function AuthForm() {
  const { loginWithRedirect, isLoading, isAuthenticated } = useAuth0()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        loginWithRedirect()
      } else {
        router.push('/explore')
      }
    }
  }, [isLoading, isAuthenticated, loginWithRedirect, router])

  const handleManualLogin = () => {
    loginWithRedirect()
  }

  return (
    <div className="w-full flex flex-col items-center justify-center py-12 space-y-6">
      <Loader2 size={36} className="animate-spin text-white" />
      <div className="text-center space-y-2">
        <p className="text-white font-black uppercase tracking-widest text-sm">
          Redirecting to Auth0...
        </p>
        <p className="text-white/40 text-xs font-mono tracking-widest uppercase">
          Initializing secure identity scan
        </p>
      </div>
      
      <button
        onClick={handleManualLogin}
        className="px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-full text-[10px] font-black uppercase tracking-widest transition-all"
      >
        Click here if not redirected
      </button>
    </div>
  )
}
