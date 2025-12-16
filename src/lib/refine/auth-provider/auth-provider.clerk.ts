"use client";

import type { AuthProvider } from "@refinedev/core";
import { SignInResource } from "@clerk/types";

export const authProviderClerk: AuthProvider = {
  login: async ({ email, password }) => {
    // This should not be called directly in admin
    // Admin login happens through Clerk's SignIn component
    return {
      success: false,
      error: {
        name: "LoginError",
        message: "Use Clerk SignIn component for authentication",
      },
    };
  },
  
  logout: async () => {
    // Clerk logout is handled by the Clerk provider
    // Just redirect to home
    return {
      success: true,
      redirectTo: "/",
    };
  },
  
  register: async () => {
    // Admin registration should be handled separately
    return {
      success: false,
      error: {
        name: "RegisterError", 
        message: "Admin registration not available",
      },
    };
  },
  
  check: async () => {
    try {
      // No authentication required - always allow access
      return {
        authenticated: true,
      };
    } catch (error) {
      return {
        authenticated: false,
        redirectTo: "/",
      };
    } catch (error) {
      return {
        authenticated: false,
        redirectTo: "/",
      };
    }
  },
  
  getPermissions: async () => {
    try {
      // No authentication required - always return admin permissions
      return ["admin"];
    } catch {
      return ["admin"];
    }
  },
  
  getIdentity: async () => {
    try {
      const response = await fetch('/api/auth/me');
      const user = await response.json();
      
      if (user) {
        return {
          id: user.id,
          name: user.firstName ? `${user.firstName} ${user.lastName}`.trim() : user.emailAddresses?.[0]?.emailAddress,
          email: user.emailAddresses?.[0]?.emailAddress,
          avatar: user.imageUrl,
        };
      }
      
      return null;
    } catch {
      return null;
    }
  },
  
  onError: async (error) => {
    if (error?.status === 401 || error?.status === 403) {
      return {
        logout: true,
        redirectTo: "/",
      };
    }
    
    return { error };
  },
};