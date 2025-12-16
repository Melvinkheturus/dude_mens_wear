"use client";

import { useTable } from "@refinedev/react-table";
import { ColumnDef, flexRender } from "@tanstack/react-table";
import { GetManyResponse, useMany } from "@refinedev/core";
import {
  Edit,
  Eye,
  MoreHorizontal,
  Plus,
  Trash2,
  Upload
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

interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  original_price?: number;
  category_id: string;
  status: 'active' | 'draft';
  in_stock: boolean;
  is_bestseller: boolean;
  is_new_drop: boolean;
  created_at: string;
}

interface Category {
  id: string;
  name: string;
}

export default function ProductsListPage() {
  const columns: ColumnDef<Product>[] = [
    {
      id: "title",
      header: "Product",
      accessorKey: "title",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="flex flex-col">
            <span className="font-medium">{product.title}</span>
            <span className="text-sm text-muted-foreground">/{product.slug}</span>
          </div>
        );
      },
    },
    {
      id: "category",
      header: "Category",
      accessorKey: "category_id",
      cell: ({ row }) => {
        const product = row.original;
        return <CategoryCell categoryId={product.category_id} />;
      },
    },
    {
      id: "price",
      header: "Price",
      accessorKey: "price",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="flex flex-col">
            <span className="font-medium">₹{(product.price / 100).toLocaleString()}</span>
            {product.original_price && (
              <span className="text-sm text-muted-foreground line-through">
                ₹{(product.original_price / 100).toLocaleString()}
              </span>
            )}
          </div>
        );
      },
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="flex gap-1">
            <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
              {product.status}
            </Badge>
            {!product.in_stock && (
              <Badge variant="destructive">Out of Stock</Badge>
            )}
          </div>
        );
      },
    },
    {
      id: "badges",
      header: "Badges",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="flex gap-1">
            {product.is_bestseller && (
              <Badge variant="outline">Bestseller</Badge>
            )}
            {product.is_new_drop && (
              <Badge variant="outline">New Drop</Badge>
            )}
          </div>
        );
      },
    },
    {
      id: "created_at",
      header: "Created",
      accessorKey: "created_at",
      cell: ({ row }) => {
        const product = row.original;
        return new Date(product.created_at).toLocaleDateString();
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const product = row.original;
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

  const table = useTable<Product>({
    columns,
    refineCoreProps: {
      resource: "products",
    },
  });

  const { refineCore, reactTable } = table;
  const isLoading = refineCore.tableQuery.isLoading;
  const tableData = refineCore.tableQuery.data;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <a href="/admin/products/import">
              <Upload className="mr-2 h-4 w-4" />
              Bulk Import
            </a>
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading products...</div>
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

function CategoryCell({ categoryId }: { categoryId: string }) {
  const { result } = useMany<Category>({
    resource: "categories",
    ids: [categoryId],
    queryOptions: {
      enabled: !!categoryId,
    },
  });

  const category = result?.data?.[0];

  return (
    <span className="text-sm">
      {category?.name || "Uncategorized"}
    </span>
  );
}