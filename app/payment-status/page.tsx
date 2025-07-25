"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Upload,
  Calendar as CalendarIcon,
  User,
  Mail,
  Car,
  Clock,
  CreditCard,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { usePaymentStore } from "@/store/payment";

// Mock response object (replace with real data fetching or props)
// const response = {
//   breakdown: {
//     car_price_total: 200,
//     car_wash_charge: 199,
//     late_night_charge: 0,
//     total_amount: 399,
//   },
//   car_id: 1,
//   created_at: "2025-06-19T12:09:21.256313",
//   documents: {},
//   down_payment: 10,
//   due_amount: 389,
//   end_time: "2025-06-22 18:00",
//   id: 4,
//   razorpay_order_id: "order_Qj36X2bYo7jUy6",
//   razorpay_payment_id: "pay_Qj37RKX3J2TbfQ",
//   start_time: "2025-06-21 18:00",
//   status: "doc_upload_required",
//   temp_id: "order_Qj36X2bYo7jUy6",
//   user_email: "yn7675@gmail.com",
// }

export default function PaymentStatusPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const response = usePaymentStore((state) => state.payment)?.booking;
  console.log(response, "response");

  useEffect(() => {
    const paymentStatus = searchParams.get("payment");
    if (paymentStatus) {
      setPaymentStatus(paymentStatus);
    }
    if(!response){
      paymentStatus === "success" ?
        router.push("/dashboard?payment=success")
        :
        router.push("/dashboard?payment=failed")
    }
  }, [searchParams]);

  // Determine payment outcome
  let outcome: "success" | "failure" | "other" = "other";
  if (paymentStatus === "success") {
    outcome = "success";
  } else if (paymentStatus === "failed") {
    outcome = "failure";
  } else {
    if (response?.status === "success" && response?.razorpay_payment_id) {
      outcome = "success";
    } else if (
      response?.status === "failed" ||
      !response?.razorpay_payment_id
    ) {
      outcome = "failure";
    } else if (response?.status === "doc_upload_required") {
      outcome = "other";
    }
  }

  // Animated background (copied from not-found and loading)
  const AnimatedBg = () => (
    <div className="absolute inset-0">
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-white/10 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Number.POSITIVE_INFINITY,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative">
      <AnimatedBg />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg z-10"
      >
        <Card className="glass-dark border-white/20 shadow-2xl">
          <CardHeader className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center glow mb-4
                ${
                  outcome === "success"
                    ? "bg-gradient-to-r from-green-500 to-blue-500"
                    : outcome === "failure"
                    ? "bg-gradient-to-r from-red-500 to-pink-500"
                    : "bg-gradient-to-r from-yellow-500 to-orange-500"
                }
              `}
            >
              {outcome === "success" && (
                <CheckCircle2 className="w-10 h-10 text-white" />
              )}
              {outcome === "failure" && (
                <XCircle className="w-10 h-10 text-white" />
              )}
              {outcome === "other" && (
                <AlertTriangle className="w-10 h-10 text-white" />
              )}
            </motion.div>
            <CardTitle
              className={`gradient-text text-2xl ${
                outcome === "success"
                  ? "text-green-400"
                  : outcome === "failure"
                  ? "text-red-400"
                  : "text-yellow-400"
              }`}
            >
              {outcome === "success" && "Payment Successful"}
              {outcome === "failure" && "Payment Failed"}
              {outcome === "other" && "Action Required"}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Success State */}
            {outcome === "success" && (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge variant="default">Booking ID: {response?.id}</Badge>
                  <Badge variant="secondary">Car ID: {response?.car_id}</Badge>
                  <Badge variant="secondary">
                    User: {response?.user_email}
                  </Badge>
                </div>
                <div className="flex flex-col gap-2 text-gray-300 text-sm">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-blue-400" /> Start:{" "}
                    <span className="text-white">{response?.start_time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-purple-400" /> End:{" "}
                    <span className="text-white">{response?.end_time}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-300">
                    <span>Car Price Total</span>
                    <span>
                      {formatCurrency(response?.breakdown.car_price_total)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Car Wash Charge</span>
                    <span>
                      {formatCurrency(response?.breakdown.car_wash_charge)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Late Night Charge</span>
                    <span>
                      {formatCurrency(response?.breakdown.late_night_charge)}
                    </span>
                  </div>
                  <div className="border-t border-white/20 pt-2">
                    <div className="flex justify-between text-white font-bold text-lg">
                      <span>Total Amount</span>
                      <span>
                        {formatCurrency(response?.breakdown.total_amount)}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between text-green-400 font-semibold">
                    <span>Down Payment</span>
                    <span>{formatCurrency(response?.down_payment)}</span>
                  </div>
                  <div className="flex justify-between text-yellow-400 font-semibold">
                    <span>Due Amount</span>
                    <span>{formatCurrency(response?.due_amount)}</span>
                  </div>
                </div>
                <div className="text-center">
                  <Badge variant="default">
                    {response?.razorpay_payment_id}
                  </Badge>
                </div>
                <div className="text-center">
                  <Button
                    onClick={() => router.push("/dashboard")}
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 glow mt-2"
                  >
                    Go to Dashboard
                  </Button>
                </div>
              </div>
            )}

            {/* Failure State */}
            {outcome === "failure" && (
              <div className="space-y-4 text-center">
                <p className="text-red-400 font-semibold">
                  Your payment could not be processed.
                </p>
                <p className="text-gray-400">
                  Please try again or contact support if the issue persists.
                </p>
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={() => router.back()}
                    className="w-full h-12 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                  >
                    Retry Payment
                  </Button>
                  <Button
                    onClick={() => router.push("/help")}
                    variant="outline"
                    className="w-full h-12 border-white/30 text-white hover:bg-white/10"
                  >
                    Contact Support
                  </Button>
                </div>
              </div>
            )}

            {/* Other/Doc Upload Required State */}
            {outcome === "other" && (
              <div className="space-y-4 text-center">
                <p className="text-yellow-400 font-semibold">
                  Your payment was received, but document upload is required to
                  complete your booking.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge variant="default">Booking ID: {response.id}</Badge>
                  <Badge variant="secondary">Car ID: {response.car_id}</Badge>
                  <Badge variant="secondary">User: {response.user_email}</Badge>
                </div>
                <div className="flex flex-col gap-2 text-gray-300 text-sm">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-blue-400" /> Start:{" "}
                    <span className="text-white">{response.start_time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-purple-400" /> End:{" "}
                    <span className="text-white">{response.end_time}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-300">
                    <span>Car Price Total</span>
                    <span>
                      {formatCurrency(response.breakdown.car_price_total)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Car Wash Charge</span>
                    <span>
                      {formatCurrency(response.breakdown.car_wash_charge)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Late Night Charge</span>
                    <span>
                      {formatCurrency(response.breakdown.late_night_charge)}
                    </span>
                  </div>
                  <div className="border-t border-white/20 pt-2">
                    <div className="flex justify-between text-white font-bold text-lg">
                      <span>Total Amount</span>
                      <span>
                        {formatCurrency(response.breakdown.total_amount)}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between text-green-400 font-semibold">
                    <span>Down Payment</span>
                    <span>{formatCurrency(response.down_payment)}</span>
                  </div>
                  <div className="flex justify-between text-yellow-400 font-semibold">
                    <span>Due Amount</span>
                    <span>{formatCurrency(response.due_amount)}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 text-center">
                  <Button
                    onClick={() => router.push(`/documents/${response.id}`)}
                    className="w-full h-12 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 glow mt-2 flex items-center justify-center gap-2"
                  >
                    <Upload className="w-5 h-5" /> Upload Documents
                  </Button>
                  <Button
                    onClick={() => router.push(`/dashboard`)}
                    className="w-full h-12 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 glow mt-2 flex items-center justify-center gap-2"
                  >
                    <Upload className="w-5 h-5" />
                    Dashboard
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
