import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Eye, Trash2 } from "lucide-react";
import type { Order } from "@/pages/Orders";

type OrderListProps = {
  orders: Order[];
  onDelete: (id: string) => void;
};

const statusColors = {
  pending: "bg-warning text-warning-foreground",
  invoiced: "bg-info text-info-foreground",
  paid: "bg-success text-success-foreground",
};

export const OrderList = ({ orders, onDelete }: OrderListProps) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">No orders created yet. Click "Create Order" to get started.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Order List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order Number</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Grand Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.orderNumber}</TableCell>
                  <TableCell>{order.vendorName}</TableCell>
                  <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                  <TableCell>{order.items.length} item(s)</TableCell>
                  <TableCell>₹{order.grandTotal.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[order.status]}>{order.status.toUpperCase()}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="icon" onClick={() => setSelectedOrder(order)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Order Details - {order.orderNumber}</DialogTitle>
                          </DialogHeader>
                          {selectedOrder && selectedOrder.id === order.id && (
                            <div className="space-y-6">
                              <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                  <p className="text-sm text-muted-foreground">Vendor</p>
                                  <p className="font-medium">{selectedOrder.vendorName}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Order Date</p>
                                  <p className="font-medium">{new Date(selectedOrder.orderDate).toLocaleDateString()}</p>
                                </div>
                              </div>

                              <div>
                                <h3 className="mb-3 font-semibold">Order Items</h3>
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Description</TableHead>
                                      <TableHead>Qty</TableHead>
                                      <TableHead>Unit Price</TableHead>
                                      <TableHead>GST %</TableHead>
                                      <TableHead>GST Amount</TableHead>
                                      <TableHead>Total</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {selectedOrder.items.map((item) => (
                                      <TableRow key={item.id}>
                                        <TableCell>{item.description}</TableCell>
                                        <TableCell>{item.quantity}</TableCell>
                                        <TableCell>₹{item.unitPrice.toFixed(2)}</TableCell>
                                        <TableCell>{item.gstRate}%</TableCell>
                                        <TableCell>₹{item.gstAmount.toFixed(2)}</TableCell>
                                        <TableCell className="font-medium">₹{item.totalAmount.toFixed(2)}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>

                              <div className="border-t pt-4">
                                <div className="flex justify-end">
                                  <div className="w-64 space-y-2">
                                    <div className="flex justify-between text-sm">
                                      <span>Subtotal:</span>
                                      <span>₹{selectedOrder.subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <span>Total GST:</span>
                                      <span>₹{selectedOrder.totalGst.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between border-t pt-2 font-bold">
                                      <span>Grand Total:</span>
                                      <span>₹{selectedOrder.grandTotal.toFixed(2)}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <h3 className="mb-2 font-semibold">Terms & Conditions</h3>
                                <div className="whitespace-pre-wrap rounded-lg bg-muted p-4 text-sm">
                                  {selectedOrder.termsAndConditions}
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      <Button variant="outline" size="icon" onClick={() => onDelete(order.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
};
