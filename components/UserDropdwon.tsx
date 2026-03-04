import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BadgeCheckIcon,
  BellIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CreditCardIcon,
  LayoutDashboardIcon,
  LogOutIcon,
} from "lucide-react";
import UserAvatar from "./UserAvatar";
import { auth } from "@/auth";
import { signOutAction } from "@/lib/actions/auth.action";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

export async function UserDropdown({
  isMobile = false,
}: {
  isMobile?: boolean;
}) {
  const session = await auth();
  if (!session) return null;
  const role = session?.user?.role;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "rounded-full bg-background py-6 justify-start",
            isMobile && "py-7",
          )}
        >
          <UserAvatar
            id={session?.user?.id || ""}
            name={session?.user?.name || ""}
          />
          <h2>{session?.user?.name}</h2>
          {isMobile ? <ChevronRightIcon /> : <ChevronDownIcon />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          {role === "admin" && (
            <DropdownMenuItem asChild>
              <Link href={ROUTES.ADMIN} className="flex items-center gap-2">
                <LayoutDashboardIcon className="h-4 w-4" />
                Admin Panel
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem asChild>
            <Link href={ROUTES.PROFILE} className="flex items-center gap-2">
              <BadgeCheckIcon className="h-4 w-4" />
              Profile
            </Link>
          </DropdownMenuItem>
          {/*  <DropdownMenuItem asChild>
            <Link href="/billing" className="flex items-center gap-2">
              <CreditCardIcon className="h-4 w-4" />
              Billing
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/notifications" className="flex items-center gap-2">
              <BellIcon className="h-4 w-4" />
              Notifications
            </Link>
          </DropdownMenuItem> */}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <form action={signOutAction} className="w-full">
            <button type="submit" className="flex items-center gap-2 w-full">
              <LogOutIcon className="h-4 w-4" />
              Sign Out
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
