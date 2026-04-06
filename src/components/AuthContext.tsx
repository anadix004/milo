"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
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
  display_name?: string;
  role: "owner" | "admin" | "team" | "user";
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signUp: (email: string, pass: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
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
        // Hardcoded Owner Priority: If email matches, role MUST be owner.
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
        // Run profile sync in background to avoid blocking the loading pulse
        fetchProfile(session.user.id, session.user).then(hasProfile => {
          if (_event === "SIGNED_IN" && !hasProfile) {
            addNotification("session", "Account initialized. Let's set up your profile.");
          }
        });
      } else {
        setUser(null);
      }
      
      // Strict loading gate clearance
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [addNotification]);

  const login = async (email: string, pass: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) {
      addNotification("system", `Login failed: ${error.message}`);
    } else {
       addNotification("session", "Login successful. Welcome back.");
    }
  };

  const signUp = async (email: string, pass: string, name: string) => {
    try {

      const { error } = await supabase.auth.signUp({ 
        email, 
        password: pass,
        options: { data: { display_name: name, full_name: name } }
      });
      
      if (error) {
        addNotification("system", `Signup failed: ${error.message}`);
      } else {
         addNotification("session", "Account created. Please verify your email.");
      }
    } catch (err) {
       addNotification("system", "Authentication error: Connection failed.");
    }
  };

  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) addNotification("system", `Google Auth failed: ${error.message}`);
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
       addNotification("session", "Password reset link sent to your email.");
    }
  };

  const isAdmin = user?.role === "owner" || user?.role === "admin" || user?.role === "team";
  const isOwner = user?.role === "owner";

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      isLoading, 
      login, 
      signUp,
      loginWithGoogle,
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
