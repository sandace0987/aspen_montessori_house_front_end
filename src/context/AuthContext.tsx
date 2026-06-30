import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { api, Profile, AuthContextResponse } from "@/apis/api-client";
import { toast } from "sonner";

interface AuthContextType {
  user: Profile | null;
  roles: string[];
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isSimulation: boolean;
  /** Sign in with real Supabase email + password credentials */
  login: (email: string, password: string) => Promise<boolean>;
  /** Sign in with Google OAuth (redirects to Google) */
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  syncProfile: (fullName: string, phone: string) => Promise<boolean>;
  toggleSimulation: (enable: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSimulation, setIsSimulation] = useState(api.getSimulationStatus());

  // Refs to prevent race conditions
  const activeTokenRef = useRef<string | null>(null);
  const hydrationPromiseRef = useRef<Promise<boolean> | null>(null);
  const rolesRef = useRef<string>("");

  /** Fetch backend profile + roles using the current Supabase access token.
   *  If a hydration is already in-flight, concurrent callers await the same promise. */
  const hydrateProfile = useCallback(async (accessToken: string): Promise<boolean> => {
    // If already hydrated with the same token and no hydration is in-flight, skip
    if (activeTokenRef.current === accessToken && !hydrationPromiseRef.current) {
      console.debug("[Auth] hydrateProfile skipped — same token already hydrated");
      return true;
    }

    // If a hydration is already in-flight, wait for it instead of firing a duplicate
    if (hydrationPromiseRef.current) {
      console.debug("[Auth] hydrateProfile — awaiting in-flight hydration");
      return hydrationPromiseRef.current;
    }

    activeTokenRef.current = accessToken;
    const promise = (async (): Promise<boolean> => {
      try {
        api.setToken(accessToken);
        const authContext: AuthContextResponse = await api.getMe();
        setUser(authContext.profile);
        // Only update roles state if they actually changed (prevents useEffect re-fires)
        const newRolesKey = JSON.stringify(authContext.roles);
        if (newRolesKey !== rolesRef.current) {
          rolesRef.current = newRolesKey;
          setRoles(authContext.roles);
        }
        setToken(accessToken);
        return true;
      } catch (err: any) {
        console.error("[Auth] Failed to hydrate profile from backend /me:", err);
        activeTokenRef.current = null;
        return false;
      } finally {
        hydrationPromiseRef.current = null;
      }
    })();

    hydrationPromiseRef.current = promise;
    return promise;
  }, []);


  // ── Restore session on app load ──────────────────────────────────────────────
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);

      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error("[Auth] getSession error:", error.message);
        }

        if (session?.access_token) {
          await hydrateProfile(session.access_token);
        }
      } catch (err) {
        console.error("[Auth] Session restoration failed:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Listen for Supabase auth state changes (token refresh, logout from another tab, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          if (session?.access_token) {
            await hydrateProfile(session.access_token);
          }
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          setRoles([]);
          rolesRef.current = "";
          setToken(null);
          activeTokenRef.current = null;
          hydrationPromiseRef.current = null;
          api.setToken(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [hydrateProfile]);

  // ── Login ────────────────────────────────────────────────────────────────────
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        toast.error(error.message || "Sign-in failed. Please check your credentials.");
        return false;
      }

      if (!data.session?.access_token) {
        toast.error("Sign-in succeeded but no session was returned. Please try again.");
        return false;
      }

      const hydrated = await hydrateProfile(data.session.access_token);

      if (!hydrated) {
        // Supabase auth worked but backend profile missing — still allow login
        toast.warning("Signed in, but your backend profile could not be loaded. Contact support if issues persist.");
        setToken(data.session.access_token);
      } else {
        toast.success("Welcome back!");
      }

      return true;
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred during sign-in.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // ── Google OAuth Login ───────────────────────────────────────────────────────
  const loginWithGoogle = async (): Promise<void> => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + window.location.pathname,
      },
    });
    if (error) {
      toast.error(error.message || "Google sign-in failed. Please try again.");
    }
    // On success, Supabase redirects to Google; onAuthStateChange handles the session on return
  };

  // ── Logout ───────────────────────────────────────────────────────────────────
  const logout = async (): Promise<void> => {
    await supabase.auth.signOut();
    setUser(null);
    setRoles([]);
    rolesRef.current = "";
    setToken(null);
    activeTokenRef.current = null;
    hydrationPromiseRef.current = null;
    api.setToken(null);
    toast.info("Logged out successfully.");
  };

  // ── Sync profile to backend ──────────────────────────────────────────────────
  const syncProfile = async (fullName: string, phone: string): Promise<boolean> => {
    try {
      const updatedProfile = await api.syncProfile({ full_name: fullName, phone });
      setUser(updatedProfile);
      toast.success("Profile sync completed successfully.");
      return true;
    } catch (err: any) {
      toast.error(err.message || "Profile synchronization failed.");
      return false;
    }
  };

  // ── Toggle simulation mode ───────────────────────────────────────────────────
  const toggleSimulation = (enable: boolean) => {
    api.enableSimulation(enable);
    setIsSimulation(enable);
    toast.success(
      enable ? "Enabled local simulation database mode." : "Enabled real backend communication mode."
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        roles,
        token,
        isAuthenticated: !!user,
        isLoading,
        isSimulation,
        login,
        loginWithGoogle,
        logout,
        syncProfile,
        toggleSimulation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
