"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
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
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  isLoading: boolean;
  isAdmin: boolean;
  isOwner: boolean;
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
  const supabase = createClient();
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

      const isOwnerEmail = baseUser.email === "milo.anadi@gmail.com";
      
      if (data) {
        const role = isOwnerEmail ? "owner" : (data.role || "user");
        setUser({ ...baseUser, ...data, role } as AuthUser);
        return true; 
      }
      
      const role = isOwnerEmail ? "owner" : "user";
      setUser({ ...baseUser, role } as AuthUser);
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
    if (isInitialized.current) return;
    isInitialized.current = true;

    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        if (session?.user) {
          await fetchProfile(session.user.id, session.user);
        }
      } catch (err) {
        console.error("Critical Auth Initializer Error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user.id, session.user).then(hasProfile => {
          if (_event === "SIGNED_IN" && !hasProfile) {
            addNotification("session", "Account initialized. Let's set up your profile.");
          }
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
      
      // Trigger router.refresh to sync with Server Components/Middleware
      router.refresh();
    });

    return () => subscription.unsubscribe();
  }, [addNotification, router, supabase]);

  const login = async (email: string, pass: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) {
      addNotification("system", `Login failed: ${error.message}`);
    } else {
      addNotification("session", "Identity verified. Redirecting...");
      router.refresh();
      router.push("/");
    }
  };

  const signUp = async (email: string, pass: string, data: any) => {
    const { error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: { data }
    });
    if (error) {
      addNotification("system", `Signup failed: ${error.message}`);
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
        redirectTo: `${window.location.origin}/auth/callback`
      }
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
    addNotification("session", "Identity purged. Nexus disconnected.");
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
      addNotification("session", "Profile synchronized with Nexus.");
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

  const isAdmin = user?.role === "admin" || user?.role === "owner";
  const isOwner = user?.role === "owner";
  const isAuthenticated = !!session;

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      isLoading, 
      isAdmin, 
      isOwner, 
      isAuthenticated,
      login, 
      signUp, 
      logout,
      refreshProfile,
      updateProfile,
      recoverPassword,
      loginWithGoogle
    }}>
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
