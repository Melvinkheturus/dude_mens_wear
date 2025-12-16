# Admin Dashboard Components

A modular, action-oriented dashboard following the philosophy: **"If it doesn't help you decide what to do next, it's noise."**

## Philosophy

The dashboard answers three key questions:
1. **Is the business healthy today?** (KPI Strip)
2. **What needs attention now?** (Action Orders)
3. **What is trending recently?** (Recent Activity)

## Component Structure

### 1. KPIStrip (`kpi-strip.tsx`)
**Purpose**: Health check at a glance
- Today vs 7-day metrics
- Revenue, Orders, AOV, Conversion
- Visual trend indicators
- Loading states

### 2. ActionOrders (`action-orders.tsx`)
**Purpose**: Orders requiring immediate action
- Pending orders (not processed)
- Failed payments
- Clear CTAs for each order
- Empty state when all caught up

### 3. RecentActivity (`recent-activity.tsx`)
**Purpose**: Operational awareness
- Recent order timeline
- System activity feed
- Confidence that system is working

### 4. InventoryAlerts (`inventory-alerts.tsx`)
**Purpose**: Stock management alerts
- Low stock variants (< 5 units)
- Out-of-stock products
- Exception-based display (only problems)

### 5. CollectionPerformance (`collection-performance.tsx`)
**Purpose**: Collection management
- Active collections overview
- Manual vs Auto collections
- Quick edit links

### 6. QuickActions (`quick-actions.tsx`)
**Purpose**: Common admin tasks
- Add Product
- View Orders
- View Store (external)

### 7. DashboardData (`dashboard-data.tsx`)
**Purpose**: Data fetching and processing
- Centralized Refine queries
- Data transformation
- Loading state management
- KPI calculations

## Data Flow

```
dashboard-data.tsx (hook)
    ↓
Fetches from Supabase via Refine
    ↓
Processes & calculates KPIs
    ↓
Returns structured data + loading states
    ↓
Individual components render with data
```

## Layout Structure

```
┌─────────────────────────────────────────┐
│              KPI Strip                  │
│    Revenue | Orders | AOV | Conversion  │
└─────────────────────────────────────────┘

┌─────────────────────────┐ ┌─────────────┐
│     Action Orders       │ │ Inventory   │
│   (Most Important)      │ │ Alerts      │
├─────────────────────────┤ ├─────────────┤
│    Recent Activity      │ │ Collections │
│                         │ ├─────────────┤
│                         │ │ Quick       │
│                         │ │ Actions     │
└─────────────────────────┘ └─────────────┘
```

## Key Features

- **Action-oriented**: Surfaces what needs attention
- **Exception-based**: Only shows problems, not all data
- **Modular**: Each component has single responsibility
- **Loading states**: Skeleton loaders for better UX
- **Responsive**: Works on desktop and mobile
- **Type-safe**: Full TypeScript support

## Usage

```tsx
import { 
  KPIStrip, 
  ActionOrders, 
  useDashboardData 
} from "@/components/admin/dashboard";

export default function Dashboard() {
  const { kpiData, pendingOrdersData, isLoading } = useDashboardData();
  
  return (
    <div>
      <KPIStrip data={kpiData} isLoading={isLoading.kpi} />
      <ActionOrders 
        pendingOrders={pendingOrdersData} 
        isLoading={isLoading.pending} 
      />
    </div>
  );
}
```

## What NOT to Add

❌ **Heavy analytics** (belongs in Reports)  
❌ **Historical deep dives** (belongs in Reports)  
❌ **Vanity metrics** (social media followers, etc.)  
❌ **Complex charts** (keep it simple)  
❌ **Everything in one component** (stay modular)

## Future Enhancements

- Real visitor tracking for conversion rates
- Collection performance metrics (orders per collection)
- Automated inventory reorder suggestions
- Payment retry automation
- Real-time notifications for urgent actions