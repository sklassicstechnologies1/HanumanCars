"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const BASE_URL = "http://77.37.45.187:5085/api"

function getAuthToken() {
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem("auth-storage")
      if (!raw) return ""
      const parsed = JSON.parse(raw)
      return parsed?.state?.token || ""
    } catch {
      return ""
    }
  }
  return ""
}

export default function RideStatusPage() {
  const { booking_id } = useParams<{ booking_id: string }>()
  const router = useRouter()
  const [booking, setBooking] = useState<any>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!booking_id) return
    setLoading(true)
    axios
      .get(`${BASE_URL}/user/ride_status/${booking_id}`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` }
      })
      .then((res) => {
        setBooking(res.data.booking)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.response?.data?.error || "Failed to load ride status.")
        setLoading(false)
      })
  }, [booking_id])

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <span className="text-white text-lg">Loading ride status…</span>
      </div>
    )
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <span className="text-red-400 text-lg">{error}</span>
      </div>
    )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4 py-8 font-sans flex items-center justify-center">
      <Card className="glass-dark max-w-xl w-full shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold gradient-text mb-2">
            Ride Status for Booking #{booking.id}
          </CardTitle>
          <div className="flex gap-2">
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 border">
              {booking.ride_status ? booking.ride_status.replace("_", " ").toUpperCase() : "NOT STARTED"}
            </Badge>
            {booking.ride_status === "live" && (
              <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 border">LIVE</Badge>
            )}
            {booking.ride_status === "completed" && (
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 border">COMPLETED</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3 text-white text-base">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p>
                <span className="font-semibold text-gray-300">Scheduled Start:</span>
                <span className="ml-2">{booking.start_time}</span>
              </p>
              <p>
                <span className="font-semibold text-gray-300">Scheduled End:</span>
                <span className="ml-2">{booking.end_time}</span>
              </p>
            </div>
            <div>
              <p>
                <span className="font-semibold text-gray-300">Start OTP:</span>
                <span className="ml-2">{booking.start_otp}</span>
              </p>
              <p>
                <span className="font-semibold text-gray-300">End OTP:</span>
                <span className="ml-2">{booking.end_otp}</span>
              </p>
            </div>
          </div>
          {booking.ride_status === "live" && (
            <div className="text-orange-400 font-semibold mt-2">🚗 Ride is LIVE.</div>
          )}
          {booking.ride_status === "completed" && (
            <div className="text-green-400 font-semibold mt-2">✅ Ride has COMPLETED.</div>
          )}
          {!booking.ride_status && (
            <div className="text-gray-400 font-medium mt-2">⏳ Ride has NOT STARTED.</div>
          )}
          <Button
            variant="outline"
            className="mt-8 border-white/30 text-white hover:bg-white/10"
            onClick={() => router.push("/bookings")}
          >
            ← Back to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}