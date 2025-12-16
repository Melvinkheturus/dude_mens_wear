# Settings System - Complete Implementation

## Overview

Implemented a comprehensive settings system following Medusa's architecture patterns but adapted for your custom stack. The system provides centralized configuration management with proper security, validation, and UI.

## Architecture Principles

✅ **Settings are contracts** - Change rarely, validate strictly, store centrally  
✅ **Three concentric rings** - Store identity → Operations → Access control  
✅ **Single source of truth** - One row per singleton setting  
✅ **Role-based access** - Owner → Admin → Staff hierarchy  
✅ **Defense in depth** - Database constraints + API validation + UI validation  

## Database Schema

### Core Tables Created

1. **store_settings** (singleton)
   - Store identity and compliance
   - Currency, timezone, legal info
   - Single row enforced by unique index

2. **store_locations** 
   - Warehouses and pickup points
   - Primary location constraint
   - Multi-location ready

3. **admin_users**
   - Role-based access control
   - Clerk integration for identity
   - Invitation tracking

4. **payment_settings**
   - Provider configuration
   - Enable/disable toggles
   - Display order management

5. **shipping_settings** (singleton)
   - Rates and delivery options
   - COD configuration
   - Customer messaging

6. **notification_settings** (singleton)
   - Email preferences
   - Alert thresholds
   - System notifications

### Security Features

- **RLS Policies**: Proper row-level security for all tables
- **Role Functions**: `is_admin_user()` and `is_owner_user()` helpers
- **Public Access**: Store info publicly readable where appropriate
- **Admin Protection**: Sensitive settings require admin role

## API Layer

### Service Classes

```typescript
// Clean service layer with type safety
StoreSettingsService.get()
StoreSettingsService.update(updates)

ShippingSettingsService.get()
ShippingSettingsService.update(updates)

AdminUsersService.getByClerkId(clerkId)
AdminUsersService.create(adminUser)
```

### API Endpoints

- `GET/PUT /api/admin/settings/store` - Store profile
- `GET/PUT /api/admin/settings/shipping` - Shipping config
- `GET/PUT /api/admin/settings/payments` - Payment methods
- `GET/PUT /api/admin/settings/notifications` - Email settings
- `GET/POST /api/admin/settings/locations` - Store locations
- `GET/POST /api/admin/settings/users` - Admin management

## Admin UI

### Settings Navigation

```
/admin/settings/
├── Store Profile      (admin+)
├── Store Locations    (admin+) 
├── Admin Users        (owner only)
├── Payment Methods    (admin+)
├── Shipping           (admin+)
└── Notifications      (admin+)
```

### Permission System

- **Owner**: Full access to all settings
- **Admin**: Operational settings (no user management)
- **Staff**: Read-only access (future)

### UI Features

- **Role-based visibility**: Sections hidden based on permissions
- **Real-time validation**: Client + server validation
- **Success feedback**: Clear save confirmations
- **Error handling**: Detailed error messages
- **Loading states**: Proper UX during operations

## Integration Points

### Clerk Authentication

```typescript
// Middleware checks admin role in database
const { userId } = await auth();
const profile = await supabase
  .from('profiles')
  .select('role')
  .eq('id', userId)
  .single();
```

### Store Frontend

```typescript
// Public settings accessible to store
const storeSettings = await StoreSettingsService.get();
const shippingSettings = await ShippingSettingsService.get();
const paymentMethods = await PaymentSettingsService.getEnabled();
```

### Order Processing

```typescript
// Settings drive business logic
const shipping = await ShippingSettingsService.get();
const freeShippingThreshold = shipping.free_shipping_min;
const codEnabled = shipping.cod_enabled;
```

## Usage Examples

### Getting Store Information

```typescript
// For invoices, emails, contact pages
const store = await StoreSettingsService.get();
console.log(store.store_name);        // "DUDE Menswear"
console.log(store.support_email);     // "support@dudemenswear.com"
console.log(store.currency);          // "INR"
```

### Calculating Shipping

```typescript
const shipping = await ShippingSettingsService.get();
const orderTotal = 75000; // ₹750 in paise

const shippingCost = orderTotal >= shipping.free_shipping_min 
  ? 0 
  : shipping.flat_rate;
```

### Admin User Management

```typescript
// Check if user is admin
const adminUser = await AdminUsersService.getByClerkId(clerkUserId);
const isAdmin = adminUser?.is_active && adminUser?.role === 'admin';

// Create new admin
await AdminUsersService.create({
  clerk_user_id: clerkId,
  email: 'admin@example.com',
  role: 'admin',
  invited_by: currentAdminId
});
```

## Default Configuration

The system comes pre-configured with sensible defaults:

```sql
-- Store Settings
store_name: "DUDE Menswear"
currency: "INR"
timezone: "Asia/Kolkata"

-- Payment Settings  
razorpay: enabled
cod: enabled

-- Shipping Settings
flat_rate: 0 (free shipping)
free_shipping_min: ₹999
cod_enabled: true
delivery_estimate: "3-7 business days"
```

## Security Considerations

1. **Database Level**: RLS policies prevent unauthorized access
2. **API Level**: `requireAdmin()` checks on all endpoints  
3. **UI Level**: Role-based component rendering
4. **Validation**: Input sanitization and type checking
5. **Audit Trail**: Created/updated timestamps on all changes

## Future Enhancements

### Phase 2 Features
- **Multi-location inventory**: Location-based stock management
- **Advanced shipping**: Zone-based rates, carrier integration
- **Tax settings**: GST configuration, tax rules
- **Email templates**: Customizable notification templates
- **Audit logs**: Track all settings changes

### Phase 3 Features  
- **Multi-currency**: Dynamic currency conversion
- **Regional settings**: Location-specific configurations
- **Advanced roles**: Custom permission sets
- **API keys**: Third-party integrations management

## Maintenance

### Regular Tasks
- Review admin user access quarterly
- Update store information as needed
- Monitor shipping rates vs. actual costs
- Validate payment provider settings

### Monitoring
- Track settings change frequency
- Monitor API endpoint performance
- Review security advisor recommendations
- Validate RLS policy effectiveness

## Migration Notes

- ✅ Database schema created with proper constraints
- ✅ RLS policies implemented and tested
- ✅ TypeScript types generated and updated
- ✅ Service layer with error handling
- ✅ Admin UI with role-based access
- ✅ API endpoints with validation
- ✅ Integration with existing auth system

The settings system is now production-ready and follows enterprise patterns for configuration management.