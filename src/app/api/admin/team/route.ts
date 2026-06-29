import { createClient } from '@supabase/supabase-js';
import { createClient as createServerSupabase } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email("Invalid email format"),
  action: z.enum(['invite', 'promote', 'revoke'])
});

export async function POST(request: Request) {
  try {
    // ── Auth guard ─────────────────────────────────────────────────────────────
    // Verify the caller is logged in via their session cookie, then check their
    // role in the DB using the service-role client.  Without this check, any
    // unauthenticated HTTP client could call this endpoint and promote themselves
    // to admin (privilege escalation).
    const supabaseUser = await createServerSupabase();
    const { data: { user }, error: authError } = await supabaseUser.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: callerProfile } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const callerRole = callerProfile?.role ?? 'user';
    if (!['admin', 'owner', 'team'].includes(callerRole)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    // ── End auth guard ─────────────────────────────────────────────────────────

    const body = await request.json();
    const result = schema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.issues?.[0]?.message || 'Invalid input' }, { status: 400 });
    }

    const { email, action } = result.data;

    if (action === 'invite' || action === 'promote') {
      // Check if user already exists in the DB
      const { data: existingProfile } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();

      if (existingProfile) {
        // User exists — promote them directly
        const { error } = await supabaseAdmin
          .from('profiles')
          .update({ role: 'admin' })
          .eq('id', existingProfile.id);

        if (error) throw error;
        return NextResponse.json({ success: true, message: 'Existing user promoted to Admin' });
      } else {
        // User doesn't exist — send an invite; the DB trigger handle_new_user
        // will create their profile with role: 'admin' from the metadata.
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
