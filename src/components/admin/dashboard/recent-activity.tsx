"use client";

import { Activity } from "lucide-react";
import dayjs from "dayjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

interface Order {
  id: string;
  total_amount: number;
  created_at: string;
}

interface RecentActivityProps {
  orders: Order[];
  isLoading?: boolean;
}

export function RecentActivity({ orders, isLoading }: RecentActivityProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Activity className="h-4 w-4 text-gray-600" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
                <div className="flex-1 h-4 bg-gray-200 rounded"></div>
                <div className="w-12 h-3 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Activity className="h-4 w-4 text-gray-600" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {orders.slice(0, 6).map((order) => (
            <div key={order.id} className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full shrink-0"></div>
              <div className="flex-1 min-w-0">
                <span className="text-gray-900">Order placed</span>
                <span className="text-gray-500 ml-1">
                  #{order.id.slice(-8)} • ₹{order.total_amount}
                </span>
              </div>
              <span className="text-xs text-gray-400 shrink-0">
                {dayjs(order.created_at).format("h:mm A")}
              </span>
            </div>
          ))}
          {orders.length === 0 && (
            <p className="text-sm text-gray-500 py-4">No recent activity</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}