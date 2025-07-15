"use client"
import { useRouter } from "next/navigation"
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { getLoggedInUser } from "@/features/auth/actions/login.actions";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/features/common/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/features/common/components/ui/dropdown-menu"
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  CreditCard,
  // FileText,
  // BarChart3,
  Settings,
  Receipt,
  // DollarSign,
  // Calendar,
  User,
  LogOut,
  ChevronUp,
} from "lucide-react";
import { useEffect, useState } from "react";

const mainMenuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Class",
    url: "/class",
    icon: GraduationCap,
  },
  {
    title: "Students",
    url: "/students",
    icon: Users,
  },
  {
    title: "Fee Collection",
    url: "/fee-collection",
    icon: CreditCard,
  },
  {
    title: "Receipts",
    url: "/receipts",
    icon: Receipt,
  },
  // {
  //   title: "Reports",
  //   url: "/reports",
  //   icon: FileText,
  // },
];

// const analyticsItems = [
//   {
//     title: "Analytics",
//     url: "/analytics",
//     icon: BarChart3,
//   },
//   {
//     title: "Revenue",
//     url: "/revenue",
//     icon: DollarSign,
//   },
//   {
//     title: "Calendar",
//     url: "/calendar",
//     icon: Calendar,
//   },
// ]

export function AppSidebar() {
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchUser = async () => {
      const result = await getLoggedInUser(); 
      console.log("getLoggedInUser Result:", result);
      setUserName(result.name);
    };

    fetchUser();
  }, []);
    const router = useRouter()
  
 

    const handleLogout = async () => {
      setLoading(true);
  
      try {
        const res = await fetch("/api/logout", { method: "POST" });
  
        if (res.ok) {
          toast.success("Logged out successfully!");
          setTimeout(() => {
            router.push("/dashboard");
          }, 1500);
        } else {
          toast.error("Logout failed. Please try again.");
        }
      } catch (error) {
        toast.error("An error occurred during logout.");
        console.error("Logout failed", error);
      } finally {
        setLoading(false);
      }
    };
  return (
    <div className="">
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-emerald-600 text-sidebar-primary-foreground">
                <GraduationCap className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">School POS</span>
                <span className="truncate text-xs">Fee Collection System</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* <SidebarGroup>
          <SidebarGroupLabel>Analytics & Reports</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {analyticsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup> */}

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/settings">
                    <Settings />
                    <span>Settings</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User />
                  <span>{userName|| "User"}</span>
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} disabled={loading}>
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Logging out...
        </>
      ) : (
        <>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </>
      )}
    </DropdownMenuItem>
         
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
    </div>
  )
}
