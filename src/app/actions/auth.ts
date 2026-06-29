'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

export async function signInWithPassword(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email and password are required', data: null }
  }

  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message, data: null }
  }

  revalidatePath('/', 'layout')
  redirect('/explore')
}

export async function signUpWithEmail(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const username = formData.get('username') as string
  const full_name = formData.get('full_name') as string

  if (!email || !password || !username) {
    return { error: 'Email, password, and username are required', data: null }
  }

  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
        full_name: full_name || username,
      },
    },
  })

  if (error) {
    return { error: error.message, data: null }
  }

  revalidatePath('/', 'layout')
  redirect('/explore')
}

export async function signInWithGoogle() {
  const supabase = await createClient()
  const headersList = await headers();
  // Construct redirect origin safely to prevent Host Header Injection / OAuth Callback spoofing.
  // x-forwarded-host can be spoofed if the reverse proxy isn't explicitly configured to overwrite it.
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_VERCEL_URL;
  let origin = "";
  if (appUrl) {
    origin = appUrl.startsWith("http") ? appUrl : `https://${appUrl}`;
  } else {
    const host = headersList.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    origin = `${protocol}://${host}`;
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message, data: null }
  }

  return { error: null, data: { url: data.url } }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  
  revalidatePath('/', 'layout')
  redirect('/')
}
