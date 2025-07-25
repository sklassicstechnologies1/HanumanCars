"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useAuthStore } from "@/store/auth"
import { useBookingStore } from "@/store/booking"
import { carAPI } from "@/lib/api"
import api from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import CarCard from "@/components/cars/car-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, MapPin, Sparkles, Calendar, Clock, Car, CreditCard, FileText, TrendingUp, Plus, Eye } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { userAPI } from "@/lib/endpoints"
import ProtectedRoute from "@/components/auth/protected-route"

function isCarUnavailable(car: any) {
  return false // <-- Replace with your actual logic
}

function DashboardContent() {
  const { user, logout } = useAuthStore()
  const { cars, setCars, setLoading, isLoading } = useBookingStore()
  const { toast } = useToast()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [locationFilter, setLocationFilter] = useState("")
  const [userBookings, setUserBookings] = useState<any[]>([])
  const [userLoading, setUserLoading] = useState(true)
  const searchParams = useSearchParams()

  useEffect(() => {
    const paymentStatus = searchParams.get("payment")
    if (paymentStatus) {
      paymentStatus === "success" ? toast({ title: "Payment Success" }) : toast({ title: "Payment Failed" })
    }
    fetchCars()
    fetchUserDashboard()
  }, [])

  const fetchCars = async () => {
    setLoading(true)
    try {
      const response = await carAPI.getLiveCars()
      setCars(response.data.cars || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch cars",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchUserDashboard = async () => {
    setUserLoading(true)
    try {
      const response = await api.get("/user_dashboard")
      setUserBookings(response.data.bookings || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch user dashboard",
        variant: "destructive",
      })
    } finally {
      setUserLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    localStorage.removeItem("token")
    toast({
      title: "Logged Out",
      description: "You have been logged out",
    })
    router.push("/")
  }

  const handleBookCar = (carId: number) => {
    router.push(`/car/${carId}`)
  }

  const filteredCars = cars.filter(
    (car) =>
      car.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (locationFilter === "" || car.location.toLowerCase().includes(locationFilter.toLowerCase())),
  )

  const availableCars = cars.filter((car) => !isCarUnavailable(car))

  // Calculate user stats
  const totalBookings = userBookings.length
  const activeBookings = userBookings.filter(b => b.status === 'approved').length
  const pendingBookings = userBookings.filter(b => b.status === 'pending_approval').length
  const totalSpent = userBookings.reduce((sum, b) => sum + (b.breakdown?.total_amount || 0), 0)

  // Get recent bookings (last 5)
  const recentBookings = userBookings.slice(0, 5)

  // Get upcoming bookings
  const upcomingBookings = userBookings.filter(b => 
    b.status === 'approved' && new Date(b.start_time) > new Date()
  ).slice(0, 3)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-dark border-b border-white/10 sticky top-0 z-50 backdrop-blur-xl"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <span
                className="text-3xl font-bold"
                style={{
                  fontFamily: '"Pacifico", cursive',
                  fontWeight: 400,
                  fontStyle: "normal",
                  color: "rgb(255, 136, 0)",
                }}
              >
                HanumanCars
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button onClick={() => router.push("/home")} variant="glass" className="hidden md:flex">
              Home
            </Button>
            <Button onClick={() => router.push("/cars")} variant="glass" className="hidden md:flex">
              Cars
            </Button>
            <Button onClick={() => router.push("/bookings")} variant="glass" className="hidden md:flex">
              My Bookings
            </Button>
            <Button onClick={handleLogout} variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10">
              Logout
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative py-20 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
        <div className="absolute inset-0 opacity-50">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/5 rounded-full blur-xl"></div>
          <div className="absolute top-20 right-20 w-16 h-16 bg-white/5 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 left-20 w-12 h-12 bg-white/5 rounded-full blur-xl"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-300">Welcome back, {user?.name || user?.email || 'Valued Customer'}!</span>
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-5xl md:text-7xl font-bold gradient-text mb-6"
          >
            Your Journey
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
              Starts Here
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Discover the perfect ride for your next adventure. From city commutes to road trips, 
            we've got you covered with our premium fleet of vehicles.
          </motion.p>

          {/* Quick Stats in Hero */}
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8"
          >
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white mb-1">{totalBookings}</div>
              <div className="text-xs text-gray-400">Total Rentals</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-green-400 mb-1">{activeBookings}</div>
              <div className="text-xs text-gray-400">Active Now</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-yellow-400 mb-1">{pendingBookings}</div>
              <div className="text-xs text-gray-400">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-purple-400 mb-1">₹{totalSpent.toLocaleString()}</div>
              <div className="text-xs text-gray-400">Total Spent</div>
            </div>
          </motion.div> */}

          {/* Call to Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button 
              onClick={() => router.push("/home")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="flex items-center justify-between">
                <Car className="w-5 h-5 mr-2" />
                Book Your Next Ride
              </div>
            </Button>
            <Button 
              onClick={() => router.push("/bookings")}
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 px-8 py-3 text-lg font-semibold rounded-xl backdrop-blur-sm"
            >
              <div className="flex items-center justify-between"> 
                <FileText className="w-5 h-5 mr-2" />
                View My Bookings
              </div>
            </Button>
          </motion.div>

          {/* Floating Elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
            className="absolute top-10 left-10 hidden lg:block"
          >
            <div className="w-20 h-20 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute top-20 right-20 hidden lg:block"
          >
            <div className="w-16 h-16 bg-purple-500/20 rounded-full blur-xl animate-pulse"></div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="absolute bottom-10 left-20 hidden lg:block"
          >
            <div className="w-12 h-12 bg-orange-500/20 rounded-full blur-xl animate-pulse"></div>
          </motion.div>
        </div>
      </motion.section>

      {/* Quick Stats */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="container mx-auto px-4 mb-12 mt-6"
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-dark rounded-2xl p-6 border border-white/10"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Bookings</p>
                <p className="text-3xl font-bold text-white">{totalBookings}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="glass-dark rounded-2xl p-6 border border-white/10"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Rentals</p>
                <p className="text-3xl font-bold text-white">{activeBookings}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <Car className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="glass-dark rounded-2xl p-6 border border-white/10"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Pending</p>
                <p className="text-3xl font-bold text-white">{pendingBookings}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="glass-dark rounded-2xl p-6 border border-white/10"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Spent</p>
                <p className="text-3xl font-bold text-white">₹{totalSpent.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Main Dashboard Content */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="container mx-auto px-4 mb-12"
      >
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Quick Actions & Upcoming Bookings */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 }}
              className="glass-dark rounded-2xl p-6 border border-white/10"
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Button 
                  onClick={() => router.push("/home")}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <div className="flex items-center justify-between">
                    <Car className="w-4 h-4 mr-2" />
                    Book a Car
                  </div>
                </Button>
                <Button 
                  onClick={() => router.push("/cars")}
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white/10"
                >
                  <div className="flex items-center justify-between">
                    <Car className="w-4 h-4 mr-2" />
                    Browse All Cars
                  </div>
                </Button>
                <Button 
                  onClick={() => router.push("/bookings")}
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white/10"
                >
                  <div className="flex items-center justify-between">
                    <FileText className="w-4 h-4 mr-2" />
                    View All Bookings
                  </div>
                </Button>
                {/* <Button 
                  onClick={() => router.push("/profile")}
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white/10"
                >
                  <div className="flex items-center justify-between">
                    <Eye className="w-4 h-4 mr-2" />
                    My Profile
                  </div>
                </Button> */}
              </div>
            </motion.div>

            {/* Upcoming Bookings */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 }}
              className="glass-dark rounded-2xl p-6 border border-white/10"
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Upcoming Rentals
              </h3>
              {upcomingBookings.length > 0 ? (
                <div className="space-y-3">
                  {upcomingBookings.map((booking) => (
                    <div key={booking.id} className="p-3 bg-white/5 rounded-lg border border-white/10 cursor-pointer" onClick={() => router.push(`/booking/${booking.id}`)}>
                      <div className="text-sm font-medium text-white">Booking #{booking.id}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {new Date(booking.start_time).toLocaleDateString()} - {new Date(booking.end_time).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-green-400 mt-1">₹{booking.breakdown?.total_amount}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-400 py-4">
                  <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No upcoming rentals</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Column - Recent Activity & Available Cars */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 }}
              className="glass-dark rounded-2xl p-6 border border-white/10"
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Recent Activity
              </h3>
              {recentBookings.length > 0 ? (
                <div className="space-y-3">
                  {recentBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          booking.status === 'approved' ? 'bg-green-500' :
                          booking.status === 'pending_approval' ? 'bg-yellow-500' :
                          booking.status === 'doc_upload_required' ? 'bg-blue-500' :
                          'bg-gray-500'
                        }`} />
                        <div>
                          <div className="text-sm font-medium text-white">Booking #{booking.id}</div>
                          <div className="text-xs text-gray-400">
                            {new Date(booking.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xs px-2 py-1 rounded-full ${
                          booking.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                          booking.status === 'pending_approval' ? 'bg-yellow-500/20 text-yellow-400' :
                          booking.status === 'doc_upload_required' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {booking.status.replace(/_/g, ' ')}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">₹{booking.breakdown?.total_amount}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-400 py-4">
                  <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No recent activity</p>
                </div>
              )}
            </motion.div>

            {/* Available Cars Preview */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 }}
              className="glass-dark rounded-2xl p-6 border border-white/10"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Car className="w-5 h-5" />
                  Available Cars
                </h3>
                <Button 
                  onClick={() => router.push("/cars")}
                  variant="outline"
                  size="sm"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  View All
                </Button>
              </div>
              
              {/* Search and Filters */}
              {/* <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search cars..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 glass border-white/30"
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Filter by location..."
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="pl-10 glass border-white/30"
                  />
                </div>
              </div> */}

              {availableCars.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {availableCars.slice(0, 4).map((car, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <CarCard car={car} carId={index} onBook={handleBookCar} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-400 py-8">
                  <Car className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No cars available at the moment.</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  )
}

export default function Dashboard() {
  return (
    <ProtectedRoute requiredRoles={["user"]}>
      <DashboardContent />
    </ProtectedRoute>
  )
}
