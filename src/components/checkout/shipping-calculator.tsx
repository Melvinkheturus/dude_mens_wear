"use client";

import { useState, useEffect } from "react";
import { Truck, Calculator, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";

interface CartItem {
  id: string;
  quantity: number;
  variant_id: string;
}

interface ShippingAddress {
  state: string;
  city: string;
  pincode: string;
}

interface ShippingResult {
  amount: number;
  provider: string;
  zone: string;
  rule_id: string;
}

interface ShippingCalculatorProps {
  cartItems: CartItem[];
  shippingAddress: ShippingAddress | null;
  onShippingCalculated?: (shipping: ShippingResult | null) => void;
}

export function ShippingCalculator({ 
  cartItems, 
  shippingAddress, 
  onShippingCalculated 
}: ShippingCalculatorProps) {
  const [shipping, setShipping] = useState<ShippingResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cartItems.length > 0 && shippingAddress?.state) {
      calculateShipping();
    } else {
      setShipping(null);
      setError(null);
      onShippingCalculated?.(null);
    }
  }, [cartItems, shippingAddress]);

  const calculateShipping = async () => {
    if (!shippingAddress) return;

    setIsCalculating(true);
    setError(null);

    try {
      const response = await fetch("/api/shipping/calculate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartItems,
          shippingAddress,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to calculate shipping");
      }

      if (data.success) {
        setShipping(data.shipping);
        onShippingCalculated?.(data.shipping);
      } else {
        throw new Error(data.error || "Shipping calculation failed");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to calculate shipping";
      setError(errorMessage);
      setShipping(null);
      onShippingCalculated?.(null);
    } finally {
      setIsCalculating(false);
    }
  };

  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const getZoneDisplay = (zone: string) => {
    return zone === "tamilnadu" ? "Tamil Nadu" : "Rest of India";
  };

  if (!shippingAddress) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 text-gray-500">
            <Truck className="h-5 w-5" />
            <span className="text-sm">Enter shipping address to calculate delivery charges</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isCalculating) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Calculator className="h-5 w-5 animate-pulse text-blue-500" />
            <span className="text-sm">Calculating shipping charges...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 text-red-700">
            <AlertCircle className="h-5 w-5" />
            <div>
              <p className="text-sm font-medium">Shipping calculation failed</p>
              <p className="text-xs text-red-600">{error}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!shipping) {
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 text-yellow-700">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm">Unable to calculate shipping for this location</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Shipping Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-green-600" />
              <span className="font-medium">Shipping via ST Courier</span>
            </div>
            <Badge variant="outline" className="text-green-700 border-green-200">
              {getZoneDisplay(shipping.zone)}
            </Badge>
          </div>

          {/* Shipping Details */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">
                {totalQuantity} {totalQuantity === 1 ? "item" : "items"} to {shippingAddress.city}
              </span>
              <span className="font-medium">₹{(shipping.amount / 100).toFixed(0)}</span>
            </div>
            
            <div className="text-xs text-gray-500">
              Delivery in 3-5 business days
            </div>
          </div>

          {/* Rate Explanation */}
          <div className="bg-gray-50 p-3 rounded text-xs text-gray-600">
            <p className="font-medium mb-1">Shipping Rates:</p>
            <div className="space-y-1">
              {shipping.zone === "tamilnadu" ? (
                <>
                  <div>≤4 items: ₹60 | 5+ items: ₹120</div>
                </>
              ) : (
                <>
                  <div>≤4 items: ₹100 | 5+ items: ₹150</div>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}