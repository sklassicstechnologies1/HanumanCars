"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuthStore } from "@/store/auth"
import { motion } from "framer-motion"
import { Shield, Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRoles?: string[]
  fallback?: React.ReactNode
}

export default function ProtectedRoute({ 
  children, 
  requiredRoles = [], 
  fallback 
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuthStore()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAccess = async () => {
      // Wait for auth store to initialize
      if (isLoading) return

      // Check if user is authenticated
      if (!isAuthenticated || !user) {
        const redirect = searchParams.get("redirect") || "/dashboard"
        router.push(`/auth?redirect=${encodeURIComponent(redirect)}`)
        return
      }

      // Check role-based access if required
      if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
        // Redirect to appropriate dashboard based on user role
        let redirectPath = "/dashboard"
        
        if (user.role === "admin") {
          redirectPath = "/admin"
        } else if (user.role === "owner") {
          redirectPath = "/owner"
        }
        
        router.push(redirectPath)
        return
      }

      setIsChecking(false)
    }

    checkAccess()
  }, [isAuthenticated, user, isLoading, requiredRoles, router, searchParams])

  // Show loading state while checking
  if (isLoading || isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="relative">
            <Shield className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <Loader2 className="w-8 h-8 text-blue-400 animate-spin absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-white">Verifying Access</h2>
            <p className="text-gray-400">Please wait while we check your permissions...</p>
          </div>
        </motion.div>
      </div>
    )
  }

  // Show fallback if provided and user doesn't have access
  if (!isAuthenticated || !user || (requiredRoles.length > 0 && !requiredRoles.includes(user.role))) {
    return fallback || null
  }

  // Render children if user has access
  return <>{children}</>
} 