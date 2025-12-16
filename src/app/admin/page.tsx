"use client";

import { KPIStrip } from "@/components/admin/dashboard/kpi-strip";
import { ActionOrders } from "@/components/admin/dashboard/action-orders";
import { RecentActivity } from "@/components/admin/dashboard/recent-activity";
import { InventoryAlerts } from "@/components/admin/dashboard/inventory-alerts";
import { CollectionPerformance } from "@/components/admin/dashboard/collection-performance";
import { QuickActions } from "@/components/admin/dashboard/quick-actions";
import { useDashboardData } from "@/components/admin/dashboard/dashboard-data";

export default function AdminDashboard() {
  const {
    kpiData,
    pendingOrdersData,
    failedPaymentsData,
    recentOrdersData,
    lowStockVariantsData,
    collectionsData,
    isLoading,
  } = useDashboardData();

  return (
    <div className="space-y-6 p-6">
      {/* 1️⃣ Top KPI Strip - Health Check */}
      <KPIStrip data={kpiData} isLoading={isLoading.kpi} />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Main Actions */}
        <div className="lg:col-span-2 space-y-4">
          {/* 2️⃣ Orders that need action (MOST IMPORTANT) */}
          <ActionOrders
            pendingOrders={pendingOrdersData}
            failedPayments={failedPaymentsData}
            isLoading={isLoading.pending || isLoading.failed}
          />

          {/* 3️⃣ Recent Activity Feed */}
          <RecentActivity
            orders={recentOrdersData}
            isLoading={isLoading.recent}
          />
        </div>

        {/* Right Column - Alerts & Quick Actions */}
        <div className="space-y-4">
          {/* 4️⃣ Inventory Alerts */}
          <InventoryAlerts
            variants={lowStockVariantsData}
            isLoading={isLoading.stock}
          />

          {/* 5️⃣ Collection Performance */}
          <CollectionPerformance
            collections={collectionsData}
            isLoading={isLoading.collections}
          />

          {/* Quick Actions */}
          <QuickActions />
        </div>
      </div>
    </div>
  );
}