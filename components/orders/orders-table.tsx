"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Order } from "@/global-types";

interface OrdersTableProps {
  orders: Order[];
}

export function OrdersTable({ orders }: OrdersTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Order ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Customer Location</TableHead>
            <TableHead>Payment Method</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.ID}>
              <TableCell className="font-medium">#{order.ID}</TableCell>
              <TableCell>
                <span suppressHydrationWarning>
                  {new Date(order.CreatedAt).toLocaleDateString("en-US")}
                </span>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{order.Status}</Badge>
              </TableCell>
              <TableCell>
                {order.BillingAddress.city}, {order.BillingAddress.country}
              </TableCell>
              <TableCell className="capitalize">
                {order.PaymentMethod.replace("_", " ")}
              </TableCell>
              <TableCell className="text-right">
                ${order.TotalAmount.toFixed(2)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
