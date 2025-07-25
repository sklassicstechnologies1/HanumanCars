"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

export {};

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PendingDue {
  due_amount: number;
  booking_id: number;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

function getAuthToken() {
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

export default function DuePaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "verifying" | "success" | "error">("idle");
  const [pendingDue, setPendingDue] = useState<PendingDue | null>(null);
  const [razorpayKey, setRazorpayKey] = useState("");

  // Load Razorpay SDK
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Fetch due info and Razorpay key
  useEffect(() => {
    if (!orderId) {
      setError("Missing order_id in URL");
      setLoading(false);
      return;
    }

    const fetchDue = async () => {
      try {
        const res = await fetch(`${BASE_URL}/pay_due_now?order_id=${orderId}`, {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        });
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ message: 'An unknown error occurred' }));
          throw new Error(errorData.message || res.statusText);
        }
        const data = await res.json();
        setPendingDue(data.pending_due);
        setRazorpayKey(data.razorpay_key);
      } catch (err: any) {
        setError(err?.message || "Failed to load due payment info.");
      } finally {
        setLoading(false);
      }
    };

    fetchDue();
  }, [orderId]);

  const handlePay = () => {
    if (!window.Razorpay || !pendingDue || !orderId) {
      setError("Razorpay SDK or payment data not ready.");
      return;
    }

    const options = {
      key: razorpayKey,
      amount: pendingDue.due_amount * 100,
      currency: "INR",
      name: "Car Rental - Due Payment",
      description: `Due Payment for booking ${pendingDue.booking_id}`,
      order_id: orderId,
      handler: async function (response: any) {
        try {
          setPaymentStatus('verifying');
          const verifyRes = await fetch(`${BASE_URL}/payment_success`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getAuthToken()}`,
            },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          if (!verifyRes.ok) throw new Error("Verification failed");

          toast({
            title: "Payment Successful",
            description: "Your due payment was verified successfully.",
          });
          
          setPaymentStatus('success');

          setTimeout(() => {
            router.push("/bookings");
          }, 3000); // 3-second delay before redirect

        } catch (e) {
          setPaymentStatus('error');
          setError("Payment verification failed.");
          toast({
            title: "Verification Error",
            description: "Payment verification failed.",
            variant: "destructive",
          });
        }
      },
      theme: {
        color: "#6366f1",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  if (paymentStatus === 'success') {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4 font-sans text-center">
            <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, type: 'spring' }}
                className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-green-500/30"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="mx-auto w-24 h-24 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center glow mb-6"
                >
                    <Check className="w-12 h-12 text-white" />
                </motion.div>
                <h2 className="text-3xl font-bold gradient-text mb-2">Payment Successful!</h2>
                <p className="text-gray-300 text-lg">Your due payment has been verified.</p>
                <p className="text-gray-400 mt-4">Redirecting to your bookings...</p>
            </motion.div>
        </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white text-lg">
        Loading due payment details…
      </div>
    );
  }

  if (error || !pendingDue) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-red-400 text-lg">
        {error || "Something went wrong."}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4 font-sans">
      <div className="max-w-md w-full bg-white/5 border border-white/20 backdrop-blur-md p-6 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-white text-center mb-4">Pay Remaining Amount</h2>

        <p className="text-lg text-gray-300 text-center mb-6">
          <strong className="text-white">Due Amount:</strong> ₹{pendingDue.due_amount}
        </p>

        <Button
          onClick={handlePay}
          className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold py-3"
        >
          Pay Now with Razorpay
        </Button>

        <Button
          variant="outline"
          onClick={() => router.push("/bookings")}
          className="w-full mt-4 border-white/30 text-white hover:bg-white/10"
        >
          ← Back to Dashboard
        </Button>
      </div>
    </div>
  );
}
