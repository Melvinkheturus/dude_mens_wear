"use client";

import { useList, useUpdate, useCreate, useDelete } from "@refinedev/core";
import { useState } from "react";
import { Edit, Trash2, Plus, Save, X } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { Badge } from "@/shared/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";

interface ShippingRule {
  id: string;
  zone: string;
  max_quantity: number;
  price: number;
  provider: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function ShippingSettingsPage() {
  const [editingRule, setEditingRule] = useState<ShippingRule | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Fetch shipping rules
  const { query: { data: shippingRules, isLoading, refetch } } = useList<ShippingRule>({
    resource: "shipping_rules",
    sorters: [
      { field: "zone", order: "asc" },
      { field: "max_quantity", order: "asc" },
    ],
  });

  const { mutate: updateRule } = useUpdate();
  const { mutate: createRule } = useCreate();
  const { mutate: deleteRule } = useDelete();

  const rules = (shippingRules as any)?.data || [];

  const handleUpdateRule = (id: string, updates: Partial<ShippingRule>) => {
    updateRule({
      resource: "shipping_rules",
      id,
      values: updates,
    }, {
      onSuccess: () => {
        setEditingRule(null);
        refetch();
      },
    });
  };

  const handleCreateRule = (rule: Omit<ShippingRule, "id" | "created_at" | "updated_at">) => {
    createRule({
      resource: "shipping_rules",
      values: rule,
    }, {
      onSuccess: () => {
        setIsCreateDialogOpen(false);
        refetch();
      },
    });
  };

  const handleDeleteRule = (id: string) => {
    if (confirm("Are you sure you want to delete this shipping rule?")) {
      deleteRule({
        resource: "shipping_rules",
        id,
      }, {
        onSuccess: () => {
          refetch();
        },
      });
    }
  };

  const formatZoneDisplay = (zone: string) => {
    return zone === "tamilnadu" ? "Tamil Nadu" : "Rest of India";
  };

  const formatQuantityDisplay = (maxQuantity: number) => {
    return maxQuantity >= 999 ? "5+" : `≤${maxQuantity}`;
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Shipping Settings</h1>
          <p className="text-gray-500 mt-1">
            Manage shipping rates and zones for ST Courier
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Rule
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Shipping Rule</DialogTitle>
            </DialogHeader>
            <CreateRuleForm 
              onSubmit={handleCreateRule}
              onCancel={() => setIsCreateDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Current Rules Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Current Shipping Rates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h3 className="font-medium text-green-700">Tamil Nadu</h3>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>≤4 products:</span>
                  <span className="font-medium">₹60</span>
                </div>
                <div className="flex justify-between">
                  <span>5+ products:</span>
                  <span className="font-medium">₹120</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-blue-700">Rest of India</h3>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>≤4 products:</span>
                  <span className="font-medium">₹100</span>
                </div>
                <div className="flex justify-between">
                  <span>5+ products:</span>
                  <span className="font-medium">₹150</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Rules Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Manage Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Zone</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.map((rule: ShippingRule) => (
                <TableRow key={rule.id}>
                  <TableCell>
                    {editingRule?.id === rule.id ? (
                      <EditRuleForm
                        rule={rule}
                        onSave={(updates) => handleUpdateRule(rule.id, updates)}
                        onCancel={() => setEditingRule(null)}
                      />
                    ) : (
                      <>
                        <div className="font-medium">
                          {formatZoneDisplay(rule.zone)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatQuantityDisplay(rule.max_quantity)}
                        </div>
                        <div className="text-sm font-medium">
                          ₹{(rule.price / 100).toFixed(0)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {rule.provider}
                        </div>
                        <Badge variant={rule.is_active ? "default" : "secondary"}>
                          {rule.is_active ? "Active" : "Inactive"}
                        </Badge>
                        <div className="flex gap-2 mt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingRule(rule)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteRule(rule.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Shipping Logic Explanation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">How Shipping Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm space-y-2">
            <p><strong>Zone Detection:</strong> Based on shipping address state</p>
            <p><strong>Rate Calculation:</strong> Based on total quantity in cart</p>
            <p><strong>Provider:</strong> ST Courier for all deliveries</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg text-sm">
            <h4 className="font-medium mb-2">Example Calculations:</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• 3 items to Chennai → Tamil Nadu ≤4 → ₹60</li>
              <li>• 6 items to Chennai → Tamil Nadu 5+ → ₹120</li>
              <li>• 2 items to Mumbai → Rest of India ≤4 → ₹100</li>
              <li>• 8 items to Delhi → Rest of India 5+ → ₹150</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function EditRuleForm({ 
  rule, 
  onSave, 
  onCancel 
}: { 
  rule: ShippingRule;
  onSave: (updates: Partial<ShippingRule>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    zone: rule.zone,
    max_quantity: rule.max_quantity,
    price: rule.price / 100, // Convert to rupees for display
    provider: rule.provider,
    is_active: rule.is_active,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      price: formData.price * 100, // Convert back to paise
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="zone">Zone</Label>
          <Select value={formData.zone} onValueChange={(value) => setFormData({...formData, zone: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tamilnadu">Tamil Nadu</SelectItem>
              <SelectItem value="rest_of_india">Rest of India</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="max_quantity">Max Quantity</Label>
          <Input
            type="number"
            value={formData.max_quantity}
            onChange={(e) => setFormData({...formData, max_quantity: parseInt(e.target.value)})}
            min="1"
            max="999"
          />
        </div>
        
        <div>
          <Label htmlFor="price">Price (₹)</Label>
          <Input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
            min="0"
            step="0.01"
          />
        </div>
        
        <div>
          <Label htmlFor="provider">Provider</Label>
          <Input
            value={formData.provider}
            onChange={(e) => setFormData({...formData, provider: e.target.value})}
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.is_active}
            onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
          />
          Active
        </label>
      </div>
      
      <div className="flex gap-2">
        <Button type="submit" size="sm">
          <Save className="h-3 w-3 mr-1" />
          Save
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          <X className="h-3 w-3 mr-1" />
          Cancel
        </Button>
      </div>
    </form>
  );
}

function CreateRuleForm({ 
  onSubmit, 
  onCancel 
}: { 
  onSubmit: (rule: Omit<ShippingRule, "id" | "created_at" | "updated_at">) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    zone: "tamilnadu",
    max_quantity: 4,
    price: 60, // In rupees for display
    provider: "st_courier",
    is_active: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      price: formData.price * 100, // Convert to paise
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="zone">Zone</Label>
          <Select value={formData.zone} onValueChange={(value) => setFormData({...formData, zone: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tamilnadu">Tamil Nadu</SelectItem>
              <SelectItem value="rest_of_india">Rest of India</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="max_quantity">Max Quantity</Label>
          <Input
            type="number"
            value={formData.max_quantity}
            onChange={(e) => setFormData({...formData, max_quantity: parseInt(e.target.value)})}
            min="1"
            max="999"
          />
        </div>
        
        <div>
          <Label htmlFor="price">Price (₹)</Label>
          <Input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
            min="0"
            step="0.01"
          />
        </div>
        
        <div>
          <Label htmlFor="provider">Provider</Label>
          <Input
            value={formData.provider}
            onChange={(e) => setFormData({...formData, provider: e.target.value})}
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.is_active}
            onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
          />
          Active
        </label>
      </div>
      
      <div className="flex gap-2">
        <Button type="submit">
          <Plus className="h-4 w-4 mr-2" />
          Create Rule
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}