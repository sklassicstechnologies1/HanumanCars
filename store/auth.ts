import { create } from "zustand"
import { persist } from "zustand/middleware"
import { storeAuthData, clearAuthData } from "@/lib/auth-utils"

interface User {
  email: string
  role: "user" | "admin" | "owner"
  name?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  isInitialized: boolean
  login: (user: User, token: string) => void
  logout: () => void
  setLoading: (loading: boolean) => void
  updateUser: (user: Partial<User>) => void
  initializeAuth: () => Promise<void>
  validateToken: () => Promise<boolean>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: false,

      login: (user, token) => {
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
          isInitialized: true,
        })
        
        // Store in both localStorage and cookies
        storeAuthData(user, token)
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          isInitialized: true,
        })
        
        // Clear from both localStorage and cookies
        clearAuthData()
      },

      setLoading: (loading) => {
        set({ isLoading: loading })
      },

      updateUser: (userData) => {
        const currentUser = get().user
        if (currentUser) {
          const updatedUser = { ...currentUser, ...userData }
          set({ user: updatedUser })
          
          // Update cookies with new user data
          const token = get().token
          if (token) {
            storeAuthData(updatedUser, token)
          }
        }
      },

      initializeAuth: async () => {
        const state = get()
        
        // If already initialized, don't reinitialize
        if (state.isInitialized) return

        set({ isLoading: true })

        try {
          // Check if we have stored auth data
          if (state.token && state.user) {
            // Validate the token
            const isValid = await get().validateToken()
            
            if (isValid) {
              set({ 
                isAuthenticated: true, 
                isLoading: false, 
                isInitialized: true 
              })
              
              // Ensure cookies are up to date
              storeAuthData(state.user, state.token)
            } else {
              // Token is invalid, clear auth data
              get().logout()
            }
          } else {
            // No stored auth data
            set({ 
              isAuthenticated: false, 
              isLoading: false, 
              isInitialized: true 
            })
          }
        } catch (error) {
          console.error("Error initializing auth:", error)
          // On error, clear auth data and mark as initialized
          get().logout()
          set({ isInitialized: true })
        }
      },

      validateToken: async () => {
        const state = get()
        
        if (!state.token) return false

        try {
          // Import here to avoid circular dependency
          const { authAPI } = await import("@/lib/api")
          
          // Try to get user role to validate token
          const response = await authAPI.getRole()
          
          if (response.data && response.data.role) {
            // Update user data if needed
            set({ user: response.data })
            
            // Update cookies with new user data
            storeAuthData(response.data, state.token)
            
            return true
          }
          
          return false
        } catch (error) {
          console.error("Token validation failed:", error)
          return false
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        isInitialized: state.isInitialized,
      }),
    },
  ),
)
