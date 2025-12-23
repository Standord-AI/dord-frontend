"use client";

import {
  CreditCard,
  Frame,
  GalleryVerticalEnd,
  LayoutDashboard,
  Map,
  Package,
  PieChart,
  ShoppingBag,
  Store,
  Users,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Standord DORD",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "General",
      url: "#",
      icon: LayoutDashboard,
      isActive: true,
      items: [
        {
          title: "Dashboard",
          url: "",
        },
        {
          title: "Analytics",
          url: "analytics",
        },
      ],
    },
    {
      title: "Inventory",
      url: "#",
      icon: Package,
      isActive: true,
      items: [
        {
          title: "Products",
          url: "/inventory/products",
        },
        {
          title: "Categories",
          url: "/inventory/categories",
        },
        {
          title: "Brands",
          url: "/inventory/brands",
        },
      ],
    },
    {
      title: "Orders & Fulfillment",
      url: "#",
      icon: ShoppingBag,
      isActive: true,
      items: [
        {
          title: "Orders",
          url: "/orders",
        },
        {
          title: "Abandoned Carts",
          url: "/orders/abandoned-carts",
        },
        {
          title: "Orders History",
          url: "/orders/history",
        },
        {
          title: "Conversations",
          url: "/conversations",
        },
      ],
    },
    {
      title: "Payments",
      url: "#",
      icon: CreditCard,
      isActive: true,
      items: [
        {
          title: "Pending Payments",
          url: "/payments/pending",
        },
        {
          title: "Reviewed Payments",
          url: "/payments/verified",
        },
        {
          title: "Refunds & Chargebacks",
          url: "/payments/refunds",
        },
        {
          title: "Payments History",
          url: "/payments/history",
        },
      ],
    },
    {
      title: "Customers",
      url: "/customers",
      icon: Users,
      isActive: true,
      items: [
        {
          title: "Customer List",
          url: "/customers",
        },
        {
          title: "Contact Us Messages",
          url: "/customers/contact",
        },
      ],
    },
    {
      title: "Storefront & Channels",
      url: "#",
      icon: Store,
      isActive: true,
      items: [
        {
          title: "Store Settings",
          url: "/storefront/store-settings",
        },
        {
          title: "Catalogue Design",
          url: "/storefront/catalogue-design",
        },
        {
          title: "Manage Channels",
          url: "/channels",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Agent Settings",
      url: "#",
      icon: Frame,
    },
    {
      name: "AI Sales Insights",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Test Automations",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({
  user,
  tenant,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user: { name: string; email: string; avatar: string };
  tenant: { name: string; plan: string; logo: any; slug: string };
}) {
  const baseUrl = `/admin/dashboard/${tenant.slug}`;

  const transformUrl = (url: string) => {
    if (!url) return baseUrl;
    if (url === "#") return url;
    if (url.startsWith("/")) return `${baseUrl}${url}`;
    return `${baseUrl}/${url}`;
  };

  const dynamicData = {
    ...data,
    user: user,
    teams: [
      {
        name: tenant.name,
        logo: GalleryVerticalEnd, // Fallback or use tenant.logo if available and compatible
        plan: tenant.plan,
      },
    ],
    navMain: data.navMain.map((item) => ({
      ...item,
      items: item.items.map((subItem) => ({
        ...subItem,
        url: transformUrl(subItem.url),
      })),
    })),
    projects: data.projects.map((item) => ({
      ...item,
      url: transformUrl(item.url),
    })),
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={dynamicData.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={dynamicData.navMain} />
        <NavProjects projects={dynamicData.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={dynamicData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
