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
            "rounded-full bg-background py-6 justify-start",
            isMobile && "py-7",
          )}
        >
          <UserAvatar
            id={session?.user?.id || ""}
            name={profile?.name || ""}
            imageUrl={profile?.imageCldPubId || ""}
          />
          <h2>{profile?.name}</h2>
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
          <DropdownMenuItem asChild>
            <Link
              href={ROUTES.PROFILE_COURSES}
              className="flex items-center gap-2"
            >
              <BookOpenIcon className="h-4 w-4" />
              My Courses
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href={ROUTES.PROFILE_PROJECTS}
              className="flex items-center gap-2"
            >
              <FolderIcon className="h-4 w-4" />
              My Projects
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href={ROUTES.PROFILE_ACHIEVEMENTS}
              className="flex items-center gap-2"
            >
              <TrophyIcon className="h-4 w-4" />
              My Achievements
            </Link>
          </DropdownMenuItem>
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
