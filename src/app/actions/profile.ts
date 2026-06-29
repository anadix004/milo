'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_MIME_TYPES = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg']

export async function uploadIdentification(formData: FormData) {
  const file = formData.get('document') as File

  if (!file) {
    return { error: 'No document provided', data: null }
  }

  if (file.size > MAX_FILE_SIZE) {
    return { error: 'File size must be less than 5MB', data: null }
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return { error: 'File type must be PDF, PNG, or JPG', data: null }
  }

  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return { error: 'Unauthorized', data: null }
  }

  const ext = file.name.split('.').pop()
  const timestamp = Date.now()
  const filePath = `private/${user.id}/id_${timestamp}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('user-documents')
    .upload(filePath, file)

  if (uploadError) {
    return { error: `Upload failed: ${uploadError.message}`, data: null }
  }

  // Generate a long-lived (1 year) signed URL to prevent exposing government IDs via public URLs
  const { data: signedData, error: signedError } = await supabase.storage
    .from('user-documents')
    .createSignedUrl(filePath, 31536000)

  if (signedError || !signedData?.signedUrl) {
    return { error: `Failed to secure document: ${signedError?.message || 'Unknown error'}`, data: null }
  }

  const securedUrl = signedData.signedUrl

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ id_document_url: securedUrl })
    .eq('id', user.id)

  if (updateError) {
    return { error: `Profile update failed: ${updateError.message}`, data: null }
  }

  revalidatePath('/explore')
  revalidatePath('/profile')
  revalidatePath('/complete-profile')

  return { error: null, data: { publicUrl: securedUrl } }
}

export async function updateProfile(formData: FormData) {
  const full_name = formData.get('full_name') as string
  const avatar_url = formData.get('avatar_url') as string

  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return { error: 'Unauthorized', data: null }
  }

  const updates: any = {}
  if (full_name) updates.full_name = full_name
  if (avatar_url) updates.avatar_url = avatar_url

  if (Object.keys(updates).length === 0) {
    return { error: 'No updates provided', data: null }
  }

  const { error: updateError } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)

  if (updateError) {
    return { error: `Profile update failed: ${updateError.message}`, data: null }
  }

  revalidatePath('/explore')
  revalidatePath('/profile')

  return { error: null, data: { success: true } }
}
