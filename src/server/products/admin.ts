"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { productSchema, type ProductInput } from "@/lib/validators";
import { revalidatePath } from "next/cache";

export async function createProduct(input: ProductInput) {
  try {
    // Check admin permissions
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }
    
    // Validate input
    const validatedInput = productSchema.parse(input);
    
    const supabase = await createServerSupabase();
    
    // Generate slug from name
    const slug = validatedInput.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    
    const { data: product, error } = await supabase
      .from("products")
      .insert({
        ...validatedInput,
        slug,
        created_by: user.id,
      })
      .select()
      .single();
    
    if (error) throw error;
    
    revalidatePath("/admin/products");
    return { success: true, data: product };
  } catch (error) {
    console.error("Error creating product:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create product",
    };
  }
}

export async function updateProduct(id: string, input: Partial<ProductInput>) {
  try {
    // Check admin permissions
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }
    
    const supabase = await createServerSupabase();
    
    // Generate new slug if name is being updated
    const dbUpdateData: any = { ...input };
    if (input.name) {
      dbUpdateData.slug = input.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }
    
    const { data: product, error } = await supabase
      .from("products")
      .update({
        ...dbUpdateData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    
    revalidatePath("/admin/products");
    revalidatePath(`/products/${product.slug}`);
    return { success: true, data: product };
  } catch (error) {
    console.error("Error updating product:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update product",
    };
  }
}

export async function deleteProduct(id: string) {
  try {
    // Check admin permissions
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }
    
    const supabase = await createServerSupabase();
    
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
    
    revalidatePath("/admin/products");
    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete product",
    };
  }
}

export async function getAdminProducts(options: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
} = {}) {
  try {
    // Check admin permissions
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Unauthorized", data: [], pagination: {} };
    }
    
    const { page = 1, limit = 20, search, status } = options;
    
    const supabase = await createServerSupabase();
    
    let query = supabase
      .from("products")
      .select(`
        id,
        name,
        price,
        inventory_quantity,
        status,
        images,
        slug,
        created_at,
        updated_at
      `, { count: "exact" });
    
    if (search) {
      query = query.or(`name.ilike.%${search}%,sku.ilike.%${search}%`);
    }
    
    if (status && status !== "all") {
      query = query.eq("status", status);
    }
    
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    const { data: products, error, count } = await query
      .order("created_at", { ascending: false })
      .range(from, to);
    
    if (error) throw error;
    
    return {
      success: true,
      data: products || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    };
  } catch (error) {
    console.error("Error getting admin products:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get products",
      data: [],
      pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
    };
  }
}