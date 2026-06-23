// NOTE: Ensure Auth0 has a Rule/Action that adds { role: 'authenticated' } to the ID token custom claims
// Without this, Supabase RLS will reject authenticated requests

"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useMemo,
} from "react";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { createClient, setTokenResolver } from "@/utils/supabase/client";
import { useNotifications } from "./NotificationContext";

interface AuthUser {
  id: string;
  email?: string;
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
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
}

interface AuthContextType {
  user: AuthUser | null;
  session: any | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (updates: Partial<AuthUser>) => Promise<void>;
  recoverPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthProviderInner({ children }: { children: React.ReactNode }) {
  const {
    getIdTokenClaims,
    isAuthenticated,
    isLoading: authLoading,
    user: auth0User,
    logout: auth0Logout,
  } = useAuth0();

  const supabase = useMemo(() => createClient(), []);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addNotification } = useNotifications();

  // Set up token resolver on mount / auth state change
  useEffect(() => {
    if (isAuthenticated) {
      const getAccessToken = async () => {
        try {
          const claims = await getIdTokenClaims();
          return claims?.__raw || null;
        } catch (err) {
          console.error("Auth0 token retrieval failed:", err);
          return null;
        }
      };
      setTokenResolver(getAccessToken);
    } else {
      setTokenResolver(null);
    }
  }, [isAuthenticated, getIdTokenClaims]);

  // Construct a mock session object that mimics Supabase's structure
  useEffect(() => {
    if (isAuthenticated && auth0User) {
      getIdTokenClaims().then((claims) => {
        setSession({
          access_token: claims?.__raw || "",
          user: {
            id: auth0User.sub || auth0User.email || "",
            email: auth0User.email,
          },
        });
      });
    } else {
      setSession(null);
    }
  }, [isAuthenticated, auth0User, getIdTokenClaims]);

  const fetchProfile = async (uid: string, baseUser: AuthUser) => {
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
    if (isAuthenticated && auth0User) {
      const uid = auth0User.sub || auth0User.email || "";
      const baseUser: AuthUser = {
        id: uid,
        email: auth0User.email,
        user_metadata: {
          full_name: auth0User.name,
          avatar_url: auth0User.picture,
        },
      };
      await fetchProfile(uid, baseUser);
    }
  };

  // Sync profile when authentication state changes
  useEffect(() => {
    if (!authLoading) {
      if (isAuthenticated && auth0User) {
        const uid = auth0User.sub || auth0User.email || "";
        const baseUser: AuthUser = {
          id: uid,
          email: auth0User.email,
          user_metadata: {
            full_name: auth0User.name,
            avatar_url: auth0User.picture,
          },
        };
        fetchProfile(uid, baseUser).then(() => {
          setIsLoading(false);
        });
      } else {
        setUser(null);
        setIsLoading(false);
      }
    }
  }, [authLoading, isAuthenticated, auth0User]);

  const logout = async () => {
    setUser(null);
    setSession(null);
    setTokenResolver(null);
    addNotification("session", "Logged out successfully.");
    auth0Logout({ logoutParams: { returnTo: window.location.origin } });
  };

  const recoverPassword = async (email: string) => {
    addNotification(
      "session",
      "Auth0 manages password recovery. Please use login page reset options."
    );
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const domain =
    process.env.NEXT_PUBLIC_AUTH0_DOMAIN || "placeholder-domain.us.auth0.com";
  const clientId =
    process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || "placeholder-client-id";

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <>{children}</>;
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri:
          typeof window !== "undefined" ? window.location.origin : undefined,
      }}
    >
      <AuthProviderInner>{children}</AuthProviderInner>
    </Auth0Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
