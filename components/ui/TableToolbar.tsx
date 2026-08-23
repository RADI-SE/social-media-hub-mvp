"use client";

import { Search, X } from "lucide-react";

export type TableFilter = {
  label: string;
  value: string;
  allLabel: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
};

export default function TableToolbar({
  title,
  countLabel,
  search,
  searchPlaceholder,
  clearLabel,
  filters = [],
  onSearchChange,
  onClear,
}: {
  title: string;
  countLabel: string;
  search: string;
  searchPlaceholder: string;
  clearLabel: string;
  filters?: TableFilter[];
  onSearchChange: (value: string) => void;
  onClear: () => void;
}) {
  const hasFilters = Boolean(search || filters.some((filter) => filter.value));

  return (
    <div className="border-b border-slate-100 bg-white/55 px-5 py-5 sm:px-6">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold text-[#071e55]">{title}</h2>
          <p className="mt-1 text-xs text-slate-400">{countLabel}</p>
        </div>
        {hasFilters && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 hover:text-[#173b9a]"
          >
            <X size={14} />
            {clearLabel}
          </button>
        )}
      </div>
      <div className="flex flex-col gap-3 md:flex-row md:flex-wrap">
        <label className="relative min-w-60 flex-1">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={searchPlaceholder}
            className="h-11 w-full rounded-xl border border-slate-200 bg-white pe-3 ps-10 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
          />
        </label>
        {filters.map((filter) => (
          <label key={filter.label} className="min-w-36 flex-1 md:max-w-52">
            <span className="sr-only">{filter.label}</span>
            <select
              aria-label={filter.label}
              value={filter.value}
              onChange={(event) => filter.onChange(event.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
            >
              <option value="">{filter.allLabel}</option>
              {filter.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
    </div>
  );
}
