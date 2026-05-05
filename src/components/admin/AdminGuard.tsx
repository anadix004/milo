"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { Loader2 } from "lucide-react";

const ADMIN_ROLES = ["admin", "owner", "team"];

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const role = user?.role ?? "user";
  const isAuthorized = ADMIN_ROLES.includes(role);

  useEffect(() => {
    // Wait until auth has fully resolved before making any routing decision
    if (isLoading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    if (!isAuthorized) {
      console.warn("AdminGuard: insufficient role →", role);
      router.push("/");
    }
  }, [user, isLoading, isAuthorized, role, router]);

  // Show spinner while auth is loading OR while we wait for the role check
  if (isLoading || !user || !isAuthorized) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="animate-spin text-purple-500" size={48} />
      </div>
    );
  }

  return <>{children}</>;
}
