import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) fetchUser(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) fetchUser(session.user.id);
      else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  async function fetchUser(userId) {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/users/${userId}`);
      const data = await res.json();
      if (data.success) setUser(data.data);
    } catch {
      // User exists in auth but not in our DB yet
    } finally {
      setLoading(false);
    }
  }

  async function signUp({ email, password, fullname, username, phone, role }) {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const res = await fetch(`${apiUrl}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, fullname, username, phone, role }),
    });
    const data = await res.json();
    if (data.success) {
      setSession(data.data.session);
      setUser(data.data.user);
    }
    return data;
  }

  async function signIn({ email, password }) {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const res = await fetch(`${apiUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.success) {
      setSession(data.data.session);
      setUser(data.data.user);
    }
    return data;
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
