import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import type { Payment } from "@/pages/Payments";

type PaymentListProps = {
  payments: Payment[];
  onDelete: (id: string) => void;
};

const statusColors = {
  sent: "bg-success text-success-foreground",
  pending: "bg-warning text-warning-foreground",
};

export const PaymentList = ({ payments, onDelete }: PaymentListProps) => {
  if (payments.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">No payments recorded yet. Click "Record Payment" to get started.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice Number</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payment Date</TableHead>
              <TableHead>Payment Account</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-medium">{payment.invoiceNumber}</TableCell>
                <TableCell>{payment.vendorName}</TableCell>
                <TableCell>₹{payment.amount.toLocaleString()}</TableCell>
                <TableCell>{new Date(payment.paymentDate).toLocaleDateString()}</TableCell>
                <TableCell>{payment.paymentAccount}</TableCell>
                <TableCell className="capitalize">{payment.paymentMethod.replace("_", " ")}</TableCell>
                <TableCell>
                  <Badge className={statusColors[payment.status]}>{payment.status.toUpperCase()}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="icon" onClick={() => onDelete(payment.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
