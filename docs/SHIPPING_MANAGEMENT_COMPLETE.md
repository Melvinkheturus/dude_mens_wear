# Shipping Management System - Complete Implementation

## Overview
A real-world, deterministic shipping system for D2C men's clothing store using Supabase + Next.js + Refine.

## Business Rules Implemented

### Zone-Based Shipping (ST Courier)
- **Tamil Nadu**: ≤4 items = ₹60, 5+ items = ₹120
- **Rest of India**: ≤4 items = ₹100, 5+ items = ₹150

### Key Features
✅ **Admin-configurable** - No code changes for rate updates  
✅ **Deterministic logic** - Simple quantity + zone calculation  
✅ **Future-proof** - Database-driven rules  
✅ **Order immutability** - Shipping locked at order creation  
✅ **Guest + User support** - Works for all checkout flows  

## Database Schema

### shipping_rules Table
```sql
CREATE TABLE shipping_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zone TEXT NOT NULL CHECK (zone IN ('tamilnadu', 'rest_of_india')),
  max_quantity INTEGER NOT NULL CHECK (max_quantity > 0),
  price INTEGER NOT NULL CHECK (price >= 0), -- in paise
  provider TEXT NOT NULL DEFAULT 'st_courier',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(zone, max_quantity)
);
```

### Updated orders Table
```sql
ALTER TABLE orders ADD COLUMN shipping_amount INTEGER DEFAULT 0;
ALTER TABLE orders ADD COLUMN shipping_provider TEXT DEFAULT 'st_courier';
ALTER TABLE orders ADD COLUMN shipping_zone TEXT;
ALTER TABLE orders ADD COLUMN shipping_tracking_number TEXT;
```

## Architecture Components

### 1. Server-Side Calculation (`src/server/shipping/calculate.ts`)
- **calculateShipping()** - Authoritative shipping calculation
- **normalizeShippingZone()** - Handles Tamil Nadu variants
- **getShippingRules()** - Admin rule management
- Zone detection: `state === "Tamil Nadu" ? "tamilnadu" : "rest_of_india"`

### 2. API Endpoints
- **POST /api/shipping/calculate** - Real-time shipping calculation
- **POST /api/orders/create** - Order creation with shipping

### 3. Admin Interface (`src/app/admin/settings/shipping/page.tsx`)
- Visual shipping rules management
- Real-time rate updates
- Current rates overview
- Rule creation/editing/deletion

### 4. Checkout Components
- **ShippingCalculator** - Real-time shipping display
- **OrderSummary** - Checkout summary with shipping
- **useShipping** hook - Shipping state management

## Usage Examples

### Frontend Integration
```tsx
import { ShippingCalculator } from "@/components/checkout/shipping-calculator";
import { useShipping } from "@/hooks/use-shipping";

function Checkout() {
  const { shipping, calculateShipping } = useShipping();
  
  return (
    <ShippingCalculator
      cartItems={cartItems}
      shippingAddress={address}
      onShippingCalculated={setShipping}
    />
  );
}
```

### Server-Side Usage
```tsx
import { calculateShipping } from "@/server/shipping/calculate";

const result = await calculateShipping(cartItems, shippingAddress);
if ("error" in result) {
  // Handle error
} else {
  // Use result.amount, result.zone, result.provider
}
```

## Admin Workflow

1. **View Current Rates**: `/admin/settings/shipping`
2. **Edit Rules**: Click edit → modify → save
3. **Add New Rule**: Click "Add Rule" → configure → create
4. **Monitor Orders**: Dashboard shows shipping in order summary

## Edge Cases Handled

- **State Normalization**: "TN", "Tamil Nadu", "Tamilnadu" → "tamilnadu"
- **Quantity Boundaries**: Exactly 4 items → lower tier, 5+ → upper tier
- **Guest Checkout**: Same logic for authenticated and guest users
- **Stock Validation**: Checks inventory before order creation
- **Error Handling**: Graceful fallbacks for calculation failures

## Security & Performance

- **RLS Policies**: Public read for active rules, admin-only management
- **Indexed Queries**: Fast lookups by zone + quantity
- **Input Validation**: Server-side validation for all inputs
- **Immutable Orders**: Shipping amount locked at order creation

## Future Enhancements

- **Tracking Integration**: ST Courier API for real-time tracking
- **Zone Expansion**: Add more granular zones (metro/non-metro)
- **Weight-Based**: Optional weight-based calculation
- **Free Shipping**: Minimum order value for free shipping
- **Express Delivery**: Premium shipping options

## Files Created

### Backend
- `src/server/shipping/calculate.ts` - Core shipping logic
- `src/server/orders/create.ts` - Order creation with shipping
- `src/app/api/shipping/calculate/route.ts` - Shipping API
- `src/app/api/orders/create/route.ts` - Order creation API

### Frontend
- `src/app/admin/settings/shipping/page.tsx` - Admin interface
- `src/components/checkout/shipping-calculator.tsx` - Checkout component
- `src/components/checkout/order-summary.tsx` - Order summary
- `src/hooks/use-shipping.ts` - Shipping hook

### Database
- Migration: shipping_rules table creation
- Migration: orders table shipping fields
- Initial data: Tamil Nadu and Rest of India rules

## Testing Scenarios

1. **3 items to Chennai** → Tamil Nadu ≤4 → ₹60
2. **6 items to Chennai** → Tamil Nadu 5+ → ₹120  
3. **2 items to Mumbai** → Rest of India ≤4 → ₹100
4. **8 items to Delhi** → Rest of India 5+ → ₹150
5. **State variants** → "TN", "Tamil Nadu" → normalized correctly

## Production Checklist

✅ Database schema deployed  
✅ Initial shipping rules inserted  
✅ RLS policies configured  
✅ API endpoints tested  
✅ Admin interface functional  
✅ Checkout integration complete  
✅ Error handling implemented  
✅ Type safety ensured  

The shipping system is production-ready and follows e-commerce best practices for deterministic, admin-configurable shipping calculation.