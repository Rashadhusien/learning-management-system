import { LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";

import NavLinks from "./navbar/NavLinks";
import { ModeToggle } from "./navbar/mode-toggle";

const LeftSidebar = async () => {
  const session = await auth();

  return (
    <section className=" custom-scrollbar p-6   max-sm:hidden border-r border-foreground/20    flex flex-col  justify-between overflow-y-auto  sticky left-0 top-0 h-screen  lg:w-[266px]  ">
      <h1 className="text-3xl font-bold hidden lg:block">
        Admin Panel <ModeToggle />
      </h1>
      <div className="  flex flex-1 md:w-full justify-center flex-col w-fit gap-5">
        <NavLinks isAdmin />
      </div>
    </section>
  );
};

export default LeftSidebar;
