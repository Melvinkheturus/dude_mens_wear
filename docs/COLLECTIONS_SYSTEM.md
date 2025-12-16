# Collections-Based Homepage System

## 🎯 Overview

The homepage is now fully dynamic and controlled through an admin interface. No more hardcoded "New Drops" or "Best Sellers" sections!

## 🏗️ Architecture

### Database Tables
- **`collections`** - Reusable product collections (manual or rule-based)
- **`collection_products`** - Manual product curation for collections
- **`homepage_sections`** - Controls what appears on homepage and in what order

### Key Features
- **Dynamic Homepage**: Renders whatever admin configures
- **Rule-Based Collections**: Auto-updating (New Arrivals, Best Sellers)
- **Manual Collections**: Curated product lists
- **Scheduling**: Start/end dates for seasonal campaigns
- **Ordering**: Drag-and-drop section positioning
- **RLS Security**: Proper row-level security policies

## 🚀 Usage

### Admin Interface
1. **Collections** (`/admin/collections`)
   - Create manual or rule-based collections
   - Toggle active/inactive status
   - Edit collection details

2. **Homepage** (`/admin/homepage`)
   - Add sections pointing to collections
   - Reorder sections with up/down arrows
   - Set layout (grid, carousel, banner)
   - Schedule sections with start/end dates

### Frontend
- Homepage automatically renders active sections
- No code changes needed for campaigns
- Supports different layouts per section

## 🔄 Campaign Workflow

**Before (hardcoded):**
```
Developer changes code → Deploy → Homepage updates
```

**After (dynamic):**
```
Admin updates sections → Homepage updates instantly
```

## 📊 Example Scenarios

### Normal Day
1. New Drops (carousel)
2. Best Sellers (grid)

### Diwali Campaign
1. Diwali Sale (banner)
2. Best Sellers (grid)
3. Festive Collection (carousel)

### Winter Season
1. Winter Sale (banner)
2. New Arrivals (carousel)
3. Hoodies Collection (grid)

## 🛠️ Technical Details

### Collection Types
- **Manual**: Admin selects specific products
- **Rule**: Auto-populated based on criteria (sales, date, category)

### Rule Examples
```json
// New Arrivals (last 30 days)
{"created_at": {"gte": "last_30_days"}}

// Best Sellers (10+ sales)
{"sales_count": {"gte": 10}}

// Winter Sale (category + discount)
{"category": "winter", "discount": {"gte": 20}}
```

### RLS Policies
- Public read access for active collections/sections
- Admin full CRUD access
- Date-based filtering for scheduled sections

## 🎉 Benefits

✅ **No more deployments** for homepage changes  
✅ **Marketing independence** from developers  
✅ **Seasonal flexibility** (Diwali → Winter → Summer)  
✅ **Professional scalability** (same as Shopify/Amazon)  
✅ **Clean data model** (no hardcoded hacks)  

This is exactly how grown-up ecommerce sites work! 🔥