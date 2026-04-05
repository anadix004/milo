import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/utils/supabaseAdmin";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const { email, role } = await req.json();
    const authHeader = req.headers.get("Authorization");

    if (!authHeader) {
      return NextResponse.json({ error: "Authorization required" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    const supabaseAdmin = getSupabaseAdmin();

    // 1. Verify the requester's identity
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    // 2. Check requester has owner or admin role
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || !profile || (profile.role !== "owner" && profile.role !== "admin")) {
      return NextResponse.json({ error: "Access denied: Owner or Admin role required" }, { status: 403 });
    }

    // 3. Create the new team account instantly
    const TEAM_PASSWORD = process.env.TEAM_SHARED_PASSWORD || "milo_team_2026";

    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: TEAM_PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: "Team Member" },
    });

    if (createError) {
      return NextResponse.json({ error: `Account creation failed: ${createError.message}` }, { status: 500 });
    }

    // 4. Insert profile record
    const { error: insertError } = await supabaseAdmin
      .from("profiles")
      .insert({
        id: newUser.user.id,
        email: email,
        role: role,
        full_name: "Team Member",
      });

    if (insertError) {
      // Cleanup: delete the auth user if profile insert fails
      await supabaseAdmin.auth.admin.deleteUser(newUser.user.id);
      return NextResponse.json({ error: "Profile creation failed" }, { status: 500 });
    }

    return NextResponse.json({ success: true, user: newUser.user });
  } catch (err: any) {
    return NextResponse.json({ error: "Server error", details: err.message }, { status: 500 });
  }
}
