"use client"

import { useEffect, useState } from "react"
import { redirect, useParams } from "next/navigation"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { DateTimePicker } from "@/components/ui/date-time-picker"
import { Link } from "lucide-react"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

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

export default function OwnerBlocksPage() {
  const params = useParams()
  const car_id = Array.isArray(params.car_id) ? params.car_id[0] : params.car_id
  const [blocks, setBlocks] = useState<any[]>([])
  const [start, setStart] = useState("")
  const [end, setEnd] = useState("")
  const [startDateTime, setStartDateTime] = useState<Date | null>(null)
  const [endDateTime, setEndDateTime] = useState<Date | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null)

  // Load existing blocks
  useEffect(() => {
    if (!car_id) return
    setLoading(true)
    axios.get(`${BASE_URL}/owner/block/${car_id}`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` }
    })
      .then(res => setBlocks(res.data.blocks))
      .catch(() => setMessage({ type: "error", text: "Failed to load blocks." }))
      .finally(() => setLoading(false))
  }, [car_id])

  const addBlock = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    setLoading(true)
    try {
      const res = await axios.post(
        `${BASE_URL}/owner/block/${car_id}`,
        { start_block: start, end_block: end },
        { headers: { Authorization: `Bearer ${getAuthToken()}` } }
      )
      setBlocks(res.data.blocks)
      setStart("")
      setEnd("")
      setMessage({ type: "success", text: res.data.message || "Block added." })
      toast({ title: "Block Added", description: res.data.message || "Block added." })
    } catch (err: any) {
      setMessage({ type: "error", text: err?.response?.data?.error || "Could not add block." })
      toast({ title: "Error", description: err?.response?.data?.error || "Could not add block.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const removeBlock = async (idx: number) => {
    if (!window.confirm("Remove this block?")) return
    setLoading(true)
    try {
      const res = await axios.post(
        `${BASE_URL}/owner/unblock/${car_id}/${idx}`,
        {},
        { headers: { Authorization: `Bearer ${getAuthToken()}` } }
      )
      setBlocks(res.data.blocks)
      setMessage({ type: "success", text: res.data.message || "Block removed." })
      toast({ title: "Block Removed", description: res.data.message || "Block removed." })
    } catch (err: any) {
      setMessage({ type: "error", text: err?.response?.data?.error || "Could not remove block." })
      toast({ title: "Error", description: err?.response?.data?.error || "Could not remove block.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  function formatDateTime(date: Date): string {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    const hours = `${date.getHours()}`.padStart(2, "0");
    const minutes = `${date.getMinutes()}`.padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4 py-8 font-sans">
      <Card className="glass-dark max-w-2xl mx-auto mb-10 shadow-xl rounded-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold gradient-text">
            Manage Blocks for Car #{car_id}
          </CardTitle>
         
        </CardHeader>
        <CardContent>
          {message && (
            <div className={`mb-4 px-4 py-3 rounded-md text-sm font-medium
              ${message.type === "error"
                ? "bg-red-500/10 text-red-400 border border-red-500/20"
                : "bg-green-500/10 text-green-400 border border-green-500/20"}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={addBlock} className="space-y-6">
            <div>
              <label className="block text-white font-semibold mb-1">Start (YYYY-MM-DD HH:MM)</label>
              <DateTimePicker
                value={startDateTime || undefined}
                onChange={date => {
                  setStartDateTime(date)
                  setStart(date ? formatDateTime(date) : "")
                }}
                placeholder="Select start date and time"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-white font-semibold mb-1">End (YYYY-MM-DD HH:MM)</label>
              <DateTimePicker
                value={endDateTime || undefined}
                onChange={date => {
                  setEndDateTime(date)
                  setEnd(date ? formatDateTime(date) : "")
                }}
                placeholder="Select end date and time"
                className="w-full"
                minDate={startDateTime || undefined}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              disabled={loading}
            >
              Add Block
            </Button>
          </form>
          <div className="flex justify-end p-4">
          <a href="/owner" className="text-sm bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-4 py-1.5 rounded-md transition">
            Back
          </a>
      </div>
        </CardContent>
      </Card>

      <Card className="glass-dark max-w-2xl mx-auto shadow-xl rounded-xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-white">Existing Blocks</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-gray-300">Loading...</p>
          ) : blocks.length === 0 ? (
            <p className="text-gray-300">(No blocks)</p>
          ) : (
            <div className="space-y-4">
              {blocks.map((b, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center glass-dark p-4 rounded-md shadow-sm border border-white/10"
                >
                  <span className="text-white">{b.start} → {b.end}</span>
                  <Button
                    onClick={() => removeBlock(i)}
                    className="text-sm bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-4 py-1.5 rounded-md transition"
                    disabled={loading}
                  >
                    Unblock
                  </Button>
                  
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}