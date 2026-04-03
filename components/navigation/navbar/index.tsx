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
    <nav className="p-2 bg-background/20 backdrop-blur-md border-b border-border/40 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between md:justify-around">
        <h1 className="text-3xl font-bold font-space-grotesk  text-primary">
          <Link href={ROUTES.HOME}>Cody</Link>
        </h1>
        <div className="max-lg:hidden flex items-center gap-4 bg-background/30 px-4 rounded-full">
          <NavLinks />
        </div>
        <div className="flex items-center gap-4 max-lg:hidden">
          {session ? (
            <UserDropdown />
          ) : (
            <Link href={ROUTES.LOGIN}>
              <Button>log in</Button>
            </Link>
          )}
          <ThemeSwitcher />
        </div>
        <div className="flex items-center gap-2 lg:hidden">
          <div className="lg:hidden">
            <ThemeSwitcher />
          </div>
          {/* <SidebarTrigger /> */}
          <MobileNavigation />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
