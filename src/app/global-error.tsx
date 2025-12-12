'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="text-center max-w-md">
            <h1 className="text-6xl font-bold text-red-600 mb-4">500</h1>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Application Error
            </h2>
            <p className="text-gray-600 mb-8">
              A critical error occurred. Please refresh the page or contact support if the problem persists.
            </p>
            <button
              onClick={reset}
              className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
