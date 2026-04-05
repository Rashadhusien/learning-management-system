import { Menu } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import NavLinks from "./NavLinks";
import { ROUTES } from "@/constants/routes";
import { UserDropdown } from "@/components/UserDropdwon";
import { getAuthSession } from "@/lib/auth-wrapper";

const MobileNavigation = async () => {
  const session = await getAuthSession();
  const userId = session?.user?.id;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="lg:hidden rounded-lg border-border/50 bg-muted/40 hover:bg-muted"
          aria-label="Open navigation menu"
        >
          <Menu className="size-4" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-[260px] p-0 border-r border-border/40 bg-background flex flex-col"
      >
        <SheetHeader className="px-4 pt-5 pb-4 border-b border-border/30">
          <SheetTitle asChild>
            <Link href="/" className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-orange-500 mb-0.5" />
              <span className="text-[18px] font-semibold tracking-tight font-space-grotesk text-foreground">
                Cody
              </span>
            </Link>
          </SheetTitle>
        </SheetHeader>

        {/* Nav links */}
        <div className="flex-1 overflow-y-auto px-2 py-4">
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground px-3 mb-2">
            Menu
          </p>
          <SheetClose asChild>
            <div className="flex flex-col gap-0.5">
              <NavLinks isMobileNav />
            </div>
          </SheetClose>
        </div>

        {/* Footer */}
        <div className="px-3 pb-6 pt-3 border-t border-border/30 flex flex-col gap-2">
          {userId ? (
            <UserDropdown isMobile />
          ) : (
            <>
              <SheetClose asChild>
                <Link href={ROUTES.LOGIN} className="w-full">
                  <Button className="w-full rounded-lg h-9 text-sm">
                    Log in
                  </Button>
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href={ROUTES.REGISTER} className="w-full">
                  <Button
                    variant="outline"
                    className="w-full rounded-lg h-9 text-sm border-border/50"
                  >
                    Sign up
                  </Button>
                </Link>
              </SheetClose>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavigation;
