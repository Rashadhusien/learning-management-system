import { UserDropdown } from "@/components/UserDropdwon";
import { ThemeSwitcher } from "@/components/theme-switcher";
import NavLinks from "./NavLinks";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import MobileNavigation from "./MobileNavigation";
import { getAuthSession } from "@/lib/auth-wrapper";
import { Button } from "@/components/ui/button";

const Navbar = async () => {
  const session = await getAuthSession();
  return (
    <nav className="px-4 py-2.5 bg-background/80 backdrop-blur-xl border-b border-border/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href={ROUTES.HOME} className="flex items-center gap-1.5 shrink-0">
          <span className="size-2 rounded-full bg-primary mb-0.5" />
          <span className="text-[19px] font-semibold tracking-tight text-foreground font-space-grotesk">
            Cody
          </span>
        </Link>

        {/* Desktop nav links — pill container */}
        <div className="hidden lg:flex items-center bg-muted/60 border border-border/40 rounded-full p-1 gap-0.5">
          <NavLinks />
        </div>

        {/* Desktop right actions */}
        <div className="hidden lg:flex items-center gap-2">
          {session ? (
            <UserDropdown />
          ) : (
            <Link href={ROUTES.LOGIN}>
              <Button size="sm" className="rounded-full px-5 h-8 text-sm">
                Log in
              </Button>
            </Link>
          )}
          <ThemeSwitcher />
        </div>

        {/* Mobile right actions */}
        <div className="flex lg:hidden items-center gap-2">
          <ThemeSwitcher />
          <MobileNavigation />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
