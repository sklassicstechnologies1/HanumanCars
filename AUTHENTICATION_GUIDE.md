# Authentication & Route Protection Guide

## Overview

This guide explains the comprehensive authentication and route protection system implemented in the HanumanCars application. The system provides:

- **Server-side route protection** via Next.js middleware
- **Client-side route protection** via ProtectedRoute components
- **Role-based access control** (RBAC)
- **Token persistence** across page refreshes
- **Automatic token validation** and cleanup
- **Cookie-based storage** for middleware access

## Architecture

### 1. Authentication Store (`store/auth.ts`)

The Zustand store manages authentication state with persistence:

```typescript
interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  isInitialized: boolean
  login: (user: User, token: string) => void
  logout: () => void
  initializeAuth: () => Promise<void>
  validateToken: () => Promise<boolean>
}
```

**Key Features:**
- Persistent storage using Zustand's `persist` middleware
- Token validation on app initialization
- Automatic cleanup on logout
- Loading states for better UX
- **Dual storage**: localStorage (for Zustand) + cookies (for middleware)

### 2. Route Protection

#### Server-Side Protection (Middleware)

**File:** `middleware.ts`

The middleware provides server-side route protection by reading authentication data from cookies:

```typescript
const ROUTE_CONFIG: Record<string, string[]> = {
  // Admin only routes
  "/admin": ["admin"],
  "/admin/add-car": ["admin"],
  
  // Owner only routes
  "/owner": ["owner"],
  "/owner/ride_action": ["owner"],
  
  // User routes (authenticated users)
  "/dashboard": ["user", "admin", "owner"],
  "/booking": ["user", "admin", "owner"],
  "/payment": ["user", "admin", "owner"],
  
  // Public routes
  "/": [],
  "/home": [],
  "/auth": [],
}
```

**How it works:**
1. Intercepts all requests (except static files and API routes)
2. **Reads authentication token from cookies** (`auth-storage`)
3. Validates user role against route requirements
4. Redirects unauthorized users to appropriate pages

#### Client-Side Protection (ProtectedRoute Component)

**File:** `components/auth/protected-route.tsx`

Provides client-side protection with loading states:

```typescript
<ProtectedRoute requiredRoles={["admin"]}>
  <AdminDashboard />
</ProtectedRoute>
```

**Features:**
- Loading states while checking authentication
- Role-based access control
- Automatic redirects for unauthorized users
- Fallback UI support

### 3. Authentication Utilities (`lib/auth-utils.ts`)

Helper functions for token and user management with **dual storage**:

```typescript
// Store auth data in both localStorage and cookies
export function storeAuthData(user: any, token: string): void

// Get auth data from cookies (for middleware)
export function getAuthDataFromCookies(): { user: any; token: string | null } | null

// Get token from localStorage (for API calls)
export function getAuthToken(): string | null

// Get user data from localStorage
export function getAuthUser(): any

// Check if user is authenticated
export function isUserAuthenticated(): boolean

// Check if user has required role
export function hasRequiredRole(userRole: string, requiredRoles: string[]): boolean

// Validate token by making API call
export async function validateToken(token: string): Promise<boolean>

// Clear all auth data (both localStorage and cookies)
export function clearAuthData(): void
```

### 4. API Interceptors

Both `lib/api.ts` and `lib/axiosInstance.ts` include interceptors that:

- **Request Interceptor:** Automatically add JWT tokens to requests
- **Response Interceptor:** Handle 401 errors by logging out user and redirecting

## Storage Strategy

### Dual Storage System

The application uses a **dual storage strategy** for optimal performance and security:

1. **localStorage** (Primary storage for Zustand)
   - Fast access for client-side operations
   - Persists across browser sessions
   - Used by Zustand store and API interceptors

2. **Cookies** (Secondary storage for middleware)
   - Accessible by server-side middleware
   - Automatic inclusion in HTTP requests
   - Used for server-side route protection

### Cookie Configuration

```typescript
// Cookie settings for auth-storage
{
  name: "auth-storage",
  value: JSON.stringify({ state: { user, token, isAuthenticated, timestamp } }),
  expires: 7 days,
  path: "/",
  SameSite: "Strict"
}
```

## Usage Examples

### Protecting Routes

#### Admin-Only Routes
```typescript
// app/admin/page.tsx
export default function AdminDashboard() {
  return (
    <ProtectedRoute requiredRoles={["admin"]}>
      <AdminDashboardContent />
    </ProtectedRoute>
  )
}
```

#### Owner-Only Routes
```typescript
// app/owner/page.tsx
export default function OwnerDashboard() {
  return (
    <ProtectedRoute requiredRoles={["owner"]}>
      <OwnerDashboardContent />
    </ProtectedRoute>
  )
}
```

#### User Routes (All Authenticated Users)
```typescript
// app/dashboard/page.tsx
export default function Dashboard() {
  return (
    <ProtectedRoute requiredRoles={["user", "admin", "owner"]}>
      <DashboardContent />
    </ProtectedRoute>
  )
}
```

### Authentication Flow

1. **Login Process:**
   ```typescript
   const response = await authAPI.login(email, otp)
   const { access_token } = response.data
   
   // Get user role
   const roleResponse = await authAPI.getRole()
   const { role } = roleResponse.data
   
   // Create user object
   const user = { email, role }
   
   // Login with complete data (stores in Zustand + localStorage)
   login(user, access_token)
   
   // Also store in cookies for middleware access
   storeAuthData(user, access_token)
   ```

2. **Token Validation:**
   - Tokens are validated on app initialization
   - Invalid tokens are automatically cleared from both storage locations
   - Users are redirected to login if validation fails

3. **Logout Process:**
   ```typescript
   logout() // Clears Zustand store + localStorage
   clearAuthData() // Clears cookies
   router.push("/auth")
   ```

## Route Configuration

### Protected Routes

| Route | Required Roles | Description |
|-------|---------------|-------------|
| `/admin` | `["admin"]` | Admin dashboard |
| `/admin/add-car` | `["admin"]` | Add new car |
| `/owner` | `["owner"]` | Owner dashboard |
| `/owner/ride_action` | `["owner"]` | Manage ride actions |
| `/dashboard` | `["user", "admin", "owner"]` | User dashboard |
| `/booking` | `["user", "admin", "owner"]` | Booking management |
| `/bookings` | `["user", "admin", "owner"]` | View bookings |
| `/payment` | `["user", "admin", "owner"]` | Payment processing |
| `/pay_due` | `["user", "admin", "owner"]` | Pay due amounts |
| `/due_payment` | `["user", "admin", "owner"]` | Due payment management |
| `/profile` | `["user", "admin", "owner"]` | User profile |
| `/documents` | `["user", "admin", "owner"]` | Document management |
| `/notifications` | `["user", "admin", "owner"]` | Notifications |

### Public Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/home` | Home page |
| `/auth` | Authentication page |
| `/splash` | Splash screen |
| `/about` | About page |
| `/help` | Help page |
| `/car` | Car listings |

## Security Features

### 1. Token Management
- Tokens are stored in **both Zustand store and cookies**
- Automatic token validation on app startup
- Secure token cleanup on logout (both storage locations)

### 2. Role-Based Access Control
- Server-side role validation in middleware (from cookies)
- Client-side role checking in ProtectedRoute components (from Zustand)
- Automatic redirects for unauthorized access

### 3. Error Handling
- 401 errors automatically log out users
- Graceful fallbacks for authentication failures
- Loading states during authentication checks

### 4. Persistence
- Authentication state persists across page refreshes
- Token validation ensures data integrity
- Automatic cleanup of invalid tokens from both storage locations

### 5. Cookie Security
- **SameSite=Strict** prevents CSRF attacks
- **HttpOnly** could be added for additional security
- **Secure** flag for HTTPS-only transmission
- **Path=/** ensures cookie is available across the app

## Best Practices

### 1. Always Use ProtectedRoute for Protected Pages
```typescript
// ✅ Good
export default function ProtectedPage() {
  return (
    <ProtectedRoute requiredRoles={["admin"]}>
      <PageContent />
    </ProtectedRoute>
  )
}

// ❌ Bad - No protection
export default function UnprotectedPage() {
  return <PageContent />
}
```

### 2. Use Auth Utilities for Token Access
```typescript
// ✅ Good
import { getAuthToken } from "@/lib/auth-utils"
const token = getAuthToken()

// ❌ Bad - Direct localStorage access
const token = localStorage.getItem("auth-storage")
```

### 3. Handle Loading States
```typescript
// ✅ Good
if (isLoading || isChecking) {
  return <LoadingSpinner />
}
```

### 4. Proper Error Handling
```typescript
// ✅ Good
try {
  const response = await authAPI.getRole()
  // Handle success
} catch (error) {
  // Handle error appropriately
  console.error("Auth error:", error)
}
```

### 5. Cookie Management
```typescript
// ✅ Good - Use utility functions
storeAuthData(user, token)
clearAuthData()

// ❌ Bad - Direct cookie manipulation
document.cookie = "auth-storage=..."
```

## Troubleshooting

### Common Issues

1. **State Reset on Refresh**
   - Ensure AuthProvider is wrapping the app
   - Check that `isInitialized` is being set properly
   - Verify token persistence in both localStorage and cookies

2. **Unauthorized Access**
   - Check route configuration in middleware
   - Verify user role in auth store
   - Ensure ProtectedRoute is wrapping components
   - Check if cookies are being set properly

3. **Token Validation Failures**
   - Check API endpoint availability
   - Verify token format and expiration
   - Check network connectivity

4. **Redirect Loops**
   - Ensure auth page doesn't require authentication
   - Check redirect logic in middleware
   - Verify role-based redirects

5. **Cookie Issues**
   - Check browser cookie settings
   - Verify SameSite policy compatibility
   - Ensure cookies are being set with proper domain/path

### Debug Tools

1. **Check Auth State:**
   ```javascript
   // In browser console
   console.log(useAuthStore.getState())
   ```

2. **Check localStorage:**
   ```javascript
   // In browser console
   console.log(localStorage.getItem("auth-storage"))
   console.log(localStorage.getItem("auth_token"))
   ```

3. **Check Cookies:**
   ```javascript
   // In browser console
   console.log(document.cookie)
   console.log(getAuthDataFromCookies())
   ```

4. **Check Middleware:**
   - Add console.logs in middleware.ts
   - Check Network tab for redirects
   - Verify cookies are being read properly

## Future Enhancements

1. **Token Refresh:** Implement automatic token refresh
2. **Session Management:** Add session timeout handling
3. **Multi-factor Authentication:** Add 2FA support
4. **Audit Logging:** Track authentication events
5. **Rate Limiting:** Add API rate limiting
6. **SSO Integration:** Support for OAuth providers
7. **HttpOnly Cookies:** Enhanced security for token storage
8. **Token Rotation:** Regular token refresh for security 