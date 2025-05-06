
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export const useAuth = () => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        setSession(session);
        setUser(session?.user ?? null);
      } catch (err) {
        console.error("Error fetching session:", err);
        setError(err.message || 'Failed to fetch session');
        setSession(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth event:", event, session);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        setError(null); // Clear error on successful auth change
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const handleLogin = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
      if (loginError) throw loginError;
      // Session update will be handled by onAuthStateChange
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || 'Invalid login credentials');
      setLoading(false); // Ensure loading stops on error
      throw err; // Re-throw to handle in component
    }
    // setLoading(false) is handled by onAuthStateChange
  };

  const handleSignUp = async (email, password, name) => {
    setLoading(true);
    setError(null);
    try {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name, // Store name in user_metadata
          },
        },
      });
      if (signUpError) throw signUpError;
       if (!signUpData.session) {
         // Handle cases where email confirmation might be required
         // Depending on Supabase settings, user might not be logged in immediately
         // Provide feedback to the user
         console.log("Signup successful, but session not immediately available. Check email confirmation settings.");
         setLoading(false); // Stop loading as the immediate action is done
         return { needsConfirmation: true, user: signUpData.user }; 
       }
      // Session update handled by onAuthStateChange if signup logs in immediately
    } catch (err) {
      console.error("Sign up error:", err);
      setError(err.message || 'Could not create account');
      setLoading(false);
      throw err;
    }
     // setLoading(false) handled by onAuthStateChange if logged in
  };

  const handleLogout = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error: logoutError } = await supabase.auth.signOut();
      if (logoutError) throw logoutError;
      setSession(null);
      setUser(null);
    } catch (err) {
      console.error("Logout error:", err);
      setError(err.message || 'Failed to logout');
    } finally {
      setLoading(false);
    }
  };

  return {
    session,
    user,
    loading,
    error,
    setError, // Allow clearing error externally
    handleLogin,
    handleSignUp,
    handleLogout,
  };
};
  