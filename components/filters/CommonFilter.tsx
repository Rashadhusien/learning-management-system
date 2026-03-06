"use client";

import { useSearchParams, useRouter } from "next/navigation";

import { formUrlQuery } from "@/lib/url";
import { cn } from "@/lib/utils";

import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectGroup,
} from "../ui/select";

interface Filter {
  name: string;
  value: string;
}

interface Props {
  filters: Filter[];
  otherClasses?: string;
  containerClasses?: string;
  paramKey?: string;
}
const CommonFilter = ({
  filters,
  otherClasses = "",
  containerClasses = "",
  paramKey = "sort",
}: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const paramsFilter = searchParams.get(paramKey);

  const handleUpdateParams = (value: string) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: paramKey,
      value,
    });

    router.push(newUrl, { scroll: false });
  };

  return (
    <div className={cn("relative", containerClasses)}>
      <Select onValueChange={handleUpdateParams} value={paramsFilter || ""}>
        <SelectTrigger
          className={cn(
            "body-regular no-focus light-border background-light800_dark300 text-dark500_light700 px-5 py-2.5",
            otherClasses,
          )}
          aria-label="Filter Options"
        >
          <div className="line-clamp-1 flex-1 text-left">
            <SelectValue placeholder="Select a filter" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {filters.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default CommonFilter;
