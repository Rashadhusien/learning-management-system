"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { formUrlQuery, removeKeysFromUrlQuery } from "@/lib/url";
import { InputGroup } from "../ui/input-group";
import { Input } from "../ui/input";
import { Search } from "lucide-react";

interface Props {
  route: string;
  placeholder: string;
  otherClasses?: string;
  iconPosition?: "left" | "right";
}

const LocalSearch = ({
  route,
  placeholder,
  otherClasses,
  iconPosition = "left",
}: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const query = searchParams.get("query") || "";

  const [searchQuery, setSearchQuery] = useState(query);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "query",
          value: searchQuery,
        });
        router.push(newUrl, { scroll: false });
      } else {
        if (pathname === route) {
          const newUrl = removeKeysFromUrlQuery({
            params: searchParams.toString(),
            keysToRemove: ["query"],
          });
          router.push(newUrl, { scroll: false });
        }
      }
      return () => clearTimeout(delayDebounce);
    }, 300);
  }, [searchQuery, router, route, searchParams, pathname]);

  return (
    <InputGroup
      className={` ${otherClasses}  flex min-h-[56px] grow items-center gap-2 px-4 max-w-lg`}
    >
      {iconPosition === "left" && <Search className="w-5 h-5 text-gray-500" />}
      <Input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="paragraph-regular no-focus placholder border-none shadow-none outline-none "
      />
      {iconPosition === "right" && <Search className="w-5 h-5 text-gray-500" />}
    </InputGroup>
  );
};

export default LocalSearch;
