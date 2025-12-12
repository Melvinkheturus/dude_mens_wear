'use client'

import { useState } from 'react'
import { useToast } from '@/contexts/ToastContext'

interface PromoCodeProps {
    onApplied?: (discount: { code: string; amount: number } | null) => void
}

// Demo promo codes for local cart
const DEMO_PROMO_CODES = {
    'SAVE10': { discount: 10, type: 'percentage' },
    'FLAT50': { discount: 50, type: 'fixed' },
    'WELCOME': { discount: 15, type: 'percentage' },
}

export default function PromoCode({ onApplied }: PromoCodeProps) {
    const [code, setCode] = useState('')
    const [isApplying, setIsApplying] = useState(false)
    const [appliedCode, setAppliedCode] = useState<string | null>(null)
    const { showToast } = useToast()

    const handleApply = async () => {
        if (!code.trim()) {
            showToast('Please enter a promo code', 'warning')
            return
        }

        setIsApplying(true)
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500))
        
        try {
            const promoCode = DEMO_PROMO_CODES[code.toUpperCase() as keyof typeof DEMO_PROMO_CODES]
            
            if (!promoCode) {
                throw new Error('Invalid promo code')
            }

            setAppliedCode(code.toUpperCase())
            setCode('')
            showToast('Promo code applied successfully!', 'success')
            onApplied?.({ code: code.toUpperCase(), amount: promoCode.discount })
        } catch (error: any) {
            console.error('Failed to apply promo code:', error)
            showToast(error.message || 'Invalid promo code', 'error')
        } finally {
            setIsApplying(false)
        }
    }

    const handleRemove = async () => {
        if (!appliedCode) return

        setIsApplying(true)
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300))
        
        try {
            setAppliedCode(null)
            showToast('Promo code removed', 'info')
            onApplied?.(null)
        } catch (error: any) {
            console.error('Failed to remove promo code:', error)
            showToast('Failed to remove promo code', 'error')
        } finally {
            setIsApplying(false)
        }
    }

    return (
        <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-3">Promo Code</h3>

            {appliedCode ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                    <div>
                        <span className="font-medium text-green-800">{appliedCode}</span>
                        <span className="text-sm text-green-600 ml-2">Applied</span>
                    </div>
                    <button
                        onClick={handleRemove}
                        disabled={isApplying}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                        Remove
                    </button>
                </div>
            ) : (
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                        placeholder="Enter code"
                        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                    <button
                        onClick={handleApply}
                        disabled={isApplying || !code.trim()}
                        className="px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 disabled:bg-gray-400"
                    >
                        {isApplying ? 'Applying...' : 'Apply'}
                    </button>
                </div>
            )}
        </div>
    )
}
