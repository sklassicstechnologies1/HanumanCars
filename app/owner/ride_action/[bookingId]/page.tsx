"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { formatDate } from "@/lib/utils"


const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Helper to get token from localStorage "auth-storage"
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

export default function OwnerRideActionPage() {
  const router = useRouter()
  const params = useParams()
  const bookingId = Array.isArray(params.bookingId) ? params.bookingId[0] : params.bookingId
  const [booking, setBooking] = useState<Booking | null>(null)
  const [otp, setOtp] = useState("")
  const [msg, setMsg] = useState<{ type: "error" | "success"; text: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load booking details
  useEffect(() => {
    if (!bookingId) return
    setIsLoading(true)
    axios
      .get(`${BASE_URL}/owner/ride_action/${bookingId}`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` }
      })
      .then(res => setBooking(res.data.booking))
      .catch(err =>
        setMsg({
          type: "error",
          text: err?.response?.data?.error || "Failed to load booking.",
        })
      )
      .finally(() => setIsLoading(false))
  }, [bookingId])

  interface Booking {
    id: number
    ride_status: string
    start_time: string
    end_time: string
    [key: string]: any
  }

  type RideAction = "start" | "end"

  const verifyOtp = async (action: RideAction): Promise<void> => {
    setMsg(null)
    try {
      const endpoint =
        action === "start"
          ? `${BASE_URL}/owner/start_ride/${bookingId}`
          : `${BASE_URL}/owner/end_ride/${bookingId}`

      const res = await axios.post<{ booking: Booking }>(
        endpoint,
        { otp },
        { headers: { Authorization: `Bearer ${getAuthToken()}` } }
      )
      setBooking(res.data.booking)
      setMsg({
        type: "success",
        text: `Ride ${action === "start" ? "started" : "ended"} successfully.`,
      })
      setOtp("")
      toast({
        title: "Success",
        description: `Ride ${action === "start" ? "started" : "ended"} successfully.`,
      })
    } catch (err: any) {
      setMsg({
        type: "error",
        text:
          err?.response?.data?.error ||
          `Could not ${action === "start" ? "start" : "end"} ride.`,
      })
      toast({
        title: "Error",
        description:
          err?.response?.data?.error ||
          `Could not ${action === "start" ? "start" : "end"} ride.`,
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <span className="text-white text-lg">Loading…</span>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <span className="text-red-400 text-lg">Booking not found.</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4 py-8 flex flex-col items-center font-sans">
      <Card className="glass-dark max-w-xl w-full shadow-xl rounded-xl p-6 space-y-5">
        <CardHeader>
          <CardTitle className="text-2xl font-bold gradient-text">Manage Ride #{booking.id}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2">
            <p className="text-sm text-gray-300">
              <strong>Status:</strong>{" "}
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 border">
                {booking.ride_status ? booking.ride_status.replace("_", " ").toUpperCase() : "NOT STARTED"}
              </Badge>
            </p>
            <p className="text-sm text-gray-300">
              <strong>Scheduled:</strong> {formatDate(booking.start_time)} → {formatDate(booking.end_time)}
            </p>
          </div>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              className="w-full px-4 py-3 rounded-md bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
            {booking.ride_status !== "live" ? (
              <Button
                onClick={() => verifyOtp("start")}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                Start Ride
              </Button>
            ) : (
              <Button
                onClick={() => verifyOtp("end")}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              >
                End Ride
              </Button>
            )}
          </div>
          {msg && (
            <div
              className={`p-3 rounded-md mt-3 text-sm font-medium ${
                msg.type === "error"
                  ? "bg-red-500/10 text-red-400 border border-red-500/20"
                  : "bg-green-500/10 text-green-400 border border-green-500/20"
              }`}
            >
              {msg.text}
            </div>
          )}
        </CardContent>
      </Card>
      <Button
        variant="outline"
        className="mt-8 border-white/30 text-white hover:bg-white/10"
        onClick={() => router.push("/owner")}
      >
        ← Back to Dashboard
      </Button>
    </div>
  )
}

// In browser console:
