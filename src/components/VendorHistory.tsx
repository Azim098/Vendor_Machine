import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Vendor } from "@/pages/Vendors";
import type { Order } from "@/pages/Orders";
import type { Invoice } from "@/pages/Invoices";
import type { Payment } from "@/pages/Payments";

type VendorHistoryProps = {
  vendor: Vendor;
  orders: Order[];
  invoices: Invoice[];
  payments: Payment[];
};

export const VendorHistory = ({ vendor, orders, invoices, payments }: VendorHistoryProps) => {
  const vendorOrders = orders.filter((o) => o.vendorName === vendor.name);
  const vendorInvoices = invoices.filter((i) => i.vendorName === vendor.name);
  const vendorPayments = payments.filter((p) => p.vendorName === vendor.name);

  const totalOrders = vendorOrders.reduce((sum, o) => sum + o.grandTotal, 0);
  const totalInvoiced = vendorInvoices.reduce((sum, i) => sum + i.amount, 0);
  const totalPaid = vendorPayments.reduce((sum, p) => sum + p.amount, 0);
  const outstandingAmount = totalInvoiced - totalPaid;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{vendor.name}</h2>
        <p className="text-muted-foreground">GST: {vendor.gst}</p>
        <p className="text-sm text-muted-foreground mt-1">{vendor.address}, {vendor.city}, {vendor.state} - {vendor.pincode}</p>
        <p className="text-sm text-muted-foreground">Contact: {vendor.contactPerson} | {vendor.email} | {vendor.phone}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalOrders.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{vendorOrders.length} orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Invoiced</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalInvoiced.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{vendorInvoices.length} invoices</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">₹{totalPaid.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{vendorPayments.length} payments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">₹{outstandingAmount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Pending payment</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="orders" className="w-full">
        <TabsList>
          <TabsTrigger value="orders">Orders ({vendorOrders.length})</TabsTrigger>
          <TabsTrigger value="invoices">Invoices ({vendorInvoices.length})</TabsTrigger>
          <TabsTrigger value="payments">Payments ({vendorPayments.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order Number</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendorOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        No orders found
                      </TableCell>
                    </TableRow>
                  ) : (
                    vendorOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.orderNumber}</TableCell>
                        <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                        <TableCell>{order.items.length} items</TableCell>
                        <TableCell>₹{order.grandTotal.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant={order.status === "paid" ? "default" : order.status === "invoiced" ? "secondary" : "outline"}>
                            {order.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice Number</TableHead>
                    <TableHead>Order Number</TableHead>
                    <TableHead>Invoice Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendorInvoices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        No invoices found
                      </TableCell>
                    </TableRow>
                  ) : (
                    vendorInvoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                        <TableCell>{invoice.orderNumber}</TableCell>
                        <TableCell>{new Date(invoice.invoiceDate).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                        <TableCell>₹{invoice.amount.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant={invoice.status === "paid" ? "default" : "outline"}>
                            {invoice.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice Number</TableHead>
                    <TableHead>Payment Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendorPayments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        No payments found
                      </TableCell>
                    </TableRow>
                  ) : (
                    vendorPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.invoiceNumber}</TableCell>
                        <TableCell>{new Date(payment.paymentDate).toLocaleDateString()}</TableCell>
                        <TableCell>₹{payment.amount.toFixed(2)}</TableCell>
                        <TableCell className="capitalize">{payment.paymentMethod.replace("_", " ")}</TableCell>
                        <TableCell>{payment.paymentAccount}</TableCell>
                        <TableCell>
                          <Badge variant="default">{payment.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
