"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { SheetClose } from "@/components/ui/sheet";
import { adminLinks, sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";

const NavLinks = ({
  isMobileNav = false,
  isAdmin = false,
}: {
  isMobileNav?: boolean;
  isAdmin?: boolean;
}) => {
  const pathname = usePathname();
  const links = isAdmin ? adminLinks : sidebarLinks;

  return (
    <>
      {links.map((item) => {
        const isActive =
          (pathname.includes(item.route) && item.route.length > 1) ||
          pathname === item.route;

        const LinkComponent = (
          <Link
            href={item.route}
            className={cn(
              "flex items-center gap-2.5 transition-all duration-150",
              // Desktop pill style
              !isMobileNav &&
                !isAdmin &&
                cn(
                  "text-[13px] font-medium px-4 py-1.5 rounded-full",
                  isActive
                    ? "bg-background text-foreground shadow-sm border border-border/40"
                    : "text-muted-foreground hover:text-foreground",
                ),
              // Mobile nav style
              isMobileNav &&
                cn(
                  "text-[13px] font-medium px-3 py-2 rounded-lg",
                  isActive
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                ),
              // Admin sidebar style
              isAdmin &&
                cn(
                  "text-[13px] font-medium px-3 py-2 rounded-lg",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                ),
            )}
          >
            {item.imgUrl && (isMobileNav || isAdmin) && (
              <Image
                src={item.imgUrl}
                alt={item.label}
                width={16}
                height={16}
                className={cn(isAdmin && "dark:invert", "opacity-70")}
              />
            )}
            <span>{item.label}</span>
          </Link>
        );

        return isMobileNav ? (
          <SheetClose asChild key={item.route}>
            {LinkComponent}
          </SheetClose>
        ) : (
          <React.Fragment key={item.route}>{LinkComponent}</React.Fragment>
        );
      })}
    </>
  );
};

export default NavLinks;
