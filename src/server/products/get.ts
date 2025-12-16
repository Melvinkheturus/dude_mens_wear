"use server";

import { createSupabaseServerClient } from "@/utils/supabase/server";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";

interface GetProductsOptions {
  page?: number;
  limit?: number;
  category?: string;
  collection?: string;
  search?: string;
  sortBy?: "name" | "price" | "created_at";
  sortOrder?: "asc" | "desc";
  status?: "active" | "inactive" | "draft";
}

export async function getProducts(options: GetProductsOptions = {}) {
  try {
    const {
      page = 1,
      limit = DEFAULT_PAGE_SIZE,
      category,
      collection,
      search,
      sortBy = "created_at",
      sortOrder = "desc",
      status = "active"
    } = options;
    
    const supabase = await createSupabaseServerClient();
    
    let query = supabase
      .from("products")
      .select(`
        id,
        name,
        description,
        price,
        compare_at_price,
        images,
        slug,
        inventory_quantity,
        status,
        created_at,
        categories (
          id,
          name,
          slug
        ),
        product_collections!inner (
          collections (
            id,
            name,
            slug
          )
        )
      `)
      .eq("status", status);
    
    // Apply filters
    if (category) {
      query = query.eq("categories.slug", category);
    }
    
    if (collection) {
      query = query.eq("product_collections.collections.slug", collection);
    }
    
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }
    
    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === "asc" });
    
    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);
    
    const { data: products, error, count } = await query;
    
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
    console.error("Error getting products:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get products",
      data: [],
      pagination: { page: 1, limit: DEFAULT_PAGE_SIZE, total: 0, totalPages: 0 },
    };
  }
}

export async function getProduct(slug: string) {
  try {
    const supabase = await createSupabaseServerClient();
    
    const { data: product, error } = await supabase
      .from("products")
      .select(`
        id,
        name,
        description,
        price,
        compare_at_price,
        images,
        slug,
        inventory_quantity,
        status,
        sku,
        weight,
        dimensions,
        material,
        care_instructions,
        created_at,
        updated_at,
        categories (
          id,
          name,
          slug
        ),
        product_variants (
          id,
          name,
          price,
          inventory_quantity,
          sku,
          options
        ),
        product_collections (
          collections (
            id,
            name,
            slug
          )
        )
      `)
      .eq("slug", slug)
      .eq("status", "active")
      .single();
    
    if (error) throw error;
    
    return { success: true, data: product };
  } catch (error) {
    console.error("Error getting product:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Product not found",
      data: null,
    };
  }
}

export async function getFeaturedProducts(limit: number = 8) {
  try {
    const supabase = await createSupabaseServerClient();
    
    const { data: products, error } = await supabase
      .from("products")
      .select(`
        id,
        name,
        price,
        compare_at_price,
        images,
        slug
      `)
      .eq("status", "active")
      .eq("is_featured", true)
      .order("created_at", { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    
    return { success: true, data: products || [] };
  } catch (error) {
    console.error("Error getting featured products:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get featured products",
      data: [],
    };
  }
}