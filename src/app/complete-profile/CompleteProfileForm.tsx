'use client'

import { useState, useTransition } from 'react'
import { uploadIdentification } from '@/app/actions/profile'
import { Loader2, UploadCloud, ShieldCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function CompleteProfileForm() {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    const selectedFile = e.target.files?.[0]
    
    if (!selectedFile) return

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size must be under 5MB')
      return
    }

    if (!['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'].includes(selectedFile.type)) {
      setError('Only PDF, PNG, and JPG files are allowed')
      return
    }

    setFile(selectedFile)

    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => setPreviewUrl(reader.result as string)
      reader.readAsDataURL(selectedFile)
    } else {
      setPreviewUrl(null)
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file) {
      setError('Please select a document to upload')
      return
    }

    setError(null)

    const formData = new FormData()
    formData.append('document', file)

    startTransition(async () => {
      const result = await uploadIdentification(formData)
      if (result?.error) {
        setError(result.error)
      } else {
        router.push('/dashboard')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-4 rounded-xl text-center font-mono">
          {error}
        </div>
      )}

      <div className="relative group cursor-pointer w-full h-48 bg-white/5 border-2 border-dashed border-white/10 rounded-3xl hover:border-white/30 transition-colors flex flex-col items-center justify-center overflow-hidden">
        <input 
          type="file" 
          accept="image/jpeg, image/png, application/pdf"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
        />
        
        {previewUrl ? (
          <img src={previewUrl} alt="Document Preview" className="absolute inset-0 w-full h-full object-cover opacity-80" />
        ) : (
          <div className="flex flex-col items-center justify-center text-white/40 group-hover:text-white/60 transition-colors z-10 space-y-3">
            <UploadCloud size={32} />
            <span className="font-mono text-xs uppercase tracking-widest text-center px-4">
              {file ? file.name : "Tap or Drag Document Here"}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-2 text-white/40 font-mono text-[9px] uppercase tracking-widest">
        <ShieldCheck size={14} className="text-emerald-500" />
        Secure Encrypted Upload
      </div>

      <button
        type="submit"
        disabled={isPending || !file}
        className="w-full py-4 bg-white text-black font-black uppercase tracking-widest text-sm rounded-xl hover:bg-white/90 transition-transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4 shadow-xl"
      >
        {isPending && <Loader2 size={16} className="animate-spin" />}
        Submit Identity
      </button>

      <button
        type="button"
        onClick={() => router.push('/dashboard')}
        className="w-full text-center font-mono text-[10px] text-white/20 uppercase tracking-widest hover:text-white transition-colors font-black mt-4"
      >
        Skip for now
      </button>
    </form>
  )
}
