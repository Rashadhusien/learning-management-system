"use client";
import { ModeToggle } from "./mode-toggle";
import { signOutAction } from "@/lib/actions/auth.action";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const Navbar = () => {
  return (
    <nav>
      Navbar
      <ModeToggle />
      <form action={signOutAction}>
        <Button className="base-medium w-fit px-4 py-3 cursor-pointer">
          <LogOut className="size-5 text-black dark:text-white" />
          <span className="max-lg:hidden text-dark300_light900">Log out</span>
        </Button>
      </form>
    </nav>
  );
};

export default Navbar;
