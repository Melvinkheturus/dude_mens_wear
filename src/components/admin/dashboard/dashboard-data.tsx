"use client";

import { useList } from "@refinedev/core";
import dayjs from "dayjs";

export function useDashboardData() {
  const today = dayjs().startOf('day');
  const sevenDaysAgo = dayjs().subtract(7, 'day').startOf('day');

  // Fetch all orders for calculations
  const { query: { data: allOrders, isLoading: ordersLoading } } = useList({
    resource: "orders",
    pagination: { mode: "off" },
  });

  // Orders that need action
  const { query: { data: pendingOrders, isLoading: pendingLoading } } = useList({
    resource: "orders",
    filters: [
      {
        field: "order_status",
        operator: "in",
        value: ["pending", "processing"],
      },
    ],
    sorters: [{ field: "created_at", order: "desc" }],
    pagination: { pageSize: 10 },
  });

  const { query: { data: failedPayments, isLoading: failedLoading } } = useList({
    resource: "orders",
    filters: [
      {
        field: "payment_status",
        operator: "eq",
        value: "failed",
      },
    ],
    sorters: [{ field: "created_at", order: "desc" }],
    pagination: { pageSize: 5 },
  });

  // Recent orders for activity feed
  const { query: { data: recentOrders, isLoading: recentLoading } } = useList({
    resource: "orders",
    sorters: [{ field: "created_at", order: "desc" }],
    pagination: { pageSize: 8 },
  });

  // Low stock variants
  const { query: { data: lowStockVariants, isLoading: stockLoading } } = useList({
    resource: "product_variants",
    filters: [
      {
        field: "stock",
        operator: "lt",
        value: 5,
      },
    ],
    sorters: [{ field: "stock", order: "asc" }],
    pagination: { pageSize: 10 },
  });

  // Active collections
  const { query: { data: collections, isLoading: collectionsLoading } } = useList({
    resource: "collections",
    filters: [{ field: "is_active", operator: "eq", value: true }],
    pagination: { pageSize: 5 },
  });

  // Process data safely
  const allOrdersData = (allOrders as any)?.data || [];
  const pendingOrdersData = (pendingOrders as any)?.data || [];
  const failedPaymentsData = (failedPayments as any)?.data || [];
  const recentOrdersData = (recentOrders as any)?.data || [];
  const lowStockVariantsData = (lowStockVariants as any)?.data || [];
  const collectionsData = (collections as any)?.data || [];

  // Calculate KPI data
  const todayOrdersData = allOrdersData.filter((order: any) => 
    dayjs(order.created_at).isAfter(today)
  );
  const weekOrdersData = allOrdersData.filter((order: any) => 
    dayjs(order.created_at).isAfter(sevenDaysAgo)
  );

  const todayRevenue = todayOrdersData.reduce((sum: number, order: any) => 
    sum + (order.total_amount || 0), 0
  );
  const weekRevenue = weekOrdersData.reduce((sum: number, order: any) => 
    sum + (order.total_amount || 0), 0
  );
  const todayOrderCount = todayOrdersData.length;
  const weekOrderCount = weekOrdersData.length;
  const todayAvgOrder = todayOrderCount > 0 ? todayRevenue / todayOrderCount : 0;
  const weekAvgOrder = weekOrderCount > 0 ? weekRevenue / weekOrderCount : 0;

  const kpiData = {
    todayRevenue,
    weekRevenue,
    todayOrderCount,
    weekOrderCount,
    todayAvgOrder,
    weekAvgOrder,
  };

  const isLoading = ordersLoading || pendingLoading || failedLoading || 
                   recentLoading || stockLoading || collectionsLoading;

  return {
    kpiData,
    pendingOrdersData,
    failedPaymentsData,
    recentOrdersData,
    lowStockVariantsData,
    collectionsData,
    isLoading: {
      kpi: ordersLoading,
      pending: pendingLoading,
      failed: failedLoading,
      recent: recentLoading,
      stock: stockLoading,
      collections: collectionsLoading,
    },
  };
}