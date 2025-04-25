import * as React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Overview",
        url: "/dashboard",
        icon: "LayoutDashboard",
      },
      {
        title: "Analytics",
        url: "/dashboard/analytics",
        icon: "BarChart",
      },
    ],
  },
  {
    title: "Management",
    items: [
      {
        title: "Projects",
        url: "/projects",
        icon: "FolderKanban",
      },
      {
        title: "Tasks",
        url: "/tasks",
        icon: "CheckSquare",
      },
      {
        title: "Calendar",
        url: "/calendar",
        icon: "Calendar",
      },
    ],
  },
  {
    title: "Settings",
    items: [
      {
        title: "Profile",
        url: "/settings/profile",
        icon: "User",
      },
      {
        title: "Preferences",
        url: "/settings/preferences",
        icon: "Settings",
      },
    ],
  },
];

export function AppSidebar({ className, ...props }) {
  return (
    <Sidebar className={cn("border-r", className)} {...props}>
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="font-semibold">A</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Arafat</span>
            <span className="text-xs text-muted-foreground">Dashboard</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {navigationItems.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link to={item.url}>{item.title}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
