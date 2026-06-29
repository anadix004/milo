import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata = {
  title: "MILO Admin",
  description: "Admin Portal for MILO",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/auth");
  }

  // Double-check the user's role on the server
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = profile?.role ?? "user";
  const isAdmin = ["admin", "owner", "team"].includes(role);

  if (!isAdmin) {
    redirect("/explore");
  }

  return (
    <div className="w-full h-screen bg-black overflow-hidden font-[family-name:var(--font-lexend)]">
      {children}
    </div>
  );
}
