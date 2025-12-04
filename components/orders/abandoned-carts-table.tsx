"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AbandonedCart } from "@/global-types";

interface AbandonedCartsTableProps {
  carts: AbandonedCart[];
}

export function AbandonedCartsTable({ carts }: AbandonedCartsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Cart ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="text-right">Total Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {carts.map((cart) => (
            <TableRow key={cart.cart_id}>
              <TableCell className="font-medium">#{cart.cart_id}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">
                    {cart.user_first_name} {cart.user_last_name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ID: {cart.user_id}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span>{cart.user_email}</span>
                  <span className="text-xs text-muted-foreground">
                    {cart.user_phone}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <span suppressHydrationWarning>
                  {new Date(cart.updated_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </TableCell>
              <TableCell className="text-right">
                ${cart.total_price.toFixed(2)}
              </TableCell>
            </TableRow>
          ))}
          {carts.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No abandoned carts found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
