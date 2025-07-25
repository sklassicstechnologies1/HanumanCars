"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { triggerRazorpay } from "@/components/payment/razorpay-payment";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  CreditCard,
  Shield,
  Clock,
  Check,
  Loader2,
  Car,
  Calendar,
  MapPin,
  Users,
  Fuel,
  FileText,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { axiosInstance } from "@/lib/axiosInstance";
import { useBookingStore } from "@/store/booking";
import { carAPI } from "@/lib/api";
import ProtectedRoute from "@/components/auth/protected-route";
import { formatCurrency, formatDate, getImageUrl } from "@/lib/utils";
import Image from "next/image";

function PaymentPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "processing" | "success" | "error"
  >("idle");
  const { toast } = useToast();
  const [isPaying, setIsPaying] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [carDetails, setCarDetails] = useState<any>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { cars, setCars } = useBookingStore();

  useEffect(() => {
    const orderIdParam = searchParams.get("order_id");
    if (orderIdParam) {
      setOrderId(orderIdParam);
    }
  }, [searchParams]);

  useEffect(() => {
    if (orderId) {
      fetchPaymentDetails();
    }
  }, [orderId]);

  // Auto-scroll carousel effect
  useEffect(() => {
    if (carDetails?.images && carDetails.images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) =>
          prev === carDetails.images.length - 1 ? 0 : prev + 1
        );
      }, 5000); // Change image every 3 seconds

      return () => clearInterval(interval);
    }
  }, [carDetails?.images]);

  const fetchPaymentDetails = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/pay?order_id=${orderId}`);
      const data = response.data;
      setPaymentData(data);

      // Find car details from the booking store using car_id
      if (data.booking && data.booking.car_id !== undefined) {
        let car = cars[data.booking.car_id];

        // If car not found in store, fetch live cars data
        if (!car) {
          try {
            const carsResponse = await carAPI.getLiveCars();
            const updatedCars = carsResponse.data.cars || [];
            car = updatedCars[data.booking.car_id];
          } catch (error) {
            console.error("Failed to fetch live cars:", error);
          }
        }

        if (car) {
          setCarDetails(car);
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch payment details",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = (paymentData: any) => {
    setIsPaying(false);
    setPaymentStatus("success");
    setTimeout(() => {
      router.push("/dashboard?payment=success");
    }, 1500);
  };

  const handlePaymentError = (error: any) => {
    setIsPaying(false);
    setPaymentStatus("error");
    toast({
      title: "Payment Failed",
      description: "Something went wrong during payment.",
      variant: "destructive",
    });
    setTimeout(() => {
      router.push("/dashboard?payment=failed");
    }, 1500);
  };

  const handleBack = () => {
    router.back();
  };

  const nextImage = () => {
    if (carDetails?.images) {
      setCurrentImageIndex((prev) =>
        prev === carDetails.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (carDetails?.images) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? carDetails.images.length - 1 : prev - 1
      );
    }
  };

  if (paymentStatus === "success") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4 font-sans text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
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
          <h2 className="text-3xl font-bold gradient-text mb-2">
            Payment Successful!
          </h2>
          <p className="text-gray-300 text-lg">
            Your payment has been verified.
          </p>
          <p className="text-gray-400 mt-4">Redirecting to your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  if (!orderId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Card className="glass-dark border-white/20 max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-bold text-white mb-4">
              Invalid Payment Link
            </h2>
            <Button onClick={() => router.push("/dashboard")}>
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-white" />
          <p className="text-white">Loading payment details...</p>
        </div>
      </div>
    );
  }

  const handleToast = ({
    title,
    description,
    variant,
  }: {
    title: string;
    description: string;
    variant: any;
  }) => {
    toast({
      title: title as string,
      description: description as string,
      variant: variant || "default",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={handleBack}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10"
              >
                <span className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </span>
              </Button>
              <div className="h-6 w-px bg-white/20" />
              <div>
                <h1 className="text-xl font-bold text-white">
                  Payment Confirmation
                </h1>
                <p className="text-sm text-gray-400">
                  Complete your booking payment
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">Booking ID</div>
              <div className="text-white font-mono">{orderId}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Car Details and Booking Summary */}
            <div className="space-y-6">
              {/* Car Details Card */}
              {carDetails && (
                <Card className="glass-dark border-white/20">
                  <CardHeader>
                    <CardTitle className="gradient-text text-xl flex items-center gap-2">
                      <Car className="w-5 h-5" />
                      Car Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Image Carousel */}
                    <div className="relative h-64 overflow-hidden rounded-lg">
                      {carDetails.images && carDetails.images.length > 0 ? (
                        <>
                          <Image
                            src={`${process.env.NEXT_PUBLIC_API_BASE_URL?.replace(
                              /\/api$/,
                              ""
                            )}/static/uploads/${
                              carDetails.images[currentImageIndex]
                            }`}
                            alt={`${carDetails.name} - Image ${
                              currentImageIndex + 1
                            }`}
                            fill
                            className="object-cover transition-all duration-500 animate-in fade-in-0 zoom-in-95"
                          />

                          {/* Navigation Arrows */}
                          {carDetails.images.length > 1 && (
                            <>
                              <button
                                onClick={prevImage}
                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
                              >
                                <ChevronLeft className="w-4 h-4" />
                              </button>
                              <button
                                onClick={nextImage}
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
                              >
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </>
                          )}

                          {/* Image Indicators */}
                          {carDetails.images.length > 1 && (
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                              {carDetails.images.map(
                                (_: any, index: number) => (
                                  <button
                                    key={index}
                                    onClick={() => setCurrentImageIndex(index)}
                                    className={`w-2 h-2 rounded-full transition-all ${
                                      index === currentImageIndex
                                        ? "bg-white"
                                        : "bg-white/50 hover:bg-white/75"
                                    }`}
                                  />
                                )
                              )}
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                          <Car className="w-12 h-12 text-gray-600" />
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-xl font-bold text-white">
                        {carDetails.name}
                      </h3>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-300">
                          <MapPin className="w-4 h-4 text-blue-400" />
                          <span>{carDetails.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <Users className="w-4 h-4 text-green-400" />
                          <span>{carDetails.seats} seats</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <Fuel className="w-4 h-4 text-orange-400" />
                          <span>{carDetails.fuel_type}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <span className="text-purple-400">Color:</span>
                          <span>{carDetails.vehicle_color}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Booking Details Card */}
              {paymentData?.booking && (
                <Card className="glass-dark border-white/20">
                  <CardHeader>
                    <CardTitle className="gradient-text text-xl flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Booking Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between text-gray-300">
                        <span>Start Time:</span>
                        <span>
                          {formatDate(paymentData.booking.start_time)}
                        </span>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span>End Time:</span>
                        <span>{formatDate(paymentData.booking.end_time)}</span>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span>Down Payment:</span>
                        <span>
                          {formatCurrency(paymentData.booking.down_payment)}
                        </span>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span>Due Amount:</span>
                        <span className="text-green-400 font-bold">
                          {formatCurrency(paymentData.booking.due_amount)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Payment Card */}
            <Card className="glass-dark border-white/20">
              <CardHeader className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center glow mb-4"
                >
                  <CreditCard className="w-8 h-8 text-white" />
                </motion.div>
                <CardTitle className="gradient-text text-2xl">
                  Secure Payment
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Price Breakdown */}
                {paymentData?.booking?.breakdown && (
                  <div className="space-y-3 p-4 bg-white/5 rounded-lg">
                    <h4 className="text-white font-semibold mb-3">
                      Price Breakdown
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-gray-300">
                        <span>Car Price Total:</span>
                        <span>
                          {formatCurrency(
                            paymentData.booking.breakdown.car_price_total
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span>Car Wash Charge:</span>
                        <span>
                          {formatCurrency(
                            paymentData.booking.breakdown.car_wash_charge
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span>Late Night Charge:</span>
                        <span>
                          {formatCurrency(
                            paymentData.booking.breakdown.late_night_charge
                          )}
                        </span>
                      </div>
                      <div className="border-t border-white/20 pt-2">
                        <div className="flex justify-between text-white font-bold text-lg">
                          <span>Total Amount:</span>
                          <span>
                            {formatCurrency(
                              paymentData.booking.breakdown.total_amount
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-300">
                    <Shield className="w-5 h-5 text-green-400" />
                    <span>256-bit SSL Encryption</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <Clock className="w-5 h-5 text-blue-400" />
                    <span>Instant Confirmation</span>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={termsAccepted}
                      onCheckedChange={(checked) =>
                        setTermsAccepted(checked as boolean)
                      }
                      className="border-white/30 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-300">
                      I agree to the{" "}
                      <Dialog>
                        <DialogTrigger asChild>
                          <button className="text-blue-400 hover:text-blue-300 underline">
                            Terms and Conditions
                          </button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-slate-900/95 glass-dark border-white/20">
                          <DialogHeader>
                            <DialogTitle className="text-xl font-bold gradient-text flex items-center gap-2">
                              <FileText className="w-5 h-5" />
                              Terms and Conditions
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 text-gray-300 text-sm leading-relaxed">
                            <h3 className="text-white font-semibold text-lg">
                              VEHICLE RENTAL AGREEMENT
                            </h3>
                            <p className="text-white">Hanuman Cars</p>
                            <p>
                              This Vehicle Rental Agreement (“Agreement”) is
                              entered into between Hanuman Cars (“Owner”) and
                              the undersigned customer (“Renter”) for the rental
                              of a vehicle on the following terms and
                              conditions:
                            </p>

                            <section>
                              <h4 className="text-white font-medium mb-2">
                                1. Booking and Cancellation
                              </h4>
                              <p>
                                Upon making a reservation, the Renter agrees
                                that 10% of the booking amount will be retained
                                as a cancellation fee in the event of
                                cancellation.
                              </p>
                            </section>

                            <section>
                              <h4 className="text-white font-medium mb-2">
                                2. Eligibility
                              </h4>
                              <p>
                                Vehicles are strictly rented to residents of
                                Telangana and Andhra Pradesh.
                              </p>
                              <p>
                                If a booking is made by customers from any other
                                state, the reservation amount will be retained,
                                and the remaining balance will be refunded.
                              </p>
                            </section>

                            <section>
                              <h4 className="text-white font-medium mb-2">
                                3. Security Deposit
                              </h4>
                              <p>
                                A refundable security deposit of ₹10,000 (Rupees
                                Ten Thousand only) is required at the time of
                                booking, or the Renter may deposit a two-wheeler
                                vehicle (model year 2017 or newer) as security.
                              </p>
                            </section>

                            <section>
                              <h4 className="text-white font-medium mb-2">
                                4. Vehicle Condition and Return
                              </h4>
                              <p>
                                Prior to taking possession, the Renter shall
                                inspect the vehicle, including its fuel level,
                                FASTag balance, and general condition.
                              </p>
                              <p>
                                The vehicle must be returned in the same
                                condition, with the same fuel level and FASTag
                                balance as when rented.
                              </p>
                            </section>

                            <section>
                              <h4 className="text-white font-medium mb-2">
                                5. Damage and Liability
                              </h4>
                              <p>
                                The Renter is fully responsible for any damage
                                caused to the vehicle during the rental period.
                              </p>
                              <p>
                                The security deposit will be refunded only after
                                the Owner verifies that the vehicle is returned
                                in proper condition.
                              </p>
                            </section>

                            <section>
                              <h4 className="text-white font-medium mb-2">
                                6. Traffic Violations
                              </h4>
                              <p>
                                The Renter is responsible for any traffic
                                challans, fines, or penalties incurred during
                                the rental period.
                              </p>
                            </section>

                            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs text-blue-300 space-y-2">
                              <p>
                                By checking the terms and conditions checkbox,
                                you acknowledge that you have read, understood,
                                and agree to be bound by this agreement.
                              </p>
                              {/* <div className="pt-2 space-y-1 text-gray-400">
                                <p>
                                  | Customer Name:
                                  _______________________________ |
                                </p>
                                <p>
                                  | Mobile Number:
                                  _______________________________ |
                                </p>
                                <p>| Date: _______________________________ |</p>
                                <p>
                                  Signature of Customer:
                                  ____________________________
                                </p>
                                <p>
                                  Authorized Representative (Hanuman Cars):
                                  ____________________________
                                </p>
                              </div> */}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </label>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-gray-400 mb-4">
                    Click the button below to proceed with secure payment
                  </p>
                  <Button
                    onClick={() => {
                      if (orderId) {
                        setIsPaying(true);
                        triggerRazorpay(
                          orderId,
                          handlePaymentSuccess,
                          handlePaymentError,
                          handleToast
                        );
                      }
                    }}
                    className="w-full h-12 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 glow"
                    disabled={isPaying || !termsAccepted}
                  >
                    {isPaying ? (
                      <Loader2 className="animate-spin w-5 h-5 mx-auto" />
                    ) : (
                      <>Pay Securely 🔒</>
                    )}
                  </Button>
                  {!termsAccepted && (
                    <p className="text-red-400 text-sm mt-2">
                      Please accept the terms and conditions to proceed
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <ProtectedRoute requiredRoles={["user", "admin", "owner"]}>
      <PaymentPageContent />
    </ProtectedRoute>
  );
}
