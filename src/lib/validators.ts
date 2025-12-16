import { z } from "zod";

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Product schemas
export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  price: z.number().positive("Price must be positive"),
  compare_at_price: z.number().optional(),
  sku: z.string().optional(),
  inventory_quantity: z.number().int().min(0, "Inventory cannot be negative"),
  status: z.enum(["draft", "active", "inactive", "archived"]),
  images: z.array(z.string()).optional(),
  category_id: z.string().uuid().optional(),
  tags: z.array(z.string()).optional(),
});

// Cart schemas
export const addToCartSchema = z.object({
  variant_id: z.string().uuid("Invalid variant ID"),
  quantity: z.number().int().positive("Quantity must be positive"),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(0, "Quantity cannot be negative"),
});

// Order schemas
export const createOrderSchema = z.object({
  shipping_address: z.object({
    name: z.string().min(1, "Name is required"),
    phone: z.string().min(10, "Valid phone number is required"),
    address_line_1: z.string().min(1, "Address is required"),
    address_line_2: z.string().optional(),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    postal_code: z.string().min(1, "Postal code is required"),
    country: z.string().min(1, "Country is required"),
  }),
  billing_address: z.object({
    name: z.string().min(1, "Name is required"),
    phone: z.string().min(10, "Valid phone number is required"),
    address_line_1: z.string().min(1, "Address is required"),
    address_line_2: z.string().optional(),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    postal_code: z.string().min(1, "Postal code is required"),
    country: z.string().min(1, "Country is required"),
  }).optional(),
  payment_method: z.enum(["razorpay", "cod"]),
  notes: z.string().optional(),
});

// Admin schemas
export const bannerSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional(),
  image_url: z.string().url("Invalid image URL"),
  link_url: z.string().url("Invalid link URL").optional(),
  is_active: z.boolean(),
  sort_order: z.number().int().min(0),
});

export const collectionSchema = z.object({
  name: z.string().min(1, "Collection name is required"),
  description: z.string().optional(),
  slug: z.string().min(1, "Slug is required"),
  image_url: z.string().url("Invalid image URL").optional(),
  is_active: z.boolean(),
  sort_order: z.number().int().min(0),
});

// Type exports
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type BannerInput = z.infer<typeof bannerSchema>;
export type CollectionInput = z.infer<typeof collectionSchema>;