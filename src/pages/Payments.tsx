import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { PaymentForm } from "@/components/PaymentForm";
import { PaymentList } from "@/components/PaymentList";

export type Payment = {
  id: string;
  invoiceNumber: string;
  vendorName: string;
  amount: number;
  paymentDate: string;
  paymentAccount: string;
  paymentMethod: string;
  status: "sent" | "pending";
};

const Payments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [showForm, setShowForm] = useState(false);

  const handleAddPayment = (payment: Omit<Payment, "id" | "status">) => {
    setPayments([...payments, { ...payment, id: Date.now().toString(), status: "sent" }]);
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setPayments(payments.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Payments</h1>
          <p className="text-muted-foreground">Record and track vendor payments</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Record Payment
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Record New Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <PaymentForm onSubmit={handleAddPayment} onCancel={() => setShowForm(false)} />
          </CardContent>
        </Card>
      )}

      <PaymentList payments={payments} onDelete={handleDelete} />
    </div>
  );
};

export default Payments;
