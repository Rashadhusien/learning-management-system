import { LogOut, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { auth, signOut } from "@/auth";
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
const MobileNavigation = async () => {
  const session = await auth();
  const userId = session?.user?.id;
  return (
    <Sheet>
      <SheetTrigger asChild className="cursor-pointer">
        <Button variant="outline" size="icon" className="lg:hidden">
          <Menu className="h-[1.2rem] w-[1.2rem]  rounded-full  scale-100 rotate-0 transition-all" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side={"left"}
        className="background-light900_dark200 border-none"
      >
        <SheetHeader>
          <SheetTitle className="hidden">Navigation</SheetTitle>
          <Link href={"/"} className="flex items-center gap-1">
            {/* <Image src={"/site-logo.png"} width={23} height={23} alt="Logo" /> */}
            <p className="h2-bold font-space-grotesk text-dark-100 dark:text-light-900 ">
              Cody
            </p>
          </Link>
          <div className="no-scrollbar flex h-[calc(100vh-80px)] flex-col justify-between overflow-y-auto ">
            <SheetClose asChild>
              <section className="flex h-full flex-col gap-6 pt-16">
                <NavLinks isMobileNav />
              </section>
            </SheetClose>
            <div className="flex flex-col gap-3 mt-5">
              {userId ? (
                <UserDropdown isMobile />
              ) : (
                <>
                  <SheetClose asChild>
                    <Link href={ROUTES.LOGIN}>
                      <Button className="small-medium  min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none cursor-pointer">
                        <span className="">Log In</span>
                      </Button>
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link href={ROUTES.REGISTER}>
                      <Button
                        variant={"outline"}
                        className="small-medium  border light-border-2   min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none cursor-pointer"
                      >
                        Sign Up
                      </Button>
                    </Link>
                  </SheetClose>
                </>
              )}
            </div>
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavigation;
