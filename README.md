# 🎨 Dude Menswear - Storefront (Next.js)

Next.js storefront for Dude Menswear e-commerce platform.

## 📋 Overview

Modern, responsive e-commerce storefront built with:
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS 4
- Clerk Authentication
- Cloudinary CDN

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Running Medusa backend

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your credentials:
   - `NEXT_PUBLIC_MEDUSA_BACKEND_URL` - Backend URL
   - `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_API_KEY` - Medusa API key
   - Clerk authentication keys
   - Cloudinary credentials
   - Razorpay keys

3. **Start development server**
   ```bash
   npm run dev
   ```
   Frontend runs on `http://localhost:3000`

## 🎯 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📁 Project Structure

```
dudemw-storefront/
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── (main)/         # Main layout pages
│   │   ├── auth/           # Authentication pages
│   │   ├── checkout/       # Checkout page
│   │   └── api/            # API routes
│   ├── components/         # Reusable components
│   │   ├── common/         # Common components
│   │   ├── layout/         # Layout components
│   │   ├── product/        # Product components
│   │   └── ui/             # UI primitives
│   ├── contexts/           # React contexts
│   ├── hooks/              # Custom hooks
│   ├── lib/                # Utilities & integrations
│   │   ├── medusa/         # Medusa API integration
│   │   ├── utils/          # Utility functions
│   │   └── monitoring/     # Error tracking
│   ├── modules/            # Feature modules
│   │   ├── homepage/       # Homepage sections
│   │   ├── product-detail-page/ # PDP
│   │   ├── profile/        # User profile
│   │   └── checkout/       # Checkout flow
│   └── config/             # Configuration
├── public/                 # Static assets
├── docs/                   # Documentation
└── .env.example           # Environment template
```

## ✨ Features

### Customer Features
- ✅ **Guest Checkout** - Purchase without account
- ✅ User authentication (Clerk)
- ✅ Wishlist functionality
- ✅ Recently viewed products
- ✅ Product reviews
- ✅ Size guide
- ✅ Pincode checker
- ✅ WhatsApp support
- ✅ Responsive design

### Technical Features
- ✅ SEO optimized (structured data, meta tags)
- ✅ Image optimization (Cloudinary)
- ✅ Error boundaries
- ✅ Environment validation
- ✅ Structured logging
- ✅ Type-safe with TypeScript

## 🔧 Configuration

### Environment Variables

#### Required
```env
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_API_KEY=pk_...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_...
```

#### Optional
```env
NEXT_PUBLIC_WHATSAPP_NUMBER=919876543210
NEXT_PUBLIC_SUPPORT_EMAIL=support@dudemenswear.com
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-...
SENTRY_DSN=https://...
```

### Site Configuration
Edit `src/config/site.ts` for:
- Business information
- Contact details
- Social media links
- Shipping configuration
- Feature flags

## 🎨 Customization

### Styling
- Uses Tailwind CSS 4
- Custom fonts: Satoshi (headings), Manrope (body)
- Theme configuration in `tailwind.config.ts`

### Components
- Radix UI for accessible components
- Framer Motion for animations
- Custom UI components in `src/components/ui/`

## 📚 Documentation

Detailed documentation in `docs/`:
- `SECURITY_CHECKLIST.md` - Security requirements
- `PRODUCTION_DEPLOYMENT_GUIDE.md` - Deployment guide
- `OPTIMIZATION_REPORT.md` - Technical review
- `QUICK_START_CHECKLIST.md` - Setup checklist

## 🔒 Security

### Before Deployment
1. ⚠️ Read `docs/SECURITY_CHECKLIST.md`
2. Rotate all exposed credentials
3. Generate strong secrets
4. Configure CORS properly
5. Enable HTTPS

### Environment Validation
The app validates required environment variables on startup.
See `src/lib/env.ts` for validation logic.

## 🚢 Deployment

### Vercel (Recommended)
1. Import project from GitHub
2. Configure environment variables
3. Deploy

### Build Locally
```bash
npm run build
npm run start
```

### Environment Variables
Set all variables from `.env.example` in your hosting platform.

## 🔍 SEO

### Implemented
- ✅ Comprehensive meta tags
- ✅ Structured data (JSON-LD)
- ✅ Dynamic sitemap
- ✅ robots.txt
- ✅ OpenGraph tags
- ✅ Twitter Cards

### Post-Deployment
1. Submit sitemap to Google Search Console
2. Verify structured data
3. Set up Google Analytics
4. Monitor search performance

## 🆘 Troubleshooting

### Build Errors
```bash
rm -rf .next node_modules
npm install
npm run build
```

### Environment Issues
- Verify all `NEXT_PUBLIC_*` variables are set
- Check backend URL is accessible
- Verify API keys are correct

### Image Loading Issues
- Check Cloudinary credentials
- Verify image URLs in database
- Check browser network tab

## 📊 Performance

### Optimization
- Images optimized via Cloudinary
- Code splitting with Next.js
- Lazy loading components
- CDN for static assets

### Monitoring
- Error tracking with Sentry (optional)
- Performance monitoring
- Analytics with Google Analytics

## 📄 License

Copyright © 2025 Dude Menswear. All rights reserved.

See [LICENSE](../LICENSE) for details.

## 🆘 Support

For technical support:
- Email: support@dudemenswear.com
- WhatsApp: +91-98765-43210

---

**Built with ❤️ for Dude Menswear**
