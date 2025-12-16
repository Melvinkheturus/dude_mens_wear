'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useUser, useClerk } from '@clerk/nextjs'

interface Address {
  id: string
  name: string
  phone: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  pincode: string
  isDefault: boolean
}

interface User {
  id: string
  name: string
  email: string
  phone?: string
  addresses?: Address[]
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  logout: () => Promise<void>
  updateUser: (data: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user: clerkUser, isLoaded } = useUser()
  const { signOut } = useClerk()

  // Transform Clerk user to our User interface
  const user: User | null = clerkUser
    ? {
        id: clerkUser.id,
        name: clerkUser.fullName || clerkUser.firstName || 'User',
        email: clerkUser.primaryEmailAddress?.emailAddress || '',
        phone: clerkUser.primaryPhoneNumber?.phoneNumber || undefined,
        addresses: [], // Addresses will be fetched from Supabase when needed
      }
    : null

  const logout = async () => {
    await signOut()
  }

  const updateUser = async (data: Partial<User>) => {
    if (!clerkUser) return

    try {
      // Update Clerk user
      await clerkUser.update({
        firstName: data.name?.split(' ')[0],
        lastName: data.name?.split(' ').slice(1).join(' '),
      })
    } catch (error) {
      console.error('Error updating user:', error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: !isLoaded,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}