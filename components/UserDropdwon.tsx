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
  BookOpenIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  FolderIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  TrophyIcon,
} from "lucide-react";
import UserAvatar from "./UserAvatar";
import { getAuthSession } from "@/lib/auth-wrapper";
import { signOutAction } from "@/lib/actions/auth.action";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { getProfile } from "@/lib/actions/profile.action";

export async function UserDropdown({
  isMobile = false,
}: {
  isMobile?: boolean;
}) {
  const session = await getAuthSession();
  if (!session) return null;
  const { data: profile } = await getProfile({
    userId: session?.user?.id || "",
  });
  const role = session?.user?.role;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "rounded-full bg-background hover:bg-accent/50 transition-colors h-10 px-3 gap-2",
            isMobile && "h-12 px-4 gap-3 w-full justify-start",
          )}
        >
          <UserAvatar
            id={session?.user?.id || ""}
            name={profile?.name || ""}
            imageUrl={profile?.imageCldPubId || ""}
            className={isMobile ? "h-8 w-8" : "h-7 w-7"}
          />
          {!isMobile && (
            <span className="text-sm font-medium truncate max-w-20">
              {profile?.name}
            </span>
          )}
          {isMobile && (
            <span className="text-sm font-medium truncate flex-1 text-left">
              {profile?.name}
            </span>
          )}
          {isMobile ? (
            <ChevronRightIcon className="h-4 w-4 shrink-0" />
          ) : (
            <ChevronDownIcon className="h-4 w-4 shrink-0" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className={cn("w-48 min-w-0", isMobile && "w-56")}
      >
        <DropdownMenuGroup className="p-1">
          {role === "admin" && (
            <DropdownMenuItem asChild>
              <Link
                href={ROUTES.ADMIN}
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent transition-colors text-sm"
              >
                <LayoutDashboardIcon className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Admin Panel</span>
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem asChild>
            <Link
              href={ROUTES.PROFILE}
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent transition-colors text-sm"
            >
              <BadgeCheckIcon className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href={ROUTES.PROFILE_COURSES}
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent transition-colors text-sm"
            >
              <BookOpenIcon className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">My Courses</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href={ROUTES.PROFILE_PROJECTS}
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent transition-colors text-sm"
            >
              <FolderIcon className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">My Projects</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href={ROUTES.PROFILE_ACHIEVEMENTS}
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent transition-colors text-sm"
            >
              <TrophyIcon className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Achievements</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="my-1" />
        <DropdownMenuItem asChild>
          <form action={signOutAction} className="w-full">
            <button
              type="submit"
              className="flex items-center gap-3 px-3 py-2 w-full rounded-md hover:bg-accent transition-colors text-sm font-medium text-destructive hover:text-destructive"
            >
              <LogOutIcon className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
