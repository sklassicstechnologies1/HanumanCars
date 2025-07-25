"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, Fuel, Calendar, Star, ChevronLeft, ChevronRight } from "lucide-react"
import { formatCurrency, getImageUrl } from "@/lib/utils"
import Image from "next/image"
import { useState, useEffect } from "react"

interface Car {
  name: string
  owner_name: string
  location: string
  seats: string
  fuel_type: string
  price_per_day: string
  vehicle_color: string
  images: string[]
}

interface CarCardProps {
  car: Car
  carId: number
  onBook: (carId: number) => void
}

export default function CarCard({ car, carId, onBook }: CarCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  // Auto-scroll carousel effect
  useEffect(() => {
    if (car.images && car.images.length > 1 && !isHovered) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => 
          prev === car.images.length - 1 ? 0 : prev + 1
        )
      }, 4000) // Change image every 4 seconds

      return () => clearInterval(interval)
    }
  }, [car.images, isHovered])

  const nextImage = () => {
    if (car.images) {
      console.log('nextImage called, current:', currentImageIndex, 'total:', car.images.length)
      setCurrentImageIndex((prev) => {
        const newIndex = prev === car.images.length - 1 ? 0 : prev + 1
        console.log('Setting new index to:', newIndex)
        return newIndex
      })
    }
  }

  const prevImage = () => {
    if (car.images) {
      console.log('prevImage called, current:', currentImageIndex, 'total:', car.images.length)
      setCurrentImageIndex((prev) => {
        const newIndex = prev === 0 ? car.images.length - 1 : prev - 1
        console.log('Setting new index to:', newIndex)
        return newIndex
      })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className="car-card glass-dark border-white/20 overflow-hidden h-full">
        <div className="relative h-48 overflow-hidden">
          {/* Image Carousel */}
          {car.images && car.images.length > 0 ? (
            <>
              <Image
                src={
                  car.images[currentImageIndex]
                    ? `${process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/api$/, "")}/static/uploads/${car.images[currentImageIndex]}`
                    : "/placeholder.svg?height=200&width=300"
                }
                alt={`${car.name} - Image ${currentImageIndex + 1}`}
                fill
                className="object-cover transition-all duration-700 ease-in-out"
              />
              
              {/* Navigation Arrows */}
              {car.images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      console.log('Prev clicked, current index:', currentImageIndex)
                      prevImage()
                    }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all hover:scale-110 z-10"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      console.log('Next clicked, current index:', currentImageIndex)
                      nextImage()
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all hover:scale-110 z-10"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
              
              {/* Image Indicators */}
              {car.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {car.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation()
                        setCurrentImageIndex(index)
                      }}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentImageIndex 
                          ? 'bg-white scale-125' 
                          : 'bg-white/50 hover:bg-white/75'
                      }`}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              <Calendar className="w-12 h-12 text-gray-600" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Floating badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            <Badge className="bg-blue-500/80 backdrop-blur-sm text-white border-0">Premium</Badge>
            <Badge className="bg-green-500/80 backdrop-blur-sm text-white border-0">Available</Badge>
          </div>

          {/* Rating */}
          <div className="absolute top-4 right-4 flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
            <Star className="w-3 h-3 text-yellow-400 fill-current" />
            <span className="text-white text-xs font-medium">4.8</span>
          </div>

          {/* Price overlay */}
          <div className="absolute bottom-4 right-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full px-3 py-1 glow">
            <span className="text-white font-bold text-lg">
              {formatCurrency(Number.parseInt(car.price_per_day))}/day
            </span>
          </div>

          {/* Image counter */}
          {car.images && car.images.length > 1 && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
              <span className="text-white text-xs font-medium">
                {currentImageIndex + 1} / {car.images.length}
              </span>
            </div>
          )}
        </div>

        <CardContent className="p-6 space-y-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">{car.name}</h3>
            <p className="text-gray-400 text-sm">by {car.owner_name}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-gray-300">
              <MapPin className="w-4 h-4 text-blue-400" />
              <span>{car.location}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <Users className="w-4 h-4 text-green-400" />
              <span>{car.seats} seats</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <Fuel className="w-4 h-4 text-orange-400" />
              <span>{car.fuel_type}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <Calendar className="w-4 h-4 text-purple-400" />
              <span>{car.vehicle_color}</span>
            </div>
          </div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={() => onBook(carId)}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold glow group"
            >
              <span className="group-hover:scale-110 transition-transform">Book Now </span>
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
