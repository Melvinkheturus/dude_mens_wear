export const siteConfig = {
  name: 'Dude Menswear',
  description: 'Premium streetwear and fashion for men',
  tagline: 'Elevate Your Style',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://dudemenswear.com',
  
  // Contact Information
  contact: {
    email: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@dudemenswear.com',
    phone: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210',
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210',
  },
  
  // Social Media Links
  socials: {
    instagram: 'https://instagram.com/dudemenswear',
    facebook: 'https://facebook.com/dudemenswear',
    twitter: 'https://twitter.com/dudemenswear',
    youtube: 'https://youtube.com/@dudemenswear',
  },
  
  // Business Information
  business: {
    name: 'Dude Menswear',
    legalName: 'Dude Menswear Private Limited',
    gst: 'GSTIN_NUMBER_HERE', // TODO: Add actual GST number
    address: {
      street: 'Your Street Address',
      city: 'Your City',
      state: 'Your State',
      pincode: '000000',
      country: 'India',
    },
  },
  
  // Shipping Configuration
  shipping: {
    freeShippingThreshold: 999,
    codCharges: 40,
    zones: [
      { name: 'Local (0-100km)', rate: 60 },
      { name: 'Zone 1 (101-500km)', rate: 80 },
      { name: 'Zone 2 (500+km)', rate: 100 },
      { name: 'Northeast States', rate: 120 },
    ],
  },
  
  // Feature Flags
  features: {
    wishlist: process.env.ENABLE_WISHLIST === 'true',
    reviews: process.env.ENABLE_REVIEWS === 'true',
    loyaltyPoints: process.env.ENABLE_LOYALTY_POINTS === 'true',
    cod: process.env.ENABLE_COD === 'true',
  },
};
