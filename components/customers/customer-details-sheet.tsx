"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Customer } from "@/global-types";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface CustomerDetailsSheetProps {
  customer: Customer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CustomerDetailsSheet({
  customer,
  open,
  onOpenChange,
}: CustomerDetailsSheetProps) {
  if (!customer) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>Customer Details</SheetTitle>
          <SheetDescription>
            View detailed information about {customer.first_name}{" "}
            {customer.last_name}.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Header Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                {customer.first_name[0]}
                {customer.last_name[0]}
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  {customer.first_name} {customer.last_name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  ID: {customer.user_id}
                </p>
              </div>
            </div>
            <Badge
              variant={customer.status === "active" ? "default" : "secondary"}
            >
              {customer.status}
            </Badge>
          </div>

          <Separator />

          {/* Contact Info */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                Email
              </h4>
              <p className="text-sm font-medium">{customer.email}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                Phone
              </h4>
              <p className="text-sm font-medium">{customer.phone}</p>
            </div>
          </div>

          <Separator />

          {/* Metrics */}
          <div>
            <h4 className="mb-4 text-sm font-medium text-muted-foreground">
              Purchase History
            </h4>
            <div className="grid gap-4 rounded-lg border p-4 md:grid-cols-3">
              <div>
                <p className="text-xs text-muted-foreground">Total Spent</p>
                <p className="text-xl font-bold">
                  ${customer.total_spent.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Orders</p>
                <p className="text-xl font-bold">{customer.total_orders}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Avg. Order</p>
                <p className="text-xl font-bold">
                  ${customer.average_order_value.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                First Purchase
              </h4>
              <p className="text-sm">
                {format(new Date(customer.first_purchase_date), "PPP")}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                Last Purchase
              </h4>
              <p className="text-sm">
                {format(new Date(customer.last_purchase_date), "PPP")}
              </p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
