import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { InvoiceForm } from "@/components/InvoiceForm";
import { InvoiceList } from "@/components/InvoiceList";
import type { Vendor } from "./Vendors";

export type Invoice = {
  id: string;
  invoiceNumber: string;
  orderNumber: string;
  vendorName: string;
  invoiceDate: string;
  dueDate: string;
  amount: number;
  status: "pending" | "paid";
  invoiceFile?: string;
  invoiceFileName?: string;
};

const Invoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [vendors] = useState<Vendor[]>([]); // In real app, fetch from context or props

  const handleAddInvoice = (invoice: Omit<Invoice, "id" | "status">) => {
    setInvoices([...invoices, { ...invoice, id: Date.now().toString(), status: "pending" }]);
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setInvoices(invoices.filter((i) => i.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Invoices</h1>
          <p className="text-muted-foreground">Track vendor invoices and payments</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Invoice
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Invoice</CardTitle>
          </CardHeader>
          <CardContent>
            <InvoiceForm 
              onSubmit={handleAddInvoice} 
              onCancel={() => setShowForm(false)}
              vendors={vendors}
            />
          </CardContent>
        </Card>
      )}

      <InvoiceList invoices={invoices} onDelete={handleDelete} />
    </div>
  );
};

export default Invoices;
