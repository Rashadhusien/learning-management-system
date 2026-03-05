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
              isActive ? " rounded-lg " : "",
              "flex items-center justify-start gap-4  p-4 ",
              !isMobileNav && isActive && "text-primary",
              isMobileNav && isActive && "bg-primary/10 rounded-xl",
              isAdmin && isActive && "bg-primary/10 rounded-xl",
            )}
          >
            {item.imgUrl && isMobileNav && (
              <Image
                src={item.imgUrl}
                alt={item.label}
                width={20}
                height={20}
              />
            )}

            {item.imgUrl && isAdmin && (
              <Image
                src={item.imgUrl}
                alt={item.label}
                width={20}
                height={20}
                className={cn("dark:invert ")}
              />
            )}

            <p
              className={cn(
                isActive ? "base-bold" : "base-medium",
                !isMobileNav && "max-lg:hidden",
              )}
            >
              {item.label}
            </p>
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
