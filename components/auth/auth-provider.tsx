"use client"

import { useEffect } from "react"
import { useAuthStore } from "@/store/auth"

interface AuthProviderProps {
  children: React.ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { initializeAuth, isInitialized } = useAuthStore()

  useEffect(() => {
    // Initialize auth state when component mounts
    if (!isInitialized) {
      initializeAuth()
    }
  }, [initializeAuth, isInitialized])

  // Don't render children until auth is initialized
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-400">Initializing...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
} 