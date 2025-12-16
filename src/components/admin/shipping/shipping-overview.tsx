"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Truck, MapPin, Calculator, Settings } from "lucide-react";
import Link from "next/link";

export function ShippingOverview() {
  return (
    <div className="space-y-6">
      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-green-600" />
            Shipping System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="font-medium">ST Courier Active</p>
                <p className="text-sm text-gray-500">Primary shipping provider</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="font-medium">Zone-Based Rates</p>
                <p className="text-sm text-gray-500">Tamil Nadu & Rest of India</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="font-medium">Real-time Calculation</p>
                <p className="text-sm text-gray-500">Quantity-based pricing</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Rates */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-4 w-4 text-green-600" />
              Tamil Nadu Rates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                <div>
                  <p className="font-medium">≤4 Products</p>
                  <p className="text-sm text-gray-600">Standard delivery</p>
                </div>
                <Badge className="bg-green-100 text-green-800">₹60</Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                <div>
                  <p className="font-medium">5+ Products</p>
                  <p className="text-sm text-gray-600">Bulk delivery</p>
                </div>
                <Badge className="bg-green-100 text-green-800">₹120</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-600" />
              Rest of India Rates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                <div>
                  <p className="font-medium">≤4 Products</p>
                  <p className="text-sm text-gray-600">Standard delivery</p>
                </div>
                <Badge className="bg-blue-100 text-blue-800">₹100</Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                <div>
                  <p className="font-medium">5+ Products</p>
                  <p className="text-sm text-gray-600">Bulk delivery</p>
                </div>
                <Badge className="bg-blue-100 text-blue-800">₹150</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/admin/settings/shipping"
              className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Calculator className="h-4 w-4 text-blue-600" />
              <div>
                <p className="font-medium">Manage Rates</p>
                <p className="text-sm text-gray-500">Update shipping rules</p>
              </div>
            </Link>
            
            <Link
              href="/admin/orders"
              className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Truck className="h-4 w-4 text-green-600" />
              <div>
                <p className="font-medium">Track Orders</p>
                <p className="text-sm text-gray-500">Manage shipments</p>
              </div>
            </Link>

            <div className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50">
              <MapPin className="h-4 w-4 text-gray-400" />
              <div>
                <p className="font-medium text-gray-500">Integration Ready</p>
                <p className="text-sm text-gray-400">Use shipping components</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Info */}
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 text-sm">
            <div>
              <h4 className="font-medium mb-2">Features</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Zone-based shipping calculation</li>
                <li>• Quantity-based pricing tiers</li>
                <li>• Real-time rate calculation</li>
                <li>• Admin-configurable rules</li>
                <li>• Order tracking integration</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Coverage</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Tamil Nadu: Special rates</li>
                <li>• Rest of India: Standard rates</li>
                <li>• 3-5 business days delivery</li>
                <li>• ST Courier network</li>
                <li>• Guest & user checkout</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}