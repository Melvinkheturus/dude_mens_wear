import { createSupabaseServerClient } from "@/utils/supabase/server";
import { supabase } from "./supabase/client";
import { getGuestId as getOrCreateGuestId } from "./guest";

/**
 * Get current user on server side
 */
export async function getCurrentUser() {
  const supabaseServer = await createSupabaseServerClient();
  const { data: { user }, error } = await supabaseServer.auth.getUser();
  
  if (error) {
    console.error("Error getting user:", error);
    return null;
  }
  
  return user;
}

/**
 * Get current user on client side
 */
export async function getCurrentUserClient() {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error) {
    console.error("Error getting user:", error);
    return null;
  }
  
  return user;
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}

/**
 * Get user session
 */
export async function getSession() {
  const supabaseServer = await createSupabaseServerClient();
  const { data: { session }, error } = await supabaseServer.auth.getSession();
  
  if (error) {
    console.error("Error getting session:", error);
    return null;
  }
  
  return session;
}

/**
 * Get guest ID for anonymous users
 */
export async function getGuestIdForAuth(): Promise<string> {
  return await getOrCreateGuestId();
}