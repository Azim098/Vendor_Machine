import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Trash2, Plus, Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { Order, OrderItem } from "@/pages/Orders";
import type { Vendor } from "@/pages/Vendors";

type OrderFormProps = {
  onSubmit: (data: Omit<Order, "id" | "status">) => void;
  onCancel: () => void;
  vendors: Vendor[];
  existingOrders: Order[];
};

type FormItem = {
  description: string;
  quantity: number;
  unitPrice: number;
  gstRate: number;
};

const defaultTerms = `1. Payment terms: Net 30 days from invoice date
2. Delivery timeline as per agreed schedule
3. Quality as per specifications
4. Prices are inclusive of GST
5. All disputes subject to [City] jurisdiction`;

export const OrderForm = ({ onSubmit, onCancel, vendors, existingOrders }: OrderFormProps) => {
  const [openVendor, setOpenVendor] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState("");

  // Generate next order number automatically
  const generateOrderNumber = () => {
    const lastOrder = existingOrders[existingOrders.length - 1];
    if (!lastOrder) return "PO-001";
    
    const lastNumber = parseInt(lastOrder.orderNumber.split("-")[1]);
    return `PO-${String(lastNumber + 1).padStart(3, "0")}`;
  };

  // Get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  const { register, handleSubmit, control, watch, setValue } = useForm({
    defaultValues: {
      orderNumber: generateOrderNumber(),
      vendorName: "",
      orderDate: getCurrentDate(),
      items: [{ description: "", quantity: 1, unitPrice: 0, gstRate: 18 }] as FormItem[],
      termsAndConditions: defaultTerms,
    },
  });

  useEffect(() => {
    setValue("vendorName", selectedVendor);
  }, [selectedVendor, setValue]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const watchItems = watch("items");

  const calculateItemTotals = (item: FormItem): OrderItem => {
    const baseAmount = item.quantity * item.unitPrice;
    const gstAmount = (baseAmount * item.gstRate) / 100;
    const totalAmount = baseAmount + gstAmount;

    return {
      id: Date.now().toString() + Math.random(),
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      gstRate: item.gstRate,
      gstAmount,
      totalAmount,
    };
  };

  const calculateTotals = () => {
    const items = watchItems.map(calculateItemTotals);
    const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const totalGst = items.reduce((sum, item) => sum + item.gstAmount, 0);
    const grandTotal = subtotal + totalGst;

    return { items, subtotal, totalGst, grandTotal };
  };

  const { subtotal, totalGst, grandTotal } = calculateTotals();

  const handleFormSubmit = (data: any) => {
    const { items } = calculateTotals();
    onSubmit({
      orderNumber: data.orderNumber,
      vendorName: data.vendorName,
      orderDate: data.orderDate,
      items,
      subtotal,
      totalGst,
      grandTotal,
      termsAndConditions: data.termsAndConditions,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="orderNumber">Order Number *</Label>
          <Input 
            id="orderNumber" 
            {...register("orderNumber", { required: true })} 
            placeholder="PO-001"
            readOnly
            className="bg-muted"
          />
        </div>

        <div className="space-y-2">
          <Label>Vendor Name *</Label>
          <Popover open={openVendor} onOpenChange={setOpenVendor}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openVendor}
                className="w-full justify-between"
              >
                {selectedVendor || "Select vendor..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search vendor..." />
                <CommandList>
                  <CommandEmpty>No vendor found.</CommandEmpty>
                  <CommandGroup>
                    {vendors.map((vendor) => (
                      <CommandItem
                        key={vendor.id}
                        value={vendor.name}
                        onSelect={(currentValue) => {
                          setSelectedVendor(currentValue === selectedVendor ? "" : currentValue);
                          setOpenVendor(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedVendor === vendor.name ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {vendor.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <input type="hidden" {...register("vendorName", { required: true })} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="orderDate">Order Date *</Label>
          <Input id="orderDate" type="date" {...register("orderDate", { required: true })} />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Order Items</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ description: "", quantity: 1, unitPrice: 0, gstRate: 18 })}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>

        <div className="space-y-3">
          {fields.map((field, index) => (
            <Card key={field.id} className="p-4">
              <div className="grid gap-4 md:grid-cols-5">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor={`items.${index}.description`}>Item Description *</Label>
                  <Input
                    id={`items.${index}.description`}
                    {...register(`items.${index}.description`, { required: true })}
                    placeholder="Item name/description"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`items.${index}.quantity`}>Quantity *</Label>
                  <Input
                    id={`items.${index}.quantity`}
                    type="number"
                    min="1"
                    {...register(`items.${index}.quantity`, { required: true, valueAsNumber: true })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`items.${index}.unitPrice`}>Unit Price (₹) *</Label>
                  <Input
                    id={`items.${index}.unitPrice`}
                    type="number"
                    step="0.01"
                    min="0"
                    {...register(`items.${index}.unitPrice`, { required: true, valueAsNumber: true })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`items.${index}.gstRate`}>GST (%) *</Label>
                  <Input
                    id={`items.${index}.gstRate`}
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    {...register(`items.${index}.gstRate`, { required: true, valueAsNumber: true })}
                  />
                </div>
              </div>

              {watchItems[index] && (
                <div className="mt-3 flex items-center justify-between border-t pt-3 text-sm">
                  <div className="space-x-4 text-muted-foreground">
                    <span>Base: ₹{(watchItems[index].quantity * watchItems[index].unitPrice).toFixed(2)}</span>
                    <span>
                      GST: ₹{((watchItems[index].quantity * watchItems[index].unitPrice * watchItems[index].gstRate) / 100).toFixed(2)}
                    </span>
                    <span className="font-semibold text-foreground">
                      Total: ₹
                      {(
                        watchItems[index].quantity * watchItems[index].unitPrice +
                        (watchItems[index].quantity * watchItems[index].unitPrice * watchItems[index].gstRate) / 100
                      ).toFixed(2)}
                    </span>
                  </div>
                  {fields.length > 1 && (
                    <Button type="button" variant="outline" size="icon" onClick={() => remove(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>

        <Card className="bg-muted p-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-medium">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Total GST:</span>
              <span className="font-medium">₹{totalGst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t pt-2 text-base font-bold">
              <span>Grand Total:</span>
              <span>₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-2">
        <Label htmlFor="termsAndConditions">Terms & Conditions *</Label>
        <Textarea
          id="termsAndConditions"
          {...register("termsAndConditions", { required: true })}
          placeholder="Enter terms and conditions..."
          rows={6}
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit">Create Order</Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};
