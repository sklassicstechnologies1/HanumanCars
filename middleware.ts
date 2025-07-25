import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Define route configurations with required roles
const ROUTE_CONFIG: Record<string, string[]> = {
  // Admin only routes
  "/admin": ["admin"],
  "/admin/add-car": ["admin"],
  
  // Owner only routes
  "/owner": ["owner"],
  "/owner/ride_action": ["owner"],
  "/owner/blocks": ["owner"],
  
  // User routes (authenticated users)
  "/dashboard": ["user", "admin", "owner"],
  "/booking": ["user", "admin", "owner"],
  "/bookings": ["user", "admin", "owner"],
  "/payment": ["user", "admin", "owner"],
  "/pay_due": ["user", "admin", "owner"],
  "/due_payment": ["user", "admin", "owner"],
  "/profile": ["user", "admin", "owner"],
  "/documents": ["user", "admin", "owner"],
  "/notifications": ["user", "admin", "owner"],
  "/user": ["user", "admin", "owner"],
  
  // Public routes (no protection needed)
  "/": [],
  "/home": [],
  "/auth": [],
  "/splash": [],
  "/about": [],
  "/help": [],
  "/car": [],
}

// Helper function to check if user has required role
function hasRequiredRole(userRole: string, requiredRoles: string[]): boolean {
  if (requiredRoles.length === 0) return true // Public route
  return requiredRoles.includes(userRole)
}

// Helper function to get user data from request cookies
function getUserFromRequest(request: NextRequest): { user: any; token: string | null } | null {
  try {
    // Check for auth-storage in cookies
    const authStorage = request.cookies.get("auth-storage")?.value
    if (authStorage) {
      const parsed = JSON.parse(decodeURIComponent(authStorage))
      if (parsed?.state?.token && parsed?.state?.user) {
        return {
          user: parsed.state.user,
          token: parsed.state.token
        }
      }
    }
    
    // Check Authorization header (for API calls)
    const authHeader = request.headers.get("authorization")
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.substring(7)
      // For API routes, we'll rely on client-side validation
      return { user: null, token }
    }
    
    return null
  } catch (error) {
    console.error("Error parsing auth data:", error)
    return null
  }
}

// Get default redirect path based on user role
function getDefaultRedirect(role: string): string {
  switch (role) {
    case "admin":
      return "/admin"
    case "owner":
      return "/owner"
    default:
      return "/dashboard"
  }
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Skip middleware for static files and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.includes(".")
  ) {
    return NextResponse.next()
  }

  // Get user data from request
  const authData = getUserFromRequest(request)
  
  // Find matching route configuration
  let requiredRoles: string[] = []
  let matchedRoute = ""
  
  for (const [route, roles] of Object.entries(ROUTE_CONFIG)) {
    if (pathname === route || pathname.startsWith(route + "/")) {
      requiredRoles = roles
      matchedRoute = route
      break
    }
  }
  
  // If no specific route config found, treat as public
  if (requiredRoles.length === 0 && !matchedRoute) {
    return NextResponse.next()
  }

  // Check if route requires authentication
  if (requiredRoles.length > 0) {
    // Route requires authentication
    if (!authData || !authData.user || !authData.token) {
      // Not authenticated, redirect to auth page
      const authUrl = new URL("/auth", request.url)
      authUrl.searchParams.set("redirect", pathname)
      return NextResponse.redirect(authUrl)
    }

    // Check role-based access
    if (!hasRequiredRole(authData.user.role, requiredRoles)) {
      // User doesn't have required role, redirect to appropriate dashboard
      const redirectPath = getDefaultRedirect(authData.user.role)
      const redirectUrl = new URL(redirectPath, request.url)
      return NextResponse.redirect(redirectUrl)
    }
  }

  // Add auth data to headers for client-side access
  const response = NextResponse.next()
  
  if (authData?.user) {
    response.headers.set("x-user-role", authData.user.role)
    response.headers.set("x-user-email", authData.user.email)
  }
  
  return response
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
