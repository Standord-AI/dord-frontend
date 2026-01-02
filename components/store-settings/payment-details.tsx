"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BankAccount } from "@/global-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PaymentDetailsProps {
  bankAccounts: BankAccount[];
}

export function PaymentDetails({ bankAccounts }: PaymentDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Details (Bank Transfer)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {bankAccounts.length > 0 ? (
          bankAccounts.map((account) => (
            <div
              key={account.ID}
              className="border rounded-lg p-4 space-y-4 relative"
            >
              {account.IsDefault && (
                <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                  Default
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`bankName-${account.ID}`}>Bank Name</Label>
                  <Input
                    id={`bankName-${account.ID}`}
                    value={account.BankName}
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`branchName-${account.ID}`}>Branch</Label>
                  <Input
                    id={`branchName-${account.ID}`}
                    value={account.Branch}
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`accountHolder-${account.ID}`}>
                    Account Holder Name
                  </Label>
                  <Input
                    id={`accountHolder-${account.ID}`}
                    value={account.AccountHolder}
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`accountNumber-${account.ID}`}>
                    Account Number
                  </Label>
                  <Input
                    id={`accountNumber-${account.ID}`}
                    value={account.AccountNumber}
                    readOnly
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-muted-foreground">
            No bank account details found.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
