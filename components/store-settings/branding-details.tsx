"use client";

import { Label } from "@/components/ui/label";
import { TenantSettings } from "@/global-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BrandingDetailsProps {
  settings: TenantSettings;
}

export function BrandingDetails({ settings }: BrandingDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Store Branding</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Store Logo</Label>
          <div className="border rounded-md p-4 flex items-center justify-center h-32 w-32 bg-muted/10">
            {settings.logo_url ? (
              <img
                src={settings.logo_url}
                alt="Store Logo"
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <span className="text-muted-foreground text-sm">No Logo</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Primary Color</Label>
            <div className="flex items-center gap-2">
              <div
                className="w-10 h-10 rounded-md border shadow-sm"
                style={{ backgroundColor: settings.primary_color || "#000000" }}
              />
              <span className="text-sm font-mono">
                {settings.primary_color || "Not set"}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Secondary Color</Label>
            <div className="flex items-center gap-2">
              <div
                className="w-10 h-10 rounded-md border shadow-sm"
                style={{
                  backgroundColor: settings.secondary_color || "#ffffff",
                }}
              />
              <span className="text-sm font-mono">
                {settings.secondary_color || "Not set"}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Accent Color</Label>
            <div className="flex items-center gap-2">
              <div
                className="w-10 h-10 rounded-md border shadow-sm"
                style={{ backgroundColor: settings.accent_color || "#000000" }}
              />
              <span className="text-sm font-mono">
                {settings.accent_color || "Not set"}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
