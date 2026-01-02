"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TenantSettings } from "@/global-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StoreInfoProps {
  settings: TenantSettings;
}

export function StoreInfo({ settings }: StoreInfoProps) {
  const storeUrl = `${settings.slug}.dord.live`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Store Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="storeName">Store Name</Label>
          <Input id="storeName" value={settings.name} readOnly />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description / Bio</Label>
          <Textarea id="description" value={settings.description} readOnly />
        </div>
        <div className="space-y-2">
          <Label htmlFor="storeUrl">Store URL</Label>
          <Input id="storeUrl" value={storeUrl} readOnly />
        </div>
      </CardContent>
    </Card>
  );
}
