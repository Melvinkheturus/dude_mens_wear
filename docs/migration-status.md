# Domain Migration Status

## ✅ Completed

### Product Domain
- [x] Created `src/domains/product/` structure
- [x] Moved `ProductCard` component (unified from modules/homepage)
- [x] Moved `ProductGrid` component  
- [x] Moved `RelatedProducts` section
- [x] Created domain index file with exports
- [x] Created types file
- [x] Updated imports in:
  - [x] `src/modules/products-page/components/ProductGrid.tsx`
  - [x] `src/modules/wishlist/index.tsx`

## 🔄 In Progress

### Files Still Using Old ProductCard Import
Need to update these files to use `@/domains/product`:

- [ ] `src/modules/profile/components/MobileGuestView.tsx`
- [ ] `src/modules/profile/components/DesktopGuestView.tsx`  
- [ ] `src/modules/products-page/components/HorizontalProductScroll.tsx`
- [ ] `src/modules/product-detail-page/sections/RelatedProducts.tsx` (already moved, need to delete old)
- [ ] `src/modules/homepage/sections/NewDropSection.tsx`
- [ ] `src/modules/homepage/sections/BestsellerSection.tsx`

## 📋 Next Steps

### Step 2: Cart Domain
- [ ] Move `src/contexts/CartContext.tsx` → `src/domains/cart/context.tsx`
- [ ] Move `src/modules/cart/components/*` → `src/domains/cart/components/`
- [ ] Move `src/hooks/useCartSound.ts` → `src/domains/cart/hooks/`
- [ ] Create cart domain index

### Step 3: Homepage Domain (Data-Driven)
- [ ] Create `src/domains/homepage/components/SectionRenderer.tsx`
- [ ] Create `src/domains/homepage/layouts/GridSection.tsx`
- [ ] Create `src/domains/homepage/layouts/CarouselSection.tsx`
- [ ] Replace hard-coded sections with data-driven approach

### Step 4: Other Domains
- [ ] Auth domain
- [ ] Profile domain  
- [ ] Wishlist domain
- [ ] Order domain

### Step 5: Shared Components
- [ ] Move `src/components/layout/*` → `src/shared/layout/`
- [ ] Move `src/components/common/ImageWithFallback.tsx` → `src/shared/media/`
- [ ] Move generic UI components → `src/shared/ui/`

### Step 6: Cleanup
- [ ] Delete empty `src/modules/` folders
- [ ] Update all remaining imports
- [ ] Test all pages work correctly

## 🎯 Benefits Already Achieved

✅ **Single source of truth** for ProductCard component
✅ **Clean imports** using domain structure  
✅ **Better organization** - all product-related code together
✅ **Easier maintenance** - know exactly where to find/modify product UI

## 🚨 Safety Notes

- Keep old files until migration is complete
- Test each page after updating imports
- Commit frequently during migration
- Update imports incrementally, not all at once