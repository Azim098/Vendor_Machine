import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { VendorForm } from "@/components/VendorForm";
import { VendorList } from "@/components/VendorList";
import type { Order } from "./Orders";
import type { Invoice } from "./Invoices";
import type { Payment } from "./Payments";

export type Vendor = {
  id: string;
  name: string;
  gst: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  contactPerson: string;
  email: string;
  phone: string;
};

const Vendors = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  
  // In real app, these would come from context or global state
  const [orders] = useState<Order[]>([]);
  const [invoices] = useState<Invoice[]>([]);
  const [payments] = useState<Payment[]>([]);

  const handleAddVendor = (vendor: Omit<Vendor, "id">) => {
    if (editingVendor) {
      setVendors(vendors.map((v) => (v.id === editingVendor.id ? { ...vendor, id: v.id } : v)));
      setEditingVendor(null);
    } else {
      setVendors([...vendors, { ...vendor, id: Date.now().toString() }]);
    }
    setShowForm(false);
  };

  const handleEdit = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setVendors(vendors.filter((v) => v.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Vendors</h1>
          <p className="text-muted-foreground">Manage your vendor information</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Vendor
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingVendor ? "Edit Vendor" : "Add New Vendor"}</CardTitle>
          </CardHeader>
          <CardContent>
            <VendorForm
              onSubmit={handleAddVendor}
              onCancel={() => {
                setShowForm(false);
                setEditingVendor(null);
              }}
              initialData={editingVendor || undefined}
            />
          </CardContent>
        </Card>
      )}

      <VendorList 
        vendors={vendors} 
        onEdit={handleEdit} 
        onDelete={handleDelete}
        orders={orders}
        invoices={invoices}
        payments={payments}
      />
    </div>
  );
};

export default Vendors;
