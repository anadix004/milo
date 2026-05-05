"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { Loader2 } from "lucide-react";

const ADMIN_ROLES = ["admin", "owner", "team"];
const ADMIN_EMAIL = "milo.anadi@gmail.com";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading, session } = useAuth();
  const router = useRouter();

  // Once we've confirmed admin access, lock it in for this mount so a
  // transient re-render (TOKEN_REFRESHED, etc.) can't kick us out.
  const wasAuthorized = useRef(false);

  // Local gate: stays true until we've made a definitive auth decision.
  const [isChecking, setIsChecking] = useState(true);

  const role = user?.role ?? "";
  const email = user?.email ?? session?.user?.email ?? "";

  // Admin if role matches OR email matches the hardcoded admin email.
  const isAuthorized = ADMIN_ROLES.includes(role) || email === ADMIN_EMAIL;

  useEffect(() => {
    // Wait for AuthContext to finish resolving the user + profile.
    if (isLoading) return;

    if (isAuthorized) {
      wasAuthorized.current = true;
      setIsChecking(false);
      return;
    }

    // If we've already been authorized once this mount, ignore transient
    // un-authorized states (e.g., role briefly missing during token refresh).
    if (wasAuthorized.current) return;

    // Auth settled and user is definitively not allowed — redirect.
    setIsChecking(false);
    if (!user && !session) {
      router.push("/login");
    } else {
      router.push("/");
    }
  }, [isLoading, isAuthorized, user, session, router]);

  if (isLoading || isChecking) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="animate-spin text-purple-500" size={48} />
      </div>
    );
  }

  if (!isAuthorized && !wasAuthorized.current) return null;

  return <>{children}</>;
}
