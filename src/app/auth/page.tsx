import AuthForm from './AuthForm'
import Image from 'next/image'
import BrandLogo from '@/components/BrandLogo'
import { Suspense } from 'react'

export const metadata = {
  title: 'Milo | Authentication',
  description: 'Login or Sign Up for Milo',
}

export default function AuthPage() {
  return (
    <main className="min-h-screen w-full flex bg-black">
      {/* Left Side: 3D Generic Image Split */}
      <div className="hidden lg:flex w-1/2 relative bg-zinc-900 overflow-hidden items-center justify-center">
        <Image
          src="https://picsum.photos/seed/loginpage/1600/2400"
          alt="Auth Abstract"
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
        <div className="flex-1 flex flex-col justify-center items-center px-8 sm:px-16 py-20 max-w-xl mx-auto w-full">
          <div className="w-full space-y-8">
            <div className="flex justify-center mb-6">
              <BrandLogo size="md" />
            </div>
            
            <Suspense fallback={<div className="h-64 animate-pulse bg-white/5 rounded-2xl" />}>
              <AuthForm />
            </Suspense>
            
          </div>
        </div>
      </div>
    </main>
  )
}
