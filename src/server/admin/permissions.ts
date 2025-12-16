"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";

export async function checkAdminPermission(): Promise<boolean> {
  try {
    const user = await getCurrentUser();
    if (!user) return false;
    
    const supabase = await createServerSupabase();
    
    const { data: userRole, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single();
    
    if (error) return false;
    
    return userRole?.role === "admin";
  } catch (error) {
    console.error("Error checking admin permission:", error);
    return false;
  }
}

export async function requireAdmin() {
  const isAdmin = await checkAdminPermission();
  if (!isAdmin) {
    throw new Error("Admin access required");
  }
  return true;
}

export async function getUserRole(userId?: string) {
  try {
    const user = userId ? { id: userId } : await getCurrentUser();
    if (!user) return null;
    
    const supabase = await createServerSupabase();
    
    const { data: userRole, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single();
    
    if (error) return null;
    
    return userRole?.role || "user";
  } catch (error) {
    console.error("Error getting user role:", error);
    return null;
  }
}