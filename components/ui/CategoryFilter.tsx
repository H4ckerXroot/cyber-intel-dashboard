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
        "rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200",
        active
          ? "border-blue-500/60 bg-blue-500/20 text-blue-200 shadow-[0_0_14px_rgba(59,130,246,0.25)]"
          : "border-slate-700/60 bg-slate-900/40 text-slate-400 hover:border-blue-500/30 hover:text-blue-300"
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
