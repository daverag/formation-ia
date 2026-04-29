import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../services/supabaseClient.js';
import { getFriendlyError } from '../utils/errors.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user || null);
      setLoading(false);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  async function signUp({ name, email, password }) {
    setAuthError('');
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });

    if (error) {
      const message = getFriendlyError(error);
      setAuthError(message);
      return { ok: false, message };
    }

    return { ok: true, message: 'Compte créé. Vous pouvez maintenant vous connecter.' };
  }

  async function signIn({ email, password }) {
    setAuthError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      const message = getFriendlyError(error);
      setAuthError(message);
      return { ok: false, message };
    }

    return { ok: true };
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  const value = useMemo(
    () => ({ user, loading, authError, signUp, signIn, signOut }),
    [user, loading, authError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth doit être utilisé dans AuthProvider');
  return context;
}
