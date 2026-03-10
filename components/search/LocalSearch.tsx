"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";

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

  // Use refs to store stable values
  const routerRef = useRef(router);
  const pathnameRef = useRef(pathname);
  const routeRef = useRef(route);

  // Update refs when values change
  useEffect(() => {
    routerRef.current = router;
    pathnameRef.current = pathname;
    routeRef.current = route;
  }, [router, pathname, route]);

  const query = searchParams.get("query") || "";
  const [searchQuery, setSearchQuery] = useState(query);

  // Memoize searchParams string to prevent unnecessary re-renders
  const searchParamsString = searchParams.toString();

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery) {
        const newUrl = formUrlQuery({
          params: searchParamsString,
          key: "query",
          value: searchQuery,
        });
        routerRef.current.push(newUrl, { scroll: false });
      } else {
        if (pathnameRef.current === routeRef.current) {
          const newUrl = removeKeysFromUrlQuery({
            params: searchParamsString,
            keysToRemove: ["query"],
          });
          routerRef.current.push(newUrl, { scroll: false });
        }
      }
      return () => clearTimeout(delayDebounce);
    }, 300);
  }, [searchQuery, searchParamsString]); // Depend on memoized searchParamsString

  return (
    <InputGroup
      className={` ${otherClasses}  flex min-h-[56px] grow items-center gap-2 px-4 sm:max-w-lg `}
    >
      {iconPosition === "left" && <Search className="w-5 h-5 text-gray-500" />}
      <Input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="paragraph-regular no-focus placholder border-none shadow-none outline-none w-full"
      />
      {iconPosition === "right" && <Search className="w-5 h-5 text-gray-500" />}
    </InputGroup>
  );
};

export default LocalSearch;
