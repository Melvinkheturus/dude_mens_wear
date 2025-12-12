'use client'

import { motion } from 'framer-motion'
import { MapPin, Phone, Clock, Navigation } from 'lucide-react'

export default function StoreLocatorPage() {
  const stores = [
    {
      name: 'Dude Mens Wear - Mumbai Flagship',
      address: '123 Fashion Street, Colaba, Mumbai, Maharashtra 400001',
      phone: '+91 98765 43210',
      hours: 'Mon-Sat: 10:00 AM - 7:00 PM, Sun: 11:00 AM - 6:00 PM',
      mapUrl: 'https://maps.google.com',
      image: '/images/store-mumbai.jpg'
    },
    {
      name: 'Dude Mens Wear - Delhi',
      address: '456 Connaught Place, New Delhi, Delhi 110001',
      phone: '+91 98765 43211',
      hours: 'Mon-Sat: 10:00 AM - 7:00 PM, Sun: 11:00 AM - 6:00 PM',
      mapUrl: 'https://maps.google.com',
      image: '/images/store-delhi.jpg'
    },
    {
      name: 'Dude Mens Wear - Bangalore',
      address: '789 MG Road, Bangalore, Karnataka 560001',
      phone: '+91 98765 43212',
      hours: 'Mon-Sat: 10:00 AM - 7:00 PM, Sun: 11:00 AM - 6:00 PM',
      mapUrl: 'https://maps.google.com',
      image: '/images/store-bangalore.jpg'
    },
    {
      name: 'Dude Mens Wear - Pune',
      address: '321 FC Road, Pune, Maharashtra 411004',
      phone: '+91 98765 43213',
      hours: 'Mon-Sat: 10:00 AM - 7:00 PM, Sun: 11:00 AM - 6:00 PM',
      mapUrl: 'https://maps.google.com',
      image: '/images/store-pune.jpg'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Store Locator</h1>
          <p className="text-gray-600 text-lg">Visit us at any of our locations across India</p>
        </motion.div>

        {/* Store Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {stores.map((store, index) => (
            <motion.div
              key={store.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Store Image Placeholder */}
              <div className="h-48 bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
                <MapPin className="w-16 h-16 text-white opacity-50" />
              </div>

              {/* Store Details */}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-900">{store.name}</h3>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700 text-sm">{store.address}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <a href={`tel:${store.phone}`} className="text-gray-700 text-sm hover:text-red-600">
                      {store.phone}
                    </a>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700 text-sm">{store.hours}</p>
                  </div>
                </div>

                <a
                  href={store.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Navigation className="w-5 h-5" />
                  Get Directions
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center"
          >
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">Multiple Locations</h3>
            <p className="text-gray-600 text-sm">
              Find us in major cities across India with more stores opening soon
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center"
          >
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">Extended Hours</h3>
            <p className="text-gray-600 text-sm">
              Open 7 days a week to serve you better with convenient timings
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center"
          >
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">Expert Assistance</h3>
            <p className="text-gray-600 text-sm">
              Our friendly staff is ready to help you find the perfect fit
            </p>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12 bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-8 text-white text-center"
        >
          <h3 className="text-2xl font-bold mb-2">Can't Visit a Store?</h3>
          <p className="mb-4">Shop online and get free delivery on orders above ₹999</p>
          <a
            href="/collections/all"
            className="inline-block bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Shop Online
          </a>
        </motion.div>
      </div>
    </div>
  )
}
