// App constants
export const APP_NAME = "Your Store";
export const APP_DESCRIPTION = "Modern e-commerce platform";

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// Cart
export const MAX_CART_ITEMS = 50;
export const CART_COOKIE_NAME = "cart_items";

// Wishlist
export const MAX_WISHLIST_ITEMS = 100;
export const WISHLIST_COOKIE_NAME = "wishlist_items";

// Orders
export const ORDER_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
  REFUNDED: "refunded",
} as const;

// Payment
export const PAYMENT_STATUS = {
  PENDING: "pending",
  COMPLETED: "completed",
  FAILED: "failed",
  REFUNDED: "refunded",
} as const;

// Product
export const PRODUCT_STATUS = {
  DRAFT: "draft",
  ACTIVE: "active",
  INACTIVE: "inactive",
  ARCHIVED: "archived",
} as const;

// Collection
export const COLLECTION_STATUS = {
  DRAFT: "draft",
  ACTIVE: "active",
  INACTIVE: "inactive",
} as const;

// Image sizes
export const IMAGE_SIZES = {
  THUMBNAIL: { width: 150, height: 150 },
  CARD: { width: 400, height: 400 },
  DETAIL: { width: 800, height: 800 },
  HERO: { width: 1200, height: 600 },
} as const;