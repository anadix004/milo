import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import AdminClient from "@/components/AdminClient";

export default async function AdminPage() {
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch profile to check role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const isOwnerEmail = user.email === "milo.anadi@gmail.com";
  const effectiveRole = isOwnerEmail ? "owner" : (profile?.role || "user");
  const authorizedRoles = ["owner", "admin", "team"];

  if (!authorizedRoles.includes(effectiveRole)) {
    redirect("/");
  }

  return <AdminClient />;
}
