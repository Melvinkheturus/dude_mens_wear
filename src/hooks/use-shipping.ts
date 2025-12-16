import { useState, useCallback } from "react";

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

interface UseShippingReturn {
  shipping: ShippingResult | null;
  isCalculating: boolean;
  error: string | null;
  calculateShipping: (cartItems: CartItem[], address: ShippingAddress) => Promise<void>;
  clearShipping: () => void;
}

export function useShipping(): UseShippingReturn {
  const [shipping, setShipping] = useState<ShippingResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateShipping = useCallback(async (
    cartItems: CartItem[], 
    shippingAddress: ShippingAddress
  ) => {
    if (!cartItems.length || !shippingAddress.state) {
      setShipping(null);
      setError(null);
      return;
    }

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
      } else {
        throw new Error(data.error || "Shipping calculation failed");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to calculate shipping";
      setError(errorMessage);
      setShipping(null);
    } finally {
      setIsCalculating(false);
    }
  }, []);

  const clearShipping = useCallback(() => {
    setShipping(null);
    setError(null);
    setIsCalculating(false);
  }, []);

  return {
    shipping,
    isCalculating,
    error,
    calculateShipping,
    clearShipping,
  };
}