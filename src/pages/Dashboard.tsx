import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Receipt, Wallet } from "lucide-react";

const stats = [
  { title: "Total Vendors", value: "0", icon: Users, color: "text-primary" },
  { title: "Active Orders", value: "0", icon: FileText, color: "text-info" },
  { title: "Pending Invoices", value: "0", icon: Receipt, color: "text-warning" },
  { title: "Payments Sent", value: "₹0", icon: Wallet, color: "text-success" },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your vendor management system</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={cn("h-4 w-4", stat.color)} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">No orders yet. Create your first order to get started.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">No payments yet. Make your first payment to track it here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
