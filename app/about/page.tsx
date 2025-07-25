"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const teamMembers = [
  {
    name: "Mike Hardson",
    role: "Manager",
    image: "/team1.jpg",
    socials: ["facebook", "twitter", "linkedin", "youtube"],
  },
  {
    name: "Aleesha Brown",
    role: "Manager",
    image: "/team2.jpg",
    socials: ["facebook", "twitter", "linkedin", "youtube"],
  },
  {
    name: "David Jhonson",
    role: "Manager",
    image: "/team3.jpg",
    socials: ["facebook", "twitter", "linkedin", "youtube"],
  },
];

const socialIcons: Record<string, JSX.Element> = {
  facebook: <span title="Facebook" aria-label="Facebook">🌐</span>,
  twitter: <span title="Twitter" aria-label="Twitter">🐦</span>,
  linkedin: <span title="LinkedIn" aria-label="LinkedIn">💼</span>,
  youtube: <span title="YouTube" aria-label="YouTube">▶️</span>,
};

const AboutUs: React.FC = () => {
  const [counts, setCounts] = useState({
    rentouts: 0,
    centers: 0,
    customers: 0,
  });
  const router = useRouter();

  useEffect(() => {
    const animateCount = (target: number, key: keyof typeof counts) => {
      let count = 0;
      const step = Math.ceil(target / 50);
      const interval = setInterval(() => {
        count += step;
        setCounts((prev) => ({ ...prev, [key]: count > target ? target : count }));
        if (count >= target) {
          setCounts((prev) => ({ ...prev, [key]: target }));
          clearInterval(interval);
        }
      }, 50);
    };
    animateCount(500, "rentouts");
    animateCount(200, "centers");
    animateCount(500, "customers");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-dark border-b border-white/10 sticky top-0 z-50 backdrop-blur-xl"
      >
        {/* <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button onClick={() => router.back()} variant="ghost" size="icon" className="text-white hover:bg-white/10">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span
                className="text-2xl font-bold bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 bg-clip-text text-transparent"
                style={{
                  fontFamily: '"Poppins", sans-serif',
                  fontWeight: 700,
                  textShadow: '0 0 20px rgba(255, 136, 0, 0.3)',
                }}
              >
                HanumanCars
              </span>
            </div>
          </div> */}
          {/* <div className="container mx-auto px-4 py-2 flex items-center justify-between"> */}
          <div className="container mx-auto px-4 py-2 md:py-4 flex items-center justify-between">
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
          <div className="ml-auto">
            <h1 className="text-xl font-bold text-white">About Us</h1>
            <p className="text-gray-400 text-sm">Learn more about our company</p>
          </div>
        </div>
      </motion.header>

      {/* About Company Section */}
      <section className="py-20 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="inline-block mb-6"
            >
              <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto glow">
                <span className="text-white text-3xl">🏢</span>
              </div>
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-bold gradient-text mb-6">About HanumanCars</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Your trusted partner for comfortable and reliable car rentals. We're committed to providing 
              exceptional service and premium vehicles for all your transportation needs.
            </p>
          </motion.div>

          <div className="max-w-screen-xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            {/* Enhanced Image Section */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative">
                {/* Main Image */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  className="relative z-10"
                >
                  <Image
                    src="/carseat.jpg"
                    alt="Professional Businessman"
                    width={500}
                    height={400}
                    className="w-full rounded-2xl object-cover shadow-2xl"
                  />
                  {/* Image Glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-2xl blur-xl -z-10"></div>
                </motion.div>

                {/* Overlapping Image */}
                <motion.div
                  initial={{ opacity: 0, x: 50, y: 50 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  whileHover={{ scale: 1.05 }}
                  className="absolute -bottom-8 -right-8 z-20"
                >
                  <Image
                    src="/interior1.jpg"
                    alt="Happy Customer"
                    width={300}
                    height={250}
                    className="w-64 h-48 rounded-xl object-cover shadow-2xl border-4 border-white/20"
                  />
                  {/* Floating Badge */}
                  <div className="absolute -top-4 -left-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full p-3 shadow-lg">
                    <span className="text-white text-xl">⭐</span>
                  </div>
                </motion.div>

                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute top-10 -left-5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full p-3 shadow-lg"
                >
                  <span className="text-white text-xl">🚗</span>
                </motion.div>
                
                <motion.div
                  animate={{ y: [10, -10, 10] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                  className="absolute bottom-20 -right-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-3 shadow-lg"
                >
                  <span className="text-white text-xl">💎</span>
                </motion.div>
              </div>
            </motion.div>

            {/* Enhanced Content Section */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              {/* Main Content */}
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full px-4 py-2 mb-4">
                    <span className="text-orange-400 text-sm">🏆</span>
                    <span className="text-orange-400 text-sm font-semibold uppercase tracking-wide">Premium Service</span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold gradient-text mb-4">Get to Know About HanumanCars</h3>
                  <p className="text-lg font-semibold text-white leading-relaxed">
                    Your Trusted Partner for Comfortable and Reliable Car Rentals.
                  </p>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="text-base text-gray-300 leading-relaxed"
                >
                  At HanumanCars, we offer top quality rental services with a fleet of well maintained vehicles. 
                  Our goal is to provide you with a hassle free and enjoyable driving experience that exceeds 
                  your expectations every time.
                </motion.p>
              </div>

              {/* Enhanced Features List */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="space-y-4"
              >
                <h4 className="text-xl font-semibold text-white mb-4">Why Choose HanumanCars?</h4>
                <div className="grid gap-4">
                  {[
                    { icon: "🚗", text: "Wide range of luxury and budget friendly cars", color: "orange" },
                    { icon: "⚡", text: "Flexible rental plans tailored to your needs", color: "blue" },
                    { icon: "🎯", text: "Easy online booking and hassle free process", color: "green" },
                    { icon: "🛡️", text: "24/7 customer support for a seamless experience", color: "purple" }
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      whileHover={{ x: 10 }}
                      className="flex items-center gap-4 group"
                    >
                      <div className={`w-12 h-12 bg-gradient-to-r ${
                        feature.color === 'orange' ? 'from-orange-500 to-red-500' :
                        feature.color === 'blue' ? 'from-blue-500 to-cyan-500' :
                        feature.color === 'green' ? 'from-green-500 to-emerald-500' :
                        'from-purple-500 to-pink-500'
                      } rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <span className="text-white text-xl">{feature.icon}</span>
                      </div>
                      <span className="text-gray-200 font-medium group-hover:text-white transition-colors duration-300">
                        {feature.text}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Stats Preview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
                className="grid grid-cols-3 gap-4 pt-6"
              >
                {[
                  { number: "5+", label: "Years Experience", color: "orange" },
                  { number: "99%", label: "Customer Satisfaction", color: "green" },
                  { number: "24/7", label: "Support Available", color: "blue" }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className={`text-2xl font-bold ${
                      stat.color === 'orange' ? 'text-orange-400' :
                      stat.color === 'green' ? 'text-green-400' :
                      'text-blue-400'
                    }`}>
                      {stat.number}
                    </div>
                    <div className="text-gray-400 text-sm">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 1 }}
                className="pt-6"
              >
                <Button
                  onClick={() => router.push("/login")}
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 text-lg font-bold glow"
                >
                  <span className="flex items-center gap-2">
                    Explore Our Services
                    <span className="text-xl">🚀</span>
                  </span>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600/20 to-purple-600/20 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="inline-block mb-6"
            >
              <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto glow">
                <span className="text-white text-3xl">📊</span>
              </div>
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-bold gradient-text mb-6">Our Success Numbers</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Join thousands of satisfied customers who trust HanumanCars for their transportation needs.
              Our commitment to excellence is reflected in these impressive statistics.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Stat 1 - Cars Rentouts */}
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -10, scale: 1.05 }}
              className="group"
            >
              <div className="relative">
                {/* Main Card */}
                <div className="glass-dark border border-orange-500/30 rounded-2xl p-8 text-center hover:border-orange-500/60 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-orange-500/20">
                  {/* Background Glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-red-500/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>

                  {/* Icon */}
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="relative z-10 w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300"
                  >
                    <span className="text-white text-3xl">🚗</span>
                  </motion.div>

                  {/* Number */}
                  <div className="relative z-10">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                      className="text-5xl md:text-6xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors duration-300"
                    >
                      {counts.rentouts.toLocaleString()}+
                    </motion.div>
                    <h3 className="text-xl font-semibold text-orange-400 mb-2">Cars Rented</h3>
                    <p className="text-gray-400 text-sm">Successfully delivered to customers</p>
                  </div>
                </div>

                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 rounded-full opacity-60"
                ></motion.div>
                <motion.div
                  animate={{ y: [5, -5, 5] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                  className="absolute -bottom-2 -left-2 w-4 h-4 bg-red-500 rounded-full opacity-60"
                ></motion.div>
              </div>
            </motion.div>

            {/* Stat 2 - Cities */}
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -10, scale: 1.05 }}
              className="group"
            >
              <div className="relative">
                <div className="glass-dark border border-blue-500/30 rounded-2xl p-8 text-center hover:border-blue-500/60 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-blue-500/20">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>

                  <motion.div
                    animate={{ rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="relative z-10 w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300"
                  >
                    <span className="text-white text-3xl">🏢</span>
                  </motion.div>

                  <div className="relative z-10">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                      className="text-5xl md:text-6xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors duration-300"
                    >
                      {counts.centers}+
                    </motion.div>
                    <h3 className="text-xl font-semibold text-blue-400 mb-2">Cities Covered</h3>
                    <p className="text-gray-400 text-sm">Nationwide presence</p>
                  </div>
                </div>

                <motion.div
                  animate={{ y: [5, -5, 5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-2 -left-2 w-5 h-5 bg-blue-500 rounded-full opacity-60"
                ></motion.div>
                <motion.div
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                  className="absolute -bottom-2 -right-2 w-3 h-3 bg-cyan-500 rounded-full opacity-60"
                ></motion.div>
              </div>
            </motion.div>

            {/* Stat 3 - Happy Customers */}
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -10, scale: 1.05 }}
              className="group"
            >
              <div className="relative">
                <div className="glass-dark border border-green-500/30 rounded-2xl p-8 text-center hover:border-green-500/60 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-green-500/20">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>

                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="relative z-10 w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300"
                  >
                    <span className="text-white text-3xl">😊</span>
                  </motion.div>

                  <div className="relative z-10">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                      className="text-5xl md:text-6xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors duration-300"
                    >
                      {counts.customers.toLocaleString()}+
                    </motion.div>
                    <h3 className="text-xl font-semibold text-green-400 mb-2">Happy Customers</h3>
                    <p className="text-gray-400 text-sm">Satisfied with our service</p>
                  </div>
                </div>

                <motion.div
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full opacity-60"
                ></motion.div>
                <motion.div
                  animate={{ y: [5, -5, 5] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                  className="absolute -bottom-2 -left-2 w-6 h-6 bg-emerald-500 rounded-full opacity-60"
                ></motion.div>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* Promo Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">Special Offers & Features</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover our premium car rental services with exclusive benefits
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* 3D Car Display */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative w-full h-96 flex items-center justify-center">
                {/* 3D Car Container */}
                <div className="relative transform rotate-y-12 perspective-1000">
                  <div className="relative transform hover:scale-110 transition-transform duration-500">
                    <Image
                      src="/car.png"
                      alt="Premium Car"
                      width={600}
                      height={400}
                      className="w-full max-w-md object-contain drop-shadow-2xl"
                    />
                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full blur-3xl -z-10"></div>
                  </div>
                </div>

                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute top-10 left-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full p-3 shadow-lg"
                >
                  <span className="text-white text-2xl">🚗</span>
                </motion.div>

                <motion.div
                  animate={{ y: [10, -10, 10] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                  className="absolute bottom-10 right-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-3 shadow-lg"
                >
                  <span className="text-white text-2xl">⭐</span>
                </motion.div>

                <motion.div
                  animate={{ y: [-5, 15, -5] }}
                  transition={{ duration: 3.5, repeat: Infinity, delay: 2 }}
                  className="absolute top-1/2 -left-5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full p-3 shadow-lg"
                >
                  <span className="text-white text-2xl">💎</span>
                </motion.div>
              </div>
            </motion.div>

            {/* Features Grid */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Feature 1 */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="glass-dark border border-orange-500/30 rounded-xl p-6 hover:border-orange-500/50 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="text-white text-xl">🔥</span>
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">Price Guarantee</h3>
                      <p className="text-gray-400 text-sm">Lowest price guaranteed</p>
                    </div>
                  </div>
                </motion.div>

                {/* Feature 2 */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="glass-dark border border-blue-500/30 rounded-xl p-6 hover:border-blue-500/50 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="text-white text-xl">⚡</span>
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">Instant Booking</h3>
                      <p className="text-gray-400 text-sm">Book your car in seconds</p>
                    </div>
                  </div>
                </motion.div>

                {/* Feature 3 */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="glass-dark border border-green-500/30 rounded-xl p-6 hover:border-green-500/50 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="text-white text-xl">🛡️</span>
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">Secure Booking</h3>
                      <p className="text-gray-400 text-sm">KYC-checked drivers.</p>
                    </div>
                  </div>
                </motion.div>

                {/* Feature 4 */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="glass-dark border border-purple-500/30 rounded-xl p-6 hover:border-purple-500/50 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="text-white text-xl">👑</span>
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">Premium Fleet</h3>
                      <p className="text-gray-400 text-sm">Luxury & economy options</p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="text-center pt-6"
              >
                <Button
                  onClick={() => router.push("/login")}
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 text-lg font-bold glow"
                >
                  <span className="flex items-center gap-2">
                    Book Now
                    <span className="text-xl">🚗</span>
                  </span>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
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
              <p className="text-gray-400 leading-relaxed">
                Experience the future of car rental with premium vehicles and exceptional service.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-white font-semibold">Quick Links</h3>
              <div className="space-y-2">
                <a href="/home" className="block text-gray-400 hover:text-white transition-colors">
                  Home
                </a>
                <a href="/about" className="block text-gray-400 hover:text-white transition-colors">
                  About
                </a>
                <button
                  onClick={() => router.push("/help")}
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Help
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-white font-semibold">Services</h3>
              <div className="space-y-2">
                <span className="block text-gray-400">Car Rental</span>
                <span className="block text-gray-400">Premium Fleet</span>
                <span className="block text-gray-400">24/7 Support</span>
                <span className="block text-gray-400">Insurance</span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-white font-semibold">Contact</h3>
              <div className="space-y-2">
                <span className="block text-gray-400">hanumancars0520@gmail.com</span>
                <span className="block text-gray-400">+91  9392732341</span>
                <span className="block text-gray-400">Hyderabad, India</span>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 HanumanCars. All rights reserved. Built with for the future of mobility.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutUs;
