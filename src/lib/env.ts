/**
 * Environment variable validation and type-safe access
 * Ensures all required environment variables are present at runtime
 * 
 * SECURITY NOTES:
 * - NEXT_PUBLIC_* variables are exposed to the browser (public keys only)
 * - Non-prefixed variables are server-side only (secret keys)
 * - Never expose secret keys to the client
 */

interface PublicEnvConfig {
  // Public keys (safe for browser)
  clerkPublishableKey: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  razorpayKeyId: string;
  
  // App settings
  appUrl: string;
  nodeEnv: string;
  
  // Optional public settings
  whatsappNumber?: string;
  supportEmail?: string;
  gaTrackingId?: string;
}

interface ServerEnvConfig extends PublicEnvConfig {
  // Secret keys (server-side only)
  clerkSecretKey: string;
  supabaseServiceKey: string;
  razorpayKeySecret: string;
  razorpayWebhookSecret: string;
  resendApiKey: string;
  upstashRedisUrl: string;
  upstashRedisToken: string;
  sentryDsn?: string;
  sentryAuthToken?: string;
  ngrokAuthToken?: string;
}

function validatePublicEnv(): PublicEnvConfig {
  const config = {
    clerkPublishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || '',
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    razorpayKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
    appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development',
    
    // Optional
    whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
    supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL,
    gaTrackingId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  };

  // Validate required public variables in production
  if (process.env.NODE_ENV === 'production') {
    const requiredPublic = [
      'clerkPublishableKey',
      'supabaseUrl', 
      'supabaseAnonKey',
      'razorpayKeyId'
    ];
    
    const missing = requiredPublic.filter(key => !config[key as keyof PublicEnvConfig]);
    
    if (missing.length > 0) {
      throw new Error(
        `Missing required public environment variables: ${missing.join(', ')}\n` +
        'Please check your environment configuration.'
      );
    }
  }

  return config;
}

function validateServerEnv(): ServerEnvConfig {
  const publicConfig = validatePublicEnv();
  
  const serverConfig = {
    ...publicConfig,
    
    // Secret keys (server-side only)
    clerkSecretKey: process.env.CLERK_SECRET_KEY || '',
    supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY || '',
    razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || '',
    razorpayWebhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || '',
    resendApiKey: process.env.RESEND_API_KEY || '',
    upstashRedisUrl: process.env.UPSTASH_REDIS_REST_URL || '',
    upstashRedisToken: process.env.UPSTASH_REDIS_REST_TOKEN || '',
    
    // Optional secrets
    sentryDsn: process.env.SENTRY_DSN,
    sentryAuthToken: process.env.SENTRY_AUTH_TOKEN,
    ngrokAuthToken: process.env.NGROK_AUTHTOKEN,
  };

  // Validate required server variables in production
  if (process.env.NODE_ENV === 'production') {
    const requiredServer = [
      'clerkSecretKey',
      'supabaseServiceKey',
      'razorpayKeySecret',
      'razorpayWebhookSecret',
      'resendApiKey'
    ];
    
    const missing = requiredServer.filter(key => !serverConfig[key as keyof ServerEnvConfig]);
    
    if (missing.length > 0) {
      throw new Error(
        `Missing required server environment variables: ${missing.join(', ')}\n` +
        'Please check your server environment configuration.'
      );
    }
  }

  return serverConfig;
}

// Public environment (safe for client-side)
export const publicEnv = validatePublicEnv();

// Server environment (server-side only - includes secrets)
export const serverEnv = typeof window === 'undefined' ? validateServerEnv() : ({} as ServerEnvConfig);

// Legacy export for backward compatibility
export const env = publicEnv;