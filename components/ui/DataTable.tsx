"use client";

import {
  createSortedRowModel,
  rowSortingFeature,
  tableFeatures,
  useTable,
  type ColumnDef,
  type RowData,
  type SortingState,
} from "@tanstack/react-table";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";

export const dataTableFeatures = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
});

interface DataTableProps<TData extends RowData> {
  columns: ColumnDef<typeof dataTableFeatures, TData>[];
  data: TData[];
  emptyMessage: string;
  initialSorting?: SortingState;
  getRowId?: (row: TData) => string;
  onRowClick?: (row: TData) => void;
  getRowLabel?: (row: TData) => string;
}

export default function DataTable<TData extends RowData>({
  columns,
  data,
  emptyMessage,
  initialSorting = [],
  getRowId,
  onRowClick,
  getRowLabel,
}: DataTableProps<TData>) {
  const table = useTable<typeof dataTableFeatures, TData>({
    features: dataTableFeatures,
    columns,
    data,
    getRowId,
    initialState: { sorting: initialSorting },
    enableSortingRemoval: false,
  });

  const activateRow = (row: TData, target: EventTarget | null) => {
    if (!onRowClick) return;
    if (target instanceof Element && target.closest("a, button, input")) return;
    onRowClick(row);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] border-collapse text-left">
        <thead className="border-b border-slate-100 text-[0.65rem] font-bold uppercase tracking-[0.13em] text-slate-400">
          {table.getHeaderGroups().map((group) => (
            <tr key={group.id}>
              {group.headers.map((header) => (
                <th key={header.id} className="px-6 py-4 font-bold">
                  {header.isPlaceholder ? null : header.column.getCanSort() ? (
                    <button
                      type="button"
                      onClick={header.column.getToggleSortingHandler()}
                      className="inline-flex items-center gap-1.5 hover:text-[#173b9a]"
                    >
                      <table.FlexRender header={header} />
                      <SortIcon direction={header.column.getIsSorted()} />
                    </button>
                  ) : (
                    <table.FlexRender header={header} />
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-slate-100">
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                tabIndex={onRowClick ? 0 : undefined}
                aria-label={getRowLabel?.(row.original)}
                onClick={(event) => activateRow(row.original, event.target)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    activateRow(row.original, event.target);
                  }
                }}
                className={
                  onRowClick
                    ? "cursor-pointer transition-colors hover:bg-blue-50/55 focus:bg-blue-50/55 focus:outline-none"
                    : undefined
                }
              >
                {row.getAllCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4 align-middle">
                    <table.FlexRender cell={cell} />
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-12 text-center text-sm text-slate-400"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function SortIcon({ direction }: { direction: false | "asc" | "desc" }) {
  if (direction === "asc") return <ChevronUp size={13} />;
  if (direction === "desc") return <ChevronDown size={13} />;
  return <ChevronsUpDown size={13} className="opacity-45" />;
}
