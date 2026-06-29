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
  const sessionRef = useRef<Session | null>(null);

  const [user, setUser] = useState<AuthUser | null>(null);
  const userRef = useRef<AuthUser | null>(null);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addNotification } = useNotifications();


  const fetchProfile = async (uid: string, baseUser: User) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, full_name, display_name, avatar_url, role, is_ghost, bio, location, city, instagram, twitter, spotify, cover_url")
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
      if (session?.user && !userRef.current) {
        setUser({ ...session.user, role: "user" } as AuthUser);
      } else if (!session) {
        setUser(null);
      }

      // Unblock the loading screen immediately once session state is determined
      if (isMounted) setIsLoading(false);
      clearTimeout(timeoutId);

      // Asynchronously fetch extended profile data without blocking the UI
      if (session?.user && (!userRef.current || !userRef.current.username)) {
        const hasProfile = await fetchProfile(session.user.id, session.user);
        if (_event === "SIGNED_IN" && !hasProfile) {
          addNotification("session", "Account initialized. Let's set up your profile.");
        }
      }

      if (_event === "SIGNED_OUT") {
        sessionRef.current = null;
        // No router.refresh() — React state (setUser/setSession) already updates the UI.
        // A hard refresh was causing EventListing to remount, resetting events[] to []
        // and making the explore page appear broken after login.
      } else if (_event === "SIGNED_IN") {
        if (session?.access_token !== sessionRef.current?.access_token) {
          sessionRef.current = session;
          // No router.refresh() — session is already live via cookie + React state.
        }
      }
    });

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, [supabase, addNotification]);

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

    // Allowlist only safe user fields to prevent privilege escalation (e.g. role, id_document_url)
    const allowedKeys: (keyof AuthUser)[] = [
      "username", "full_name", "display_name", "avatar_url",
      "is_ghost", "bio", "location", "city",
      "instagram", "twitter", "spotify", "cover_url"
    ];

    const safeUpdates = Object.keys(updates).reduce((acc: any, key) => {
      if (allowedKeys.includes(key as keyof AuthUser)) {
        acc[key] = updates[key as keyof AuthUser];
      }
      return acc;
    }, {});

    if (Object.keys(safeUpdates).length === 0) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .update(safeUpdates)
        .eq("id", user.id);

      if (error) throw error;

      setUser({ ...user, ...safeUpdates });
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
