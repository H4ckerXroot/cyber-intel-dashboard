"use client";

import { CATEGORIES, ALL_CATEGORY_ID, type FilterValue } from "@/lib/categories";
import type { ThreatCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  active: FilterValue;
  onChange: (value: FilterValue) => void;
  counts?: Partial<Record<ThreatCategory, number>>;
  className?: string;
}

export function CategoryFilter({
  active,
  onChange,
  counts,
  className,
}: CategoryFilterProps) {
  return (
    <div
      className={cn("flex flex-wrap gap-2", className)}
      role="tablist"
      aria-label="Filter by category"
    >
      <FilterChip
        active={active === ALL_CATEGORY_ID}
        onClick={() => onChange(ALL_CATEGORY_ID)}
        label="All"
      />
      {CATEGORIES.map((cat) => (
        <FilterChip
          key={cat.id}
          active={active === cat.id}
          onClick={() => onChange(cat.id)}
          label={cat.label}
          icon={cat.icon}
          count={counts?.[cat.id]}
        />
      ))}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
  icon,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon?: string;
  count?: number;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "rounded-md border px-2.5 py-1 text-[11px] font-medium transition-colors",
        active
          ? "border-blue-600/50 bg-blue-600/12 text-blue-200"
          : "border-slate-700/50 bg-transparent text-slate-500 hover:border-slate-600 hover:text-slate-300"
      )}
    >
      {icon && <span className="mr-1">{icon}</span>}
      {label}
      {count !== undefined && count > 0 && (
        <span className="ml-1.5 rounded-full bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400">
          {count}
        </span>
      )}
    </button>
  );
}
