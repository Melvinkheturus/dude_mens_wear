/**
 * Sentry error tracking configuration
 * Uncomment and configure when ready to use
 */

// import * as Sentry from '@sentry/nextjs'

export function initSentry() {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN && process.env.NODE_ENV === 'production') {
    // Sentry.init({
    //   dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    //   environment: process.env.NODE_ENV,
    //   tracesSampleRate: 1.0,
    //   beforeSend(event) {
    //     // Filter out sensitive data
    //     if (event.request) {
    //       delete event.request.cookies
    //       delete event.request.headers
    //     }
    //     return event
    //   },
    // })
  }
}

export function captureException(error: Error, context?: Record<string, any>) {
  if (process.env.NODE_ENV === 'production') {
    // Sentry.captureException(error, { extra: context })
  } else {
    console.error('Error:', error, context)
  }
}

export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info') {
  if (process.env.NODE_ENV === 'production') {
    // Sentry.captureMessage(message, level)
  } else {
    console.log(`[${level.toUpperCase()}]`, message)
  }
}
