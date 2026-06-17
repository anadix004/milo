"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useMemo,
} from "react";
import { createClient } from "@/lib/supabase/client";
import { useNotifications } from "./NotificationContext";
import { Session, User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { signOut as serverSignOut } from "@/app/actions/auth";

interface AuthUser extends User {
  username?: string;
  full_name?: string;
  display_name?: string;
  avatar_url?: string;
  id_document_url?: string;
  role?: string;
  is_ghost?: boolean;
  bio?: string;
  location?: string;
  city?: string;
  instagram?: string;
  twitter?: string;
  spotify?: string;
  cover_url?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (updates: Partial<AuthUser>) => Promise<void>;
  recoverPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(() => createClient(), []);

  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addNotification } = useNotifications();
  const router = useRouter();

  const fetchProfile = async (uid: string, baseUser: User) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", uid)
        .single();

      if (error && error.code !== "PGRST116") throw error;

      if (data) {
        setUser({
          ...baseUser,
          ...data,
        } as AuthUser);
        return true;
      }

      setUser({ ...baseUser, role: "user" } as AuthUser);
      return false;
    } catch (err) {
      console.error("Profile sync error:", err);
      setUser({ ...baseUser, role: "user" } as AuthUser);
      return false;
    }
  };

  const refreshProfile = async () => {
    if (session?.user) {
      await fetchProfile(session.user.id, session.user);
    }
  };

  useEffect(() => {
    let isMounted = true;

    // Fallback timeout to guarantee we never hang indefinitely on the loading screen
    const timeoutId = setTimeout(() => {
      if (isMounted) setIsLoading(false);
    }, 5000);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isMounted) return;
      
      setSession(session);
      
      // Immediately set a base user from the session so the UI can render
      if (session?.user && !user) {
        setUser({ ...session.user, role: "user" } as AuthUser);
      } else if (!session) {
        setUser(null);
      }

      // Unblock the loading screen immediately once session state is determined
      if (isMounted) setIsLoading(false);
      clearTimeout(timeoutId);

      // Asynchronously fetch extended profile data without blocking the UI
      if (session?.user) {
        const hasProfile = await fetchProfile(session.user.id, session.user);
        if (_event === "SIGNED_IN" && !hasProfile) {
          addNotification("session", "Account initialized. Let's set up your profile.");
        }
      }

      if (_event === "SIGNED_IN" || _event === "SIGNED_OUT") {
        router.refresh();
      }
    });

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, [supabase, addNotification, router]);

  const logout = async () => {
    // Clear local state immediately for snappy UI
    setUser(null);
    setSession(null);
    addNotification("session", "Logged out successfully.");
    
    // Call server action to clear HttpOnly cookies and redirect
    await serverSignOut();
  };

  const recoverPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    if (error) {
      addNotification("system", `Recovery failed: ${error.message}`);
    } else {
      addNotification("session", "Recovery pulse sent. Check your inbox.");
    }
  };

  const updateProfile = async (updates: Partial<AuthUser>) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id);

      if (error) throw error;

      setUser({ ...user, ...updates });
      addNotification("session", "Profile synchronized.");
    } catch (err) {
      console.error("Profile update error:", err);
      addNotification("system", "Profile synchronization failed.");
    }
  };

  const isAuthenticated = !!session;

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isAuthenticated,
        logout,
        refreshProfile,
        updateProfile,
        recoverPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
