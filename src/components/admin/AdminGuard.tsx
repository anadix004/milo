"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { Loader2 } from "lucide-react";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    async function checkRole() {
      if (isLoading) return;
      if (!user) {
        router.push("/login");
        return;
      }

      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (error || !data || !["admin", "owner", "team"].includes(data.role)) {
          console.error("Unauthorized access attempt:", error);
          router.push("/");
          return;
        }

        setIsAuthorized(true);
      } catch (err) {
        console.error("AdminGuard check failed:", err);
        router.push("/");
      }
    }

    checkRole();
  }, [user, isLoading, router]);

  if (isLoading || !isAuthorized) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="animate-spin text-purple-500" size={48} />
      </div>
    );
  }

  return <>{children}</>;
}
