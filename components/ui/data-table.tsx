"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Inbox,
} from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  searchPlaceholder?: string;
  enableColumnFilter?: boolean;
  enableRowSelection?: boolean;
  onRowSelectionChange?: (selectedRows: TData[]) => void;
  onRowClick?: (row: TData) => void;
  emptyMessage?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey = "",
  searchPlaceholder = "Search…",
  enableColumnFilter = true,
  enableRowSelection = false,
  onRowSelectionChange,
  onRowClick,
  emptyMessage = "No results found.",
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
  });

  React.useEffect(() => {
    if (enableRowSelection && onRowSelectionChange) {
      const selectedRows = table
        .getFilteredSelectedRowModel()
        .rows.map((r) => r.original);
      onRowSelectionChange(selectedRows);
    }
  }, [rowSelection, enableRowSelection, onRowSelectionChange, table]);

  const totalFiltered = table.getFilteredRowModel().rows.length;
  const selectedCount = table.getFilteredSelectedRowModel().rows.length;
  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const pageCount = table.getPageCount();
  const from = totalFiltered === 0 ? 0 : pageIndex * pageSize + 1;
  const to = Math.min((pageIndex + 1) * pageSize, totalFiltered);

  // Smart page range with ellipsis
  const pageRange = React.useMemo(() => {
    const delta = 2;
    const pages: (number | "…")[] = [];
    const left = Math.max(0, pageIndex - delta);
    const right = Math.min(pageCount - 1, pageIndex + delta);
    if (left > 0) {
      pages.push(0);
      if (left > 1) pages.push("…");
    }
    for (let p = left; p <= right; p++) pages.push(p);
    if (right < pageCount - 1) {
      if (right < pageCount - 2) pages.push("…");
      pages.push(pageCount - 1);
    }
    return pages;
  }, [pageIndex, pageCount]);

  return (
    <div className="w-full flex flex-col gap-4">
      {/* ── Toolbar ──────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {searchKey && (
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder={searchPlaceholder}
              value={
                (table.getColumn(searchKey)?.getFilterValue() as string) ?? ""
              }
              onChange={(e) =>
                table.getColumn(searchKey)?.setFilterValue(e.target.value)
              }
              className="pl-9 h-9 text-sm rounded-lg border-border bg-background
                         placeholder:text-muted-foreground/50 no-focus
                         focus-visible:ring-1 focus-visible:ring-primary/30
                         focus-visible:border-primary/50 transition-all"
            />
          </div>
        )}

        <div className="flex items-center gap-2 sm:ml-auto">
          {selectedCount > 0 && (
            <span className="inline-flex items-center rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-semibold text-primary">
              {selectedCount} selected
            </span>
          )}

          {enableColumnFilter && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 gap-2 rounded-lg border-border bg-background
                             text-sm text-muted-foreground hover:text-foreground
                             hover:bg-secondary transition-colors"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  View
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-44 rounded-xl p-1.5"
              >
                <p className="px-2 pb-1.5 pt-0.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Toggle columns
                </p>
                {table
                  .getAllColumns()
                  .filter((col) => col.getCanHide())
                  .map((col) => (
                    <DropdownMenuCheckboxItem
                      key={col.id}
                      className="capitalize text-sm rounded-lg cursor-pointer"
                      checked={col.getIsVisible()}
                      onCheckedChange={(val) => col.toggleVisibility(!!val)}
                    >
                      {col.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* ── Table ────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-border overflow-hidden bg-card shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((hg) => (
                <TableRow
                  key={hg.id}
                  className="border-b border-border bg-muted/50 hover:bg-muted/50"
                >
                  {hg.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="h-11 px-5 text-[11px] font-semibold uppercase
                                 tracking-widest text-muted-foreground whitespace-nowrap"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    onClick={() => onRowClick?.(row.original)}
                    className={[
                      "border-b border-border/50 transition-colors duration-100",
                      "hover:bg-muted/40",
                      row.getIsSelected()
                        ? "bg-primary/5 hover:bg-primary/8"
                        : "",
                      onRowClick ? "cursor-pointer" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="px-5 py-3.5 text-sm text-foreground align-middle"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-60 text-center"
                  >
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-muted">
                        <Inbox className="h-6 w-6 text-muted-foreground/60" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-foreground">
                          {emptyMessage}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Try adjusting your search or filters
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* ── Pagination footer (inside card) ─────────────────── */}
        {pageCount > 0 && (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-border bg-muted/30 px-5 py-3">
            {/* Left: count + rows per page */}
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>
                {totalFiltered === 0
                  ? "No results"
                  : `${from}–${to} of ${totalFiltered} row${totalFiltered !== 1 ? "s" : ""}`}
              </span>
              <span className="h-3 w-px bg-border" />
              <div className="flex items-center gap-1.5">
                <span>Per page</span>
                <select
                  value={pageSize}
                  onChange={(e) => table.setPageSize(Number(e.target.value))}
                  className="h-7 w-[52px] rounded-md border border-border bg-background
                             px-1.5 text-xs text-foreground cursor-pointer
                             focus:outline-none focus:ring-1 focus:ring-primary/30
                             focus:border-primary/50 transition-all"
                >
                  {[10, 20, 30, 50].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Right: page controls */}
            <div className="flex items-center gap-1">
              {/* First page */}
              <button
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
                aria-label="First page"
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-border
                           bg-background text-muted-foreground transition-colors
                           hover:bg-secondary hover:text-foreground
                           disabled:opacity-35 disabled:cursor-not-allowed"
              >
                <ChevronsLeft className="h-3.5 w-3.5" />
              </button>

              {/* Prev */}
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                aria-label="Previous page"
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-border
                           bg-background text-muted-foreground transition-colors
                           hover:bg-secondary hover:text-foreground
                           disabled:opacity-35 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>

              {/* Page pills */}
              <div className="flex items-center gap-0.5 mx-0.5">
                {pageRange.map((p, idx) =>
                  p === "…" ? (
                    <span
                      key={`el-${idx}`}
                      className="flex h-7 w-7 items-center justify-center text-xs text-muted-foreground"
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => table.setPageIndex(p as number)}
                      className={[
                        "flex h-7 min-w-[28px] items-center justify-center rounded-lg px-2 text-xs font-medium transition-colors",
                        p === pageIndex
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "border border-border bg-background text-muted-foreground hover:bg-secondary hover:text-foreground",
                      ].join(" ")}
                    >
                      {(p as number) + 1}
                    </button>
                  ),
                )}
              </div>

              {/* Next */}
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                aria-label="Next page"
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-border
                           bg-background text-muted-foreground transition-colors
                           hover:bg-secondary hover:text-foreground
                           disabled:opacity-35 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>

              {/* Last page */}
              <button
                onClick={() => table.setPageIndex(pageCount - 1)}
                disabled={!table.getCanNextPage()}
                aria-label="Last page"
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-border
                           bg-background text-muted-foreground transition-colors
                           hover:bg-secondary hover:text-foreground
                           disabled:opacity-35 disabled:cursor-not-allowed"
              >
                <ChevronsRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
