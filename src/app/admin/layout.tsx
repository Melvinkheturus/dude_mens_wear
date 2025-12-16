"use client";

import { Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import { ReactNode } from "react";
import routerProvider from "@refinedev/nextjs-router";
import Image from "next/image";
import {
  Package,
  FolderTree,
  Layers,
  ShoppingCart,
  Users,
  ImageIcon,
  Ticket,
  LayoutDashboard,
  Settings,
  Megaphone,
  Home,
  Warehouse,
} from "lucide-react";

import { Layout } from "@/shared/ui/refine/layout/layout";
import { Toaster } from "@/shared/ui/refine/notification/toaster";
import { useNotificationProvider } from "@/shared/ui/refine/notification/use-notification-provider";
import { dataProvider } from "@/lib/refine/data-provider/index";

interface AdminLayoutProps {
  children: ReactNode;
}

function AdminLayoutContent({ children }: AdminLayoutProps) {
  const notificationProvider = useNotificationProvider();

  return (
    <RefineKbarProvider>
      <Refine
        dataProvider={dataProvider}
        notificationProvider={notificationProvider}
        routerProvider={routerProvider}
        resources={[
          {
            name: "dashboard",
            list: "/admin",
            meta: {
              label: "Dashboard",
              icon: <LayoutDashboard className="h-3.5 w-3.5" />,
            },
          },
          {
            name: "products",
            list: "/admin/products",
            create: "/admin/products/create",
            edit: "/admin/products/edit/:id",
            show: "/admin/products/:id",
            meta: {
              canDelete: true,
              label: "Products",
              icon: <Package className="h-3.5 w-3.5" />,
            },
          },
          {
            name: "categories",
            list: "/admin/categories",
            create: "/admin/categories/create",
            edit: "/admin/categories/edit/:id",
            show: "/admin/categories/:id",
            meta: {
              canDelete: true,
              label: "Categories",
              icon: <FolderTree className="h-3.5 w-3.5" />,
            },
          },
          {
            name: "collections",
            list: "/admin/collections",
            create: "/admin/collections/create",
            edit: "/admin/collections/edit/:id",
            show: "/admin/collections/:id",
            meta: {
              canDelete: true,
              label: "Collections",
              icon: <Layers className="h-3.5 w-3.5" />,
            },
          },
          {
            name: "orders",
            list: "/admin/orders",
            show: "/admin/orders/:id",
            meta: {
              canDelete: false,
              label: "Orders",
              icon: <ShoppingCart className="h-3.5 w-3.5" />,
            },
          },
          {
            name: "customers",
            list: "/admin/customers",
            show: "/admin/customers/:id",
            meta: {
              canDelete: false,
              label: "Customers",
              icon: <Users className="h-3.5 w-3.5" />,
            },
          },
          {
            name: "banners",
            list: "/admin/banners",
            create: "/admin/banners/create",
            edit: "/admin/banners/edit/:id",
            meta: {
              canDelete: true,
              label: "Banners",
              icon: <ImageIcon className="h-3.5 w-3.5" />,
            },
          },
          {
            name: "coupons",
            list: "/admin/coupons",
            create: "/admin/coupons/create",
            edit: "/admin/coupons/edit/:id",
            meta: {
              canDelete: true,
              label: "Coupons",
              icon: <Ticket className="h-3.5 w-3.5" />,
            },
          },
          {
            name: "campaigns",
            list: "/admin/campaigns",
            meta: {
              label: "Campaigns",
              icon: <Megaphone className="h-3.5 w-3.5" />,
            },
          },
          {
            name: "homepage",
            list: "/admin/homepage",
            meta: {
              label: "Homepage",
              icon: <Home className="h-3.5 w-3.5" />,
            },
          },
          {
            name: "inventory",
            list: "/admin/inventory",
            meta: {
              label: "Inventory",
              icon: <Warehouse className="h-3.5 w-3.5" />,
            },
          },
          {
            name: "users",
            list: "/admin/users",
            meta: {
              label: "Users",
              icon: <Users className="h-3.5 w-3.5" />,
            },
          },
          {
            name: "settings",
            list: "/admin/settings",
            meta: {
              label: "Settings",
              icon: <Settings className="h-3.5 w-3.5" />,
            },
          },
        ]}
        options={{
          syncWithLocation: true,
          warnWhenUnsavedChanges: true,
          title: {
            text: (
              <span style={{ fontSize: '12px', fontWeight: 500 }}>
                My <span style={{ color: '#dc2626', fontWeight: 700 }}>DUDE</span> Store
              </span>
            ),
            icon: (
              <Image
                src="/images/logo/logo.png"
                alt="DUDE"
                width={22}
                height={22}
                className="rounded-sm"
              />
            ),
          },
        }}
      >
        <Layout>
          {children}
        </Layout>
        <Toaster />
        <RefineKbar />
      </Refine>
    </RefineKbarProvider>
  );
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return <AdminLayoutContent>{children}</AdminLayoutContent>;
}