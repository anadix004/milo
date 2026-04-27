import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, action } = await request.json();
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    if (action === 'invite' || action === 'promote') {
      // 1. Check if user already exists
      const { data: existingProfile } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('email', email)
        .single();

      if (existingProfile) {
        // User exists, promote them directly
        const { error } = await supabaseAdmin
          .from('profiles')
          .update({ role: 'admin' })
          .eq('id', existingProfile.id);
          
        if (error) throw error;
        return NextResponse.json({ success: true, message: 'Existing user promoted to Admin' });
      } else {
        // User does not exist, send an invite with the 'admin' role in metadata
        // The database trigger public.handle_new_user will handle profile creation
        const { error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
          data: { role: 'admin' }
        });
        
        if (error) {
          return NextResponse.json({ error: error.message }, { status: 400 });
        }
        
        return NextResponse.json({ success: true, message: 'Invitation sent and Admin access granted' });
      }
    }

    if (action === 'revoke') {
      const { error } = await supabaseAdmin
        .from('profiles')
        .update({ role: 'user' })
        .eq('email', email);
        
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      return NextResponse.json({ success: true, message: 'Admin access revoked' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
