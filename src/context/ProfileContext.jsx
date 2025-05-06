
import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext'; // Import useAuth

export const ProfileContext = createContext({
  profileImageUrl: null,
  setProfileImageUrl: () => {},
  isLoading: true,
});

// Removed local storage key as we now rely on Supabase Auth metadata

export const ProfileProvider = ({ children }) => {
  const { user, session, isLoading: authLoading } = useAuth(); // Use Auth context
  const [profileImageUrl, setProfileImageUrlState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
     // Wait for auth to finish loading
     if (!authLoading) {
        if (user?.user_metadata?.profile_image_url) {
          // Ensure cache-busting if necessary, though Supabase URLs might handle this
           setProfileImageUrlState(user.user_metadata.profile_image_url);
        } else {
           setProfileImageUrlState(null); // Reset if no URL in metadata
        }
        setIsLoading(false); // Profile loading finished once auth is checked
     }

  }, [user, authLoading]); // Depend on user object and authLoading state

  // This function is now primarily used by AccountPage after successful upload
  // It updates the state, and the user metadata should ideally be updated too
  // (which is done in AccountPage's handleUpload)
  const setProfileImageUrl = (url) => {
     setProfileImageUrlState(url);
     // No need to interact with local storage anymore
     // If you wanted to ensure immediate update without waiting for auth listener,
     // you could potentially update user metadata here too, but it's better
     // kept within the upload logic itself.
  };


   // Listen for auth changes to update profile pic if metadata changes elsewhere
   useEffect(() => {
     const { data: authListener } = supabase.auth.onAuthStateChange(
       (event, session) => {
         if (event === 'USER_UPDATED') {
            const newUrl = session?.user?.user_metadata?.profile_image_url;
            setProfileImageUrlState(newUrl || null);
         }
          if (event === 'SIGNED_OUT') {
              setProfileImageUrlState(null); // Clear profile pic on sign out
          }
       }
     );

     return () => {
       authListener?.subscription?.unsubscribe();
     };
   }, []);


  return (
    <ProfileContext.Provider value={{ profileImageUrl, setProfileImageUrl, isLoading }}>
      {children}
    </ProfileContext.Provider>
  );
};
  