import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

interface AuthContextType {
  isAuthenticated: boolean;
  email: string | null;
  user: User | null;
  isLoading: boolean;
  profileCompleted: boolean;
  setAuthenticated: (email: string) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  email: null,
  user: null,
  isLoading: true,
  profileCompleted: false,
  setAuthenticated: () => {},
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profileCompleted, setProfileCompleted] = useState(false);

  useEffect(() => {
    // Check for existing session on mount (persist login across refreshes)
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          setEmail(session.user.email || null);
          setIsAuthenticated(true);
          
          // Check if profile is completed
          try {
            const { data: profile } = await supabase
              .from('customer_profiles')
              .select('profile_completed')
              .eq('user_id', session.user.id)
              .single();
            
            setProfileCompleted(profile?.profile_completed || false);
          } catch (profileError) {
            console.error('Error fetching profile:', profileError);
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        setEmail(session.user.email || null);
        setIsAuthenticated(true);
        
        // Check if profile is completed
        setTimeout(async () => {
          try {
            const { data: profile } = await supabase
              .from('customer_profiles')
              .select('profile_completed')
              .eq('user_id', session.user.id)
              .single();
            
            setProfileCompleted(profile?.profile_completed || false);
          } catch (profileError) {
            console.error('Error fetching profile:', profileError);
          }
        }, 0);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setEmail(null);
        setIsAuthenticated(false);
        setProfileCompleted(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const setAuthenticated = (userEmail: string) => {
    setEmail(userEmail);
    setIsAuthenticated(true);
  };

  const signOut = async () => {
    try {
      // Clear all auth data completely
      await supabase.auth.signOut();
      
      // Clear all localStorage items related to auth and cart
      localStorage.removeItem('smart_bazaar_cart');
      localStorage.removeItem('smart_bazaar_cart_auth_pending');
      
      // Clear Supabase auth tokens from localStorage
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('sb-') || key.includes('supabase'))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Error during sign out:', error);
    }
    
    // Reset state regardless of error
    setUser(null);
    setEmail(null);
    setIsAuthenticated(false);
    setProfileCompleted(false);
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      email, 
      user, 
      isLoading, 
      profileCompleted, 
      setAuthenticated, 
      signOut 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
