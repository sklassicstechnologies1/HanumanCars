import { NextRequest, NextResponse } from "next/server"

const BASE_URL = "http://127.0.0.1:5000/api"

export async function GET(
  req: NextRequest,
  { params }: { params: { car_id: string } }
) {
  const apiUrl = `${BASE_URL}/owner/block/${params.car_id}`
  const res = await fetch(apiUrl, { method: "GET" })
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}

export async function POST(
  req: NextRequest,
  { params }: { params: { car_id: string } }
) {
  const apiUrl = `${BASE_URL}/owner/block/${params.car_id}`
  const body = await req.json()
  const res = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}