"use client"

import { usePathname } from "next/navigation"
import { useEffect } from "react"
import Navbar from "./Navbar"

// Auth routes where navbar should be hidden
const authRoutes = ['/login', '/signup', '/forgot-password', '/reset-password', '/verify-otp', '/sso-callback']

export default function ConditionalNavbar() {
  const pathname = usePathname()

  // Hide navbar on auth pages
  const isAuthPage = authRoutes.some(route => pathname?.startsWith(route))

  // Hide navbar on mobile for product detail pages
  const isProductPage = pathname?.startsWith('/products/')

  // Update body class to adjust main padding
  useEffect(() => {
    if (isProductPage) {
      document.body.classList.add('pdp-page')
    } else {
      document.body.classList.remove('pdp-page')
    }

    return () => {
      document.body.classList.remove('pdp-page')
    }
  }, [isProductPage])

  // Don't render navbar on auth pages
  if (isAuthPage) {
    return null
  }

  return (
    <>
      {/* Hide mobile navbar on PDP, show on all other pages */}
      <div className={isProductPage ? "hidden lg:block" : ""}>
        <Navbar />
      </div>
    </>
  )
}
