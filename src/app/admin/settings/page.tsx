'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  Store, 
  MapPin, 
  Users, 
  CreditCard, 
  Truck, 
  Bell,
  Settings as SettingsIcon,
  ChevronRight
} from 'lucide-react'

interface SettingsSection {
  title: string
  description: string
  icon: React.ReactNode
  href: string
  permission: 'owner' | 'admin' | 'staff'
}

const settingsSections: SettingsSection[] = [
  {
    title: 'Store Profile',
    description: 'Store name, logo, contact information, and legal details',
    icon: <Store className="h-5 w-5" />,
    href: '/admin/settings/store',
    permission: 'admin'
  },
  {
    title: 'Store Locations',
    description: 'Manage warehouses, pickup points, and shipping addresses',
    icon: <MapPin className="h-5 w-5" />,
    href: '/admin/settings/locations',
    permission: 'admin'
  },
  {
    title: 'Admin Users',
    description: 'Manage admin access, roles, and permissions',
    icon: <Users className="h-5 w-5" />,
    href: '/admin/settings/users',
    permission: 'owner'
  },
  {
    title: 'Payment Methods',
    description: 'Configure payment providers and checkout options',
    icon: <CreditCard className="h-5 w-5" />,
    href: '/admin/settings/payments',
    permission: 'admin'
  },
  {
    title: 'Shipping & Fulfillment',
    description: 'Shipping rates, delivery options, and COD settings',
    icon: <Truck className="h-5 w-5" />,
    href: '/admin/settings/shipping',
    permission: 'admin'
  },
  {
    title: 'Notifications',
    description: 'Email notifications and alert preferences',
    icon: <Bell className="h-5 w-5" />,
    href: '/admin/settings/notifications',
    permission: 'admin'
  }
]

export default function SettingsPage() {
  const [userRole, setUserRole] = useState<'owner' | 'admin' | 'staff' | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        // No authentication required - treat all users as admin
        setUserRole('admin')
      } catch (error) {
        console.error('Failed to check user role:', error)
      } finally {
        setLoading(false)
      }
    }

    checkUserRole()
  }, [])

  const canAccess = (permission: 'owner' | 'admin' | 'staff') => {
    if (!userRole) return false
    
    const roleHierarchy = { owner: 3, admin: 2, staff: 1 }
    const userLevel = roleHierarchy[userRole]
    const requiredLevel = roleHierarchy[permission]
    
    return userLevel >= requiredLevel
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-96 mb-8"></div>
          <div className="grid gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <SettingsIcon className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>
        <p className="text-gray-600">
          Configure your store settings, manage users, and customize your ecommerce experience.
        </p>
      </div>

      <div className="grid gap-4">
        {settingsSections.map((section) => {
          const hasAccess = canAccess(section.permission)
          
          return (
            <div
              key={section.href}
              className={`border rounded-lg p-4 transition-colors ${
                hasAccess 
                  ? 'hover:bg-gray-50 cursor-pointer' 
                  : 'opacity-50 cursor-not-allowed bg-gray-25'
              }`}
            >
              {hasAccess ? (
                <Link href={section.href} className="block">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        {section.icon}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 mb-1">
                          {section.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {section.description}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </Link>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      {section.icon}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-500 mb-1">
                        {section.title}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {section.description}
                      </p>
                      <p className="text-xs text-red-500 mt-1">
                        Requires {section.permission} access
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-300" />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Quick Stats */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">Settings Overview</h3>
        <p className="text-sm text-blue-700">
          Settings are contracts - change them rarely, validate them strictly, and store them centrally. 
          Each section controls a specific aspect of your store's behavior.
        </p>
      </div>
    </div>
  )
}