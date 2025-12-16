"use client";

import { useState } from "react";
import { Truck, Package, CheckCircle, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Badge } from "@/shared/ui/badge";

interface Order {
  id: string;
  shipping_provider: string;
  shipping_zone: string;
  shipping_amount: number;
  shipping_tracking_number?: string;
  order_status: string;
  created_at: string;
}

interface ShippingTrackerProps {
  order: Order;
  onTrackingUpdate?: (trackingNumber: string) => void;
}

export function ShippingTracker({ order, onTrackingUpdate }: ShippingTrackerProps) {
  const [trackingNumber, setTrackingNumber] = useState(order.shipping_tracking_number || "");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateTracking = async () => {
    if (!trackingNumber.trim()) return;

    setIsUpdating(true);
    try {
      // Call API to update tracking
      const response = await fetch(`/api/orders/${order.id}/tracking`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          tracking_number: trackingNumber,
          order_status: "shipped"
        }),
      });

      if (response.ok) {
        onTrackingUpdate?.(trackingNumber);
      }
    } catch (error) {
      console.error("Failed to update tracking:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusIcon = () => {
    switch (order.order_status) {
      case "shipped":
        return <Truck className="h-4 w-4 text-blue-600" />;
      case "delivered":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return <Package className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = () => {
    switch (order.order_status) {
      case "shipped":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "delivered":
        return "bg-green-50 text-green-700 border-green-200";
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getZoneDisplay = (zone: string) => {
    return zone === "tamilnadu" ? "Tamil Nadu" : "Rest of India";
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          {getStatusIcon()}
          Shipping Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Shipping Details */}
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <Label className="text-xs text-gray-500">Provider</Label>
            <p className="font-medium">{order.shipping_provider}</p>
          </div>
          <div>
            <Label className="text-xs text-gray-500">Zone</Label>
            <p className="font-medium">{getZoneDisplay(order.shipping_zone)}</p>
          </div>
          <div>
            <Label className="text-xs text-gray-500">Shipping Cost</Label>
            <p className="font-medium">₹{(order.shipping_amount / 100).toFixed(0)}</p>
          </div>
          <div>
            <Label className="text-xs text-gray-500">Status</Label>
            <Badge className={`${getStatusColor()} capitalize`}>
              {order.order_status}
            </Badge>
          </div>
        </div>

        {/* Tracking Number Management */}
        <div className="space-y-3">
          <Label htmlFor="tracking">Tracking Number</Label>
          {order.shipping_tracking_number ? (
            <div className="flex items-center gap-2">
              <Input
                id="tracking"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter tracking number"
              />
              <Button
                size="sm"
                onClick={handleUpdateTracking}
                disabled={isUpdating || trackingNumber === order.shipping_tracking_number}
              >
                {isUpdating ? "Updating..." : "Update"}
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Input
                id="tracking"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter tracking number"
              />
              <Button
                size="sm"
                onClick={handleUpdateTracking}
                disabled={isUpdating || !trackingNumber.trim()}
              >
                {isUpdating ? "Adding..." : "Add"}
              </Button>
            </div>
          )}
        </div>

        {/* ST Courier Tracking Link */}
        {order.shipping_tracking_number && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-800">Track Package</p>
                <p className="text-xs text-blue-600">
                  Tracking: {order.shipping_tracking_number}
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="text-blue-600 border-blue-200"
                asChild
              >
                <a
                  href={`https://stcourier.com/track?awb=${order.shipping_tracking_number}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Track
                </a>
              </Button>
            </div>
          </div>
        )}

        {/* Shipping Timeline */}
        <div className="space-y-2">
          <Label className="text-xs text-gray-500">Estimated Delivery</Label>
          <p className="text-sm text-gray-600">
            3-5 business days from order confirmation
          </p>
        </div>
      </CardContent>
    </Card>
  );
}