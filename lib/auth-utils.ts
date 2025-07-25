import { useAuthStore } from "@/store/auth"

// Cookie management functions
function setCookie(name: string, value: string, days: number = 7) {
  if (typeof window === "undefined") return
  
  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Strict`
}

function getCookie(name: string): string | null {
  if (typeof window === "undefined") return null
  
  const nameEQ = name + "="
  const ca = document.cookie.split(';')
  
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length, c.length))
    }
  }
  
  return null
}

function deleteCookie(name: string) {
  if (typeof window === "undefined") return
  
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`
}

// Get token from localStorage (for middleware and API calls)
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null
  
  try {
    // First try to get from auth-storage
    const authStorage = localStorage.getItem("auth-storage")
    if (authStorage) {
      const parsed = JSON.parse(authStorage)
      if (parsed?.state?.token) {
        return parsed.state.token
      }
    }
    
    // Fallback to separate token storage
    return localStorage.getItem("auth_token")
  } catch (error) {
    console.error("Error getting auth token:", error)
    return null
  }
}

// Get user data from localStorage
export function getAuthUser(): any {
  if (typeof window === "undefined") return null
  
  try {
    const authStorage = localStorage.getItem("auth-storage")
    if (authStorage) {
      const parsed = JSON.parse(authStorage)
      return parsed?.state?.user || null
    }
  } catch (error) {
    console.error("Error getting auth user:", error)
  }
  
  return null
}

// Store auth data in both localStorage and cookies
export function storeAuthData(user: any, token: string): void {
  if (typeof window === "undefined") return
  
  try {
    // Store in localStorage (for Zustand)
    localStorage.setItem("auth_token", token)
    
    // Store in cookies (for middleware)
    const authData = {
      user,
      token,
      isAuthenticated: true,
      timestamp: Date.now()
    }
    
    setCookie("auth-storage", JSON.stringify({ state: authData }), 7)
  } catch (error) {
    console.error("Error storing auth data:", error)
  }
}

// Get auth data from cookies (for middleware)
export function getAuthDataFromCookies(): { user: any; token: string | null } | null {
  try {
    const authStorage = getCookie("auth-storage")
    if (authStorage) {
      const parsed = JSON.parse(authStorage)
      if (parsed?.state?.token && parsed?.state?.user) {
        return {
          user: parsed.state.user,
          token: parsed.state.token
        }
      }
    }
  } catch (error) {
    console.error("Error parsing auth data from cookies:", error)
  }
  
  return null
}

// Check if user is authenticated
export function isUserAuthenticated(): boolean {
  const token = getAuthToken()
  const user = getAuthUser()
  return !!(token && user)
}

// Check if user has required role
export function hasRequiredRole(userRole: string, requiredRoles: string[]): boolean {
  if (requiredRoles.length === 0) return true // Public route
  return requiredRoles.includes(userRole)
}

// Get default redirect path based on user role
export function getDefaultRedirect(role: string): string {
  switch (role) {
    case "admin":
      return "/admin"
    case "owner":
      return "/owner"
    default:
      return "/dashboard"
  }
}

// Validate token by making an API call
export async function validateToken(token: string): Promise<boolean> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/role`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
    
    if (response.ok) {
      const data = await response.json()
      return !!(data && data.role)
    }
    
    return false
  } catch (error) {
    console.error("Token validation failed:", error)
    return false
  }
}

// Clear all auth data
export function clearAuthData(): void {
  if (typeof window === "undefined") return
  
  try {
    localStorage.removeItem("auth-storage")
    localStorage.removeItem("auth_token")
    deleteCookie("auth-storage")
  } catch (error) {
    console.error("Error clearing auth data:", error)
  }
}

// Set auth data in localStorage
export function setAuthData(user: any, token: string): void {
  if (typeof window === "undefined") return
  
  try {
    localStorage.setItem("auth_token", token)
  } catch (error) {
    console.error("Error setting auth data:", error)
  }
} 