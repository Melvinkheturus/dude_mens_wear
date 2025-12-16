"use client";

import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users } from "lucide-react";
import { Card, CardContent } from "@/shared/ui/card";

interface KPIData {
  todayRevenue: number;
  weekRevenue: number;
  todayOrderCount: number;
  weekOrderCount: number;
  todayAvgOrder: number;
  weekAvgOrder: number;
}

interface KPIStripProps {
  data: KPIData;
  isLoading?: boolean;
}

export function KPIStrip({ data, isLoading }: KPIStripProps) {
  const kpis = [
    {
      title: "Today Revenue",
      value: `₹${data.todayRevenue.toLocaleString()}`,
      subtitle: `₹${data.weekRevenue.toLocaleString()} (7d)`,
      icon: DollarSign,
      trend: data.todayRevenue > (data.weekRevenue / 7) ? "up" : "down",
    },
    {
      title: "Today Orders",
      value: data.todayOrderCount,
      subtitle: `${data.weekOrderCount} (7d)`,
      icon: ShoppingCart,
      trend: data.todayOrderCount > (data.weekOrderCount / 7) ? "up" : "down",
    },
    {
      title: "Avg Order Value",
      value: `₹${Math.round(data.todayAvgOrder)}`,
      subtitle: `₹${Math.round(data.weekAvgOrder)} (7d avg)`,
      icon: TrendingUp,
      trend: data.todayAvgOrder > data.weekAvgOrder ? "up" : "down",
    },
    {
      title: "Conversion",
      value: "2.4%", // This would need visitor tracking
      subtitle: "2.1% (7d avg)",
      icon: Users,
      trend: "up",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border border-gray-200">
            <CardContent className="p-4">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-16 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        const TrendIcon = kpi.trend === "up" ? TrendingUp : TrendingDown;
        return (
          <Card key={kpi.title} className="border border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    {kpi.title}
                  </p>
                  <p className="text-2xl font-bold text-black">{kpi.value}</p>
                  <p className="text-xs text-gray-400">{kpi.subtitle}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Icon className="h-5 w-5 text-gray-400" />
                  <TrendIcon
                    className={`h-3 w-3 ${
                      kpi.trend === "up" ? "text-green-500" : "text-red-500"
                    }`}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}