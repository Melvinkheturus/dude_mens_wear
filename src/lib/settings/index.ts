import { createServerSupabase } from '@/lib/supabase/server';
import { Tables, TablesInsert, TablesUpdate } from '@/types/database.types';

// Type definitions for settings
export type StoreSettings = Tables<'store_settings'>;
export type StoreLocation = Tables<'store_locations'>;
export type AdminUser = Tables<'admin_users'>;
export type PaymentSettings = Tables<'payment_settings'>;
export type ShippingSettings = Tables<'shipping_settings'>;
export type NotificationSettings = Tables<'notification_settings'>;

export type AdminRole = 'owner' | 'admin' | 'staff';

/**
 * Store Settings - Single row configuration
 */
export class StoreSettingsService {
  static async get(): Promise<StoreSettings | null> {
    const supabase = await createServerSupabase();
    
    const { data, error } = await supabase
      .from('store_settings')
      .select('*')
      .single();

    if (error) {
      console.error('Failed to get store settings:', error);
      return null;
    }

    return data;
  }

  static async update(updates: TablesUpdate<'store_settings'>): Promise<StoreSettings | null> {
    const supabase = await createServerSupabase();
    
    const { data, error } = await supabase
      .from('store_settings')
      .update(updates)
      .select()
      .single();

    if (error) {
      console.error('Failed to update store settings:', error);
      return null;
    }

    return data;
  }
}

/**
 * Store Locations Service
 */
export class StoreLocationsService {
  static async getAll(): Promise<StoreLocation[]> {
    const supabase = await createServerSupabase();
    
    const { data, error } = await supabase
      .from('store_locations')
      .select('*')
      .order('is_primary', { ascending: false })
      .order('name');

    if (error) {
      console.error('Failed to get store locations:', error);
      return [];
    }

    return data || [];
  }

  static async getPrimary(): Promise<StoreLocation | null> {
    const supabase = await createServerSupabase();
    
    const { data, error } = await supabase
      .from('store_locations')
      .select('*')
      .eq('is_primary', true)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Failed to get primary location:', error);
      return null;
    }

    return data;
  }

  static async create(location: TablesInsert<'store_locations'>): Promise<StoreLocation | null> {
    const supabase = await createServerSupabase();
    
    const { data, error } = await supabase
      .from('store_locations')
      .insert(location)
      .select()
      .single();

    if (error) {
      console.error('Failed to create store location:', error);
      return null;
    }

    return data;
  }

  static async update(id: string, updates: TablesUpdate<'store_locations'>): Promise<StoreLocation | null> {
    const supabase = await createServerSupabase();
    
    const { data, error } = await supabase
      .from('store_locations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Failed to update store location:', error);
      return null;
    }

    return data;
  }

  static async delete(id: string): Promise<boolean> {
    const supabase = await createServerSupabase();
    
    const { error } = await supabase
      .from('store_locations')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Failed to delete store location:', error);
      return false;
    }

    return true;
  }
}

/**
 * Admin Users Service
 */
export class AdminUsersService {
  static async getAll(): Promise<AdminUser[]> {
    const supabase = await createServerSupabase();
    
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to get admin users:', error);
      return [];
    }

    return data || [];
  }

  static async getByClerkId(clerkUserId: string): Promise<AdminUser | null> {
    const supabase = await createServerSupabase();
    
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('clerk_user_id', clerkUserId)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Failed to get admin user:', error);
      return null;
    }

    return data;
  }

  static async create(adminUser: TablesInsert<'admin_users'>): Promise<AdminUser | null> {
    const supabase = await createServerSupabase();
    
    const { data, error } = await supabase
      .from('admin_users')
      .insert(adminUser)
      .select()
      .single();

    if (error) {
      console.error('Failed to create admin user:', error);
      return null;
    }

    return data;
  }

  static async updateRole(id: string, role: AdminRole): Promise<AdminUser | null> {
    const supabase = await createServerSupabase();
    
    const { data, error } = await supabase
      .from('admin_users')
      .update({ role })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Failed to update admin user role:', error);
      return null;
    }

    return data;
  }

  static async deactivate(id: string): Promise<boolean> {
    const supabase = await createServerSupabase();
    
    const { error } = await supabase
      .from('admin_users')
      .update({ is_active: false })
      .eq('id', id);

    if (error) {
      console.error('Failed to deactivate admin user:', error);
      return false;
    }

    return true;
  }
}

/**
 * Payment Settings Service
 */
export class PaymentSettingsService {
  static async getAll(): Promise<PaymentSettings[]> {
    const supabase = await createServerSupabase();
    
    const { data, error } = await supabase
      .from('payment_settings')
      .select('*')
      .order('sort_order');

    if (error) {
      console.error('Failed to get payment settings:', error);
      return [];
    }

    return data || [];
  }

  static async getEnabled(): Promise<PaymentSettings[]> {
    const supabase = await createServerSupabase();
    
    const { data, error } = await supabase
      .from('payment_settings')
      .select('*')
      .eq('is_enabled', true)
      .order('sort_order');

    if (error) {
      console.error('Failed to get enabled payment settings:', error);
      return [];
    }

    return data || [];
  }

  static async update(id: string, updates: TablesUpdate<'payment_settings'>): Promise<PaymentSettings | null> {
    const supabase = await createServerSupabase();
    
    const { data, error } = await supabase
      .from('payment_settings')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Failed to update payment settings:', error);
      return null;
    }

    return data;
  }
}

/**
 * Shipping Settings Service
 */
export class ShippingSettingsService {
  static async get(): Promise<ShippingSettings | null> {
    const supabase = await createServerSupabase();
    
    const { data, error } = await supabase
      .from('shipping_settings')
      .select('*')
      .single();

    if (error) {
      console.error('Failed to get shipping settings:', error);
      return null;
    }

    return data;
  }

  static async update(updates: TablesUpdate<'shipping_settings'>): Promise<ShippingSettings | null> {
    const supabase = await createServerSupabase();
    
    const { data, error } = await supabase
      .from('shipping_settings')
      .update(updates)
      .select()
      .single();

    if (error) {
      console.error('Failed to update shipping settings:', error);
      return null;
    }

    return data;
  }
}

/**
 * Notification Settings Service
 */
export class NotificationSettingsService {
  static async get(): Promise<NotificationSettings | null> {
    const supabase = await createServerSupabase();
    
    const { data, error } = await supabase
      .from('notification_settings')
      .select('*')
      .single();

    if (error) {
      console.error('Failed to get notification settings:', error);
      return null;
    }

    return data;
  }

  static async update(updates: TablesUpdate<'notification_settings'>): Promise<NotificationSettings | null> {
    const supabase = await createServerSupabase();
    
    const { data, error } = await supabase
      .from('notification_settings')
      .update(updates)
      .select()
      .single();

    if (error) {
      console.error('Failed to update notification settings:', error);
      return null;
    }

    return data;
  }
}