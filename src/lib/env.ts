/**
 * Environment variable validation and type-safe access
 * Ensures all required environment variables are present at runtime
 */

interface EnvConfig {
  // Medusa
  medusaBackendUrl: string;
  medusaPublishableKey: string;
  
  // Clerk
  clerkPublishableKey: string;
  clerkSecretKey: string;
  
  // Cloudinary
  cloudinaryCloudName: string;
  cloudinaryApiKey: string;
  
  // Razorpay
  razorpayKeyId: string;
  
  // App
  appUrl: string;
  nodeEnv: string;
  
  // Optional
  whatsappNumber?: string;
  supportEmail?: string;
}

function validateEnv(): EnvConfig {
  const required = {
    medusaBackendUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || '',
    medusaPublishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_API_KEY || '',
    clerkPublishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || '',
    clerkSecretKey: process.env.CLERK_SECRET_KEY || '',
    cloudinaryCloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
    cloudinaryApiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '',
    razorpayKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
    appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development',
  };

  // Check for missing required variables (only in production)
  if (process.env.NODE_ENV === 'production') {
    const missing = Object.entries(required)
      .filter(([key, value]) => !value && key !== 'appUrl' && key !== 'nodeEnv')
      .map(([key]) => key);

    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missing.join(', ')}\n` +
        'Please check your .env.local file and ensure all required variables are set.'
      );
    }
  }

  return {
    ...required,
    whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
    supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL,
  };
}

export const env = validateEnv();
