# Domain-Based Structure Migration Plan
## 🎯 Goal: Clean structure without breaking UI

### Current Problems (Diagnosis)
```
❌ Feature modules vs route modules overlap
❌ Components split by creation location, not meaning  
❌ Homepage sections are hard-coded campaigns
❌ Contexts + hooks + modules boundaries are blurry
```

### Target Structure (Domain-First Organization)
```
src/
├── app/                    # Routes only (thin composition)
│   ├── (auth)/
│   ├── (admin)/  
│   ├── (store)/
│   └── api/
├── domains/                # 🔥 NEW: Business domains own everything
│   ├── product/
│   ├── cart/
│   ├── order/
│   ├── auth/
│   ├── homepage/
│   ├── profile/
│   └── wishlist/
├── shared/                 # Only truly generic UI
│   ├── ui/                 # shadcn components
│   ├── layout/             # Navbar, Footer
│   ├── media/              # ImageWithFallback
│   └── feedback/           # Toasts, modals
├── server/                 # Backend actions (keep as-is)
├── lib/                    # Infrastructure helpers
├── supabase/               # Keep as-is
├── styles/                 # Keep as-is
└── types/                  # Global types only
```

## 🚀 Migration Steps (Incremental, Safe)

### Step 1: Create Domain Structure (Safe - No Breaking Changes)
```bash
# Create new domain folders
mkdir -p src/domains/product/{components,sections,hooks}
mkdir -p src/domains/cart/{components,hooks}
mkdir -p src/domains/homepage/{components,layouts,hooks}
mkdir -p src/domains/order/{components,hooks}
mkdir -p src/domains/auth/{components,hooks}
mkdir -p src/domains/profile/{components,sections,hooks}
mkdir -p src/domains/wishlist/{components,hooks}
mkdir -p src/shared/{ui,layout,media,feedback}
```

### Step 2: Move Product Domain (Biggest Win First)
```
Current scattered files → New location:

components/product/ProductCard.tsx → domains/product/components/ProductCard.tsx
modules/product-detail-page/components/* → domains/product/components/
modules/product-detail-page/sections/* → domains/product/sections/
modules/products-page/components/* → domains/product/components/
hooks/useRecentlyViewed.ts → domains/product/hooks/
```

**Create domain index:**
```typescript
// domains/product/index.ts
export { ProductCard } from './components/ProductCard';
export { ProductGrid } from './components/ProductGrid';
export { ProductDetailPage } from './components/ProductDetailPage';
export { RelatedProducts } from './sections/RelatedProducts';
export { useProduct } from './hooks/useProduct';
```

### Step 3: Move Cart Domain
```
Current → New:
contexts/CartContext.tsx → domains/cart/context.tsx
modules/cart/* → domains/cart/components/
hooks/useCartSound.ts → domains/cart/hooks/
```

### Step 4: Homepage Domain (Data-Driven Sections)
```
Current messy sections → Clean data-driven approach:

❌ modules/homepage/sections/BestsellerSection.tsx
❌ modules/homepage/sections/NewDropSection.tsx
✅ domains/homepage/layouts/GridSection.tsx
✅ domains/homepage/layouts/CarouselSection.tsx
✅ domains/homepage/components/SectionRenderer.tsx
```

### Step 5: Move Shared Components
```
Current → New:
components/layout/* → shared/layout/
components/common/ImageWithFallback.tsx → shared/media/
components/ui/* → shared/ui/ (if not shadcn)
```

## 📁 Detailed Domain Structures

### domains/product/
```
domains/product/
├── components/
│   ├── ProductCard.tsx           # From components/product/
│   ├── ProductGrid.tsx           # From modules/products-page/
│   ├── ProductGallery.tsx        # From modules/product-detail-page/
│   ├── ProductOptions.tsx        # From modules/product-detail-page/
│   ├── AddToCartButton.tsx       # From modules/product-detail-page/
│   └── VariantSelector.tsx       # New or existing
├── sections/
│   ├── ProductHighlights.tsx     # From modules/product-detail-page/
│   ├── RelatedProducts.tsx       # From modules/product-detail-page/
│   ├── ProductReviews.tsx        # From modules/product-detail-page/
│   └── FrequentlyBought.tsx      # From modules/product-detail-page/
├── hooks/
│   ├── useProduct.ts             # New or from existing
│   ├── useRecentlyViewed.ts      # From hooks/
│   └── useProductFilters.ts      # From modules/products-page/
├── types.ts                      # Product-specific types
└── index.ts                      # Clean exports
```

### domains/cart/
```
domains/cart/
├── components/
│   ├── CartItem.tsx              # From modules/cart/
│   ├── CartSummary.tsx           # From modules/cart/
│   ├── EmptyCart.tsx             # From modules/cart/
│   └── MiniCart.tsx              # New or existing
├── hooks/
│   ├── useCart.ts                # From contexts/CartContext
│   └── useCartSound.ts           # From hooks/
├── context.tsx                   # From contexts/CartContext
├── types.ts
└── index.ts
```

### domains/homepage/
```
domains/homepage/
├── components/
│   ├── SectionRenderer.tsx       # NEW: Data-driven sections
│   ├── CategoryCard.tsx          # From modules/homepage/
│   ├── TrustBadge.tsx           # From modules/homepage/
│   └── HeroCarousel.tsx         # From modules/homepage/
├── layouts/
│   ├── GridSection.tsx          # NEW: Replaces BestsellerSection
│   ├── CarouselSection.tsx      # NEW: Replaces NewDropSection  
│   ├── BannerSection.tsx        # NEW: Generic banner layout
│   └── CategorySection.tsx      # NEW: Category grid layout
├── hooks/
│   └── useHomepageSections.ts   # NEW: Fetch section data
├── types.ts                     # Section configuration types
└── index.ts
```

## 🔄 Updated Route Files (Thin Composition)

### app/(store)/products/[slug]/page.tsx
```typescript
// Before (thick route)
import ProductDetailPage from '@/modules/product-detail-page';

// After (thin route)
import { ProductDetailPage } from '@/domains/product';

export default function Page({ params }) {
  return <ProductDetailPage slug={params.slug} />;
}
```

### app/(store)/page.tsx (Homepage)
```typescript
// Before (hard-coded sections)
import BestsellerSection from '@/modules/homepage/sections/BestsellerSection';
import NewDropSection from '@/modules/homepage/sections/NewDropSection';

// After (data-driven)
import { HomepageRenderer } from '@/domains/homepage';

export default function HomePage() {
  return <HomepageRenderer />;
}
```

## 🎯 Migration Execution Plan

### Week 1: Foundation
- [ ] Create domain folder structure
- [ ] Move product domain files
- [ ] Update imports for product domain
- [ ] Test product pages work

### Week 2: Cart & Wishlist  
- [ ] Move cart domain files
- [ ] Move wishlist domain files
- [ ] Update cart-related imports
- [ ] Test cart functionality

### Week 3: Homepage Refactor
- [ ] Create data-driven section components
- [ ] Move homepage components to domain
- [ ] Replace hard-coded sections with SectionRenderer
- [ ] Test homepage renders correctly

### Week 4: Cleanup
- [ ] Move remaining domains (auth, profile, order)
- [ ] Move shared components
- [ ] Delete empty modules/ folders
- [ ] Update all remaining imports

## 🚨 Safety Checklist

Before each step:
- [ ] Commit current working state
- [ ] Update imports incrementally
- [ ] Test affected pages after each move
- [ ] Keep old files until new structure is verified

## 🎉 Expected Benefits

After migration:
✅ **Faster development** - Know exactly where to find/add code
✅ **Easier onboarding** - Clear domain boundaries  
✅ **Better testing** - Test domains in isolation
✅ **Flexible homepage** - Data-driven sections for marketing
✅ **Scalable admin** - Same domain pattern for admin features

## Next Steps After Migration

1. **Admin domains** - Apply same pattern to admin features
2. **Campaign system** - Homepage sections become configurable
3. **Component library** - Shared components become design system
4. **Testing strategy** - Domain-based test organization

This migration preserves all your working UI while creating a foundation for rapid, confident development.