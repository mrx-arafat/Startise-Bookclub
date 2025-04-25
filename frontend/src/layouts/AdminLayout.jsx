import { useState, useEffect } from "react";
import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import { cn } from "../lib/utils";
import {
  BookOpen,
  Library,
  Users,
  LogOut,
  MessageSquarePlus,
  ClipboardList,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

const sidebarLinks = [
  {
    title: "Dashboard",
    icon: Library,
    href: "/admin/dashboard",
  },
  {
    title: "Books",
    icon: BookOpen,
    href: "/admin/books",
  },
  {
    title: "Borrow Requests",
    icon: ClipboardList,
    href: "/admin/borrow-requests",
  },
  {
    title: "Suggestions",
    icon: MessageSquarePlus,
    href: "/admin/suggestions",
  },
  {
    title: "Users",
    icon: Users,
    href: "/admin/users",
  },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token && location.pathname !== "/admin/login") {
      navigate("/admin/login");
    } else if (token) {
      setIsAuthenticated(true);
    }
  }, [location.pathname, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setIsAuthenticated(false);
    toast.success("Logged out successfully", {
      title: "Logged out successfully",
      description: "You have been logged out of the admin panel",
    });
    navigate("/admin/login");
  };

  if (!isAuthenticated && location.pathname !== "/admin/login") {
    return null;
  }

  if (location.pathname === "/admin/login") {
    return <Outlet />;
  }

  const AdminSidebar = () => (
    <Sidebar className="border-r p-4">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="font-semibold">BC</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Book Club</span>
            <span className="text-xs text-muted-foreground">Admin Panel</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="py-4">
        <SidebarMenu>
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            return (
              <SidebarMenuItem key={link.href}>
                <SidebarMenuButton
                  asChild
                  className={cn(
                    location.pathname === link.href
                      ? "bg-primary hover:bg-primary/90 hover:text-primary-foreground text-primary-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  <Link to={link.href} className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {link.title}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <div className="mt-auto border-t p-4">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
      <SidebarRail />
    </Sidebar>
  );

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background w-full">
        <AdminSidebar />
        <SidebarInset className="flex w-full flex-col">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-lg font-semibold">Book Club Admin</h1>
          </header>
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto p-8">
              <Outlet />
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
