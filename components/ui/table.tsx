"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto rounded-lg border border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 no-scrollbar"
    >
      <table
        data-slot="table"
        className={cn(
          "w-full caption-bottom text-sm",
          "border-separate border-spacing-0",
          className,
        )}
        {...props}
      />
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn(
        "border-b border-border/40 bg-muted/30",
        "[&_tr]:border-0",
        className,
      )}
      {...props}
    />
  );
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn(
        "[&_tr:last-child]:border-0",
        "[&_tr]:border-b border-border/20",
        "[&_tr:last-child]:border-b-0",
        className,
      )}
      {...props}
    />
  );
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "border-t border-border/40 bg-muted/50 font-medium [&>tr]:last:border-b-0",
        className,
      )}
      {...props}
    />
  );
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "transition-all duration-200 ease-in-out",
        "border-b border-border/20",
        "hover:bg-muted/30 hover:shadow-sm",
        "data-[state=selected]:bg-muted/50 data-[state=selected]:shadow-sm",
        "first:border-t-0",
        "last:border-b-0",
        className,
      )}
      {...props}
    />
  );
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "h-14 px-4 text-left align-middle font-semibold text-foreground/90",
        "whitespace-nowrap",
        "border-b border-border/30",
        "bg-gradient-to-r from-muted/40 to-muted/20",
        "text-sm",
        "first:rounded-tl-lg first:border-l-0",
        "last:rounded-tr-lg last:border-r-0",
        "[&:has([role=checkbox])]:pr-0 [&:has([role=checkbox])]:text-center",
        className,
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-4 align-middle",
        "border-b border-border/10",
        "text-foreground/80",
        "first:pl-4 last:pr-4",
        "whitespace-nowrap",
        "[&:has([role=checkbox])]:pr-0 [&:has([role=checkbox])]:text-center",
        "[&:has([role=checkbox])]:pl-2",
        className,
      )}
      {...props}
    />
  );
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn(
        "mt-4 text-sm text-muted-foreground/80",
        "font-medium",
        className,
      )}
      {...props}
    />
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
