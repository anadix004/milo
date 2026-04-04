"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";
import { useNotifications } from "./NotificationContext";
import { Session, User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

interface AuthUser extends User {
  username?: string;
  avatar_url?: string;
  mobile?: string;
  gender?: string;
  dob?: string;
  full_name?: string;
  role: "owner" | "team" | "user";
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signUp: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  refreshProfile: () => Promise<void>;
  recoverPassword: (email: string) => Promise<void>;
  isAdmin: boolean;
  isOwner: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
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
        setUser({ ...baseUser, ...data } as AuthUser);
        return true; 
      }
      
      // Default to User role if no profile yet, but milo.anadi@gmail.com is Owner
      const role = baseUser.email === "milo.anadi@gmail.com" ? "owner" : "user";
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
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        await fetchProfile(session.user.id, session.user);
      }
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user) {
        const hasProfile = await fetchProfile(session.user.id, session.user);
        
        if (_event === "SIGNED_IN") {
          if (hasProfile) {
            addNotification("session", "Identity verified. Redirecting to Live Radar.");
            router.push("/");
          } else {
             addNotification("session", "Identity established. Please complete onboarding.");
          }
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [addNotification, router]);

  const login = async (email: string, pass: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) {
      addNotification("system", `Login failed: ${error.message}`);
    } else {
       addNotification("session", "Identity mission pulse synchronized.");
    }
  };

  const signUp = async (email: string, pass: string, name: string) => {
    try {
      // 1. Gatekeeper Check: Is this email pre-authorized?
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("email", email)
        .single();
      
      // If no pre-authorized identity exists AND it's not the owner
      if ((profileError || !profile) && email !== "milo.anadi@gmail.com") {
        addNotification("system", "Gatekeeper Error: Identity not pre-authorized in Team Nexus.");
        return;
      }

      // 2. synchronize mission pulse
      const { error } = await supabase.auth.signUp({ 
        email, 
        password: pass,
        options: { data: { full_name: name } }
      });
      
      if (error) {
        addNotification("system", `Mission failed: ${error.message}`);
      } else {
         addNotification("session", "Identity established. Check email for verification pulse.");
      }
    } catch (err) {
       addNotification("system", "Nexus Hub Error: Gatekeeper synchronization failure.");
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("milo_user");
    setUser(null);
    setSession(null);
    router.push("/");
  };

  const recoverPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    if (error) {
       addNotification("system", `Recovery failed: ${error.message}`);
    } else {
       addNotification("session", "Recovery mission pulse dispatched to your identity email.");
    }
  };

  const isAdmin = user?.role === "owner" || user?.role === "team";
  const isOwner = user?.role === "owner";

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      isLoading, 
      login, 
      signUp,
      logout, 
      isAuthenticated: !!session?.user,
      refreshProfile,
      recoverPassword,
      isAdmin,
      isOwner
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
