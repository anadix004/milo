"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useMemo,
} from "react";
import { createClient } from "@/utils/supabase/client";
import { useNotifications } from "./NotificationContext";
import { Session, User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

interface AuthUser extends User {
  username?: string;
  full_name?: string;
  display_name?: string;
  avatar_url?: string;
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
  login: (email: string, pass: string) => Promise<void>;
  signUp: (email: string, pass: string, data: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (updates: Partial<AuthUser>) => Promise<void>;
  recoverPassword: (email: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  /*
   * FIX: createClient() was called directly in the component body.
   * React re-runs the component function on every render, so this created a
   * brand-new Supabase client instance each time — including on re-renders
   * triggered by the onAuthStateChange subscription itself, causing an
   * unsubscribe + re-subscribe loop. Wrapping in useMemo with [] ensures
   * exactly one client per AuthProvider mount.
   */
  const supabase = useMemo(() => createClient(), []);

  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addNotification } = useNotifications();
  const router = useRouter();
  const isInitialized = useRef(false);

  const fetchProfile = async (uid: string, baseUser: User) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", uid)
        .single();

      if (error && error.code !== "PGRST116") throw error;

      if (data) {
        const isAdmin = baseUser.email === "milo.anadi@gmail.com";
        setUser({
          ...baseUser,
          ...data,
          role: isAdmin ? "admin" : data.role || "user",
        } as AuthUser);
        return true;
      }

      const isAdmin = baseUser.email === "milo.anadi@gmail.com";
      setUser({ ...baseUser, role: isAdmin ? "admin" : "user" } as AuthUser);
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

    const initAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (isMounted) setSession(session);
        if (session?.user && isMounted) {
          await fetchProfile(session.user.id, session.user);
        }
      } catch (err) {
        console.error("Critical Auth Initializer Error:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    initAuth();

    /*
     * FIX: Because `supabase` is now stable (from useMemo), this subscription
     * is registered exactly once and cleaned up correctly on unmount.
     * Previously the stale client reference caused duplicate subscriptions.
     */
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isMounted) return;
      setSession(session);
      if (session?.user) {
        const hasProfile = await fetchProfile(session.user.id, session.user);
        if (_event === "SIGNED_IN" && !hasProfile) {
          addNotification("session", "Account initialized. Let's set up your profile.");
        }
      } else {
        setUser(null);
      }
      if (isMounted) setIsLoading(false);

      if (_event === "SIGNED_IN" || _event === "SIGNED_OUT") {
        router.refresh();
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
    /*
     * FIX: dependency array now only lists truly stable values.
     * `supabase` is stable (useMemo []), `addNotification` and `router`
     * are stable from their respective providers. Previously missing `supabase`
     * from deps while calling it inside the effect was a lint error that masked
     * the re-subscription bug.
     */
  }, [supabase, addNotification, router]);

  const login = async (email: string, pass: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });
    if (error) {
      addNotification("system", `Login failed: ${error.message}`);
      throw error;
    } else {
      addNotification("session", "Login successful. Redirecting...");
      router.refresh();
      router.push("/");
    }
  };

  const signUp = async (email: string, pass: string, data: any) => {
    const { error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: { data },
    });
    if (error) {
      addNotification("system", `Signup failed: ${error.message}`);
      throw error;
    } else {
      addNotification("session", "Enrollment successful. Welcome to Milo.");
      router.refresh();
      router.push("/");
    }
  };

  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      addNotification("system", `Google Auth failed: ${error.message}`);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    router.refresh();
    router.push("/");
    addNotification("session", "Logged out successfully.");
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

  const isAuthenticated = !!session;

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isAuthenticated,
        login,
        signUp,
        logout,
        refreshProfile,
        updateProfile,
        recoverPassword,
        loginWithGoogle,
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
