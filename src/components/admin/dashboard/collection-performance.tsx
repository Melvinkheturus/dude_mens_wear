"use client";

import { FolderTree } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

interface Collection {
  id: string;
  title: string;
  type: string;
  is_active: boolean;
}

interface CollectionPerformanceProps {
  collections: Collection[];
  isLoading?: boolean;
}

export function CollectionPerformance({ collections, isLoading }: CollectionPerformanceProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <FolderTree className="h-4 w-4 text-gray-600" />
            Active Collections
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="h-3 bg-gray-200 rounded w-8"></div>
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
          <FolderTree className="h-4 w-4 text-gray-600" />
          Active Collections
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {collections.map((collection) => (
            <div key={collection.id} className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{collection.title}</p>
                <p className="text-xs text-gray-500">
                  {collection.type === "manual" ? "Manual" : "Auto"}
                </p>
              </div>
              <Link
                href={`/admin/collections/${collection.id}`}
                className="text-xs text-blue-600 hover:underline"
              >
                Edit
              </Link>
            </div>
          ))}
          {collections.length === 0 && (
            <p className="text-sm text-gray-500">No active collections</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}