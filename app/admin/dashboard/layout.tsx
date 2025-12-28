import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { cookies } from "next/headers";

import { getTenant } from "@/app/actions/tenant";
import { decodeJwt } from "@/lib/utils";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("Authorization")?.value;

  let user = {
    name: "User",
    email: "user@example.com",
    avatar: "/avatars/shadcn.jpg",
  };
  let tenant = {
    name: "Company",
    plan: "Free",
    logo: null,
    slug: "",
  };

  if (token) {
    try {
      const payload = decodeJwt(token);

      user = {
        name: `${payload.first_name} ${payload.last_name}`,
        email: payload.email,
        avatar: "/avatars/shadcn.jpg", // Placeholder or from payload if available
      };

      if (payload.tenant_id) {
        const tenantData = await getTenant(payload.tenant_id);
        if (tenantData) {
          tenant = {
            name: tenantData.Name,
            plan: tenantData.PlanType,
            logo: tenantData.LogoURL,
            slug: tenantData.Slug,
          };
        }
      }
    } catch (e) {
      console.error("Failed to decode token or fetch tenant", e);
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar user={user} tenant={tenant} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
