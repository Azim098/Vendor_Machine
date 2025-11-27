import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { OrderForm } from "@/components/OrderForm";
import { OrderList } from "@/components/OrderList";
import type { Vendor } from "./Vendors";

export type OrderItem = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  gstRate: number;
  gstAmount: number;
  totalAmount: number;
};

export type Order = {
  id: string;
  orderNumber: string;
  vendorName: string;
  orderDate: string;
  items: OrderItem[];
  subtotal: number;
  totalGst: number;
  grandTotal: number;
  termsAndConditions: string;
  status: "pending" | "invoiced" | "paid";
};

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [vendors] = useState<Vendor[]>([]); // In real app, fetch from context or props

  const handleAddOrder = (order: Omit<Order, "id" | "status">) => {
    setOrders([...orders, { ...order, id: Date.now().toString(), status: "pending" }]);
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setOrders(orders.filter((o) => o.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Orders</h1>
          <p className="text-muted-foreground">Create and manage purchase orders</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Order
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Order</CardTitle>
          </CardHeader>
          <CardContent>
            <OrderForm 
              onSubmit={handleAddOrder} 
              onCancel={() => setShowForm(false)}
              vendors={vendors}
              existingOrders={orders}
            />
          </CardContent>
        </Card>
      )}

      <OrderList orders={orders} onDelete={handleDelete} />
    </div>
  );
};

export default Orders;
