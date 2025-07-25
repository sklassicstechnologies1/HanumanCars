import { NextRequest, NextResponse } from "next/server"

export async function GET(
  req: NextRequest,
  { params }: { params: { bookingId: string } }
) {
  const token = process.env.BACKEND_API_TOKEN
  const apiUrl = `${(process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/api$/, "")}/owner/ride_action/${params.bookingId}`

  const res = await fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    method: "GET",
    cache: "no-store",
  })

  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}

// Add POST handler for OTP verification if needed
export async function POST(
  req: NextRequest,
  { params }: { params: { bookingId: string } }
) {
  const token = process.env.BACKEND_API_TOKEN
  const { action } = Object.fromEntries(new URL(req.url).searchParams)
  const body = await req.json()
  // Use the correct backend endpoint for start/end ride
  const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/api$/, "")}/owner/${action}_ride/${params.bookingId}`

  const res = await fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(body),
  })

  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}