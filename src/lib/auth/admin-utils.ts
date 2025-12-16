import { createServerSupabase } from '@/lib/supabase/server';

export type UserRole = 'admin' | 'manager' | 'staff' | 'customer';

/**
 * Set a user as admin in the database
 * This should be called from a secure admin endpoint or script
 */
export async function setUserAsAdmin(userId: string) {
  const supabase = await createServerSupabase();
  
  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      role: 'admin',
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'id'
    });

  if (error) {
    throw new Error(`Failed to set admin role: ${error.message}`);
  }

  return data;
}

/**
 * Set user role (admin, manager, staff, customer)
 */
export async function setUserRole(userId: string, role: UserRole) {
  const supabase = await createServerSupabase();
  
  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      role,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'id'
    });

  if (error) {
    throw new Error(`Failed to set user role: ${error.message}`);
  }

  return data;
}

/**
 * Remove admin role from a user (demote to customer)
 */
export async function removeAdminRole(userId: string) {
  const supabase = await createServerSupabase();
  
  const { data, error } = await supabase
    .from('profiles')
    .update({
      role: 'customer',
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (error) {
    throw new Error(`Failed to remove admin role: ${error.message}`);
  }

  return data;
}

/**
 * Get all admin users
 */
export async function getAdminUsers() {
  const supabase = await createServerSupabase();
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'admin');

  if (error) {
    throw new Error(`Failed to get admin users: ${error.message}`);
  }

  return data || [];
}

/**
 * Get all users with elevated roles (admin, manager, staff)
 */
export async function getElevatedUsers() {
  const supabase = await createServerSupabase();
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .in('role', ['admin', 'manager', 'staff']);

  if (error) {
    throw new Error(`Failed to get elevated users: ${error.message}`);
  }

  return data || [];
}

/**
 * Check if user has admin or manager privileges
 */
export async function hasElevatedAccess(userId: string): Promise<boolean> {
  const supabase = await createServerSupabase();
  
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();

  if (error || !data) {
    return false;
  }

  return ['admin', 'manager'].includes(data.role);
}