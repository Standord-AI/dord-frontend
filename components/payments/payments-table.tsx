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
import { Payment } from "@/global-types";

interface PaymentsTableProps {
  payments: Payment[];
}

export function PaymentsTable({ payments }: PaymentsTableProps) {
  if (payments.length === 0) {
    return <div className="text-muted-foreground">No payments found.</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Transaction ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Order ID</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.ID}>
              <TableCell className="font-medium">
                {payment.TransactionID}
              </TableCell>
              <TableCell>
                <span suppressHydrationWarning>
                  {new Date(payment.PaymentDate).toLocaleDateString("en-US")}
                </span>
              </TableCell>
              <TableCell>#{payment.OrderID}</TableCell>
              <TableCell className="capitalize">
                {payment.PaymentMethod.replace("_", " ")}
              </TableCell>
              <TableCell>
                <Badge variant="outline">{payment.Status}</Badge>
              </TableCell>
              <TableCell className="text-right">
                {payment.Currency} {payment.Amount.toFixed(2)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
