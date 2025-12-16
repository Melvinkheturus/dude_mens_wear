"use client";

import { Header } from "@/shared/ui/refine/layout/header";
import { SidebarInset, SidebarProvider } from "@/shared/ui/sidebar";
import { cn } from "@/lib/utils";
import type { PropsWithChildren } from "react";
import { Sidebar } from "./sidebar";

export function Layout({ children }: PropsWithChildren) {
  return (
    <SidebarProvider>
      <Sidebar />
      <SidebarInset>
        <Header />
        <main
          className={cn(
            "@container/main",
            "container",
            "mx-auto",
            "relative",
            "w-full",
            "flex",
            "flex-col",
            "flex-1",
            "px-2",
            "pt-4",
            "md:p-4",
            "lg:px-6",
            "lg:pt-6"
          )}
        >
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

Layout.displayName = "Layout";
