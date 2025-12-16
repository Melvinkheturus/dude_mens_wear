"use client";

import { Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";

interface ProductVariant {
  id: string;
  stock: number;
  size?: string;
  color?: string;
  products?: {
    title: string;
    slug: string;
  };
}

interface InventoryAlertsProps {
  variants: ProductVariant[];
  isLoading?: boolean;
}

export function InventoryAlerts({ variants, isLoading }: InventoryAlertsProps) {
  if (isLoading) {
    return (
      <Card className="border-red-200 bg-red-50/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Package className="h-4 w-4 text-red-600" />
            Low Stock Alert
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-32 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-12"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-red-200 bg-red-50/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Package className="h-4 w-4 text-red-600" />
          Low Stock Alert
        </CardTitle>
      </CardHeader>
      <CardContent>
        {variants.length === 0 ? (
          <p className="text-sm text-gray-500">All stocked up!</p>
        ) : (
          <div className="space-y-2">
            {variants.slice(0, 5).map((variant) => (
              <div
                key={variant.id}
                className="flex items-center justify-between text-sm"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">
                    {variant.products?.title || "Unknown Product"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {variant.size} {variant.color && `• ${variant.color}`}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    variant.stock === 0
                      ? "border-red-500 text-red-700"
                      : "border-orange-500 text-orange-700"
                  }`}
                >
                  {variant.stock} left
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}