import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase.js";
import { api } from "../lib/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const fetchUser = useCallback(async (userId) => {
    try {
      const data = await api.get(`/users/${userId}`);
      setUser(data);
    } catch {
      // user exists in Supabase but not in local DB yet
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      if (s?.user) fetchUser(s.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (s?.user) fetchUser(s.user.id);
      else {
        setUser(null);
        setAuthError(null);
        setLoading(false);
      }
    });

    return () => subscription?.unsubscribe();
  }, [fetchUser]);

  async function signUp({ email, password, fullname, username, phone, role }) {
    setAuthError(null);
    const data = await api.post("/auth/signup", {
      email, password, fullname, username, phone, role,
    });
    if (data.session) setSession(data.session);
    if (data.user) setUser(data.user);
    return data;
  }

  async function signIn({ email, username, password }) {
    setAuthError(null);
    const data = await api.post("/auth/login", { email, username, password });
    if (data.session) setSession(data.session);
    if (data.user) setUser(data.user);
    return data;
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setAuthError(null);
  }

  async function updateProfile(updates) {
    if (!user) throw new Error("Not authenticated");
    const updated = await api.put(`/users/${user.userId}/profile`, updates);
    setUser((prev) => ({ ...prev, ...updated }));
    return updated;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        authError,
        signUp,
        signIn,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
