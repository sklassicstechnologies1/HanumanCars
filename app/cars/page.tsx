"use client"

import { useEffect, useState, useMemo, useRef } from "react"
import { motion } from "framer-motion"
import { useAuthStore } from "@/store/auth"
import { useBookingStore } from "@/store/booking"
import { carAPI } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import CarCard from "@/components/cars/car-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Search, 
  MapPin, 
  Car, 
  ChevronDown,
  X,
  SlidersHorizontal,
  ArrowLeft
} from "lucide-react"
import { useRouter } from "next/navigation"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import ProtectedRoute from "@/components/auth/protected-route"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"


interface FilterState {
  searchTerm: string
  location: string
  fuelType: string
  seats: string
  vehicleColor: string
  priceRange: [number, number]
  minSeats: string
  maxSeats: string
}

// Custom Dropdown Component to avoid Select issues
function CustomDropdown({ 
  options, 
  value, 
  onChange, 
  placeholder, 
  className = "",
  icon = null 
}: {
  options: string[]
  value: string
  onChange: (value: string) => void
  placeholder: string
  className?: string
  icon?: React.ReactNode
}) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg text-white hover:bg-white/20 transition-colors"
      >
        <div className="flex items-center">
          {icon && <span className="mr-2">{icon}</span>}
          <span className={value ? "text-white" : "text-gray-400"}>
            {value || placeholder}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-slate-800 border border-white/20 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          <div
            className="px-3 py-2 text-gray-400 hover:bg-white/10 cursor-pointer"
            onClick={() => {
              onChange("")
              setIsOpen(false)
            }}
          >
            All
          </div>
          {options.map((option) => (
            <div
              key={option}
              className="px-3 py-2 text-white hover:bg-white/10 cursor-pointer"
              onClick={() => {
                onChange(option)
                setIsOpen(false)
              }}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function CarsPageContent() {
  const { user, logout } = useAuthStore()
  const { cars, setCars, setLoading, isLoading } = useBookingStore()
  const { toast } = useToast()
  const router = useRouter()
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: "",
    location: "",
    fuelType: "",
    seats: "",
    vehicleColor: "",
    priceRange: [0, 10000],
    minSeats: "",
    maxSeats: ""
  })

  // Memoized filter options
  const filterOptions = useMemo(() => {
    const locations = [...new Set(cars.map(car => car.location))].filter(Boolean)
    const fuelTypes = [...new Set(cars.map(car => car.fuel_type))].filter(Boolean)
    const vehicleColors = [...new Set(cars.map(car => car.vehicle_color))].filter(Boolean)
    const seatOptions = [...new Set(cars.map(car => car.seats))].filter(Boolean).sort((a, b) => parseInt(a) - parseInt(b))
    
    return {
      locations,
      fuelTypes,
      vehicleColors,
      seatOptions
    }
  }, [cars])

  // Memoized filtered cars
  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      const matchesSearch = car.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                           car.owner_name.toLowerCase().includes(filters.searchTerm.toLowerCase())
      
      const matchesLocation = !filters.location || car.location.toLowerCase().includes(filters.location.toLowerCase())
      
      const matchesFuelType = !filters.fuelType || car.fuel_type === filters.fuelType
      
      const matchesSeats = !filters.seats || car.seats === filters.seats
      
      const matchesColor = !filters.vehicleColor || car.vehicle_color.toLowerCase().includes(filters.vehicleColor.toLowerCase())
      
      const matchesPrice = parseInt(car.price_per_day) >= filters.priceRange[0] && 
                          parseInt(car.price_per_day) <= filters.priceRange[1]
      
      const matchesMinSeats = !filters.minSeats || parseInt(car.seats) >= parseInt(filters.minSeats)
      
      const matchesMaxSeats = !filters.maxSeats || parseInt(car.seats) <= parseInt(filters.maxSeats)

      return matchesSearch && matchesLocation && matchesFuelType && matchesSeats && 
             matchesColor && matchesPrice && matchesMinSeats && matchesMaxSeats
    })
  }, [cars, filters])

  // Memoized active filters count
  const activeFiltersCount = useMemo(() => {
    return Object.values(filters).filter(value => 
      value !== "" && value !== 0 && (Array.isArray(value) ? value[0] !== 0 : true)
    ).length
  }, [filters])

  useEffect(() => {
    fetchCars()
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

  const clearFilters = () => {
    setFilters({
      searchTerm: "",
      location: "",
      fuelType: "",
      seats: "",
      vehicleColor: "",
      priceRange: [0, 10000],
      minSeats: "",
      maxSeats: ""
    })
  }

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

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
            <Button 
              onClick={() => router.back()}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10"
            >
              <div className="flex items-center justify-between">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </div>
            </Button>
            <div>
            <span
              className="text-2xl font-bold bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 bg-clip-text text-transparent cursor-pointer"
              style={{
                fontFamily: '"Pacifico", cursive',
                fontWeight: 700,
                textShadow: '0 0 20px rgba(255, 136, 0, 0.3)',
              }}
            >
              HanumanCars
            </span>
            </div>
          </div>
          {user?.role &&
          <div className="flex items-center gap-4">
            <Button onClick={() => router.push("/dashboard")} variant="glass" className="hidden md:flex">
              Dashboard
            </Button>
            <Button onClick={() => router.push("/bookings")} variant="glass" className="hidden md:flex">
              My Bookings
            </Button>
            {/* <Button onClick={handleLogout} variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10">
              Logout
            </Button> */}
            {/* Desktop logout button */}
<Button 
  onClick={handleLogout} 
  variant="outline" 
  className="hidden md:inline-flex border-red-500/50 text-red-400 hover:bg-red-500/10"
>
  Logout
</Button>

{/* Mobile dropdown logout button */}
<DropdownMenu>
  <DropdownMenuTrigger asChild className="md:hidden">
    <Button variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10">
      Logout
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent className="bg-slate-800 text-white border border-white/20">
    <DropdownMenuItem onClick={handleLogout}>
      Confirm Logout
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>

          </div>}
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative py-16 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-6xl font-bold gradient-text mb-4"
          >
            Find Your Perfect Ride
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
          >
            Explore our premium fleet of vehicles with advanced filtering options
          </motion.p>
        </div>
      </motion.section>

      {/* Search and Filters */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="container mx-auto px-4 mb-8"
      >
        <div className="glass-dark rounded-2xl p-6 border border-white/20 mt-4">
          {/* Main Search Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search cars"
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                className="pl-10 glass border-white/30"
              />
            </div>
            
            <div className="flex-1">
              <CustomDropdown
                options={filterOptions.locations}
                value={filters.location}
                onChange={(value) => handleFilterChange('location', value)}
                placeholder="All Locations"
                icon={<MapPin className="w-4 h-4 text-gray-400" />}
              />
            </div>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  <div className="flex items-center justify-between">
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    Filters
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="ml-2 bg-blue-500 text-white">
                      {activeFiltersCount}
                    </Badge>
                  )}
                  </div>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="glass-dark border-white/20">
                <SheetHeader>
                  <SheetTitle className="text-white">Advanced Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  {/* Fuel Type */}
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Fuel Type</label>
                    <CustomDropdown
                      options={filterOptions.fuelTypes}
                      value={filters.fuelType}
                      onChange={(value) => handleFilterChange('fuelType', value)}
                      placeholder="All Fuel Types"
                    />
                  </div>

                  {/* Seats */}
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Number of Seats</label>
                    <CustomDropdown
                      options={filterOptions.seatOptions}
                      value={filters.seats}
                      onChange={(value) => handleFilterChange('seats', value)}
                      placeholder="All Seats"
                    />
                  </div>

                  {/* Vehicle Color */}
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Vehicle Color</label>
                    <CustomDropdown
                      options={filterOptions.vehicleColors}
                      value={filters.vehicleColor}
                      onChange={(value) => handleFilterChange('vehicleColor', value)}
                      placeholder="All Colors"
                    />
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Price Range (₹/day)</label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        value={filters.priceRange[0]}
                        onChange={(e) => handleFilterChange('priceRange', [parseInt(e.target.value) || 0, filters.priceRange[1]])}
                        className="glass border-white/30 text-white"
                      />
                      <Input
                        type="number"
                        placeholder="Max"
                        value={filters.priceRange[1]}
                        onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value) || 10000])}
                        className="glass border-white/30 text-white"
                      />
                    </div>
                  </div>

                  {/* Seat Range */}
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Seat Range</label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="number"
                        placeholder="Min Seats"
                        value={filters.minSeats}
                        onChange={(e) => handleFilterChange('minSeats', e.target.value)}
                        className="glass border-white/30 text-white"
                      />
                      <Input
                        type="number"
                        placeholder="Max Seats"
                        value={filters.maxSeats}
                        onChange={(e) => handleFilterChange('maxSeats', e.target.value)}
                        className="glass border-white/30 text-white"
                      />
                    </div>
                  </div>

                  {/* Clear Filters */}
                  <Button 
                    onClick={clearFilters}
                    variant="outline"
                    className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10"
                  >
                    <div className="flex items-center justify-between">
                      <X className="w-4 h-4 mr-2" />
                      Clear All Filters
                    </div>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Active Filters Display */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2">
              {filters.searchTerm && (
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  Search: {filters.searchTerm}
                  <X 
                    className="w-3 h-3 ml-1 cursor-pointer" 
                    onClick={() => handleFilterChange('searchTerm', '')}
                  />
                </Badge>
              )}
              {filters.location && (
                <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                  Location: {filters.location}
                  <X 
                    className="w-3 h-3 ml-1 cursor-pointer" 
                    onClick={() => handleFilterChange('location', '')}
                  />
                </Badge>
              )}
              {filters.fuelType && (
                <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                  Fuel: {filters.fuelType}
                  <X 
                    className="w-3 h-3 ml-1 cursor-pointer" 
                    onClick={() => handleFilterChange('fuelType', '')}
                  />
                </Badge>
              )}
              {filters.seats && (
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                  Seats: {filters.seats}
                  <X 
                    className="w-3 h-3 ml-1 cursor-pointer" 
                    onClick={() => handleFilterChange('seats', '')}
                  />
                </Badge>
              )}
              {filters.vehicleColor && (
                <Badge variant="secondary" className="bg-pink-500/20 text-pink-400 border-pink-500/30">
                  Color: {filters.vehicleColor}
                  <X 
                    className="w-3 h-3 ml-1 cursor-pointer" 
                    onClick={() => handleFilterChange('vehicleColor', '')}
                  />
                </Badge>
              )}
            </div>
          )}
        </div>
      </motion.section>

      {/* Results Count */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="container mx-auto px-4 mb-6"
      >
        <div className="flex items-center justify-between">
          <p className="text-gray-300">
            Showing <span className="text-white font-semibold">{filteredCars.length}</span> of{" "}
            <span className="text-white font-semibold">{cars.length}</span> cars
          </p>
          {activeFiltersCount > 0 && (
            <Button 
              onClick={clearFilters}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
            >
              <span className="flex items-center">
              <X className="w-4 h-4 mr-1" />
              Clear Filters
              </span>
            </Button>
          )}
        </div>
      </motion.div>

      {/* Cars Grid */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="container mx-auto px-4 pb-20"
      >
        {filteredCars.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCars.map((car, index) => (
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
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="text-center py-20"
          >
            <Car className="w-16 h-16 mx-auto mb-4 text-gray-400 opacity-50" />
            <h3 className="text-2xl font-bold text-white mb-2">No cars found</h3>
            <p className="text-gray-400 mb-6">
              {activeFiltersCount > 0 
                ? "Try adjusting your filters to see more results." 
                : "No cars are available at the moment."
              }
            </p>
            {activeFiltersCount > 0 && (
              <Button onClick={clearFilters} variant="outline" className="border-white/30 text-white hover:bg-white/10">
                Clear All Filters
              </Button>
            )}
          </motion.div>
        )}
      </motion.section>
    </div>
  )
}

export default CarsPageContent