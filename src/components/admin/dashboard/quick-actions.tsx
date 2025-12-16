"use client";

import { Package, ShoppingCart, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

export function QuickActions() {
  const actions = [
    {
      title: "Add Product",
      href: "/admin/products/create",
      icon: Package,
    },
    {
      title: "View All Orders",
      href: "/admin/orders",
      icon: ShoppingCart,
    },
    {
      title: "View Store",
      href: "/",
      icon: ExternalLink,
      external: true,
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.title}
                href={action.href}
                target={action.external ? "_blank" : undefined}
                className="flex items-center gap-2 p-2 text-sm hover:bg-gray-50 rounded transition-colors"
              >
                <Icon className="h-4 w-4" />
                {action.title}
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}