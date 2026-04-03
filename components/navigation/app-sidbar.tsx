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
import { sidebarLinks } from "@/constants";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useSidebar } from "@/components/ui/sidebar";

export function AppSidebar() {
  const pathname = usePathname();
  const { isMobile } = useSidebar();

  // Only render sidebar on mobile to prevent desktop gap
  if (!isMobile) {
    return null;
  }

  return (
    <Sidebar variant="sidebar">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground">
              <span className="text-sm font-bold font-space-grotesk text-white ">
                LMS
              </span>
            </div>
            <span className="text-lg font-semibold">Learning Hub</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="hidden" aria-hidden="true">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-4 mt-4">
              {sidebarLinks.map((item) => {
                const isActive =
                  (pathname.includes(item.route) && item.route.length > 1) ||
                  pathname === item.route;

                return (
                  <SidebarMenuItem key={item.route}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className="p-6 "
                    >
                      <Link href={item.route}>
                        <span className="flex h-4 w-4 items-center justify-center rounded bg-primary/10 text-primary text-xs font-bold">
                          {item.label.charAt(0)}
                        </span>
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="px-3 py-2">
          <p className="text-xs text-sidebar-foreground/60">
            2024 Learning Management System
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
