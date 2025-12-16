"use client";

import { useTable } from "@refinedev/react-table";
import { ColumnDef, flexRender } from "@tanstack/react-table";
import {
  Edit,
  Eye,
  EyeOff,
  MoreHorizontal,
  Plus,
  Trash2
} from "lucide-react";

import { ListView } from "@/shared/ui/refine/views/list-view";
import { DataTable } from "@/shared/ui/refine/data-table/data-table";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Badge } from "@/shared/ui/badge";

interface Collection {
  id: string;
  title: string;
  slug: string;
  description?: string;
  type: 'manual' | 'rule';
  rule_json?: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function CollectionsListPage() {
  const columns: ColumnDef<Collection>[] = [
    {
      id: "title",
      header: "Collection",
      accessorKey: "title",
      cell: ({ row }) => {
        const collection = row.original;
        return (
          <div className="flex flex-col">
            <span className="font-medium">{collection.title}</span>
            <span className="text-sm text-muted-foreground">/{collection.slug}</span>
          </div>
        );
      },
    },
    {
      id: "type",
      header: "Type",
      accessorKey: "type",
      cell: ({ row }) => {
        const collection = row.original;
        return (
          <Badge variant={collection.type === 'manual' ? 'default' : 'secondary'}>
            {collection.type}
          </Badge>
        );
      },
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "is_active",
      cell: ({ row }) => {
        const collection = row.original;
        return (
          <div className="flex items-center gap-1">
            {collection.is_active ? (
              <>
                <Eye className="h-3 w-3 text-green-600" />
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Active
                </Badge>
              </>
            ) : (
              <>
                <EyeOff className="h-3 w-3 text-gray-400" />
                <Badge variant="outline" className="text-gray-400">
                  Inactive
                </Badge>
              </>
            )}
          </div>
        );
      },
    },
    {
      id: "description",
      header: "Description",
      accessorKey: "description",
      cell: ({ row }) => {
        const collection = row.original;
        return (
          <span className="text-sm text-muted-foreground max-w-xs truncate">
            {collection.description || "No description"}
          </span>
        );
      },
    },
    {
      id: "created_at",
      header: "Created",
      accessorKey: "created_at",
      cell: ({ row }) => {
        const collection = row.original;
        return new Date(collection.created_at).toLocaleDateString();
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const collection = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useTable<Collection>({
    columns,
    refineCoreProps: {
      resource: "collections",
    },
  });

  const { refineCore, reactTable } = table;
  const isLoading = refineCore.tableQuery.isLoading;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Collections</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Collection
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading collections...</div>
      ) : (
        <div className="rounded-md border">
          <table className="w-full">
            <thead>
              {reactTable.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b bg-muted/50">
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="h-12 px-4 text-left align-middle font-medium">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {reactTable.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-4 align-middle">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}