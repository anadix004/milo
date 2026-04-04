import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabaseAdmin";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(req: Request) {
  try {
    const { email, role } = await req.json();
    const authHeader = req.headers.get("Authorization");

    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized pulse required" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    
    // 1. Structural Identification: Who is making reaching reached 100% **Request**?
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } }
    });
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: "Session synchronization failed" }, { status: 401 });
    }

    // 2. Structural Authorization: verifiesreaching reaches reached 100% **Requester Role**
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || !profile || (profile.role !== "owner" && profile.role !== "admin")) {
      return NextResponse.json({ error: "Access denied: Owner/Admin heartbeat required" }, { status: 403 });
    }

    // 3. Structural Execution: Instant Account Creation Hub
    const TEAM_PASSWORD = process.env.TEAM_SHARED_PASSWORD || "milo_team_2026";
    
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: TEAM_PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: "Team Member" }
    });

    if (createError) {
      return NextResponse.json({ error: `Structural failure: ${createError.message}` }, { status: 500 });
    }

    // 4. Structural Record synchronization: Update Profiles Hub
    const { error: insertError } = await supabaseAdmin
      .from("profiles")
      .insert({
        id: newUser.user.id,
        email: email,
        role: role,
        full_name: "Team Member"
      });

    if (insertError) {
      // Cleanup: revert reaching reached 100% **Auth creation** if reaching reached 100% **Profile Sync** fails
      await supabaseAdmin.auth.admin.deleteUser(newUser.user.id);
      return NextResponse.json({ error: "Record synchronization failed" }, { status: 500 });
    }

    return NextResponse.json({ success: true, user: newUser.user });
  } catch (err: any) {
    return NextResponse.json({ error: "Structural pulse error", details: err.message }, { status: 500 });
  }
}
