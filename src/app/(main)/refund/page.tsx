'use client'

import { motion } from 'framer-motion'
import { DollarSign, Clock, CreditCard } from 'lucide-react'

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Refund Policy</h1>
          <p className="text-gray-600 text-lg">Quick and transparent refund process</p>
        </motion.div>

        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Refund Process</h2>
              </div>
            </div>
            <p className="text-gray-700 mb-4">Once we receive your returned item and verify its condition, we'll process your refund within 5-7 business days.</p>
            <ul className="space-y-2 text-gray-700">
              <li>• Refunds are issued to the original payment method</li>
              <li>• Bank transfers may take 5-7 business days to reflect</li>
              <li>• UPI/Wallet refunds are typically instant</li>
              <li>• You'll receive an email confirmation once refund is processed</li>
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Refund Timeline</h2>
              </div>
            </div>
            <div className="space-y-4">
              <div className="border-l-4 border-red-600 pl-4">
                <h3 className="font-bold mb-1">Day 1-2: Return Pickup</h3>
                <p className="text-gray-700">Our courier partner picks up the product from your address</p>
              </div>
              <div className="border-l-4 border-red-600 pl-4">
                <h3 className="font-bold mb-1">Day 3-5: Quality Check</h3>
                <p className="text-gray-700">We verify the product condition and eligibility</p>
              </div>
              <div className="border-l-4 border-red-600 pl-4">
                <h3 className="font-bold mb-1">Day 6-7: Refund Processing</h3>
                <p className="text-gray-700">Refund is initiated to your original payment method</p>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Payment Method Refunds</h2>
              </div>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li><strong>Credit/Debit Card:</strong> 5-7 business days</li>
              <li><strong>Net Banking:</strong> 5-7 business days</li>
              <li><strong>UPI:</strong> 1-2 business days</li>
              <li><strong>Wallets (Paytm, PhonePe):</strong> Instant to 24 hours</li>
              <li><strong>Cash on Delivery:</strong> Bank transfer within 7-10 business days</li>
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h3 className="font-bold text-lg mb-3 text-red-900">Important Notes</h3>
            <ul className="space-y-2 text-red-800 text-sm">
              <li>• Shipping charges are non-refundable (except in case of defective products)</li>
              <li>• Partial refunds may be issued for items not in original condition</li>
              <li>• Contact support if refund is not received within stated timeline</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
