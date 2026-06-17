import CompleteProfileForm from './CompleteProfileForm'
import BrandLogo from '@/components/BrandLogo'

export const metadata = {
  title: 'Milo | Complete Profile',
  description: 'Complete your Milo profile setup',
}

export default function CompleteProfilePage() {
  return (
    <main className="min-h-screen w-full flex flex-col bg-black text-white items-center justify-center p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.02),transparent_100%)] pointer-events-none" />

      <div className="w-full max-w-md bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-10 shadow-3xl overflow-hidden relative z-10">
        <div className="flex justify-center mb-6">
          <BrandLogo size="md" />
        </div>

        <div className="text-center space-y-4 mb-8">
          <h1 className="text-3xl font-black uppercase tracking-tighter italic">IDENTITY SCAN</h1>
          <p className="font-mono text-[9px] text-white/40 uppercase tracking-[0.5em] font-black">Upload Identification</p>
        </div>

        <CompleteProfileForm />
      </div>
    </main>
  )
}
