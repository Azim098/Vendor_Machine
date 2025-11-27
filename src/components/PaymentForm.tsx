import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Payment } from "@/pages/Payments";

type PaymentFormProps = {
  onSubmit: (data: Omit<Payment, "id" | "status">) => void;
  onCancel: () => void;
};

export const PaymentForm = ({ onSubmit, onCancel }: PaymentFormProps) => {
  const { register, handleSubmit, setValue } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="invoiceNumber">Invoice Number *</Label>
          <Input id="invoiceNumber" {...register("invoiceNumber", { required: true })} placeholder="INV-001" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="vendorName">Vendor Name *</Label>
          <Input id="vendorName" {...register("vendorName", { required: true })} placeholder="Select or type vendor name" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Payment Amount (₹) *</Label>
          <Input id="amount" type="number" step="0.01" {...register("amount", { required: true, valueAsNumber: true })} placeholder="0.00" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="paymentDate">Payment Date *</Label>
          <Input id="paymentDate" type="date" {...register("paymentDate", { required: true })} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="paymentAccount">Payment Account *</Label>
          <Input id="paymentAccount" {...register("paymentAccount", { required: true })} placeholder="e.g., HDFC Bank A/c ****1234" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="paymentMethod">Payment Method *</Label>
          <Select onValueChange={(value) => setValue("paymentMethod", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
              <SelectItem value="cheque">Cheque</SelectItem>
              <SelectItem value="upi">UPI</SelectItem>
              <SelectItem value="card">Card</SelectItem>
              <SelectItem value="cash">Cash</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="submit">Record Payment</Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};
