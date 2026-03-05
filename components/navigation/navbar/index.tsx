import { UserDropdown } from "@/components/UserDropdwon";
import { ModeToggle } from "./mode-toggle";
import NavLinks from "./NavLinks";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import MobileNavigation from "./MobileNavigation";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";

const Navbar = async () => {
  const session = await auth();
  return (
    <nav className="p-4 bg-background/30 shadow-sm">
      <div className="container mx-auto flex items-center justify-between md::justify-around">
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
          <ModeToggle />
        </div>
        <div className="flex items-center gap-2 lg:hidden">
          <div className="lg:hidden">
            <ModeToggle />
          </div>
          <MobileNavigation />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
