import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, ChevronsUpDown, Upload, X } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { Invoice } from "@/pages/Invoices";
import type { Vendor } from "@/pages/Vendors";

type InvoiceFormProps = {
  onSubmit: (data: Omit<Invoice, "id" | "status">) => void;
  onCancel: () => void;
  vendors: Vendor[];
};

export const InvoiceForm = ({ onSubmit, onCancel, vendors }: InvoiceFormProps) => {
  const [openVendor, setOpenVendor] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState("");
  const [invoiceFile, setInvoiceFile] = useState<File | null>(null);
  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    setValue("vendorName", selectedVendor);
  }, [selectedVendor, setValue]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setInvoiceFile(e.target.files[0]);
    }
  };

  const handleFormSubmit = (data: any) => {
    onSubmit({
      ...data,
      invoiceFile: invoiceFile ? URL.createObjectURL(invoiceFile) : undefined,
      invoiceFileName: invoiceFile?.name,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="invoiceNumber">Invoice Number *</Label>
          <Input id="invoiceNumber" {...register("invoiceNumber", { required: true })} placeholder="INV-001" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="orderNumber">Order Number *</Label>
          <Input id="orderNumber" {...register("orderNumber", { required: true })} placeholder="PO-001" />
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
          <Label htmlFor="amount">Amount (₹) *</Label>
          <Input id="amount" type="number" step="0.01" {...register("amount", { required: true, valueAsNumber: true })} placeholder="0.00" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="invoiceDate">Invoice Date *</Label>
          <Input id="invoiceDate" type="date" {...register("invoiceDate", { required: true })} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dueDate">Due Date *</Label>
          <Input id="dueDate" type="date" {...register("dueDate", { required: true })} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="invoiceFile">Upload Invoice (PDF/Image)</Label>
        <div className="flex items-center gap-2">
          <Input
            id="invoiceFile"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById("invoiceFile")?.click()}
            className="w-full"
          >
            <Upload className="mr-2 h-4 w-4" />
            {invoiceFile ? "Change File" : "Upload Invoice"}
          </Button>
        </div>
        {invoiceFile && (
          <div className="flex items-center justify-between rounded-md border p-2 text-sm">
            <span className="truncate">{invoiceFile.name}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setInvoiceFile(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Button type="submit">Add Invoice</Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};
