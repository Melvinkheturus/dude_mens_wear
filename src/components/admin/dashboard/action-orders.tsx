"use client";

import { AlertTriangle, Clock, CreditCard } from "lucide-react";
import Link from "next/link";
import dayjs from "dayjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";

interface Order {
  id: string;
  total_amount: number;
  created_at: string;
  order_status: string;
  payment_status: string;
}

interface ActionOrdersProps {
  pendingOrders: Order[];
  failedPayments: Order[];
  isLoading?: boolean;
}

export function ActionOrders({ pendingOrders, failedPayments, isLoading }: ActionOrdersProps) {
  if (isLoading) {
    return (
      <Card className="border-orange-200 bg-orange-50/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            Orders Needing Action
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasActions = pendingOrders.length > 0 || failedPayments.length > 0;

  return (
    <Card className="border-orange-200 bg-orange-50/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          Orders Needing Action
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {!hasActions ? (
          <p className="text-sm text-gray-500 py-4">All caught up! 🎉</p>
        ) : (
          <>
            {/* Pending Orders */}
            {pendingOrders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 bg-white rounded border"
              >
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-orange-500" />
                  <div>
                    <p className="text-sm font-medium">
                      Order #{order.id.slice(-8)}
                    </p>
                    <p className="text-xs text-gray-500">
                      ₹{order.total_amount} • {dayjs(order.created_at).format("MMM D, h:mm A")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {order.order_status}
                  </Badge>
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
            
            {/* Failed Payments */}
            {failedPayments.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 bg-red-50 rounded border border-red-200"
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="h-4 w-4 text-red-500" />
                  <div>
                    <p className="text-sm font-medium">
                      Payment Failed #{order.id.slice(-8)}
                    </p>
                    <p className="text-xs text-gray-500">
                      ₹{order.total_amount} • {dayjs(order.created_at).format("MMM D, h:mm A")}
                    </p>
                  </div>
                </div>
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="text-xs text-red-600 hover:underline"
                >
                  Retry
                </Link>
              </div>
            ))}
          </>
        )}
      </CardContent>
    </Card>
  );
}