import axios from "axios"
import { NextRequest, NextResponse } from "next/server"
import { useAuthStore } from "@/store/auth"
import { getAuthToken, clearAuthData } from "@/lib/auth-utils"

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
})

// Request interceptor to add JWT token
axiosInstance.interceptors.request.use(
  (config) => {
    let token = getAuthToken()

    // Fallback to Zustand store if localStorage fails
    if (!token) {
      token = useAuthStore.getState().token
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data and redirect to login
      useAuthStore.getState().logout()
      clearAuthData()
      
      // Only redirect on client side
      if (typeof window !== "undefined") {
        window.location.href = "/auth"
      }
    }
    return Promise.reject(error)
  },
)

export async function GET(req: NextRequest, { params }: { params: { bookingId: string } }) {
  const token = process.env.BACKEND_API_TOKEN
  const { bookingId } = params

  const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/owner/ride_action/${bookingId}`

  const res = await fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    method: "GET",
  })

  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}