"use client";

import { useDropdown } from "@/hooks/useDropdown";
import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";

const MENU_ITEMS = [
  { id: "profile", label: "Your Profile" },
  { id: "settings", label: "Settings" },
  { id: "workspace", label: "Workspace" },
  { id: "logout", label: "Logout", danger: true },
] as const;

export function UserProfileMenu() {
  const { open, toggle, ref } = useDropdown();

  const initials = BRAND.analystName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={toggle}
        className={cn(
          "flex items-center gap-2 rounded-md py-1 pl-1 pr-2 transition-colors hover:bg-slate-800/60",
          open && "bg-slate-800/60"
        )}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 text-xs font-semibold text-white">
          {initials}
        </span>
        <span className="hidden max-w-[5rem] truncate text-sm font-medium text-slate-200 md:block">
          {BRAND.analystName}
        </span>
        <ChevronIcon className={cn("hidden text-slate-500 transition-transform md:block", open && "rotate-180")} />
      </button>

      {open && (
        <div
          className="dropdown-panel absolute right-0 top-full z-50 mt-1.5 w-52 origin-top-right py-1"
          role="menu"
        >
          <div className="border-b border-slate-800/80 px-3 py-2.5">
            <p className="text-sm font-semibold text-slate-100">{BRAND.analystName}</p>
            <p className="text-xs text-slate-500">{BRAND.analystRole}</p>
            <p className="mt-0.5 text-[10px] text-slate-600">{BRAND.analystClearance}</p>
          </div>
          {MENU_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="menuitem"
              className={cn(
                "flex w-full px-3 py-2 text-left text-sm transition-colors hover:bg-slate-800/50",
                "danger" in item && item.danger
                  ? "text-red-400/90 hover:text-red-300"
                  : "text-slate-300 hover:text-slate-100"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("h-4 w-4", className)} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}
