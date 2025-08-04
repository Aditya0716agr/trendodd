
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface UserCredentials {
  email: string;
  password: string;
}

export async function signIn({ email, password }: UserCredentials) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        title: "Authentication error",
        description: error.message,
        variant: "destructive",
      });
      return { data: null, error };
    }

    toast({
      title: "Welcome back!",
      description: "You have successfully signed in.",
    });
    
    return { data, error: null };
  } catch (err) {
    const error = err as Error;
    toast({
      title: "Unexpected error",
      description: error.message,
      variant: "destructive",
    });
    return { data: null, error };
  }
}

export async function signUp({ email, password }: UserCredentials) {
  try {
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
    });

    if (error) {
      toast({
        title: "Sign up error",
        description: error.message,
        variant: "destructive",
      });
      return { data: null, error };
    }

    toast({
      title: "Account created!",
      description: "Please check your email to confirm your account.",
    });
    
    return { data, error: null };
  } catch (err) {
    const error = err as Error;
    toast({
      title: "Unexpected error",
      description: error.message,
      variant: "destructive",
    });
    return { data: null, error };
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast({
        title: "Sign out error",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }

    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
    
    return { error: null };
  } catch (err) {
    const error = err as Error;
    toast({
      title: "Unexpected error",
      description: error.message,
      variant: "destructive",
    });
    return { error };
  }
}
