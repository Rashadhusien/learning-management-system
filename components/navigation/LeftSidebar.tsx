import { LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";

import NavLinks from "./navbar/NavLinks";

const LeftSidebar = async () => {
  const session = await auth();

  return (
    <section className=" custom-scrollbar p-6 pt-28   max-sm:hidden border-r border-foreground/20    flex flex-col  justify-between overflow-y-auto  sticky left-0 top-0 h-screen  lg:w-[266px]  ">
      <div className="  flex flex-1 md:w-full justify-center flex-col w-fit gap-5">
        <NavLinks isAdmin />
      </div>

      <div className="flex flex-col gap-3 mt-4 ">
        {/* {userId ? (
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <Button className="base-medium w-fit !bg-transparent px-4 py-3 cursor-pointer">
              <LogOut className="size-5 text-black dark:text-white" />
              <span className="max-lg:hidden text-dark300_light900">
                Log out
              </span>
            </Button>
          </form>
        ) : (
          <>
            <Button
              className="small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none cursor-pointer"
              asChild
            >
              <Link href={ROUTEs.}>
                <span className="primary-text-gradient max-lg:hidden">
                  Log In
                </span>
                <Image
                  src={"/icons/account.svg"}
                  width={24}
                  height={24}
                  alt="account"
                  className="lg:hidden invert-colors"
                />
              </Link>
            </Button>

            <Button
              className="small-medium btn-tertiary border light-border-2 text-dark400_light900  min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none cursor-pointer"
              asChild
            >
              <Link href={ROUTES.SIGN_UP}>
                <span className="max-lg:hidden">Sign Up</span>
                <Image
                  src={"/icons/sign-up.svg"}
                  width={24}
                  height={24}
                  alt="sign-in"
                  className="lg:hidden invert-colors"
                />
              </Link>
            </Button>
          </>
        )} */}
      </div>
    </section>
  );
};

export default LeftSidebar;
