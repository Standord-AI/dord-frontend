"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TenantSettings } from "@/global-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ContactDetailsProps {
  settings: TenantSettings;
}

export function ContactDetails({ settings }: ContactDetailsProps) {
  const address = settings.business_address;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Store Contact Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={settings.business_email} readOnly />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" value={settings.business_phone} readOnly />
        </div>

        <div className="space-y-2">
          <Label>Address</Label>
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="address1"
                className="text-xs text-muted-foreground"
              >
                Address Line 1
              </Label>
              <Input id="address1" value={address?.address1} readOnly />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="address2"
                className="text-xs text-muted-foreground"
              >
                Address Line 2
              </Label>
              <Input id="address2" value={address?.address2} readOnly />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city" className="text-xs text-muted-foreground">
                  City
                </Label>
                <Input id="city" value={address?.city} readOnly />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="state"
                  className="text-xs text-muted-foreground"
                >
                  State / Province
                </Label>
                <Input id="state" value={address?.state} readOnly />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="zip" className="text-xs text-muted-foreground">
                  Zip / Postal Code
                </Label>
                <Input id="zip" value={address?.zip} readOnly />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="country"
                  className="text-xs text-muted-foreground"
                >
                  Country
                </Label>
                <Input id="country" value={address?.country} readOnly />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
