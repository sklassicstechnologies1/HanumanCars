"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { DollarSign, Calendar as CalendarIcon, Car as CarIcon, AlertTriangle } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

interface Booking {
  id: number;
  start_time: string;
  end_time: string;
  due_amount: number;
}

interface Car {
  name: string;
}


const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

function getAuthToken(): string {
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem("auth-storage");
      if (!raw) return "";
      const parsed = JSON.parse(raw);
      return parsed?.state?.token || "";
    } catch {
      return "";
    }
  }
  return "";
}

export default function PayDuePage() {
  const router = useRouter();
  const params = useParams();
  const bookingId = Array.isArray(params.bookingId) ? params.bookingId[0] : params.bookingId;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [car, setCar] = useState<Car | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!bookingId) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`${BASE_URL}/pay_due/${bookingId}`, {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        });
        const data = await res.json();
        setBooking(data.booking);
        setCar(data.car);
      } catch (err: any) {
        setError(err?.response?.data?.error || "Failed to load due information.");
      }
    };

    fetchData();
  }, [bookingId]);

  const confirmDue = async () => {
    try {
      const res = await fetch(`${BASE_URL}/pay_due/${bookingId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      const data = await res.json();

      if (data?.order_id) {
        router.push(`/due_payment?order_id=${data.order_id}`);
      } else {
        toast({
          title: "Payment Error",
          description: "No order ID found",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      toast({
        title: "Payment Failed",
        description: err?.response?.data?.error || "Could not initiate due payment.",
        variant: "destructive",
      });
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <p className="text-red-400 text-lg">{error}</p>
      </div>
    );
  }

  if (!booking || !car) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <p className="text-white text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4 py-10 font-sans">
      <Card className="glass-dark max-w-xl mx-auto p-6 shadow-xl space-y-5 border-white/20">
        <CardHeader>
          <CardTitle className="text-2xl font-bold gradient-text">
            Pay Due for {car.name}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 text-gray-300">
          <p>
            <strong className="text-white">Booking Period:</strong> {booking.start_time} → {booking.end_time}
          </p>
          <p>
            <strong className="text-white">Due Amount:</strong> ₹{booking.due_amount}
          </p>

          <Button
            onClick={confirmDue}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold"
          >
            Confirm Due Payment
          </Button>

          <Button
            variant="outline"
            className="w-full mt-2 border-white/30 text-white hover:bg-white/10"
            onClick={() => router.push("/bookings")}
          >
            ← Back to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
