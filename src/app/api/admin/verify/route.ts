import { NextResponse } from "next/server";

const OWNER_ID = process.env.ADMIN_OWNER_ID || "owner_milo";
const OWNER_PASS = process.env.ADMIN_OWNER_PASS || "milo_owner_vault_2026";
const TEAM_PASS = process.env.ADMIN_TEAM_PASS || "milo_team_secure_2026";

export async function POST(request: Request) {
  try {
    const { id, password } = await request.json();

    if (id === OWNER_ID && password === OWNER_PASS) {
      return NextResponse.json({ authorized: true, method: "owner" });
    }

    if (password === TEAM_PASS) {
      // Team access — caller should verify role separately
      return NextResponse.json({ authorized: true, method: "team" });
    }

    return NextResponse.json({ authorized: false }, { status: 401 });
  } catch {
    return NextResponse.json({ authorized: false, error: "Invalid request" }, { status: 400 });
  }
}
