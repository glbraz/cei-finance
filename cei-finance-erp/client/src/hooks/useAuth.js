import { useState, useEffect } from 'react';
import { authService } from '../services/supabase';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar sessão existente
    authService.getSession().then(session => {
      setUser(session?.user || null);
      setLoading(false);
    });

    // Inscrever-se em mudanças de autenticação
    const subscription = authService.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription?.unsubscribe();
  }, []);

  const signUp = async (email, password) => {
    const { error } = await authService.signUp(email, password);
    return { error };
  };

  const signIn = async (email, password) => {
    const { error } = await authService.signIn(email, password);
    return { error };
  };

  const signOut = async () => {
    const { error } = await authService.signOut();
    return { error };
  };

  return {
    user,
    loading,
    signUp,
    signIn,
    signOut
  };
};
