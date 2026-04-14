"use client";

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
} from "@/components/ui/sidebar";
import { adminLinks } from "@/constants";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, LayoutDashboard, Settings, LogOut } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { Button } from "@/components/ui/button";
import { UserDropdown } from "@/components/UserDropdwon";
import { getAuthSession } from "@/lib/auth-wrapper";

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader className="border-b">
        <SidebarMenuButton size={"sm"}>
          <Link
            href={ROUTES.HOME}
            className="sidebar-collapsed:hidden text-sm font-medium w-full h-full flex gap-2 items-center  hover:bg-muted rounded-md transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sidebar-expanded:block">Back to website</span>
          </Link>
        </SidebarMenuButton>
      </SidebarHeader>

      <SidebarContent className="py-4 ">
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminLinks.map((item) => {
                const isActive =
                  (pathname.includes(item.route) && item.route.length > 1) ||
                  pathname === item.route;

                return (
                  <SidebarMenuItem
                    key={item.route}
                    className="flex justify-center items-center"
                  >
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.label}
                      className=" rounded-lg transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground"
                    >
                      <Link
                        href={item.route}
                        className="flex items-center gap-3"
                      >
                        {item.imgUrl && (
                          <Image
                            src={item.imgUrl}
                            alt={item.label}
                            width={16}
                            height={16}
                            className="dark:invert opacity-70 group-hover:opacity-100 transition-opacity"
                          />
                        )}
                        <span className="sidebar-expanded:block font-medium">
                          {item.label}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            System
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Settings"
                  className=" rounded-lg transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  <Settings className="w-4 h-4 opacity-70" />
                  <span className="sidebar-expanded:block font-medium">
                    Settings
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
