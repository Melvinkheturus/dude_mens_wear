"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Separator } from "@/shared/ui/separator";

interface CartItem {
  id: string;
  quantity: number;
  variant_id: string;
  product_title?: string;
  variant_size?: string;
  variant_color?: string;
  price: number; // in paise
}

interface ShippingResult {
  amount: number;
  provider: string;
  zone: string;
}

interface OrderSummaryProps {
  cartItems: CartItem[];
  shipping: ShippingResult | null;
  className?: string;
}

export function OrderSummary({ cartItems, shipping, className }: OrderSummaryProps) {
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingAmount = shipping?.amount || 0;
  const total = subtotal + shippingAmount;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Cart Items */}
        <div className="space-y-3">
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <div className="flex-1">
                <p className="font-medium">{item.product_title}</p>
                <p className="text-gray-500">
                  {item.variant_size} {item.variant_color && `• ${item.variant_color}`} × {item.quantity}
                </p>
              </div>
              <p className="font-medium">
                ₹{((item.price * item.quantity) / 100).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        <Separator />

        {/* Pricing Breakdown */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
            <span>₹{(subtotal / 100).toLocaleString()}</span>
          </div>
          
          {shipping ? (
            <div className="flex justify-between">
              <span>Shipping ({shipping.provider})</span>
              <span>₹{(shippingAmount / 100).toLocaleString()}</span>
            </div>
          ) : (
            <div className="flex justify-between text-gray-500">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
          )}
        </div>

        <Separator />

        {/* Total */}
        <div className="flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span>₹{(total / 100).toLocaleString()}</span>
        </div>

        {/* Shipping Info */}
        {shipping && (
          <div className="bg-green-50 p-3 rounded-lg text-sm">
            <p className="font-medium text-green-800">Delivery Information</p>
            <p className="text-green-700">
              Via {shipping.provider} • 3-5 business days
            </p>
            <p className="text-green-600 text-xs mt-1">
              Zone: {shipping.zone === "tamilnadu" ? "Tamil Nadu" : "Rest of India"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}