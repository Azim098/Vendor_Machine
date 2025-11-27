import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Vendor } from "@/pages/Vendors";

type VendorFormProps = {
  onSubmit: (data: Omit<Vendor, "id">) => void;
  onCancel: () => void;
  initialData?: Vendor;
};

export const VendorForm = ({ onSubmit, onCancel, initialData }: VendorFormProps) => {
  const { register, handleSubmit } = useForm({
    defaultValues: initialData || {},
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Vendor Name *</Label>
          <Input id="name" {...register("name", { required: true })} placeholder="ABC Enterprises" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gst">GST Number *</Label>
          <Input id="gst" {...register("gst", { required: true })} placeholder="22AAAAA0000A1Z5" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactPerson">Contact Person *</Label>
          <Input id="contactPerson" {...register("contactPerson", { required: true })} placeholder="John Doe" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input id="email" type="email" {...register("email", { required: true })} placeholder="vendor@example.com" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone *</Label>
          <Input id="phone" {...register("phone", { required: true })} placeholder="+91 9876543210" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">City *</Label>
          <Input id="city" {...register("city", { required: true })} placeholder="Mumbai" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">State *</Label>
          <Input id="state" {...register("state", { required: true })} placeholder="Maharashtra" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="pincode">Pincode *</Label>
          <Input id="pincode" {...register("pincode", { required: true })} placeholder="400001" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address *</Label>
        <Textarea id="address" {...register("address", { required: true })} placeholder="Street address, building, etc." rows={3} />
      </div>

      <div className="flex gap-2">
        <Button type="submit">Save Vendor</Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};
